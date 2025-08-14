import { defineEventHandler, readBody } from 'h3'
import { db } from '../../utils/db'
import { users } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { hashPassword } from '../../utils/password'
import { createSession } from '../../utils/session'
import { registerSchema } from '../../utils/validation'
import { createAppError, handleApiError } from '../../utils/errors'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Validation avec Zod
    const validatedData = registerSchema.parse(body)
    
    const [existing] = await db.select().from(users).where(eq(users.email, validatedData.email)).limit(1)
    if (existing) {
      throw createAppError('EMAIL_ALREADY_EXISTS')
    }

    const passwordHash = await hashPassword(validatedData.password)
    const result = await db.insert(users).values({ 
      email: validatedData.email, 
      passwordHash 
    })

    // MySQL2 insert returns OkPacket; fetch the newly created user for session
    const [created] = await db.select().from(users).where(eq(users.email, validatedData.email)).limit(1)
    if (!created) {
      throw createAppError('INTERNAL_ERROR', 'Création utilisateur échouée')
    }

    await createSession(event, created.id)
    return { id: created.id, email: created.email, isAdmin: created.isAdmin }
    
  } catch (error) {
    return handleApiError(event, error)
  }
}) 