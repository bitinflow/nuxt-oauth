import {CookieRef, navigateTo, useCookie, useRuntimeConfig} from "#app";
import {ModuleOptions} from "../../module";

declare interface ComposableOptions {
  fetchUserOnInitialization: boolean
}

let user: CookieRef<any>;
let accessToken: CookieRef<any>;

export default async (options: ComposableOptions = {
  fetchUserOnInitialization: false
}) => {
  const authConfig = useRuntimeConfig().public.oauth as ModuleOptions;
  if (user == null) user = useCookie('oauth_user')
  if (accessToken == null) accessToken = useCookie('oauth_access_token')

  const fetchUser = async () => {
    try {
      const response = await fetch(authConfig.endpoints.userInfo, {
        headers: {
          Accept: 'application/json',
          Authorization: `${accessToken.value.tokenType} ${accessToken.value.token}`
        }
      });

      user.value = response.ok
        ? await response.json()
        : null;
    } catch (e) {
      user.value = null;
    }
  }

  const signIn = async () => {
    // create oauth authorization url
    const params = new URLSearchParams({
      client_id: authConfig.clientId,
      redirect_uri: window.location.origin + authConfig.redirect.callback,
      response_type: 'token',
      scope: authConfig.scope.join(' ')
    })

    window.location.href = `${authConfig.endpoints.authorization}?${params.toString()}`
  };

  const signOut = async () => {
    accessToken.value = null;
    user.value = null;

    if (authConfig.endpoints.logout) {
      // create oauth logout url
      const params = new URLSearchParams({
        client_id: authConfig.clientId,
        redirect_uri: window.location.origin + authConfig.redirect.logout
      })

      window.location.href = `${authConfig.endpoints.logout}?${params.toString()}`
    }

    return navigateTo(authConfig.redirect.logout)
  }

  const setBearerToken = async (token: string, tokenType: string, expires: number) => {
    accessToken.value = {token, tokenType, expiresAt: Date.now() + expires * 1000};
    await fetchUser()
  }

  // Initialize the user if the option is set to true
  if (options.fetchUserOnInitialization) {
    await fetchUser()
  }

  const bearerToken = () => {
    return accessToken.value
      ? `${accessToken.value.tokenType} ${accessToken.value.token}`
      : null;
  }

  return {
    user,
    signIn,
    signOut,
    setBearerToken,
    bearerToken,
    accessToken,
    authConfig
  }
}
