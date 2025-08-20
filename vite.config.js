import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { imagetools } from 'vite-imagetools'

export default defineConfig({
  plugins: [react(), visualizer({ open: true }), imagetools()],
  build: {
    minify: "terser",
    target: "es2018",
    brotliSize: false,
    terserOptions: {
      compress: { drop_console: true, drop_debugger: true },
      format: { comments: false },
    },
  },
})
