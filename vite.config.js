import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const api = 'http://localhost:5000'

export default defineConfig({
  plugins: [react()],
  server: {
    // In development the site calls /api and /uploads on the Vite port; forward them to Express.
    proxy: { '/api': api, '/uploads': api },
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: { manualChunks: { react: ['react', 'react-dom'], motion: ['framer-motion'] } },
    },
  },
})
