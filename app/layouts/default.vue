<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <header class="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between px-4 py-3">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Icon name="i-heroicons-academic-cap-solid" class="w-4 h-4 text-white" />
                    </div>
                    <h1 class="text-lg font-semibold">{{ config.public.appName }}</h1>
                </div>
                
                <UDropdownMenu :items="items" :ui="{ content: 'w-fit' }">
                    <UAvatar src="https://avatar.iran.liara.run/public/47" size="2xl" />
                    <template #profile-trailing>
                    </template>
                </UDropdownMenu>
            </div>
        </header>

        <main class="pb-6">
            <div class="px-4 py-6 mx-auto">
                <slot />
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const config = useRuntimeConfig()
const authUserRef = useAuthUser()
const items = [
    {
        label: authUserRef.value?.email,
        disabled: true
    },
    {
        label: 'Déconnexion', 
        icon: 'i-heroicons-arrow-left-end-on-rectangle-solid',
        color: 'error',
        slot: 'profile' as const, 
        onClick: onLogout
    }
] satisfies DropdownMenuItem[]

async function onLogout() {
    await logout()
}
</script>