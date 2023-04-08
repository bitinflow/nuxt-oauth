<script setup lang="ts">
import {useAuth, useNuxtApp} from "#imports";

const {user, signOut} = await useAuth();

definePageMeta({
  middleware: ["auth"]
})

const { $api } = useNuxtApp()

$api.get('users/@me')
  .then((response: any) => {
    console.log(response.data)
  })
  .catch((error: any) => {
    console.log(error)
  })
</script>

<template>
  <div v-if="user">
    Hello {{ user.name }}

    <button @click="signOut">
      Sign Out
    </button>
  </div>
</template>
