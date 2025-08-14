// Middleware pour les pages de connexion/inscription - redirige si déjà connecté
export default defineNuxtRouteMiddleware(async (to) => {
  const authUser = useAuthUser()
  
  // Si l'utilisateur est déjà connecté, rediriger vers l'accueil
  if (authUser.value) {
    return navigateTo('/')
  }
})
