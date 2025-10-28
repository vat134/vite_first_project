import { defineConfig } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  base: '/vite_first_project/',
  resolve: {
    alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
})
