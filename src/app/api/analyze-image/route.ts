import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Expected JSON Response Interface
 */
export interface ImageAnalysisResponse {
  issueDetected: boolean;
  category: string;
  status: "GOOD" | "AFFECTED";
  severity: number; // 0 - 100
  confidence: number; // 0 - 100
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  assessment: string;
}

interface ImagePart {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

/**
 * Extract image data and MIME type from FormData or JSON payloads
 */
async function parseIncomingImage(req: NextRequest): Promise<{ base64Data: string; mimeType: string } | null> {
  const contentType = req.headers.get("content-type") || "";

  // 1. Handle multipart/form-data
  if (contentType.includes("multipart/form-data")) {
    try {
      const formData = await req.formData();
      const file = (formData.get("image") || formData.get("file") || formData.get("photo")) as File | null;

      if (file && typeof file.arrayBuffer === "function") {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Data = buffer.toString("base64");
        const mimeType = file.type && file.type !== "application/octet-stream" ? file.type : "image/jpeg";
        return { base64Data, mimeType };
      }

      // Check if imageBase64 was passed as a text field inside FormData
      const textBase64 = formData.get("imageBase64") || formData.get("imageSource");
      if (typeof textBase64 === "string" && textBase64.trim().length > 0) {
        return extractBase64AndMime(textBase64.trim());
      }
    } catch (err) {
      console.error("[analyze-image] Error parsing form data:", err);
      return null;
    }
  }

  // 2. Handle application/json (or raw JSON bodies)
  try {
    const body = await req.json();
    const rawImage = body.image || body.imageBase64 || body.imageSource || body.file || body.data;

    if (typeof rawImage === "string" && rawImage.trim().length > 0) {
      const explicitMime = body.mimeType || body.contentType;
      return extractBase64AndMime(rawImage.trim(), explicitMime);
    }
  } catch (err) {
    console.error("[analyze-image] Error parsing JSON body:", err);
    return null;
  }

  return null;
}

/**
 * Parse base64 string and extract MIME type (handles data URLs like data:image/png;base64,...)
 */
function extractBase64AndMime(rawString: string, fallbackMime?: string): { base64Data: string; mimeType: string } {
  // Data URL regex
  const match = rawString.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,([\s\S]*)$/);
  if (match) {
    return {
      mimeType: match[1],
      base64Data: match[2].trim(),
    };
  }

  // Pure Base64 string
  return {
    mimeType: fallbackMime || "image/jpeg",
    base64Data: rawString.replace(/^data:[^;]+;base64,/, "").trim(),
  };
}

/**
 * Normalizes priority based on severity and status
 */
function normalizePriority(
  status: "GOOD" | "AFFECTED",
  severity: number,
  reportedPriority?: string
): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" {
  if (status === "GOOD" || severity <= 20) {
    return "LOW";
  }

  if (reportedPriority === "CRITICAL" || reportedPriority === "HIGH" || reportedPriority === "MEDIUM" || reportedPriority === "LOW") {
    // If reported priority aligns with severity bands, accept it
    if (severity >= 75) return "CRITICAL";
    if (severity >= 50) return "HIGH";
    if (severity >= 25) return "MEDIUM";
    return "LOW";
  }

  if (severity >= 75) return "CRITICAL";
  if (severity >= 50) return "HIGH";
  if (severity >= 25) return "MEDIUM";
  return "LOW";
}

export async function POST(req: NextRequest) {
  try {
    // 1. Environment Variable Validation: GEMINI_API_KEY (Server-side ONLY)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === "") {
      return NextResponse.json(
        {
          error: "Server configuration error: GEMINI_API_KEY is not configured.",
          message: "Please set the GEMINI_API_KEY environment variable in your server configuration or .env.local file.",
          code: "MISSING_GEMINI_API_KEY",
        },
        { status: 500 }
      );
    }

    // 2. Extract and Validate Image Input
    const parsedImage = await parseIncomingImage(req);
    if (!parsedImage || !parsedImage.base64Data || parsedImage.base64Data.length < 10) {
      return NextResponse.json(
        {
          error: "Invalid request payload.",
          message: "No valid image found. Provide an image file via multipart/form-data ('image' or 'file') or a base64 string in JSON ('image').",
          code: "INVALID_IMAGE_PAYLOAD",
        },
        { status: 400 }
      );
    }

    // 3. Initialize Gemini Vision Client
    const genAI = new GoogleGenerativeAI(apiKey);

    // Using Gemini 1.5 Flash with structured JSON output schema
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            issueDetected: {
              type: SchemaType.BOOLEAN,
              description:
                "True if any visible civic infrastructure defect, road damage, pothole, cracks, surface failure, water leak, garbage accumulation, broken lighting, or structural issue is detected. False if the scene/road is in good, clean, intact, or normal condition without defects.",
            },
            category: {
              type: SchemaType.STRING,
              description:
                "The civic infrastructure category, e.g., 'Road & Pavement', 'Water Infrastructure', 'Sanitation & Waste', 'Streetlighting', 'Drainage', 'Public Infrastructure', or 'Normal Infrastructure'.",
            },
            status: {
              type: SchemaType.STRING,
              format: "enum",
              enum: ["GOOD", "AFFECTED"],
              description:
                "MUST be 'GOOD' if the infrastructure/road is in good, intact, or undamaged condition. MUST be 'AFFECTED' if there is any visible damage, defect, leak, dump, or hazard.",
            },
            severity: {
              type: SchemaType.INTEGER,
              description:
                "Continuous severity score from 0 to 100 based strictly on visible physical evidence. For good/intact roads/scenes with no defects, return 0 to 20. For damaged roads/surfaces/defects, accurately scale severity from 41 to 100 based on the visible surface destruction.",
            },
            confidence: {
              type: SchemaType.INTEGER,
              description: "Confidence percentage score between 0 and 100 representing certainty in the visual assessment.",
            },
            priority: {
              type: SchemaType.STRING,
              format: "enum",
              enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
              description:
                "Municipal response priority. If status is GOOD or severity <= 20, priority MUST be 'LOW'. For severity 41-49: 'MEDIUM'. For severity 50-74: 'HIGH'. For severity 75-100: 'CRITICAL'.",
            },
            assessment: {
              type: SchemaType.STRING,
              description:
                "A concise, objective, and professional municipal engineering summary explaining the visual findings, specific defects seen or confirmation of good structural integrity.",
            },
          },
          required: [
            "issueDetected",
            "category",
            "status",
            "severity",
            "confidence",
            "priority",
            "assessment",
          ],
        },
      },
    });

    const prompt = `You are Central-City-AI Vision Engine, an advanced municipal infrastructure AI inspection system.
Analyze the provided image with high precision, objectivity, and engineering accuracy.

CRITICAL RULES & STRICT SCALING CRITERIA:
1. NO RANDOM VALUES OR HARDCODED NUMBERS. Every metric must derive directly from visible physical evidence.
2. GOOD INFRASTRUCTURE / INTACT ROADS:
   - If the image shows a paved road, street, or municipal asset in good, normal, or intact condition with no significant damage:
     * "issueDetected": false
     * "status": "GOOD"
     * "severity": strictly between 0 and 20 (e.g., 0-5 for newly paved, 6-20 for normal minor surface aging)
     * "priority": "LOW"
     * "category": "Road & Pavement" (or appropriate infrastructure type)
     * "assessment": Professional statement confirming satisfactory condition and absence of hazardous defects.
3. DAMAGED INFRASTRUCTURE / ROAD DEFECTS:
   - If the image displays potholes, road craters, asphalt fissures, structural cracking, pipeline rupture flooding, garbage dumps, or broken streetlights:
     * "issueDetected": true
     * "status": "AFFECTED"
     * "severity": Accurately scale from 41 to 100 based on visible surface destruction:
       - 41 - 55: Minor to moderate surface cracking, small shallow potholes, or minor localized damage.
       - 56 - 74: Substantial potholes, longitudinal fissures, active water leakage, or vehicle wheel hazard.
       - 75 - 89: Deep crater potholes, severe multi-layer asphalt degradation, structural road collapse, or high vehicle disruption.
       - 90 - 100: Catastrophic structural failure, complete impassability, massive cavity, or immediate emergency danger.
     * "priority": "MEDIUM" (for 41-49), "HIGH" (for 50-74), "CRITICAL" (for 75-100).
     * "assessment": Clear technical description detailing the defect type, depth/extent, and municipal risk.
4. CONFIDENCE:
   - Provide realistic confidence score between 75 and 99 based on visual clarity and lighting.

Return strict JSON adhering to the defined schema.`;

    const imagePart: ImagePart = {
      inlineData: {
        data: parsedImage.base64Data,
        mimeType: parsedImage.mimeType,
      },
    };

    // 4. Execute Gemini Vision Analysis
    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();

    if (!responseText || responseText.trim().length === 0) {
      throw new Error("Gemini returned an empty response.");
    }

    let parsedResult: ImageAnalysisResponse;
    try {
      parsedResult = JSON.parse(responseText);
    } catch (parseError) {
      console.error("[analyze-image] Failed to parse Gemini response JSON:", responseText, parseError);
      throw new Error("Invalid JSON response received from AI model.");
    }

    // 5. Enforce strict consistency checks and bounds validation
    let severity = typeof parsedResult.severity === "number" ? Math.round(parsedResult.severity) : 0;
    severity = Math.max(0, Math.min(100, severity));

    let confidence = typeof parsedResult.confidence === "number" ? Math.round(parsedResult.confidence) : 90;
    confidence = Math.max(0, Math.min(100, confidence));

    let status: "GOOD" | "AFFECTED" = parsedResult.status === "GOOD" ? "GOOD" : "AFFECTED";
    let issueDetected = Boolean(parsedResult.issueDetected);

    // Enforce good road consistency
    if (status === "GOOD" || !issueDetected) {
      issueDetected = false;
      status = "GOOD";
      if (severity > 20) {
        severity = Math.min(severity, 20);
      }
    } else {
      // For affected roads/issues, ensure severity is in active range (41-100 or >= 25)
      if (severity < 25) {
        severity = 45; // Default moderate floor if defect is detected
      }
    }

    const priority = normalizePriority(status, severity, parsedResult.priority);

    const finalResponse: ImageAnalysisResponse = {
      issueDetected,
      category: parsedResult.category || (issueDetected ? "Road & Pavement" : "Normal Infrastructure"),
      status,
      severity,
      confidence,
      priority,
      assessment:
        parsedResult.assessment ||
        (status === "GOOD"
          ? "Infrastructure evaluated in good structural condition with no actionable municipal defects identified."
          : `Defect identified with severity rating ${severity}/100 requiring municipal maintenance intervention.`),
    };

    return NextResponse.json(finalResponse, { status: 200 });
  } catch (error: any) {
    console.error("[analyze-image] API error:", error);

    // Check for specific Google AI / API Key errors
    const errorMessage = error?.message || "Unknown error occurred during image analysis.";
    const isApiKeyError =
      errorMessage.toLowerCase().includes("api_key") ||
      errorMessage.toLowerCase().includes("api key") ||
      errorMessage.toLowerCase().includes("unauthenticated") ||
      errorMessage.toLowerCase().includes("permission denied");

    return NextResponse.json(
      {
        error: isApiKeyError ? "Authentication failed with Gemini API. Check GEMINI_API_KEY." : "Image analysis failed.",
        message: errorMessage,
        code: isApiKeyError ? "GEMINI_AUTH_FAILED" : "ANALYSIS_FAILED",
      },
      { status: isApiKeyError ? 401 : 500 }
    );
  }
}

// Return 405 Method Not Allowed for non-POST requests
export async function GET() {
  return NextResponse.json(
    {
      error: "Method Not Allowed",
      message: "Please send a POST request with an image payload.",
    },
    { status: 405 }
  );
}
