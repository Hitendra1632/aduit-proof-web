const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  purge: [],
  theme: {
    fontFamily: {
      'sans': ['Helvetica Neue', ...defaultTheme.fontFamily.sans],
      'serif': [...defaultTheme.fontFamily.serif],
      'mono': [...defaultTheme.fontFamily.mono]
    },
    extend: {
      container: {
        center: true,
      },
    },
  },
  variants: {},
  plugins: [],
}
