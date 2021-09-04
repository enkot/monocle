import { defineConfig } from 'vite-plugin-windicss'
import defaultTheme from 'windicss/defaultTheme'
import typography from 'windicss/plugin/typography'
import forms from 'windicss/plugin/forms'

export default defineConfig({
  darkMode: 'class',
  safelist: 'bg-green-500 bg-pink-500 bg-teal-500 bg-purple-500 bg-orange-500 bg-yellow-500 bg-red-500 bg-blue-500 bg-orange-500 bg-indigo-500',
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
  shortcuts: {
    btn: 'inline-flex items-center px-4 py-3 border shadow text-base leading-4 font-medium rounded-md transition ease-in-out duration-150',
  },
})
