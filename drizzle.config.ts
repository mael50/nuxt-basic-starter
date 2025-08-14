import type { Config } from 'drizzle-kit'

const host = process.env.DB_HOST ?? '127.0.0.1'
const port = Number(process.env.DB_PORT ?? 3306)
const user = process.env.DB_USER ?? 'root'
const password = process.env.DB_PASSWORD ?? ''
const database = process.env.DB_NAME ?? 'nuxt-basic-starter'

const url = `mysql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}`

export default {
  schema: './server/db/schema.ts',
  out: './drizzle',
  dialect: 'mysql',
  dbCredentials: {
    url,
  },
} satisfies Config 