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
    userInfo: string,
    logout: string | null
  },
  clientId: string,
  scope: string[]
}

const defaults: ModuleOptions = {
  redirect: {
    login: '/login',
    logout: '/',
    callback: '/login',
    home: '/'
  },
  endpoints: {
    authorization: 'https://accounts.bitinflow.com/oauth/authorize',
    userInfo: `https://accounts.bitinflow.com/api/v3/user`,
    logout: null,
  },
  clientId: 'please-set-client-id',
  scope: ['user:read']
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@bitinflow/nuxt-oauth',
    configKey: 'oauth'
  },
  defaults,
  setup (moduleOptions, nuxt) {
    const resolver = createResolver(import.meta.url)

    const options = defu(moduleOptions, {
      ...defaults
    })

    // Set up runtime configuration
    nuxt.options.runtimeConfig = nuxt.options.runtimeConfig || { public: {} }
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
