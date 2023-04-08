import {addImportsDir, addPlugin, createResolver, defineNuxtModule} from '@nuxt/kit'
import defu from "defu";

// Module options TypeScript interface definition
export interface ModuleOptions {
  redirect: {
    login: string,
    logout: string,
    callback: string,
    home: string
  },
  endpoints: {
    authorization: string,
    token: string,
    userInfo: string,
    logout: string | null
  },
  refreshToken: {
    maxAge: number,
  }
  clientId: string,
  responseType: 'token' | 'code',
  prompt: '' | 'none' | 'login' | 'consent',
  scope: string[]
}

const defaults: ModuleOptions = {
  redirect: {
    login: '/auth/login',
    logout: '/',
    callback: '/auth/login',
    home: '/'
  },
  endpoints: {
    authorization: 'https://accounts.bitinflow.com/oauth/authorize',
    token: 'https://accounts.bitinflow.com/oauth/token',
    userInfo: 'https://accounts.bitinflow.com/api/v3/user',
    logout: null,
  },
  refreshToken: {
    maxAge: 60 * 60 * 24 * 30,
  },
  clientId: 'please-set-client-id',
  responseType: 'code',
  prompt: '',
  scope: []
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@bitinflow/nuxt-oauth',
    configKey: 'oauth'
  },
  defaults,
  setup(moduleOptions, nuxt) {
    const resolver = createResolver(import.meta.url)

    const options = defu(moduleOptions, {
      ...defaults
    })

    // Set up runtime configuration
    nuxt.options.runtimeConfig = nuxt.options.runtimeConfig || {public: {}}
    nuxt.options.runtimeConfig.oauth = defu(nuxt.options.runtimeConfig.oauth, {
      ...options
    })
    nuxt.options.runtimeConfig.public.oauth = defu(nuxt.options.runtimeConfig.public.oauth, {
      ...options
    })

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'))

    const composables = resolver.resolve('./runtime/composables')
    addImportsDir(composables)
  }
})
