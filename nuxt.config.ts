import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: '数据演示',  // 页面默认标题
      meta: [
        { name: 'description', content: '' }
      ]
    }
  },
  modules: [
    '@nuxt/ui'
  ],
  runtimeConfig: {
    public: {
      baseURL: "http://192.168.1.136:9091/api/consumer/pulsar-data"
    },
  },
  colorMode: {
    preference: 'dark'
  },
  icon: {
    // serverBundle: 'local',
    // provider: "",
    // serverBundle: {
    //   externalizeIconsJson: true,
    // },
    clientBundle: {
      // icons: [
      //   'heroicons:arrow-path',
      //   'heroicons:heroicons-exclamation-triangle',
      // ],

      // scan all components in the project and include icons
      scan: {
        globInclude: ['app/**/*.vue', /* ... */],
        globExclude: ['node_modules', 'dist', /* ... */],
      },

      // include all custom collections in the client bundle
      includeCustomCollections: true,

      // guard for uncompressed bundle size, will fail the build if exceeds
      sizeLimitKb: 256,
    },
  },
  ui: {
    fonts: false,
    theme: {
      defaultVariants: {
        color: 'neutral',
        size: 'sm'
      }
    }
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
    // build: { }
  },
  ssr: false
})