export default defineNuxtPlugin(async () => {
  // Initialiser l'authentification côté client uniquement
  const authUser = useAuthUser()
  
  // Si l'utilisateur n'est pas encore chargé, essayer de le récupérer depuis le serveur
  if (!authUser.value) {
    await fetchMe()
  }
})
