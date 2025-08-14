import { db } from '../../utils/db'
import { users, sessions } from '../../db/schema'
import { getCurrentUser } from '../../utils/session'
import { eq } from 'drizzle-orm'
import { createAppError, handleApiError } from '../../utils/errors'

export default defineEventHandler(async (event) => {
  try {
    const currentUser = await getCurrentUser(event)
    if (!currentUser) {
      throw createAppError('UNAUTHORIZED')
    }

    if (!currentUser.isAdmin) {
      throw createAppError('FORBIDDEN', 'Droits administrateur requis')
    }

    const id = getRouterParam(event, 'id')
    const userId = parseInt(id!)
    
    if (isNaN(userId)) {
      throw createAppError('VALIDATION_ERROR', 'ID utilisateur invalide')
    }

    // Ne pas permettre de se supprimer soi-même
    if (userId === currentUser.id) {
      throw createAppError('VALIDATION_ERROR', 'Vous ne pouvez pas supprimer votre propre compte')
    }

    // Vérifier que l'utilisateur existe
    const [userToDelete] = await db.select().from(users).where(eq(users.id, userId)).limit(1)
    if (!userToDelete) {
      throw createAppError('USER_NOT_FOUND')
    }

    // Supprimer en cascade : sessions de l'utilisateur
    await db.delete(sessions).where(eq(sessions.userId, userId))
    
    // Finalement supprimer l'utilisateur
    await db.delete(users).where(eq(users.id, userId))

    return { success: true, message: 'Utilisateur supprimé avec succès' }
    
  } catch (error) {
    return handleApiError(event, error)
  }
})
