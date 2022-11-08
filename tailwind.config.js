const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  content: ["./**/*.html", "./js/*.js", "./css/*.css"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        gray: colors.neutral,
      },
      screens: {
        portrait: { raw: "(orientation: portrait)" },
        landscape: { raw: "(orientation: landscape)" },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
