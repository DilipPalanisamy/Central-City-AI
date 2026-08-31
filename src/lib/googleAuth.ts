/**
 * Central-City-AI: Pure Google Identity Services (GIS) / Google OAuth Integration
 * NO FIREBASE DEPENDENCY
 */

export const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "828916788368-a0q0don34aichl7ct77h0qvnacr9r57q.apps.googleusercontent.com";

export interface GoogleUserIdentity {
  id: string;
  uid?: string;
  name: string;
  displayName?: string;
  email: string;
  picture: string;
  photoURL?: string;
}

/**
 * Dynamically loads the official Google Identity Services client script (https://accounts.google.com/gsi/client)
 */
export function loadGoogleIdentityScript(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      resolve(null);
      return;
    }

    if ((window as any).google?.accounts?.id || (window as any).google?.accounts?.oauth2) {
      resolve((window as any).google);
      return;
    }

    const scriptId = "google-identity-services-script";
    const existing = document.getElementById(scriptId);

    if (existing) {
      existing.addEventListener("load", () => resolve((window as any).google));
      existing.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve((window as any).google);
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });
}

/**
 * Safely decodes a Google JWT Credential ID token without third-party dependencies
 */
export function decodeGoogleJwt(credential: string): GoogleUserIdentity | null {
  try {
    const parts = credential.split(".");
    if (parts.length < 2) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const payload = JSON.parse(jsonPayload);
    const userId = payload.sub || payload.id || `google_${Date.now()}`;
    const userName = payload.name || payload.given_name || payload.email?.split("@")[0] || "Google Citizen";
    const userPicture =
      payload.picture ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=06b6d4&color=020617&bold=true`;

    return {
      id: userId,
      uid: userId,
      name: userName,
      displayName: userName,
      email: payload.email || "",
      picture: userPicture,
      photoURL: userPicture,
    };
  } catch (error) {
    console.error("Failed to decode Google Identity JWT:", error);
    return null;
  }
}
