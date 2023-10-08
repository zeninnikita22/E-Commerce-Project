/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ["ui-sans-serif", "system-ui"],
      cormorant: ["Cormorant Garamont", "sans-serif"],
      quicksand: ["Quicksand", "sans-serif"],
      raleway: ["Raleway", "sans-serif"],
      josefin: ["Josefin Sans", "sans-serif"],
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      backgroundColor: {
        "floral-white": "#F8F2E9",
        "dim-gray": "#646165",
        night: "#011502",
        "dark-green": "#01200F",
        "off-white": "#FAF9F6",
        "pak-green": "#033A06",
        pistachio: "#B2D3C2",
      },
      textColor: {
        "floral-white": "#F8F2E9",
        "dim-gray": "#646165",
        night: "#011502",
        "dark-green": "#01200F",
        "off-white": "#FAF9F6",
        "pak-green": "#033A06",
        pistachio: "#B2D3C2",
      },
      borderColor: {
        "floral-white": "#F8F2E9",
        "dim-gray": "#646165",
        night: "#011502",
        "dark-green": "#01200F",
        "off-white": "#FAF9F6",
        "pak-green": "#033A06",
        pistachio: "#B2D3C2",
      },
      boxShadow: {
        nav: "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)",
        categoryCard: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
        // "custom-shadow": "10px 10px 5px 0px rgba(0,0,0,0.05)",
      },
    },
  },
  plugins: [],
};
