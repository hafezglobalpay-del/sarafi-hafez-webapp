import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
import defuFix from './vite.defu-fix.js'

const CustomPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.900}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}'
    },
    warning: {
      50: '{yellow.50}',
      100: '{yellow.100}',
      200: '{yellow.200}',
      300: '{yellow.300}',
      400: '{yellow.400}',
      500: '{yellow.500}',
      600: '{yellow.600}',
      700: '{yellow.700}',
      800: '{yellow.800}',
      900: '{yellow.900}',
      950: '{yellow.950}'
    },
  }
})

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  modules: [
    '@primevue/nuxt-module',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n'
  ],
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL,
      proxyPath: process.env.API_PROXY_PATH || ''
    }
  },
  nitro: {
    routeRules: {},
    rollupConfig: {
      plugins: [defuFix()]
    }
  },
  hooks: {
    'nitro:config'(nitroConfig) {
      // Ensure the defu-compat plugin is used in Nitro's build
      nitroConfig.rollupConfig = nitroConfig.rollupConfig || {}
      nitroConfig.rollupConfig.plugins = nitroConfig.rollupConfig.plugins || []
      nitroConfig.rollupConfig.plugins.push(defuFix())
    }
  },
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js'
  },
  primevue: {
    options: {
      theme: {
        preset: CustomPreset,
        options: {
          colorScheme: 'light',
          darkModeSelector: false
        }
      }
    }
  },
  css: [
    '@mdi/font/css/materialdesignicons.min.css',
    '~/assets/css/primevue-custom.css'
  ],
  app: {
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/logo/favicon.png'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100;200;300;400;500;600;700;800;900&display=swap'
        }
      ]
    }
  },
  i18n: {
    locales: [
      { 
        code: 'en', 
        file: 'en-US.json', 
        dir: 'ltr',
        name: 'English',
        iso: 'en-US'
      },
      { 
        code: 'fa', 
        file: 'fa-IR.json', 
        dir: 'rtl',
        name: 'فارسی',
        iso: 'fa-IR'
      }
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    langDir: 'locales/',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      fallbackLocale: 'en'
    },
    lazy: true,
    compilation: {
      strictMessage: false
    },
  },
  server: {
    port: 4000,
    host: '0.0.0.0'
  },
  vite: {
    optimizeDeps: {
      include: ['defu']
    },
    resolve: {
      dedupe: ['defu']
    },
    ssr: {
      noExternal: []
    },
    plugins: [defuFix()]
  }
})