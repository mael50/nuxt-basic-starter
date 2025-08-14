// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  
  // Configuration runtime pour les variables d'environnement
  runtimeConfig: {
    // Côté serveur uniquement
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPassword: process.env.SMTP_PASSWORD,
    emailFrom: process.env.EMAIL_FROM,
    sessionCookieName: process.env.SESSION_COOKIE_NAME,
    sessionCookieSecure: process.env.SESSION_COOKIE_SECURE,
    
    // Public (accessible côté client et serveur)
    public: {
      appName: process.env.APP_NAME || 'Nuxt Basic Starter',
      baseUrl: process.env.BASE_URL || 'http://localhost:3000'
    }
  },
  
  // Configuration SSR pour l'authentification
  ssr: true,
  
  // Configuration de sécurité
  nitro: {
    experimental: {
      wasm: true
    }
  }
})
