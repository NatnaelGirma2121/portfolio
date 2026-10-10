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

## Deploy
This app needs a host that runs Node and keeps files on a **persistent disk** (Render, Railway, Fly.io or a VPS).
Static hosts such as Vercel, Netlify or GitHub Pages will not work: uploads and edits would be lost.

- Build command: `npm install --include=dev && npm run build`
- Start command: `npm start`
- Environment variables: `ADMIN_PASSWORD`, `JWT_SECRET`, and `DATA_DIR` set to the disk's mount path (e.g. `/var/data`).
- Open `https://your-site/admin` to edit.

## Free static deploy (Vercel, Netlify, GitHub Pages)
The admin needs a server, which static hosts do not have. Instead, edit locally and publish a snapshot:

1. `npm run dev`, then edit everything in http://localhost:5173/admin
2. `npm run export` (writes `public/data/content.json` and copies uploads to `public/uploads`)
3. `git add -A && git commit -m "Update content" && git push`
4. Vercel rebuilds automatically (`vercel.json` already sets the build command).

The static build (`npm run build:static`) reads the exported file and has no `/admin`.
Keep each uploaded file under 100 MB (GitHub's limit); compress videos.
