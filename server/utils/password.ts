import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'

// Configuration pour bcrypt
const SALT_ROUNDS = 12

/**
 * Hash un mot de passe avec bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Vérifie un mot de passe contre son hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Génère un token sécurisé
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex')
}

/**
 * Validation de la force du mot de passe
 */
export function isPasswordStrong(password: string): { isStrong: boolean; reasons: string[] } {
  const reasons: string[] = []
  
  if (password.length < 8) {
    reasons.push('Le mot de passe doit contenir au moins 8 caractères')
  }
  
  if (!/[a-z]/.test(password)) {
    reasons.push('Le mot de passe doit contenir au moins une lettre minuscule')
  }
  
  if (!/[A-Z]/.test(password)) {
    reasons.push('Le mot de passe doit contenir au moins une lettre majuscule')
  }
  
  if (!/\d/.test(password)) {
    reasons.push('Le mot de passe doit contenir au moins un chiffre')
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    reasons.push('Le mot de passe doit contenir au moins un caractère spécial')
  }
  
  return {
    isStrong: reasons.length === 0,
    reasons
  }
}
