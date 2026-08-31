import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { AuthProvider } from "@/context/AuthContext";
import { CivicStoreProvider } from "@/lib/mockStore";
import { ToastContainer } from "@/components/ui/ToastContainer";

export const metadata: Metadata = {
  title: "Central-City-AI | Autonomous Civic Intelligence Platform",
  description:
    "See the Problem. AI Understands. Communities Verify. Authorities Resolve. The next-generation civic technology platform for rapid urban issue resolution.",
  keywords: [
    "civic tech",
    "smart cities",
    "AI urban triage",
    "pothole detection",
    "community verification",
    "municipal authority dispatch",
    "Google Authentication",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className="font-sans bg-[#090d16] text-slate-100 min-h-screen antialiased selection:bg-cyan-500 selection:text-black"
      >
        <AuthProvider>
          <CivicStoreProvider>
            {children}
            <ToastContainer />
          </CivicStoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
