<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <!-- En-tête -->
            <div class="text-center">
                <UIcon 
                    name="i-heroicons-lock-closed-20-solid" 
                    class="mx-auto h-12 w-12 text-primary-600" 
                />
                <h2 class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                    Nouveau mot de passe
                </h2>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Définissez votre nouveau mot de passe
                </p>
            </div>

            <UCard class="mt-8">
                <!-- Vérification du token en cours -->
                <div v-if="verifyingToken" class="text-center py-8">
                    <UIcon 
                        name="i-heroicons-arrow-path" 
                        class="mx-auto h-8 w-8 text-gray-400 animate-spin" 
                    />
                    <p class="mt-4 text-gray-600 dark:text-gray-400">
                        Vérification du lien...
                    </p>
                </div>

                <!-- Token invalide -->
                <div v-else-if="!tokenValid" class="text-center py-8">
                    <UIcon 
                        name="i-heroicons-exclamation-triangle" 
                        class="mx-auto h-16 w-16 text-red-500" 
                    />
                    <h3 class="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                        Lien invalide ou expiré
                    </h3>
                    <p class="mt-2 text-gray-600 dark:text-gray-400">
                        Ce lien de réinitialisation n'est plus valide. Il a peut-être expiré ou a déjà été utilisé.
                    </p>
                    <div class="mt-6 space-y-2">
                        <UButton
                            to="/forgot-password"
                            class="w-full"
                            icon="i-heroicons-arrow-left"
                        >
                            Demander un nouveau lien
                        </UButton>
                        <UButton
                            to="/login"
                            variant="outline"
                            class="w-full"
                        >
                            Retour à la connexion
                        </UButton>
                    </div>
                </div>

                <!-- Formulaire de réinitialisation -->
                <div v-else-if="!resetSuccess" class="space-y-6">
                    <form @submit.prevent="onSubmit">
                        <div>
                            <UFormField label="Nouveau mot de passe" required>
                                <UInput
                                    v-model="password"
                                    type="password"
                                    placeholder="Minimum 6 caractères"
                                    icon="i-heroicons-lock-closed"
                                    size="lg"
                                    required
                                />
                            </UFormField>
                        </div>

                        <div class="mt-4">
                            <UFormField label="Confirmer le nouveau mot de passe" required>
                                <UInput
                                    v-model="confirmPassword"
                                    type="password"
                                    placeholder="Ressaisissez le mot de passe"
                                    icon="i-heroicons-lock-closed"
                                    size="lg"
                                    required
                                />
                            </UFormField>
                        </div>

                        <!-- Messages -->
                        <UAlert
                            v-if="error"
                            icon="i-heroicons-exclamation-triangle"
                            color="error"
                            variant="soft"
                            :title="error"
                            class="mt-4"
                        />

                        <UAlert
                            v-if="password && password.length < 6"
                            icon="i-heroicons-information-circle"
                            color="warning"
                            variant="soft"
                            title="Le mot de passe doit contenir au moins 6 caractères"
                            class="mt-4"
                        />

                        <UAlert
                            v-if="confirmPassword && password !== confirmPassword"
                            icon="i-heroicons-exclamation-triangle"
                            color="error"
                            variant="soft"
                            title="Les mots de passe ne correspondent pas"
                            class="mt-4"
                        />

                        <!-- Bouton de soumission -->
                        <UButton
                            type="submit"
                            :loading="pending"
                            :disabled="pending || password.length < 6 || password !== confirmPassword"
                            size="lg"
                            class="w-full mt-6"
                            icon="i-heroicons-check"
                        >
                            {{ pending ? 'Réinitialisation...' : 'Réinitialiser le mot de passe' }}
                        </UButton>
                    </form>
                </div>

                <!-- Succès -->
                <div v-else class="text-center py-8">
                    <UIcon 
                        name="i-heroicons-check-circle" 
                        class="mx-auto h-16 w-16 text-green-500" 
                    />
                    <h3 class="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                        Mot de passe réinitialisé !
                    </h3>
                    <p class="mt-2 text-gray-600 dark:text-gray-400">
                        Votre mot de passe a été modifié avec succès.
                        Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
                    </p>
                    <div class="mt-6">
                        <UButton
                            to="/login"
                            class="w-full"
                            icon="i-heroicons-arrow-right-on-rectangle"
                        >
                            Se connecter
                        </UButton>
                    </div>
                </div>
            </UCard>

            <!-- Lien vers la page de connexion -->
            <div v-if="tokenValid && !resetSuccess" class="text-center">
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
    title: `Réinitialiser le mot de passe - ${config.public.APP_NAME}`
})

const route = useRoute()
const token = computed(() => route.query.token as string)

const password = ref('')
const confirmPassword = ref('')
const pending = ref(false)
const error = ref('')
const verifyingToken = ref(true)
const tokenValid = ref(false)
const resetSuccess = ref(false)

// Vérifier la validité du token au chargement de la page
onMounted(async () => {
    if (!token.value) {
        verifyingToken.value = false
        tokenValid.value = false
        return
    }

    try {
        const result = await $fetch('/api/auth/verify-reset-token', {
            query: { token: token.value }
        })
        tokenValid.value = result.valid
    } catch (e) {
        tokenValid.value = false
    } finally {
        verifyingToken.value = false
    }
})

async function onSubmit() {
    if (!password.value || !confirmPassword.value) {
        error.value = 'Veuillez remplir tous les champs'
        return
    }

    if (password.value.length < 6) {
        error.value = 'Le mot de passe doit contenir au moins 6 caractères'
        return
    }

    if (password.value !== confirmPassword.value) {
        error.value = 'Les mots de passe ne correspondent pas'
        return
    }

    error.value = ''
    pending.value = true

    try {
        await $fetch('/api/auth/reset-password', {
            method: 'POST',
            body: { 
                token: token.value,
                password: password.value
            }
        })

        resetSuccess.value = true
    } catch (e: any) {
        error.value = e?.data?.statusMessage || 'Erreur lors de la réinitialisation du mot de passe'
    } finally {
        pending.value = false
    }
}
</script>
