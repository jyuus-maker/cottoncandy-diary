import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative assets work both standalone and behind the hub's subpath proxy.
  base: './',
  plugins: [react()],
})
