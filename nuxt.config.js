import 'dotenv'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  server: {
    // host: '0.0.0.0',
    // port: 8000,
  },

  serverMiddleware: [
    { path: "/api",  handler: '~/api/eggs.js', },
  ],

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'lobby-system',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '~/io',
  ],

  env: {
    WS_URL: process.env.WS_URL
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
