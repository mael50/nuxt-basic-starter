import { H3Event, getCookie, setCookie, deleteCookie } from 'h3'
import crypto from 'node:crypto'
import { db } from '../utils/db'
import { sessions, users } from '../db/schema'
import { eq, lt } from 'drizzle-orm'

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? 'sid'
const COOKIE_SECURE = (process.env.SESSION_COOKIE_SECURE ?? 'false') === 'true'
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 jours en millisecondes

export async function createSession(event: H3Event, userId: number) {
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + SESSION_DURATION)
  
  await db.insert(sessions).values({ 
    token, 
    userId,
    expiresAt 
  })
  
  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: COOKIE_SECURE,
    path: '/',
    maxAge: SESSION_DURATION / 1000, // en secondes
  })
}

export async function destroySession(event: H3Event) {
  const token = getCookie(event, COOKIE_NAME)
  if (token) {
    await db.delete(sessions).where(eq(sessions.token, token))
  }
  deleteCookie(event, COOKIE_NAME, { path: '/' })
}

export async function getCurrentUser(event: H3Event) {
  const token = getCookie(event, COOKIE_NAME)
  if (!token) return null

  const [session] = await db.select().from(sessions).where(eq(sessions.token, token)).limit(1)
  if (!session) return null

  // Vérifier si la session a expiré
  if (session.expiresAt && new Date() > session.expiresAt) {
    await db.delete(sessions).where(eq(sessions.token, token))
    return null
  }

  const [user] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1)
  return user ?? null
}

// Fonction utilitaire pour nettoyer les sessions expirées
export async function cleanupExpiredSessions() {
  await db.delete(sessions).where(lt(sessions.expiresAt, new Date()))
} 