import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  base: './', // change to '/<repo>/' for GitHub Pages
  resolve: { alias: { '@': '/src' } }
})
