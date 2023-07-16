/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      backgroundColor : {
        open: "#1a8cff",
        closed: "#ff5733",
        issued: "#ffb347",
        paid: "#8abf7c",

        
      },

      fontSize: {
        xxs: ["0.65rem", "1rem"],
      },
    },
  },
  plugins: [],
};
