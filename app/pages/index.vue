<template>
    <h1>Bienvenue</h1>
</template>

<script setup lang="ts">
definePageMeta({ 
    layout: 'default',
    middleware: 'auth'
})
</script>