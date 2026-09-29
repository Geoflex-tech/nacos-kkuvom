export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        nacos: {
          blue:        "#1E40AF",
          "blue-light":"#1D4ED8",
          "blue-dark": "#1E3A8A",
          green:       "#059669",
          "green-light":"#10B981",
          "green-dark":"#047857",
          gold:        "#D97706",
          "gold-light":"#F59E0B",
          "gold-dark": "#B45309",
        },
      },
      fontFamily: {
        sans:    ["Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        soft:       "0 1px 3px rgba(0,0,0,0.08)",
        card:       "0 4px 12px rgba(30,64,175,0.10)",
        "card-hover":"0 10px 30px rgba(30,64,175,0.14)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.5s ease-out",
        "slide-down": "slideDown 0.2s ease-out",
      },
      keyframes: {
        fadeInUp: {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%":   { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
