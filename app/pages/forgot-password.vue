<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <!-- En-tête -->
            <div class="text-center">
                <UIcon 
                    name="i-heroicons-key-20-solid" 
                    class="mx-auto h-12 w-12 text-primary-600" 
                />
                <h2 class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                    Mot de passe oublié
                </h2>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Entrez votre adresse email pour recevoir un lien de réinitialisation
                </p>
            </div>

            <!-- Formulaire ou message de confirmation -->
            <UCard class="mt-8">
                <div v-if="!emailSent" class="space-y-6">
                    <form @submit.prevent="onSubmit">
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

                        <!-- Message d'erreur -->
                        <UAlert
                            v-if="error"
                            icon="i-heroicons-exclamation-triangle"
                            color="error"
                            variant="soft"
                            :title="error"
                            class="mt-4"
                        />

                        <!-- Bouton d'envoi -->
                        <UButton
                            type="submit"
                            :loading="pending"
                            :disabled="pending"
                            size="lg"
                            class="w-full mt-6"
                            icon="i-heroicons-paper-airplane"
                        >
                            {{ pending ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation' }}
                        </UButton>
                    </form>
                </div>

                <!-- Message de confirmation -->
                <div v-else class="text-center space-y-4">
                    <UIcon 
                        name="i-heroicons-check-circle" 
                        class="mx-auto h-16 w-16 text-green-500" 
                    />
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                        Email envoyé !
                    </h3>
                    <p class="text-gray-600 dark:text-gray-400">
                        Si un compte avec l'adresse <strong>{{ email }}</strong> existe, 
                        vous recevrez un lien de réinitialisation dans les prochaines minutes.
                    </p>
                    <p class="text-sm text-gray-500">
                        Vérifiez également votre dossier de courrier indésirable.
                    </p>
                    
                    <div class="pt-4">
                        <UButton
                            @click="resetForm"
                            variant="outline"
                            icon="i-heroicons-arrow-left"
                        >
                            Envoyer un autre email
                        </UButton>
                    </div>
                </div>
            </UCard>

            <!-- Liens de navigation -->
            <div class="text-center space-y-2">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    Vous vous souvenez de votre mot de passe ?
                    <UButton
                        to="/login"
                        variant="link"
                        size="sm"
                        class="p-0"
                    >
                        Retour à la connexion
                    </UButton>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

definePageMeta({
    layout: false,
    middleware: 'guest'
})

// Titre de la page
useHead({
    title: 'Mot de passe oublié - ' + config.public.appName
})

const email = ref('')
const pending = ref(false)
const error = ref('')
const emailSent = ref(false)

async function onSubmit() {
    if (!email.value.trim()) {
        error.value = 'Veuillez saisir votre adresse email'
        return
    }

    error.value = ''
    pending.value = true

    try {
        await $fetch('/api/auth/forgot-password', {
            method: 'POST',
            body: { email: email.value }
        })

        emailSent.value = true
    } catch (e: any) {
        error.value = e?.data?.statusMessage || 'Erreur lors de l\'envoi de l\'email'
    } finally {
        pending.value = false
    }
}

function resetForm() {
    emailSent.value = false
    email.value = ''
    error.value = ''
    pending.value = false
}
</script>
