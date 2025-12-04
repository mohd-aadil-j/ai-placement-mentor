/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        first: "moveVertical 10s ease infinite",
        second: "moveInCircle 5s reverse infinite",
        third: "moveInCircle 5s linear infinite",
        fourth: "moveHorizontal 8s ease infinite",
        fifth: "moveInCircle 10s ease infinite",
      },
      keyframes: {
        moveHorizontal: {
          "0%": {
            transform: "translateX(-100%) translateY(-50%)",
          },
          "50%": {
            transform: "translateX(100%) translateY(50%)",
          },
          "100%": {
            transform: "translateX(-100%) translateY(-50%)",
          },
        },
        moveInCircle: {
          "0%": {
            transform: "rotate(0deg)",
          },
          "50%": {
            transform: "rotate(180deg)",
          },
          "100%": {
            transform: "rotate(360deg)",
          },
        },
        moveVertical: {
          "0%": {
            transform: "translateY(-75%)",
          },
          "50%": {
            transform: "translateY(75%)",
          },
          "100%": {
            transform: "translateY(-75%)",
          },
        },
      },
    },
  },
  plugins: [],
}
