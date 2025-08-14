import type { H3Event } from 'h3'
import { ZodError } from 'zod'

export class AppError extends Error {
  statusCode: number
  statusMessage: string
  
  constructor(statusCode: number, statusMessage: string, message?: string) {
    super(message || statusMessage)
    this.statusCode = statusCode
    this.statusMessage = statusMessage
  }
}

export const ErrorCodes = {
  // Authentification
  UNAUTHORIZED: { code: 401, message: 'Non authentifié' },
  FORBIDDEN: { code: 403, message: 'Accès interdit' },
  
  // Validation
  VALIDATION_ERROR: { code: 400, message: 'Données invalides' },
  EMAIL_ALREADY_EXISTS: { code: 409, message: 'Un compte avec cet email existe déjà' },
  USER_NOT_FOUND: { code: 404, message: 'Utilisateur non trouvé' },
  INVALID_CREDENTIALS: { code: 401, message: 'Email ou mot de passe incorrect' },
  
  // Tokens
  INVALID_TOKEN: { code: 400, message: 'Token invalide ou expiré' },
  
  // Serveur
  INTERNAL_ERROR: { code: 500, message: 'Erreur interne du serveur' },
  EMAIL_SEND_ERROR: { code: 500, message: 'Erreur lors de l\'envoi de l\'email' }
} as const

/**
 * Créer une erreur standardisée
 */
export function createAppError(errorType: keyof typeof ErrorCodes, customMessage?: string) {
  const error = ErrorCodes[errorType]
  return new AppError(error.code, customMessage || error.message)
}

/**
 * Formater les erreurs de validation Zod
 */
function formatZodError(error: ZodError): string {
  const issues = error.issues.map(issue => {
    const path = issue.path.length > 0 ? `${issue.path.join('.')}: ` : ''
    return `${path}${issue.message}`
  })
  return issues.join(', ')
}

/**
 * Gestionnaire d'erreur pour les routes API
 */
export function handleApiError(event: H3Event, error: unknown) {
  console.error('API Error:', error)
  
  if (error instanceof ZodError) {
    throw createError({
      statusCode: 400,
      statusMessage: formatZodError(error)
    })
  }
  
  if (error instanceof AppError) {
    throw createError({
      statusCode: error.statusCode,
      statusMessage: error.statusMessage
    })
  }
  
  if (error instanceof Error) {
    // Log l'erreur complète pour le debug
    console.error('Stack trace:', error.stack)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur interne du serveur'
    })
  }
  
  throw createError({
    statusCode: 500,
    statusMessage: 'Une erreur inattendue s\'est produite'
  })
}
