// Middleware d'authentification pour protéger les pages qui nécessitent une connexion
export default defineNuxtRouteMiddleware(async (to) => {
  const authUser = useAuthUser()
  
  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!authUser.value) {
    return navigateTo('/login')
  }
})
