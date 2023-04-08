<script setup lang="ts">
import {useAuth, useNuxtApp} from "#imports";

const {user, signOut} = await useAuth();

definePageMeta({
  middleware: ["auth"]
})

const { $api } = useNuxtApp()

$api.get('user')
  .then((response: any) => {
    console.log(response.data)
  })
  .catch((error: any) => {
    console.log(error)
  })
</script>

<template>
  <div v-if="user">
    Hello {{ user.data.first_name }}

    <button @click="signOut">
      Sign Out
    </button>
  </div>
</template>
