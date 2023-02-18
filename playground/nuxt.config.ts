export default defineNuxtConfig({
  modules: ['../src/module'],
  oauth: {
    redirect: {
      login: '/login/', // sandbox appends / at the end of url
      logout: '/',
      callback: '/login/', // sandbox appends / at the end of url
      home: '/home'
    },
    endpoints: {
      authorization: 'https://api.sandbox.own3d.pro/v1/oauth/authorization',
      userInfo: `https://id.stream.tv/api/users/@me`,
      logout: 'https://id.stream.tv/oauth/token'
    },
    clientId: '90a951d1-ea50-4fda-8c4d-275b81f7d219',
    scope: ['user:read', 'connections']
  },
})
