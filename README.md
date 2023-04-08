# 🔒 @bitinflow/nuxt-oauth

**@bitinflow/nuxt-oauth** is a Nuxt 3 Module that provides a simple OAuth 2 implementation for static site nuxt applications. It uses an Implicit Grant where no backend code is required, and plans to support PKCE as well. This package is intended to be used with laravel-passport, allowing users to interact with their first-party API using their own OAuth provider. Currently, it does not support multiple OAuth providers. With **@bitinflow/nuxt-oauth**, developers can quickly and easily implement secure OAuth authentication in their Nuxt applications.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)

## Features

- 📦 Simple OAuth 2 Implicit Grant authentication
- 📦 PKCE Support (planned)
- 📦 Intended to be used with laravel-passport
- 📦 Single OAuth provider support (currently)

## Quick Setup

1. Add `@bitinflow/nuxt-oauth` dependency to your project

```bash
# Using pnpm
pnpm add -D @bitinflow/nuxt-oauth

# Using yarn
yarn add --dev @bitinflow/nuxt-oauth

# Using npm
npm install --save-dev @bitinflow/nuxt-oauth
```

2. Add `@bitinflow/nuxt-oauth` to the `modules` section of `nuxt.config.ts` and disable `ssr`.
   
Or alternatively disable `ssr` via `routeRules`, only for pages where `auth` or `guest` middlewares are needed. Typically account section and login page.

```js
export default defineNuxtConfig({
  modules: [
    '@bitinflow/nuxt-oauth'
  ],

  ssr: false,
  // or
  routeRules: {
    '/account/**': { ssr: false },
    '/auth/**': { ssr: false }
  },

  oauth: {
    redirect: {
      login: '/login',
      logout: '/',
      callback: '/login',
      home: '/home'
    },
    endpoints: {
      authorization: 'https://example.com/v1/oauth/authorization',
      userInfo: `https://example.com/api/users/me`,
      logout: 'https://example.com/oauth/logout'
    },
    clientId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    scope: ['user:read']
  },
})
```

That's it! You can now use @bitinflow/nuxt-oauth in your Nuxt app ✨

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```
