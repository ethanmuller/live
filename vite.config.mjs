import 'dotenv/config'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// The backend (Express + Socket.IO + party API) runs as its own process
// (see server/index.js) and listens on PORT. In dev, Vite serves the
// frontend on CLIENT_PORT and proxies API/socket/upload traffic to the
// backend, so the app still looks like a single origin to the browser.
const clientPort = process.env.CLIENT_PORT || 8008
const backendPort = process.env.PORT || 8009

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: clientPort,
    proxy: {
      '/api': `http://localhost:${backendPort}`,
      '/uploads': `http://localhost:${backendPort}`,
      '/socket.io': {
        target: `http://localhost:${backendPort}`,
        ws: true,
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: clientPort,
  },
})
