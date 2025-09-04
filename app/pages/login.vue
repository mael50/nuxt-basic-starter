<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <!-- Formulaire -->
            <UCard class="mt-8">
                <h2 class="text-3xl pb-6 font-extrabold text-gray-900 dark:text-white text-center">
                    Connexion
                </h2>
                <form @submit.prevent="onSubmit" class="space-y-6">
                    <div>
                        <UFormField label="Adresse email" required>
                            <UInput
                                v-model="email"
                                type="email"
                                placeholder="votre@email.com"
                                icon="i-heroicons-envelope"
                                size="lg"
                                required
                                class="w-full"
                            />
                        </UFormField>
                    </div>

                    <div>
                        <UFormField label="Mot de passe" required>
                            <UInput
                                v-model="password"
                                type="password"
                                placeholder="••••••••"
                                icon="i-heroicons-lock-closed"
                                size="lg"
                                required
                                class="w-full"
                            />
                        </UFormField>
                    </div>

                    <!-- Message d'erreur -->
                    <UAlert
                        v-if="error"
                        icon="i-heroicons-exclamation-triangle"
                        color="error"
                        variant="soft"
                        :title="error"
                    />

                    <!-- Bouton de connexion -->
                    <UButton
                        type="submit"
                        :loading="pending"
                        :disabled="pending"
                        size="lg"
                        class="w-full"
                        icon="i-heroicons-arrow-right-on-rectangle"
                    >
                        {{ pending ? 'Connexion...' : 'Se connecter' }}
                    </UButton>

                    <!-- Séparateur -->
                    <div class="relative my-6">
                        <div class="absolute inset-0 flex items-center">
                            <div class="w-full border-t border-gray-300 dark:border-gray-700" />
                        </div>
                        <div class="relative flex justify-center text-sm">
                            <span class="px-2 bg-white dark:bg-gray-900 text-gray-500">ou</span>
                        </div>
                    </div>

                    <!-- Connexion avec Google -->
                    <UButton
                        @click="loginWithGoogle"
                        :loading="googlePending"
                        :disabled="googlePending"
                        size="lg"
                        variant="outline"
                        class="w-full"
                        icon="i-heroicons-globe-alt"
                    >
                        {{ googlePending ? 'Redirection...' : 'Continuer avec Google' }}
                    </UButton>



                    <div class="text-center mt-4">
                        <UButton
                            to="/register"
                            variant="link"
                            size="sm"
                            class="text-primary-600 hover:text-primary-500"
                        >
                            Créer un compte
                        </UButton>
                        <span>ou</span>
                        <UButton
                            to="/forgot-password"
                            variant="link"
                            size="sm"
                            class="text-primary-600 hover:text-primary-500"
                        >
                            Mot de passe oublié ?
                        </UButton>
                    </div>
                </form>
            </UCard>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: 'guest',
    layout: false
})

const email = ref('')
const password = ref('')
const pending = ref(false)
const googlePending = ref(false)
const error = ref('')

async function onSubmit() {
    error.value = ''
    pending.value = true
    try {
        await login(email.value, password.value)
        await navigateTo('/')
    } catch (e: any) {
        error.value = e?.data?.statusMessage || 'Erreur de connexion'
    } finally {
        pending.value = false
    }
}

async function loginWithGoogle() {
    googlePending.value = true
    try {
        // Rediriger vers l'endpoint Google OAuth
        await navigateTo('/api/auth/google', { external: true })
    } catch (e: any) {
        error.value = 'Erreur lors de la connexion avec Google'
        googlePending.value = false
    }
}
</script>