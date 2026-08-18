import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Vite doesn't read PORT on its own; honouring it lets the harness assign a
  // free port instead of us pinning one on the command line.
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : undefined,
  },
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
    },
  },
})
