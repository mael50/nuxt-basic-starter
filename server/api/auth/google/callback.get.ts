import { defineEventHandler, getQuery, sendRedirect } from 'h3'
import { db } from '../../../utils/db'
import { users } from '../../../db/schema'
import { eq } from 'drizzle-orm'
import { getGoogleUserInfo } from '../../../utils/google-oauth'
import { createSession } from '../../../utils/session'
import { createAppError, handleApiError } from '../../../utils/errors'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const code = query.code as string
    
    if (!code) {
      throw createAppError('VALIDATION_ERROR')
    }
    
    // Récupérer les informations utilisateur depuis Google
    const googleUser = await getGoogleUserInfo(code)
    
    // Vérifier si l'utilisateur existe déjà
    let [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, googleUser.email))
      .limit(1)
    
    if (existingUser) {
      // Utilisateur existant - mettre à jour les informations Google si nécessaire
      if (!existingUser.googleId && existingUser.provider === 'local') {
        // Lier le compte local au compte Google
        await db
          .update(users)
          .set({
            googleId: googleUser.id,
            name: googleUser.name,
            avatar: googleUser.picture,
            provider: 'google'
          })
          .where(eq(users.id, existingUser.id))
        
        existingUser.googleId = googleUser.id
        existingUser.name = googleUser.name
        existingUser.avatar = googleUser.picture
      }
    } else {
      // Nouvel utilisateur - créer un compte
      const [newUser] = await db
        .insert(users)
        .values({
          email: googleUser.email,
          googleId: googleUser.id,
          name: googleUser.name,
          avatar: googleUser.picture,
          provider: 'google',
          isAdmin: false
        })
      
      existingUser = {
        id: newUser.insertId as number,
        email: googleUser.email,
        passwordHash: null,
        googleId: googleUser.id,
        name: googleUser.name,
        avatar: googleUser.picture,
        provider: 'google',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }
    
    // Créer une session
    await createSession(event, existingUser.id)
    
    // Rediriger vers la page d'accueil
    return await sendRedirect(event, '/')
    
  } catch (error) {
    console.error('Erreur callback Google OAuth:', error)
    // Rediriger vers la page de connexion avec une erreur
    return await sendRedirect(event, '/login?error=oauth_error')
  }
})
