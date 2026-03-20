import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Let Vite/Rollup handle chunk splitting automatically.
    // Manual chunks caused a circular dependency between radix-vendor and
    // radix-extra which produced a "Cannot access 'Ge' before initialization"
    // ReferenceError at runtime, crashing the app on load.
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
  },
})
