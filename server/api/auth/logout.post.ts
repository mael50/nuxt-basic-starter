import { defineEventHandler } from 'h3'
import { destroySession } from '../../utils/session'
import { handleApiError } from '../../utils/errors'

export default defineEventHandler(async (event) => {
  try {
    await destroySession(event)
    return { ok: true }
    
  } catch (error) {
    return handleApiError(event, error)
  }
}) 