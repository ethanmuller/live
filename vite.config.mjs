import { defineConfig } from 'vite'
import createVue2Plugin from '@vitejs/plugin-vue2'
import path from 'path'

// The backend (Express + Socket.IO + party API) runs as its own process
// (see server/index.js). In dev, Vite serves the frontend on 8008 and
// proxies API/socket traffic to the backend on 8009, so the app still
// looks like a single origin to the browser, same as it did under Nuxt's
// combined server.
const backendPort = process.env.BACKEND_PORT || 8009

export default defineConfig({
  plugins: [createVue2Plugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 8008,
    proxy: {
      '/api': `http://localhost:${backendPort}`,
      '/socket.io': {
        target: `http://localhost:${backendPort}`,
        ws: true,
      },
    },
  },
})
