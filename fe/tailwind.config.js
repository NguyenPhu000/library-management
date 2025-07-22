/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "Roboto",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "system-ui",
          "sans-serif",
        ],
        poppins: ["Inter", "Roboto", "sans-serif"], // Fallback for legacy poppins usage
      },
      colors: {
        lightGreen: "#10B981",
        darkGreen: "#047857",
        customGray: "#6B7280",
        customDark: "#1F2937",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      fontSize: {
        "vietnamese-sm": [
          "14px",
          { lineHeight: "1.6", letterSpacing: "0.01em" },
        ],
        "vietnamese-base": [
          "16px",
          { lineHeight: "1.7", letterSpacing: "0.01em" },
        ],
        "vietnamese-lg": [
          "18px",
          { lineHeight: "1.6", letterSpacing: "0.005em" },
        ],
        "vietnamese-xl": ["20px", { lineHeight: "1.5", letterSpacing: "0em" }],
        "vietnamese-2xl": [
          "24px",
          { lineHeight: "1.4", letterSpacing: "-0.01em" },
        ],
        "vietnamese-3xl": [
          "30px",
          { lineHeight: "1.3", letterSpacing: "-0.02em" },
        ],
      },
    },
  },
  plugins: [],
};
