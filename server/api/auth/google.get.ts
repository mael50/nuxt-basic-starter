import { defineEventHandler, sendRedirect } from 'h3'
import { getGoogleAuthUrl } from '../../utils/google-oauth'
import { handleApiError } from '../../utils/errors'

export default defineEventHandler(async (event) => {
  try {
    const authUrl = getGoogleAuthUrl()
    
    // Rediriger vers Google OAuth
    return await sendRedirect(event, authUrl)
    
  } catch (error) {
    return handleApiError(event, error)
  }
})
