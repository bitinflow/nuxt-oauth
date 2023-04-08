import axios from "axios";
import {useAuth} from "#imports";
import {defineNuxtPlugin} from '#app';
import {watch} from 'vue';

export default defineNuxtPlugin(async () => {
  const {bearerToken, accessToken} = await useAuth();

  const api = axios.create({
    baseURL: 'https://id.stream.tv/api/',
    headers: {
      common: {
        'Authorization': bearerToken(),
      },
    },
  });

  watch(accessToken, () => {
    console.log('access token rotated')
    api.defaults.headers.common['Authorization'] = bearerToken();
  });

  return {
    provide: {
      api: api,
    },
  };
});
