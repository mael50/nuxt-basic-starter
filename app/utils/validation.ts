import { z } from 'zod'

// Schémas côté client pour la validation des formulaires
export const clientLoginSchema = z.object({
  email: z.string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide')
    .trim()
    .toLowerCase(),
  password: z.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
})

export const clientRegisterSchema = z.object({
  email: z.string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide')
    .trim()
    .toLowerCase(),
  password: z.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
})

export const clientForgotPasswordSchema = z.object({
  email: z.string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide')
    .trim()
    .toLowerCase()
})

export const clientResetPasswordSchema = z.object({
  password: z.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
})

// Types TypeScript dérivés des schémas
export type ClientLoginForm = z.infer<typeof clientLoginSchema>
export type ClientRegisterForm = z.infer<typeof clientRegisterSchema>
export type ClientForgotPasswordForm = z.infer<typeof clientForgotPasswordSchema>
export type ClientResetPasswordForm = z.infer<typeof clientResetPasswordSchema>
