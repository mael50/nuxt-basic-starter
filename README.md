# Nuxt Basic Starter 🚀

Un template Nuxt 3 moderne avec authentification complète, gestion d'utilisateurs et interface utilisateur élégante.

## ✨ Fonctionnalités

- 🔐 **Authentification complète** - Connexion, inscription, mot de passe oublié
- 👥 **Gestion d'utilisateurs** - CRUD avec rôles admin
- 🎨 **Interface moderne** - Nuxt UI + Tailwind CSS
- 🗄️ **Base de données** - MySQL + Drizzle ORM
- 📧 **Emails transactionnels** - Réinitialisation de mot de passe
- 🛡️ **Sécurité** - Sessions sécurisées, validation Zod
- 🐳 **Docker** - Configuration prête pour le déploiement

## 🛠️ Stack Technique

- **Frontend**: Nuxt 3, Vue 3, Nuxt UI, Tailwind CSS
- **Backend**: Nitro, H3
- **Base de données**: MySQL + Drizzle ORM
- **Authentification**: Sessions + cookies sécurisés
- **Validation**: Zod
- **Email**: Nodemailer
- **Deployment**: Docker

## 🚀 Installation

1. **Cloner le projet**
```bash
git clone <your-repo>
cd nuxt-basic-starter
```

2. **Installer les dépendances**
```bash
npm install
# ou
pnpm install
# ou  
yarn install
```

3. **Configuration de l'environnement**
```bash
cp .env.example .env
```

Éditer le fichier `.env` avec vos valeurs :
```bash
# Base de données
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=nuxt-basic-starter

# SMTP pour les emails
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
EMAIL_FROM=your_email@domain.com
```

4. **Setup de la base de données**
```bash
# Générer les migrations
npm run db:generate

# Pousser le schéma vers la DB
npm run db:push

# (Optionnel) Ouvrir Drizzle Studio
npm run db:studio
```

5. **Lancer le serveur de développement**
```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## 📋 Scripts Disponibles

```bash
# Développement
npm run dev              # Serveur de développement
npm run build           # Build de production
npm run preview         # Prévisualiser le build

# Base de données
npm run db:generate     # Générer les migrations
npm run db:push        # Pousser le schéma
npm run db:studio      # Interface Drizzle Studio

# Qualité de code
npm run lint           # Linter
npm run lint:fix      # Corriger automatiquement
npm run type-check    # Vérification TypeScript

# Docker
npm run docker:build   # Build des images
npm run docker:up      # Lancer en production
npm run docker:down    # Arrêter les conteneurs
```

## 🏗️ Architecture

```
├── app/
│   ├── components/          # Composants Vue réutilisables
│   ├── composables/         # Composables (useAuth, useUsers)
│   ├── layouts/            # Layouts Nuxt
│   ├── middleware/         # Middleware de route (auth, admin, guest)
│   ├── pages/              # Pages de l'application
│   └── plugins/            # Plugins Nuxt
├── server/
│   ├── api/                # Endpoints API
│   │   ├── auth/           # Authentification
│   │   └── users/          # Gestion utilisateurs
│   ├── db/                 # Schéma base de données
│   ├── middleware/         # Middleware serveur
│   └── utils/              # Utilitaires serveur
└── drizzle/               # Migrations base de données
```

## 🔐 Authentification

Le système d'authentification inclut :

- **Inscription/Connexion** - Avec validation email + mot de passe
- **Sessions sécurisées** - Tokens avec expiration
- **Mot de passe oublié** - Avec envoi d'email
- **Middleware de protection** - Pour routes protégées
- **Rôles utilisateurs** - Admin vs utilisateur standard

## 🎯 Routes Principales

- `/` - Tableau de bord (protégé)
- `/login` - Connexion
- `/register` - Inscription  
- `/forgot-password` - Mot de passe oublié
- `/reset-password` - Réinitialisation mot de passe

## 🐳 Déploiement Docker

```bash
# Build et lancement
npm run docker:build
npm run docker:up

# Logs
npm run docker:logs

# Arrêt
npm run docker:down
```

## 🛡️ Sécurité

- Cookies httpOnly et sécurisés
- Validation des entrées avec Zod
- Protection CSRF
- Hachage des mots de passe avec bcrypt
- Sessions avec expiration automatique
- Nettoyage automatique des tokens expirés

## 📧 Configuration Email

Le système utilise Nodemailer pour l'envoi d'emails. Configuration dans `.env` :

```bash
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_username  
SMTP_PASSWORD=your_password
EMAIL_FROM=your_sender_email
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add amazing feature'`)
4. Push sur la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT.
