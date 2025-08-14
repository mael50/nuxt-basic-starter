import { defineEventHandler, getQuery } from 'h3'
import { db } from '../../utils/db'
import { passwordResetTokens } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { createAppError, handleApiError } from '../../utils/errors'

const querySchema = z.object({
  token: z.string().min(1, 'Token requis')
})

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    
    // Validation avec Zod
    const validatedQuery = querySchema.parse(query)

    // Rechercher le token
    const [resetToken] = await db.select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, validatedQuery.token))
      .limit(1)
    
    if (!resetToken) {
      return {
        valid: false,
        message: 'Token invalide'
      }
    }
    
    // Vérifier que le token n'a pas expiré
    if (new Date() > resetToken.expiresAt) {
      return {
        valid: false,
        message: 'Token expiré'
      }
    }
    
    return {
      valid: true,
      message: 'Token valide'
    }
    
  } catch (error) {
    return handleApiError(event, error)
  }
})
