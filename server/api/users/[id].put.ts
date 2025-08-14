import { db } from '../../utils/db'
import { users } from '../../db/schema'
import { getCurrentUser } from '../../utils/session'
import { eq } from 'drizzle-orm'
import { updateUserSchema } from '../../utils/validation'
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

    const body = await readBody(event)
    
    // Validation avec Zod
    const validatedData = updateUserSchema.parse(body)

    // Ne pas permettre de se rétrograder soi-même
    if (userId === currentUser.id && validatedData.isAdmin === false) {
      throw createAppError('VALIDATION_ERROR', 'Vous ne pouvez pas retirer vos propres droits administrateur')
    }

    const updateValues: any = {}
    
    if (validatedData.email !== undefined) {
      // Vérifier que l'email n'est pas déjà utilisé par un autre utilisateur
      const existing = await db.select().from(users)
        .where(eq(users.email, validatedData.email))
        .limit(1)
      
      if (existing.length > 0 && existing[0].id !== userId) {
        throw createAppError('EMAIL_ALREADY_EXISTS', 'Cet email est déjà utilisé par un autre utilisateur')
      }
      
      updateValues.email = validatedData.email
    }

    if (validatedData.isAdmin !== undefined) {
      updateValues.isAdmin = validatedData.isAdmin
    }

    if (Object.keys(updateValues).length === 0) {
      throw createAppError('VALIDATION_ERROR', 'Aucune donnée à mettre à jour')
    }

    await db.update(users)
      .set(updateValues)
      .where(eq(users.id, userId))

    // Retourner l'utilisateur mis à jour
    const [updatedUser] = await db.select({
      id: users.id,
      email: users.email,
      isAdmin: users.isAdmin,
      createdAt: users.createdAt
    }).from(users).where(eq(users.id, userId)).limit(1)

    if (!updatedUser) {
      throw createAppError('USER_NOT_FOUND')
    }

    return updatedUser
    
  } catch (error) {
    return handleApiError(event, error)
  }
})
