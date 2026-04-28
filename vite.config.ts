import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import { resolve } from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    libInjectCss(),
    dts({
      include: ['src'],
      rollupTypes: true
    })
  ],
  build: {
    emptyOutDir: false,
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es']
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        chunkFileNames: 'chunks/[name].[hash].js',
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: '[name].js',
        globals: {
          vue: 'Vue',
        }
      }
    }
  }
})
