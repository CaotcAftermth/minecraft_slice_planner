import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  base: '/minecraft_slice_planner/',
  resolve: { alias: { '@': '/src' } }
})
