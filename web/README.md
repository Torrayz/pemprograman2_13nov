# NewsHub (React + Supabase)

React/Vite replacement for the legacy PHP/MySQL coursework. The original PHP files remain at repository root as archived source.

## Database
Uses `public.newshub_articles` on existing Supabase project `torray-workspace`. Published articles are public; drafts and writes require NEWSHUB membership with owner/admin/editor role. Only owners/admins may delete.

## Start
Copy `web/.env.example` to `web/.env`, set **public publishable** values (never service-role), then run:

```bash
cd web
npm install
npm run dev
npm run build
```

## Production
Vercel root directory: `web`. Build `npm run build`, output `dist`. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in Vercel. Sign in using an account that has a NEWSHUB membership role assigned by a trusted operator.

No local MySQL records were automatically imported. Schema and permissions are migrated; article table is initially empty unless records are added through the editor. No admin credentials appear in this repo.
