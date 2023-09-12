import {addRouteMiddleware, defineNuxtPlugin, navigateTo, useCookie} from '#app'
import useAuth from "./composables/useAuth"
import {RouteLocationNormalized} from "vue-router";
import {ModuleOptions} from "../module";

interface AccessToken {
  access_token: string,
  token_type: string,
  expires_in: number,
  refresh_token: string
  scope: string
}

export default defineNuxtPlugin(() => {
  const resolveUsingToken = async (
    to: RouteLocationNormalized,
    authConfig: ModuleOptions,
    setBearerToken: (token: string, tokenType: string, expires: number) => Promise<void>
  ) => {
    const hashParams = new URLSearchParams(to.hash.substring(1))

    if (hashParams.has('access_token')) {
      const token = hashParams.get('access_token') as string;
      const tokenType = hashParams.get('token_type') as string;
      const expires = hashParams.get('expires_in') as string;

      await setBearerToken(token, tokenType, parseInt(expires));
      return navigateTo(authConfig.redirect.home, { external: true })
    }
  }

  const resolveUsingCode = async (
    to: RouteLocationNormalized,
    authConfig: ModuleOptions,
    setBearerToken: (token: string, tokenType: string, expires: number) => Promise<void>,
    setRefreshToken: (token: string, tokenType: string, expires: number) => Promise<void>
  ) => {

    if (to.query['code']) {
      const code = to.query['code'] as string;
      const stateFromRequest = to.query['state'] as string;
      const stateFromCookie = useCookie<string>('oauth_state');
      const codeVerifier = useCookie<string>('oauth_code_verifier');

      if (stateFromRequest !== stateFromCookie.value) {
        console.warn('State mismatch', stateFromRequest, stateFromCookie.value)
        return navigateTo(authConfig.redirect.login, { external: true })
      }

      const formData = new FormData();
      formData.append('grant_type', 'authorization_code')
      formData.append('client_id', authConfig.clientId)
      formData.append('redirect_uri', window.location.origin + authConfig.redirect.callback)
      formData.append('code_verifier', codeVerifier.value)
      formData.append('code', code)

      const response: Response = await fetch(authConfig.endpoints.token, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        console.warn('Failed to fetch token', response)
        return navigateTo(authConfig.redirect.login, { external: true })
      }

      const data: AccessToken = await response.json();
      await setBearerToken(data.access_token, data.token_type, data.expires_in)
      await setRefreshToken(data.refresh_token, data.token_type, authConfig.refreshToken.maxAge)
      return navigateTo(authConfig.redirect.home, { external: true })
    }
  }

  addRouteMiddleware('auth', async (to) => {
    const {user, authConfig, setBearerToken, setRefreshToken} = await useAuth()

    if (to.path === authConfig.redirect.callback || to.path === authConfig.redirect.callback + '/') {
      const queryParams = new URLSearchParams(to.query.toString());
      if (queryParams.has('error')) {
        return navigateTo(authConfig.redirect.login, { external: true })
      }

      if (authConfig.responseType === 'token') {
        return await resolveUsingToken(to, authConfig, setBearerToken)
      }

      if (authConfig.responseType === 'code') {
        return await resolveUsingCode(to, authConfig, setBearerToken, setRefreshToken)
      }

      return
    }

    if (user.value === undefined) {
      return navigateTo(authConfig.redirect.login, { external: true })
    }
  })

  addRouteMiddleware('guest', async () => {
    const {user, authConfig} = await useAuth()

    if (user.value !== undefined) {
      return navigateTo(authConfig.redirect.home, { external: true })
    }
  })
})
