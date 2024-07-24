import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "light-purple-gradient": "linear-gradient(to right, #e0c3fc, #8ec5fc)",
      },
      fontFamily: {
        base: "var(--font-base)",
      },
      colors: {
        primary: "#23c1e7",
        secondary: "#8e48f6",
        tertiary: "black",
      },
    },
  },
  plugins: [],
};
export default config;
