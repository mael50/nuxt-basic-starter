import { defineEventHandler, readBody, getHeader } from 'h3'
import { db } from '../../utils/db'
import { users, passwordResetTokens } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { generateSecureToken } from '../../utils/password'
import { sendEmail, generatePasswordResetEmail } from '../../utils/email'
import { forgotPasswordSchema } from '../../utils/validation'
import { handleApiError } from '../../utils/errors'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Validation avec Zod
    const validatedData = forgotPasswordSchema.parse(body)
    
    // Vérifier que l'utilisateur existe
    const [user] = await db.select().from(users).where(eq(users.email, validatedData.email)).limit(1)
    
    // Pour des raisons de sécurité, nous retournons toujours le même message
    // même si l'utilisateur n'existe pas
    const successMessage = {
      success: true,
      message: 'Si un compte avec cette adresse email existe, vous recevrez un lien de réinitialisation.'
    }
    
    if (!user) {
      // Simulation d'un délai pour éviter l'énumération d'utilisateurs
      await new Promise(resolve => setTimeout(resolve, 1000))
      return successMessage
    }

    try {
      // Générer un token sécurisé
      const token = generateSecureToken(32)
      
      // Expiration dans 1 heure
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000)
      
      // Supprimer les anciens tokens pour cet utilisateur
      await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, user.id))
      
      // Créer le nouveau token
      await db.insert(passwordResetTokens).values({
        userId: user.id,
        token,
        expiresAt
      })
      
      // Construire l'URL de réinitialisation
      const resetUrl = `${getHeader(event, 'origin') || 'http://localhost:3000'}/reset-password?token=${token}`
      
      // Envoyer l'email
      await sendEmail({
        to: validatedData.email,
        subject: `Réinitialisation de votre mot de passe - ${process.env.APP_NAME}`,
        html: generatePasswordResetEmail(resetUrl, validatedData.email)
      })
      
      console.log(`Email de réinitialisation envoyé à ${validatedData.email}`)
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', error)
      // Ne pas exposer l'erreur technique à l'utilisateur
    }
    
    return successMessage
    
  } catch (error) {
    return handleApiError(event, error)
  }
})
