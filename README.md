# Developer Portfolio with admin backend

React + Vite + Tailwind + Framer Motion front end, Express back end.
Edit your profile picture, name, contact details and About Me text, add projects (photos and video), skills, certificates, experience & education, services and client reviews, all from `/admin`.

## Setup
```bash
npm install
cp .env.example .env     # then open .env and set ADMIN_PASSWORD and JWT_SECRET
npm run dev              # site: http://localhost:5173   admin: http://localhost:5173/admin
```
`npm run dev` starts both the site (Vite) and the API (Express on port 5000).

## Production
```bash
npm run build
npm start                # serves the site, API and uploads together on http://localhost:5000
```

## How it works
- Data is stored in `server/data/db.json` (created on first run with sample content).
- Uploaded photos, videos and certificate files are stored in `server/uploads/`.
- Both folders are git-ignored. Back them up, and keep them on a persistent disk if you deploy.
- Allowed uploads: JPG, PNG, WebP, GIF, AVIF; MP4, WebM, MOV; PDF (certificates). 150 MB max per file.
- If the API is offline, the site falls back to the static content in `src/data/content.js`.
- The admin uses one password (from `.env`). Sign-in returns an 8-hour token. Use HTTPS in production.

## API
| Method | Path | Auth |
|---|---|---|
| POST | /api/auth/login | no |
| GET | /api/profile, /api/projects, /api/skills, /api/certificates, /api/experience, /api/services, /api/testimonials | no |
| PUT | /api/profile | yes |
| POST/PUT/DELETE | /api/projects, /api/skills, /api/certificates, /api/experience, /api/services, /api/testimonials (/:id) | yes |
| POST | /api/experience, /api/services, /api/testimonials (/:id/move) | yes |

Everything on the page can now be edited from `/admin`. `src/data/content.js` only holds the fallback shown if the API is offline.
