# @bitinflow/nuxt-oauth

> Nuxt module for OAuth2 authentication

- [✨ &nbsp;Release Notes](/CHANGELOG.md)

## Features

- 📦 OAuth2 authentication
- 📦 Supports only one OAuth2 provider
- 📦 Supports only implicit flow

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

2. Add `@bitinflow/nuxt-oauth` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: [
    '@bitinflow/nuxt-oauth'
  ],

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
