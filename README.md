# Dossiers Cap Horn — Vercel + Supabase + DICOM

Prototype pédagogique pour enregistrer des cas radiologiques anonymisés avec upload DICOM privé et viewer intégré.

## Installation locale

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Déploiement

1. Créer un projet Supabase.
2. Dans Supabase SQL Editor, copier-coller `supabase/schema.sql`.
3. Dans Supabase Storage, vérifier que le bucket `dicom-files` est privé.
4. Créer un projet GitHub avec ces fichiers.
5. Importer le repo dans Vercel.
6. Ajouter les variables d’environnement :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
7. Déployer.

## Important

Ne jamais uploader de données patient nominatives.
Les fichiers DICOM doivent être anonymisés avant import.
Prototype non destiné à un usage clinique sans hébergement conforme HDS/RGPD.
