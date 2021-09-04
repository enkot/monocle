/* eslint-env node */

import { join } from 'path'
import { builtinModules } from 'module'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import WindiCSS from 'vite-plugin-windicss'
import Icons, { ViteIconsResolver } from 'vite-plugin-icons'
import Components from 'vite-plugin-components'
import SvgLoader from 'vite-svg-loader'

import { chrome } from '../../electron-vendors.config.json'
import { loadAndSetEnv } from '../../scripts/loadAndSetEnv.mjs'

const PACKAGE_ROOT = __dirname

/**
 * Vite looks for `.env.[mode]` files only in `PACKAGE_ROOT` directory.
 * Therefore, you must manually load and set the environment variables from the root directory above
 */
loadAndSetEnv(process.env.MODE, process.cwd())

/**
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
  root: PACKAGE_ROOT,
  resolve: {
    alias: {
      '/@/': `${join(PACKAGE_ROOT, 'src')}/`,
    },
  },
  plugins: [
    Vue({
      script: {
        refSugar: true,
      },
    }),
    Components({
      customComponentResolvers: ViteIconsResolver({
        componentPrefix: '',
      }),
    }),
    Pages(),
    Layouts(),
    WindiCSS(),
    Icons({
      defaultStyle: '',
    }),
    SvgLoader(),
  ],
  base: '',
  server: {
    fsServe: {
      root: join(PACKAGE_ROOT, '../../'),
    },
  },
  build: {
    sourcemap: true,
    target: `chrome${chrome}`,
    outDir: 'dist',
    assetsDir: '.',
    terserOptions: {
      ecma: 2020,
      compress: {
        passes: 2,
      },
      safari10: false,
    },
    rollupOptions: {
      external: [
        ...builtinModules,
      ],
    },
    emptyOutDir: true,
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      '@vueuse/core',
    ],
    exclude: [
      'vue-demi',
    ],
  },
})
