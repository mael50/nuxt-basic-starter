import { db } from '../../utils/db'
import { users } from '../../db/schema'
import { getCurrentUser } from '../../utils/session'
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

    const usersList = await db.select({
      id: users.id,
      email: users.email,
      isAdmin: users.isAdmin,
      createdAt: users.createdAt
    }).from(users)

    return usersList
    
  } catch (error) {
    return handleApiError(event, error)
  }
})
