import { z } from 'zod'

// Schémas de validation pour l'authentification
export const loginSchema = z.object({
  email: z.string().email('Format d\'email invalide').trim().toLowerCase(),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères')
})

export const registerSchema = z.object({
  email: z.string().email('Format d\'email invalide').trim().toLowerCase(),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères')
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Format d\'email invalide').trim().toLowerCase()
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token requis'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères')
})

// Schémas pour la gestion des utilisateurs
export const createUserSchema = z.object({
  email: z.string().email('Format d\'email invalide').trim().toLowerCase(),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  isAdmin: z.boolean().optional().default(false)
})

export const updateUserSchema = z.object({
  email: z.string().email('Format d\'email invalide').trim().toLowerCase().optional(),
  isAdmin: z.boolean().optional()
})

// Types TypeScript dérivés des schémas
export type LoginData = z.infer<typeof loginSchema>
export type RegisterData = z.infer<typeof registerSchema>
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>
export type CreateUserData = z.infer<typeof createUserSchema>
export type UpdateUserData = z.infer<typeof updateUserSchema>
