<script setup lang="ts">
import {definePageMeta, useAuth} from "#imports";

const {signIn} = await useAuth();

definePageMeta({
  middleware: ["auth"]
})
</script>

<template>
  <div>
    <h1>Login</h1>
    <button @click="signIn">
      Sign In
    </button>
  </div>
</template>
