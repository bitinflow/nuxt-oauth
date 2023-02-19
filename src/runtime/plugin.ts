import {addRouteMiddleware, defineNuxtPlugin, navigateTo} from '#app'
import useAuth from "./composables/useAuth"

export default defineNuxtPlugin(() => {
  addRouteMiddleware('auth', async (to) => {
    const {user, authConfig, setBearerToken} = await useAuth()

    if (to.path === authConfig.redirect.callback) {
      const queryParams = new URLSearchParams(to.query.toString());
      if (queryParams.has('error')) {
        return navigateTo(authConfig.redirect.login)
      }

      const hashParams = new URLSearchParams(to.hash.substring(1))

      if (hashParams.has('access_token')) {
        const token = hashParams.get('access_token') as string;
        const tokenType = hashParams.get('token_type') as string;
        const expires = hashParams.get('expires_in') as string;

        await setBearerToken(token, tokenType, parseInt(expires));
        return navigateTo(authConfig.redirect.home)
      }

      return
    }

    if (user.value === undefined) {
      return navigateTo(authConfig.redirect.login)
    }
  })

  addRouteMiddleware('guest', async () => {
    const {user, authConfig} = await useAuth()

    if (user.value !== undefined) {
      return navigateTo(authConfig.redirect.home)
    }
  })
})
