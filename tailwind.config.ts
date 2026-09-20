import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        leaf: "#6f8f3d",
        basil: "#244f35",
        chutney: "#b7cf64",
        paneer: "#fff6dd",
        clay: "#b96b42",
        charcoal: "#111312"
      },
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
        serif: ["Poppins", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
} satisfies Config;
