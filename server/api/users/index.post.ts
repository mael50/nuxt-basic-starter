import { db } from '../../utils/db'
import { users } from '../../db/schema'
import { getCurrentUser } from '../../utils/session'
import { hashPassword } from '../../utils/password'
import { eq } from 'drizzle-orm'
import { createUserSchema } from '../../utils/validation'
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

    const body = await readBody(event)
    
    // Validation avec Zod
    const validatedData = createUserSchema.parse(body)

    // Vérifier que l'utilisateur n'existe pas déjà
    const existing = await db.select().from(users).where(eq(users.email, validatedData.email)).limit(1)
    if (existing.length > 0) {
      throw createAppError('EMAIL_ALREADY_EXISTS')
    }

    const passwordHash = await hashPassword(validatedData.password)
    
    const result = await db.insert(users).values({
      email: validatedData.email,
      passwordHash,
      isAdmin: validatedData.isAdmin || false
    })

    // Récupérer l'utilisateur créé
    const [newUser] = await db.select({
      id: users.id,
      email: users.email,
      isAdmin: users.isAdmin,
      createdAt: users.createdAt
    }).from(users).where(eq(users.email, validatedData.email)).limit(1)

    return newUser
    
  } catch (error) {
    return handleApiError(event, error)
  }
})
