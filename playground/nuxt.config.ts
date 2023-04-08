export default defineNuxtConfig({
  modules: ['../src/module'],

  ssr: false,

  oauth: {
    redirect: {
      home: '/home'
    },
    clientId: '98e1cb74-125a-4d60-b686-02c2f0c87521',
    scope: ['user:read']
  },
})
