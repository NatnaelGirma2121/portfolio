// Bakes your admin content into plain files so the site can run on a static host (Vercel, Netlify, GitHub Pages).
// Usage: npm run export
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import seed from '../server/seed.js'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const dbFile = path.join(root, 'server', 'data', 'db.json')
const uploads = path.join(root, 'server', 'uploads')
const pub = path.join(root, 'public')

let db
if (fs.existsSync(dbFile)) {
  db = JSON.parse(fs.readFileSync(dbFile, 'utf8'))
  const fresh = seed()
  for (const k of Object.keys(fresh)) db[k] ??= fresh[k] // database from an older version
  console.log('Using your content from server/data/db.json')
} else {
  db = seed()
  console.log('No server/data/db.json found (you have not run the admin yet). Exporting the sample content.')
}

// A resume that points to a missing file would give visitors a broken download: hide the button instead.
const resume = db.profile.resume
if (resume && !fs.existsSync(path.join(pub, resume.replace(/^\//, '').split('?')[0])) && !resume.startsWith('/uploads/')) {
  console.log(`Note: ${resume} does not exist in /public, so the Download Resume button will be hidden.`)
  db.profile.resume = ''
}

const content = {
  profile: db.profile,
  projects: db.projects,
  skills: db.skills,
  certificates: db.certificates,
  experience: db.experience,
  services: db.services,
  testimonials: db.testimonials,
}

fs.mkdirSync(path.join(pub, 'data'), { recursive: true })
fs.writeFileSync(path.join(pub, 'data', 'content.json'), JSON.stringify(content, null, 2))

// Copy uploaded photos, videos and PDFs next to the site
const target = path.join(pub, 'uploads')
fs.rmSync(target, { recursive: true, force: true })
let count = 0
if (fs.existsSync(uploads)) {
  fs.cpSync(uploads, target, { recursive: true })
  count = fs.readdirSync(target).length
  for (const f of fs.readdirSync(target)) {
    const mb = fs.statSync(path.join(target, f)).size / 1048576
    if (mb > 50) console.log(`Warning: ${f} is ${mb.toFixed(0)} MB. GitHub rejects files over 100 MB; compress big videos.`)
  }
}
console.log(`Done: public/data/content.json written, ${count} uploaded file(s) copied to public/uploads.`)
