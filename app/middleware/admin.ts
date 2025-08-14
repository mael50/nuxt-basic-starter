// Middleware admin pour protéger les pages qui nécessitent des droits administrateur
export default defineNuxtRouteMiddleware(async (to) => {
  const authUser = useAuthUser()
  
  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!authUser.value) {
    return navigateTo('/login')
  }
  
  // Si l'utilisateur n'a pas les droits admin, rediriger vers le tableau de bord
  if (!authUser.value.isAdmin) {
    throw createError({ 
      statusCode: 403, 
      statusMessage: 'Accès interdit - Droits administrateur requis' 
    })
  }
})
