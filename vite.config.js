import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Use the repo path when building for GitHub Pages so assets stay relative.
  base: command === 'build' ? '/E2MB-website/' : '/',
  root: '.',
  build: {
    outDir: 'dist',
  },
}))
