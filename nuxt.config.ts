// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui', 'nuxt-lodash', 'nuxt-icon'],
  runtimeConfig: {
    public: {
      apiUrl: '',
      websocketApiUrl: '',
    },
  },
});
