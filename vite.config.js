import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  const isGithubPagesBuild = command === 'build' && !process.env.VERCEL

  return {
    plugins: [react()],
    // Use the repo path only when targeting GitHub Pages; keep Vercel at root.
    base: isGithubPagesBuild ? '/E2MB-website/' : '/',
    root: '.',
    build: {
      // GitHub Pages can only serve from / (root) or /docs, so emit builds there.
      outDir: 'docs',
    },
  }
})
