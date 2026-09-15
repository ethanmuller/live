import 'dotenv/config'
import { defineConfig } from 'vite'
import createVue2Plugin from '@vitejs/plugin-vue2'
import path from 'path'

// The backend (Express + Socket.IO) runs as its own process (see
// server/index.js) and listens on PORT. In dev, Vite serves the frontend
// on CLIENT_PORT and proxies API/socket traffic to the backend, so the
// app still looks like a single origin to the browser. Both are plain
// env vars (with a .env fallback via dotenv) so they're easy to override
// per-container when Dockerizing.
const clientPort = process.env.CLIENT_PORT || 8008
const backendPort = process.env.PORT || 8009

export default defineConfig({
  plugins: [createVue2Plugin()],
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
