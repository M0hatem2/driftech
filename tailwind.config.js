/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",   // مسح كل ملفات Angular
      "./node_modules/flowbite/**/*.js"

  ],
  theme: {
    extend: {
      colors: {
        foundation: {
          brown: {
            normal: "#4E1F0E",
            medium: "#5C2614",
            dark: "#3A150A",
          },
          orange: {
            normal: "#FF6B26",
          },
        },
        neutral: {
          0: "#FFFFFF",
          50: "#F5F5F5",
          300: "#D4D4D4",
          400: "#A3A3A3",
          900: "#111111",
        },
        gray: {
          medium: {
            400: "#B3B3B3",
            600: "#666666",
          }
        }
      },

      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        "dm-sans": ["DM Sans", "sans-serif"],
      },

      spacing: {
        13: "3.25rem",
        128: "32rem",
        144: "36rem",
      },

      borderRadius: {
        "4xl": "2rem",
      }
    },
  },
  plugins: [
      require("flowbite/plugin"), // هنا مكانه الصح!

  ],
};
