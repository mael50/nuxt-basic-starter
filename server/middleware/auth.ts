import { defineEventHandler } from 'h3'
import { getCurrentUser } from '../utils/session'

export default defineEventHandler(async (event) => {
  // facultatif: attacher user au contexte pour d’autres handlers
  const user = await getCurrentUser(event)
  event.context.user = user
}) 