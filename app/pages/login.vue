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
</script>