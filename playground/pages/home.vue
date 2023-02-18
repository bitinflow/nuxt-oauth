<script setup lang="ts">
import {useAuth} from "#imports";

const {user, signOut} = await useAuth();

definePageMeta({
  middleware: ["auth"]
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
