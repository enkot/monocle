import { defineConfig } from 'vite-plugin-windicss'
import defaultTheme from 'windicss/defaultTheme'
import typography from 'windicss/plugin/typography'
import forms from 'windicss/plugin/forms'

export default defineConfig({
  darkMode: 'class',
  plugins: [
    typography(),
    forms,
  ],
  extract: {
    include: [
      'index.html',
      'src/**/*.{vue,html,jsx,tsx}',
    ],
  },
  theme: {
    fontFamily: {
      sans: ['Inter', ...defaultTheme.fontFamily.sans],
    },
  },
})
