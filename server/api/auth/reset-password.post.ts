import { defineEventHandler, readBody } from 'h3'
import { db } from '../../utils/db'
import { users, passwordResetTokens, sessions } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { hashPassword } from '../../utils/password'
import { resetPasswordSchema } from '../../utils/validation'
import { createAppError, handleApiError } from '../../utils/errors'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Validation avec Zod
    const validatedData = resetPasswordSchema.parse(body)

    // Rechercher le token et vérifier qu'il n'a pas expiré
    const [resetToken] = await db.select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, validatedData.token))
      .limit(1)
    
    if (!resetToken) {
      throw createAppError('INVALID_TOKEN')
    }
    
    // Vérifier que le token n'a pas expiré
    if (new Date() > resetToken.expiresAt) {
      throw createAppError('INVALID_TOKEN', 'Token expiré')
    }
    
    // Récupérer l'utilisateur
    const [user] = await db.select()
      .from(users)
      .where(eq(users.id, resetToken.userId))
      .limit(1)
        
    if (!user) {
      throw createAppError('USER_NOT_FOUND')
    }
    
    // Hasher le nouveau mot de passe
    const passwordHash = await hashPassword(validatedData.password)
    
    // Mettre à jour le mot de passe
    await db.update(users)
      .set({ passwordHash })
      .where(eq(users.id, user.id))
    
    // Supprimer le token utilisé
    await db.delete(passwordResetTokens)
      .where(eq(passwordResetTokens.token, validatedData.token))
    
    // Optionnel: supprimer toutes les sessions actives pour forcer une nouvelle connexion
    await db.delete(sessions)
      .where(eq(sessions.userId, user.id))
    
    return {
      success: true,
      message: 'Mot de passe réinitialisé avec succès'
    }
    
  } catch (error) {
    return handleApiError(event, error)
  }
})
