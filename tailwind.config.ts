import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        umado: {
          sky: "#159DDA",
          blue: "#0A83C8",
          navy: "#0A2442",
          ink: "#12263A",
          orange: "#F58255",
          paper: "#F7FBFF"
        }
      },
      boxShadow: {
        soft: "0 20px 60px rgba(10,36,66,0.12)"
      },
      backgroundImage: {
        "seigaiha": "radial-gradient(circle at 0 100%, transparent 18px, rgba(21,157,218,.08) 19px, rgba(21,157,218,.08) 21px, transparent 22px), radial-gradient(circle at 24px 100%, transparent 18px, rgba(21,157,218,.08) 19px, rgba(21,157,218,.08) 21px, transparent 22px)"
      }
    }
  },
  plugins: []
};

export default config;
