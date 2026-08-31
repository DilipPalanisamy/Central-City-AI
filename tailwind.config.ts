import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#090d16",
        foreground: "#f1f5f9",
        civic: {
          dark: "#0b1120",
          card: "#0f172a",
          cardHover: "#1e293b",
          border: "#1e293b",
          borderLight: "#334155",
          cyan: {
            DEFAULT: "#06b6d4",
            50: "#ecfeff",
            400: "#22d3ee",
            500: "#06b6d4",
            600: "#0891b2",
            900: "#164e63",
          },
          emerald: {
            DEFAULT: "#10b981",
            400: "#34d399",
            500: "#10b981",
            600: "#059669",
            900: "#064e3b",
          },
          amber: {
            DEFAULT: "#f59e0b",
            400: "#fbbf24",
            500: "#f59e0b",
            600: "#d97706",
            900: "#78350f",
          },
          rose: {
            DEFAULT: "#f43f5e",
            400: "#fb7185",
            500: "#f43f5e",
            600: "#e11d48",
            900: "#881337",
          },
          indigo: {
            DEFAULT: "#6366f1",
            400: "#818cf8",
            500: "#6366f1",
            600: "#4f46e5",
            900: "#312e81",
          },
          purple: {
            DEFAULT: "#a855f7",
            400: "#c084fc",
            500: "#a855f7",
            600: "#9333ea",
            900: "#581c87",
          }
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "civic-glow": "radial-gradient(ellipse at top, rgba(6, 182, 212, 0.15), transparent 70%)",
        "emerald-glow": "radial-gradient(ellipse at bottom, rgba(16, 185, 129, 0.12), transparent 70%)",
        "grid-pattern": "linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
      },
      boxShadow: {
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "cyan-glow": "0 0 20px -5px rgba(6, 182, 212, 0.5)",
        "emerald-glow": "0 0 20px -5px rgba(16, 185, 129, 0.5)",
        "rose-glow": "0 0 20px -5px rgba(244, 63, 94, 0.5)",
        "indigo-glow": "0 0 20px -5px rgba(99, 102, 241, 0.5)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 3s ease-in-out infinite",
        "scan": "scan 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        }
      }
    },
  },
  plugins: [],
};
export default config;
