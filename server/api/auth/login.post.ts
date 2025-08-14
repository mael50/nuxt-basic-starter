import { defineEventHandler, readBody } from 'h3'
import { db } from '../../utils/db'
import { users } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { verifyPassword } from '../../utils/password'
import { createSession } from '../../utils/session'
import { loginSchema } from '../../utils/validation'
import { createAppError, handleApiError } from '../../utils/errors'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Validation avec Zod
    const validatedData = loginSchema.parse(body)
    
    const [user] = await db.select().from(users).where(eq(users.email, validatedData.email)).limit(1)
    if (!user) {
      throw createAppError('INVALID_CREDENTIALS')
    }

    const isValidPassword = await verifyPassword(validatedData.password, user.passwordHash)
    if (!isValidPassword) {
      throw createAppError('INVALID_CREDENTIALS')
    }

    await createSession(event, user.id)
    return { id: user.id, email: user.email, isAdmin: user.isAdmin }
    
  } catch (error) {
    return handleApiError(event, error)
  }
}) 