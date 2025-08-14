import { defineEventHandler } from 'h3'
import { getCurrentUser } from '../../utils/session'
import { createAppError, handleApiError } from '../../utils/errors'

export default defineEventHandler(async (event) => {
  try {
    const user = await getCurrentUser(event)
    if (!user) {
      throw createAppError('UNAUTHORIZED')
    }
    return { id: user.id, email: user.email, isAdmin: user.isAdmin }
    
  } catch (error) {
    return handleApiError(event, error)
  }
}) 