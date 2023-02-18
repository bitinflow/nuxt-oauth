<template>
  <div>
    Guest only page
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["guest"]
})
</script>
