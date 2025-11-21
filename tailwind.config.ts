import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // AICredy Design System - Identidade Visual
        brand: {
          DEFAULT: "#0554f2", // Azul principal
          50: "#e6f0fe",
          100: "#cce1fd",
          200: "#99c3fb",
          300: "#66a5f9",
          400: "#3387f7",
          500: "#0554f2", // Principal
          600: "#0443c2",
          700: "#033291",
          800: "#022261",
          900: "#011130",
        },
        accent: {
          DEFAULT: "#bdf26d", // Verde accent
          50: "#f7fef0",
          100: "#effde1",
          200: "#dffbc3",
          300: "#cff9a5",
          400: "#bdf26d", // Principal
          500: "#a8e84f",
          600: "#8dd32f",
          700: "#6ba824",
          800: "#4a7d19",
          900: "#28520e",
        },
        background: "#FAFBFC", // Fundo geral (mais clean)
        surface: "#FFFFFF", // Componentes
        border: "#E5E7EB", // Bordas sutis
        text: {
          primary: "#0F172A", // Texto principal (mais escuro)
          secondary: "#64748B", // Texto secundário
          muted: "#94A3B8", // Texto desabilitado
        },
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#0554f2",
      },
      borderRadius: {
        xl: "24px",
        "2xl": "32px",
        pill: "999px",
      },
      fontSize: {
        "display": ["28px", { lineHeight: "1.2", fontWeight: "700" }],
        "title": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        "subtitle": ["18px", { lineHeight: "1.5", fontWeight: "500" }],
        "body": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
