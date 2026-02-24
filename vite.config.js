import { defineConfig } from 'vite'
// import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'   // ✅ added

// https://vite.dev/config/
export default defineConfig({
  plugins: [ react()],
  resolve: {                              // ✅ added
    alias: {
      "@": fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})