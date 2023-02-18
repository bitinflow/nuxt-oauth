import {addRouteMiddleware, defineNuxtPlugin, navigateTo} from '#app'
import useAuth from "./composables/useAuth"

export default defineNuxtPlugin(() => {
  addRouteMiddleware('auth', async (to) => {
    const {user, authConfig, setBearer} = await useAuth()

    if (to.path === authConfig.redirect.callback) {
      const params = new URLSearchParams(to.hash.substring(1))

      if (params.has('access_token')) {
        const token = params.get('access_token') as string;
        const tokenType = params.get('token_type') as string;
        const expires = params.get('expires_in') as string;

        await setBearer(token, tokenType, parseInt(expires));
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
