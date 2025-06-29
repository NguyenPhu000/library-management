/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      // Modern Library Color Palette - Inspired by top libraries worldwide
      colors: {
        // Legacy color (keep for admin)
        lightGreen: "#97bc62",

        // NEW MINIMAL LIBRARY THEME
        library: {
          // Primary whites & grays
          white: "#FFFFFF",
          background: "#FAFAFA", // Very light gray background
          surface: "#FFFFFF", // Card/surface white

          // Soft accent colors
          primary: "#2563EB", // Professional blue
          "primary-light": "#3B82F6",
          "primary-dark": "#1D4ED8",

          secondary: "#64748B", // Medium gray
          "secondary-light": "#94A3B8",
          "secondary-dark": "#475569",

          // Text hierarchy
          "text-primary": "#1E293B", // Almost black for headers
          "text-secondary": "#475569", // Dark gray for body
          "text-muted": "#64748B", // Light gray for captions

          // Success & status
          success: "#059669", // Clean green
          "success-light": "#10B981",
          warning: "#D97706", // Professional orange
          error: "#DC2626", // Clean red

          // Borders & dividers
          border: "#E2E8F0", // Subtle border
          "border-light": "#F1F5F9", // Very light border

          // Interactive states
          hover: "#F8FAFC", // Light hover state
          active: "#F1F5F9", // Active state
        },
      },

      // Typography improvements
      fontFamily: {
        library: ["Inter", "system-ui", "sans-serif"],
        heading: ["Poppins", "system-ui", "sans-serif"],
      },

      // Spacing scale for better white space
      spacing: {
        18: "4.5rem",
        88: "22rem",
        100: "25rem",
        104: "26rem",
        112: "28rem",
        120: "30rem",
      },

      // Animation improvements
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "bounce-slow": "bounce 2s infinite",
        reverse: "reverse-spin 2s linear infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "gentle-hover": "gentleHover 0.2s ease-in-out",
      },

      keyframes: {
        "reverse-spin": {
          from: { transform: "rotate(360deg)" },
          to: { transform: "rotate(0deg)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        gentleHover: {
          "0%": { transform: "translateY(0px)" },
          "100%": { transform: "translateY(-2px)" },
        },
      },

      backdropBlur: {
        xs: "2px",
      },

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "library-gradient": "linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)",
      },

      // Box shadows for cards
      boxShadow: {
        "library-card":
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        "library-card-hover":
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "library-book": "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
        "library-book-hover": "0 8px 15px 0 rgba(0, 0, 0, 0.12)",
      },

      // Border radius for modern look
      borderRadius: {
        library: "0.5rem", // Standard library elements
        "library-card": "0.75rem", // Book cards
        "library-button": "0.375rem", // Buttons
      },
    },
  },
  plugins: [],
};
