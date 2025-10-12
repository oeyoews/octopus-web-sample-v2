import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
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
      baseURL: "http://192.168.1.41:8080",
      wsURL: "ws://192.168.1.41:8080"
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
    mode: 'css',
    cssLayer: 'base',
    // serviceBundle: false,
    clientBundle: {
      // @see: https://github.com/nuxt/icon/issues/245
      // icons: [
      // 'lucide:zap',
      // 'lucide:sliders',
      // 'lucide:layers',
      // 'lucide:clock',
      // 'lucide:eye',
      // 'lucide:eye-off',
      // 'lucide:chevron-up',
      // 'lucide:chevron-down',
      // 'lucide:settings',
      // 'lucide:copy',
      // 'lucide:copy-check',
      // 'lucide:cpu',
      // 'lucide:square-terminal',
      // 'lucide:wifi',
      // 'lucide:circle-question-mark',
      // ],

      // scan all components in the project and include icons
      scan: {
        globInclude: ['app/**/*.vue', /* ... */],
        globExclude: ['node_modules', 'dist', /* ... */],
      },

      // include all custom collections in the client bundle
      // includeCustomCollections: true,

      // guard for uncompressed bundle size, will fail the build if exceeds
      // sizeLimitKb: 1256,
    },
  },
  ui: {
    fonts: false,
    theme: {
      defaultVariants: {
        color: 'primary',
        size: 'md'
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