import {CookieRef, navigateTo, useCookie, useRuntimeConfig} from "#app";
import {ModuleOptions} from "../../module";
import {generateRandomString, getChallengeFromVerifier} from "../support";

declare interface ComposableOptions {
  fetchUserOnInitialization: boolean
}

let user: CookieRef<any>;
let accessToken: CookieRef<any>;
let refreshToken: CookieRef<any>;

export default async (options: ComposableOptions = {
  fetchUserOnInitialization: false
}) => {
  const authConfig = useRuntimeConfig().public.oauth as ModuleOptions;
  if (user == null) user = useCookie('oauth_user');
  if (accessToken == null) accessToken = useCookie('oauth_access_token');
  if (refreshToken == null) refreshToken = useCookie('oauth_refresh_token');

  const fetchUser = async (): Promise<void> => {
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

  const signIn = async (): Promise<void> => {
    const state = useCookie<string>('oauth_state');
    state.value = generateRandomString();

    // create oauth authorization url
    const params = new URLSearchParams({
      client_id: authConfig.clientId,
      redirect_uri: window.location.origin + authConfig.redirect.callback,
      response_type: authConfig.responseType,
      scope: authConfig.scope.join(' '),
      state: state.value,
      prompt: authConfig.prompt
    })

    if (authConfig.responseType === 'code') {
      const codeVerifier = useCookie<string>('oauth_code_verifier');
      codeVerifier.value = generateRandomString();

      params.set('code_challenge', await getChallengeFromVerifier(codeVerifier.value))
      params.set('code_challenge_method', 'S256')
    }

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

  const setBearerToken = async (token: string, tokenType: string, expires: number): Promise<void> => {
    accessToken.value = {token, tokenType, expiresAt: Date.now() + expires * 1000};
    await fetchUser()
  }

  const setRefreshToken = async (token: string, tokenType: string, expires: number): Promise<void> => {
    refreshToken.value = {token, tokenType, expiresAt: Date.now() + expires * 1000};
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
    setRefreshToken,
    bearerToken,
    accessToken,
    refreshToken,
    authConfig
  }
}
