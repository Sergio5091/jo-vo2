# Documentation Complète - Site de Recrutement Société Ivoirienne de Raffinage

## Vue d'ensemble

**Nom du projet** : Société Ivoirienne de Raffinage - Recrutement 2026  
**Type** : Formulaire de recrutement en ligne avec envoi d'emails  
**Technologies** : React + TypeScript + Vite + TailwindCSS + EmailJS  
**URL de production** : https://societe-ivoirienne-de-raffinage-git-main-sergio5091s-projects.vercel.app/  
**Repository** : https://github.com/Sergio5091/jo-2  

---

## Architecture Technique

### Stack Principal
- **Frontend** : React 18.3.1 avec TypeScript
- **Build Tool** : Vite 5.0.0
- **Styling** : TailwindCSS 3.4.0
- **Routing** : Wouter 3.3.5
- **Forms** : React Hook Form 7.55.0 avec Zod validation
- **UI Components** : Radix UI + Shadcn/ui
- **Email Service** : EmailJS Browser 4.4.1
- **Icons** : Lucide React 0.400.0
- **Animations** : Framer Motion 11.0.0

### Structure des Fichiers
```
src/
  components/
    SuccessCard.tsx          # Page de confirmation
    ui/                     # Composants UI réutilisables
    steps/
      StepIdentity.tsx       # Étape 1: Identité
      StepAvailability.tsx   # Étape 2: Disponibilité
      StepCNPS.tsx         # Étape 3: CNPS
      StepEngagement.tsx    # Étape 4: Engagement
  pages/
    Index.tsx                # Page d'accueil
    FormPage.tsx             # Formulaire principal
    not-found.tsx           # Page 404
  lib/utils.ts                # Utilitaires
  main.tsx                   # Point d'entrée
  index.css                  # Styles globaux
```

---

## Configuration EmailJS

### Variables d'Environnement

Créez un fichier `.env` à la racine du projet :

```env
# Email destinataire des formulaires
VITE_RECIPIENT_EMAIL=sergionounagnon1@gmail.com

# Configuration EmailJS
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### Configuration EmailJS Dashboard

#### Service Email
- **Type** : Gmail (ou autre provider)
- **Service ID** : À récupérer dans EmailJS

#### Template Email
- **Template ID** : À créer dans EmailJS
- **Sujet** : `Nouvelle candidature SIR - {{from_name}}` 
- **Destinataire** : `sergionounagnon1@gmail.com` 

---

## Développement Local

### Installation
```bash
npm install
```

### Développement
```bash
npm run dev
# Accès : http://localhost:5173
```

### Build
```bash
npm run build
# Output : dist/
```

### Variables d'environnement locales
```bash
cp .env.example .env
# Éditer .env avec vos clés EmailJS
```

---

## Scripts Package.json
```json
{
  "scripts": {
    "dev": "PORT=5174 BASE_PATH=/ vite --config vite.config.ts --host 0.0.0.0",
    "build": "vite build --config vite.config.ts",
    "serve": "vite preview --config vite.config.ts --host 0.0.0.0",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "vercel-build": "vite build"
  }
}
```

---

## Déploiement

### Vercel Configuration
```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "framework": "vite",
  "functions": {},
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

---

## Contact Support

### Pour les candidats
- **Email** : supportrecrut@gmail.com
- **WhatsApp/Wave** : 2250767554748

### Pour les développeurs
- **Repository** : https://github.com/Sergio5091/jo-2
- **Documentation** : Ce fichier
- **Issues** : GitHub issues

---

## Historique des Modifications

### v1.0.0 (17/04/2026)
- Configuration EmailJS complète
- Formulaire en 4 étapes
- Upload et compression d'images
- Déploiement Vercel configuré
- Design responsive et moderne
- Validation de formulaire robuste
