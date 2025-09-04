import { google } from 'googleapis'

interface GoogleUserInfo {
  id: string
  email: string
  name: string
  picture: string
}

export function getGoogleOAuthClient() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )
  
  return oauth2Client
}

export function getGoogleAuthUrl() {
  const oauth2Client = getGoogleOAuthClient()
  
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email'],
    include_granted_scopes: true,
  })
  
  return authUrl
}

export async function getGoogleUserInfo(code: string): Promise<GoogleUserInfo> {
  const oauth2Client = getGoogleOAuthClient()
  
  // Échanger le code contre un token
  const { tokens } = await oauth2Client.getToken(code)
  oauth2Client.setCredentials(tokens)
  
  // Récupérer les informations utilisateur
  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
  const { data } = await oauth2.userinfo.get()
  
  if (!data.id || !data.email || !data.name) {
    throw new Error('Informations utilisateur Google incomplètes')
  }
  
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    picture: data.picture || ''
  }
}
