// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    'nitro-cloudflare-dev'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  nitro: {
    preset: 'cloudflare-pages'
  },

  compatibilityDate: '2026-06-30',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
