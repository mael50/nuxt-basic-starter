export type AuthUser = { id: number; email: string; isAdmin: boolean }

export function useAuthUser() {
  return useState<AuthUser | null>('auth:user', () => null)
}

export async function fetchMe() {
  try {
    const me = await $fetch<AuthUser>('/api/auth/me')
    useAuthUser().value = me
    return me
  } catch {
    useAuthUser().value = null
    return null
  }
}

export async function login(email: string, password: string) {
  const user = await $fetch<AuthUser>('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  })
  useAuthUser().value = user
  return user
}

export async function register(email: string, password: string) {
  const user = await $fetch<AuthUser>('/api/auth/register', {
    method: 'POST',
    body: { email, password },
  })
  useAuthUser().value = user
  return user
}

export async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  useAuthUser().value = null
  return navigateTo('/login')
}

export async function requestPasswordReset(email: string) {
  return await $fetch('/api/auth/forgot-password', {
    method: 'POST',
    body: { email }
  })
}

export async function resetPassword(token: string, password: string) {
  return await $fetch('/api/auth/reset-password', {
    method: 'POST',
    body: { token, password }
  })
}

export async function verifyResetToken(token: string) {
  return await $fetch('/api/auth/verify-reset-token', {
    query: { token }
  })
} 