"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  GOOGLE_CLIENT_ID,
  GoogleUserIdentity,
  loadGoogleIdentityScript,
  decodeGoogleJwt,
} from "@/lib/googleAuth";

interface AuthContextType {
  user: GoogleUserIdentity | null;
  loading: boolean;
  isAuthenticated: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  clientId: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_CACHE_KEY = "central_city_ai_google_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<GoogleUserIdentity | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Read cached session on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem(LOCAL_USER_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.email) {
          setUser(parsed);
        }
      }
    } catch (e) {
      console.warn("Session cache read notice:", e);
    } finally {
      setLoading(false);
    }

    // Pre-load Google Identity Services script in background
    loadGoogleIdentityScript().catch((err) => {
      console.warn("GIS background preload notice:", err);
    });
  }, []);

  // Handle GIS Credential Callback (One Tap / Standard ID Token)
  const handleCredentialResponse = useCallback((response: any) => {
    if (response && response.credential) {
      const decodedUser = decodeGoogleJwt(response.credential);
      if (decodedUser) {
        setUser(decodedUser);
        localStorage.setItem(LOCAL_USER_CACHE_KEY, JSON.stringify(decodedUser));
      }
    }
  }, []);

  // Initialize GIS listener when script is ready
  useEffect(() => {
    if (typeof window === "undefined") return;

    loadGoogleIdentityScript()
      .then((google) => {
        if (google?.accounts?.id && GOOGLE_CLIENT_ID) {
          google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });
        }
      })
      .catch((err) => console.warn("GIS initialize notice:", err));
  }, [handleCredentialResponse]);

  // Login With Google: Launches official Google OAuth Account Chooser popup
  const loginWithGoogle = useCallback(async (): Promise<void> => {
    setLoading(true);

    try {
      const google = await loadGoogleIdentityScript();

      if (!google?.accounts) {
        throw new Error("Google Identity Services failed to load.");
      }

      // Check if OAuth2 Token Client is available (Preferred for popup with prompt: select_account)
      if (google.accounts.oauth2) {
        return new Promise<void>((resolve, reject) => {
          const client = google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: "openid profile email",
            prompt: "select_account",
            callback: async (tokenResponse: any) => {
              if (tokenResponse && tokenResponse.access_token) {
                try {
                  // Fetch real Google profile information using access token
                  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                    headers: {
                      Authorization: `Bearer ${tokenResponse.access_token}`,
                    },
                  });

                  if (res.ok) {
                    const profile = await res.json();
                    const userId = profile.sub || profile.id || `google_${Date.now()}`;
                    const userName = profile.name || profile.given_name || profile.email?.split("@")[0] || "Google Citizen";
                    const userPicture =
                      profile.picture ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=06b6d4&color=020617&bold=true`;

                    const googleUser: GoogleUserIdentity = {
                      id: userId,
                      uid: userId,
                      name: userName,
                      displayName: userName,
                      email: profile.email || "",
                      picture: userPicture,
                      photoURL: userPicture,
                    };

                    setUser(googleUser);
                    localStorage.setItem(LOCAL_USER_CACHE_KEY, JSON.stringify(googleUser));
                    setLoading(false);
                    resolve();
                    return;
                  }
                } catch (fetchErr) {
                  console.error("Failed to fetch Google userinfo:", fetchErr);
                }
              }

              if (tokenResponse?.error) {
                console.error("Google OAuth token error:", tokenResponse.error);
                setLoading(false);
                reject(new Error(`Google Sign-in: ${tokenResponse.error}`));
                return;
              }

              setLoading(false);
              resolve();
            },
            error_callback: (err: any) => {
              console.error("Google OAuth error:", err);
              setLoading(false);
              reject(err);
            },
          });

          // Open Google OAuth Account Chooser Popup
          client.requestAccessToken({ prompt: "select_account" });
        });
      } else if (google.accounts.id) {
        // Fallback to GIS Prompt
        google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setLoading(false);
          }
        });
      }
    } catch (err: any) {
      console.error("Google login error:", err);
      setLoading(false);
      throw err;
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(LOCAL_USER_CACHE_KEY);

    if (typeof window !== "undefined" && (window as any).google?.accounts?.id) {
      try {
        (window as any).google.accounts.id.disableAutoSelect();
      } catch (e) {
        console.warn("GIS disableAutoSelect notice:", e);
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        loginWithGoogle,
        logout,
        clientId: GOOGLE_CLIENT_ID,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
