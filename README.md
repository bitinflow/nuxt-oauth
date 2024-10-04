# 🔒 @bitinflow/nuxt-oauth

**@bitinflow/nuxt-oauth** is a Nuxt 3 Module that provides a simple OAuth 2 implementation for static site nuxt
applications for which no backend code is required. It uses the recommended Authorization Code Grant with PKCE by
default and supports Implicit Grant Tokens as well.

This package is intended to be used with Laravel Passport, allowing users to interact with their first-party API using
their own OAuth provider. Currently, it does not support multiple OAuth providers. With **@bitinflow/nuxt-oauth**,
developers can quickly and easily implement secure OAuth authentication in their Nuxt applications.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)

## Features

- 📦 Authorization Code Grant with PKCE (default)
- 📦 Simple OAuth 2 Implicit Grant Token
  authentication ([not recommended](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics))
- 📦 Intended to be used with laravel-passport
- 📦 Single OAuth provider support (currently)

## Quick Setup

> **Note:** Starting with **@bitinflow/nuxt-oauth** v2.0.0, the default response type is `code`. If you want to use the
> `token` response type, you need to set it explicitly in the configuration.

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

Or alternatively disable `ssr` via `routeRules`, only for pages where `auth` or `guest` middlewares are needed.
Typically account section and login page.

```js
export default defineNuxtConfig({
  modules: [
    '@bitinflow/nuxt-oauth'
  ],

  ssr: false,
  // or
  routeRules: {
    '/dashboard/**': {ssr: false},
    '/whatever/**': {ssr: false}
  },

  // example 1: using code response type (default)
  oauth: {
    endpoints: {
      authorization: 'https://example.com/oauth/authorize',
      token: 'https://example.com/oauth/token',
      userInfo: 'https://example.com/api/users/me',
      logout: 'https://example.com/oauth/logout'
    },
    clientId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    scope: ['user:read']
  },

  // example 2: using token response type (not recommended)
  oauth: {
    endpoints: {
      authorization: 'https://example.com/oauth/authorize',
      userInfo: 'https://example.com/api/users/me',
      logout: 'https://example.com/oauth/logout'
    },
    clientId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    responseType: 'token',
    scope: ['user:read']
  },
})
```

This will be your callback url (host is determined by `window.location.origin`):

- Callback: `http://localhost:3000/login`

That's it! You can now use @bitinflow/nuxt-oauth in your Nuxt app ✨

## Module Options

The module provides a set of customizable options to configure OAuth-based authentication for your application. Below is a detailed description of each option and its default values:

### `redirect`

This option defines the URLs for redirection during the authentication process.

- `login` (`string`): The URL to redirect to when a user needs to log in. Default: `/login`.
- `logout` (`string`): The URL to redirect to after logging out. Default: `/`.
- `callback` (`string`): The URL to handle the OAuth callback. Default: `/login`.
- `home` (`string`): The URL to redirect to after successful authentication. Default: `/`.

### `endpoints`

Configures the OAuth server endpoints for authorization, token exchange, and user information retrieval.

- `authorization` (`string`): The OAuth authorization endpoint. Default: `https://example.com/oauth/authorize`.
- `token` (`string`): The OAuth token endpoint. Default: `https://example.com/oauth/token`.
- `userInfo` (`string`): The endpoint to retrieve user information. Default: `https://example.com/api/users/me`.
- `logout` (`string | null`): The endpoint for logging out from the OAuth provider. Default: `null`.

### `refreshToken`

Manages the refresh token settings.

- `maxAge` (`number`): The maximum age (in seconds) for storing the refresh token in cookies. Default: `60 * 60 * 24 * 30` (30 days).

### `cookies`

Configures cookie settings for storing OAuth tokens and related data.

- `prefix` (`string`): A prefix for all cookie names. Default: none.
- `names`: Specific names for different OAuth-related cookies.
  - `oauth_user`: The cookie name for storing the OAuth user. Default: `oauth_user`.
  - `oauth_state`: The cookie name for storing the OAuth state. Default: `oauth_state`.
  - `oauth_code_verifier`: The cookie name for storing the OAuth code verifier. Default: `oauth_code_verifier`.
  - `oauth_access_token`: The cookie name for storing the access token. Default: `oauth_access_token`.
  - `oauth_refresh_token`: The cookie name for storing the refresh token. Default: `oauth_refresh_token`.
- `options`: Additional settings for cookie behavior.
  - `path` (`string`): The cookie path. Default: none.
  - `maxAge` (`number`): The cookie's maximum age (in seconds). Default: none.
  - `secure` (`boolean`): Whether the cookie should only be sent over HTTPS. Default: none.
  - `sameSite` (`string`): Sets the `SameSite` cookie attribute (`lax`, `strict`, or `none`). Default: none.
  - `domain` (`string`): Specifies the cookie's domain. Default: none.
  - `httpOnly` (`boolean`): Indicates if the cookie is inaccessible to JavaScript. Default: none.

### `clientId`

- (`string`): The client ID used for OAuth authentication. Default: `please-set-client-id`.

### `responseType`

- (`'token' | 'code'`): The type of OAuth response, either token-based or code-based flow. Default: `code`.

### `prompt`

- (`'' | 'none' | 'login' | 'consent'`): The prompt parameter to control the OAuth flow. Default: `''`.

### `scope`

- (`string[]`): The OAuth scopes requested during authentication. Default: `[]` (empty array).

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
