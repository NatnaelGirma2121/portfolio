import 'dotenv/config'
import express from 'express'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { load, save } from './db.js'

const root = path.dirname(fileURLToPath(import.meta.url))
const UPLOADS = path.join(process.env.DATA_DIR || root, 'uploads')
const DIST = path.join(root, '..', 'dist')
const PORT = process.env.PORT || 5000
const { ADMIN_PASSWORD, JWT_SECRET } = process.env

if (!ADMIN_PASSWORD || !JWT_SECRET) {
  console.error('Missing ADMIN_PASSWORD or JWT_SECRET. Copy .env.example to .env and fill both in.')
  process.exit(1)
}
fs.mkdirSync(UPLOADS, { recursive: true })

const app = express()
app.disable('x-powered-by')
app.set('trust proxy', 1) // behind a host's proxy, req.ip is the visitor (keeps the login limiter fair)
app.use(express.json({ limit: '100kb' }))

/* ---------- uploads ---------- */
const IMG = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
const ALLOWED = {
  images: IMG,
  video: ['video/mp4', 'video/webm', 'video/quicktime'],
  file: [...IMG, 'application/pdf'],
  avatar: IMG,
  resume: ['application/pdf'],
}
const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOADS,
    filename: (_req, file, cb) =>
      cb(null, crypto.randomUUID() + path.extname(file.originalname).toLowerCase().replace(/[^.a-z0-9]/g, '')),
  }),
  limits: { fileSize: 150 * 1024 * 1024, files: 11 },
  fileFilter: (_req, file, cb) => {
    const ok = ALLOWED[file.fieldname]?.includes(file.mimetype)
    cb(ok ? null : new Error(`That file type isn't allowed for "${file.fieldname}" (${file.mimetype}).`), ok)
  },
})
const projectUpload = upload.fields([{ name: 'images', maxCount: 10 }, { name: 'video', maxCount: 1 }])
const certUpload = upload.single('file')
const profileUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'resume', maxCount: 1 }])

app.use('/uploads', (_req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff')
  next()
}, express.static(UPLOADS, { maxAge: '7d' }))

/* ---------- helpers ---------- */
const url = (f) => `/uploads/${f.filename}`
const removeFile = (u) => {
  // Only ever delete inside the uploads folder
  if (typeof u === 'string' && u.startsWith('/uploads/')) fs.rm(path.join(UPLOADS, path.basename(u)), { force: true }, () => {})
}
const discard = (req) => {
  const files = req.file ? [req.file] : Object.values(req.files || {}).flat()
  files.forEach((f) => removeFile(url(f)))
}
const str = (v, max = 500) => String(v ?? '').trim().slice(0, max)
const link = (v) => {
  const s = str(v, 300)
  if (!s) return ''
  try {
    const u = new URL(s)
    return ['http:', 'https:'].includes(u.protocol) ? u.href : ''
  } catch {
    return ''
  }
}
const tags = (v) => str(v, 300).split(',').map((t) => t.trim()).filter(Boolean).slice(0, 12)
const level = (v) => {
  if (v === '' || v == null) return null
  const n = Math.round(Number(v))
  return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : null
}
const bad = (res, msg) => res.status(400).json({ error: msg })

/* ---------- auth ---------- */
const sha = (s) => crypto.createHash('sha256').update(String(s)).digest()
const attempts = new Map()

app.post('/api/auth/login', (req, res) => {
  const ip = req.ip
  const rec = attempts.get(ip) || { n: 0, t: Date.now() }
  if (Date.now() - rec.t > 15 * 60_000) Object.assign(rec, { n: 0, t: Date.now() })
  if (rec.n >= 10) return res.status(429).json({ error: 'Too many attempts. Try again in 15 minutes.' })

  const ok = crypto.timingSafeEqual(sha(req.body?.password), sha(ADMIN_PASSWORD))
  if (!ok) {
    rec.n += 1
    attempts.set(ip, rec)
    return res.status(401).json({ error: 'Wrong password.' })
  }
  attempts.delete(ip)
  res.json({ token: jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '8h' }) })
})

const requireAuth = (req, res, next) => {
  try {
    jwt.verify((req.headers.authorization || '').replace(/^Bearer /, ''), JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Your session expired. Sign in again.' })
  }
}

/* ---------- profile, contact and about ---------- */
app.get('/api/profile', (_req, res) => res.json(load().profile))

const num = (v, min, max, fallback) => {
  const n = Number(v)
  return v !== '' && v != null && Number.isFinite(n) && n >= min && n <= max ? n : fallback
}
const lines = (v, max, each) => str(v, max).split('\n').map((l) => l.trim().slice(0, each)).filter(Boolean)

app.put('/api/profile', requireAuth, profileUpload, (req, res) => {
  const p = load().profile
  const b = req.body
  const name = str(b.name, 80)
  if (!name) return discard(req), bad(res, 'Name is required.')
  const email = str(b.email, 120)
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return discard(req), bad(res, 'Enter a valid email address.')

  if (req.files?.avatar?.[0]) {
    removeFile(p.avatar)
    p.avatar = url(req.files.avatar[0])
  } else if (b.removeAvatar === 'true') {
    removeFile(p.avatar)
    p.avatar = '/images/avatar.svg'
  }
  if (req.files?.resume?.[0]) {
    removeFile(p.resume)
    p.resume = url(req.files.resume[0])
  } else if (b.removeResume === 'true') {
    removeFile(p.resume)
    p.resume = ''
  }

  Object.assign(p, {
    name,
    title: str(b.title, 80),
    intro: str(b.intro, 1000),
    email,
    phone: str(b.phone, 40),
    location: {
      label: str(b.locationLabel, 100),
      lat: num(b.lat, -90, 90, p.location.lat),
      lon: num(b.lon, -180, 180, p.location.lon),
    },
    socials: { github: link(b.github), linkedin: link(b.linkedin), twitter: link(b.twitter) },
    about: {
      bio: str(b.bio, 4000).split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean).slice(0, 6),
      goals: str(b.goals, 1000),
      interests: tags(b.interests),
      strengths: lines(b.strengths, 1600, 200).slice(0, 8),
      stats: lines(b.stats, 600, 80)
        .map((l) => {
          const [value, ...rest] = l.split('|')
          return { value: str(value, 12), label: str(rest.join('|'), 40) }
        })
        .filter((x) => x.value && x.label)
        .slice(0, 6),
    },
  })
  save()
  res.json(p)
})

/* ---------- projects ---------- */
app.get('/api/projects', (_req, res) => res.json(load().projects))

app.post('/api/projects', requireAuth, projectUpload, (req, res) => {
  const title = str(req.body.title, 120)
  if (!title) return discard(req), bad(res, 'Project title is required.')
  const item = {
    id: crypto.randomUUID(),
    title,
    description: str(req.body.description, 1000),
    tags: tags(req.body.tags),
    github: link(req.body.github),
    demo: link(req.body.demo),
    images: (req.files?.images || []).map(url),
    video: req.files?.video?.[0] ? url(req.files.video[0]) : '',
    createdAt: new Date().toISOString(),
  }
  load().projects.push(item)
  save()
  res.status(201).json(item)
})

app.put('/api/projects/:id', requireAuth, projectUpload, (req, res) => {
  const item = load().projects.find((p) => p.id === req.params.id)
  if (!item) return discard(req), res.status(404).json({ error: 'Project not found.' })
  const title = str(req.body.title, 120)
  if (!title) return discard(req), bad(res, 'Project title is required.')

  const drop = [].concat(req.body.removeImages || [])
  drop.filter((u) => item.images.includes(u)).forEach(removeFile)
  item.images = item.images.filter((u) => !drop.includes(u)).concat((req.files?.images || []).map(url))

  if (req.files?.video?.[0]) {
    removeFile(item.video)
    item.video = url(req.files.video[0])
  } else if (req.body.removeVideo === 'true') {
    removeFile(item.video)
    item.video = ''
  }
  Object.assign(item, {
    title,
    description: str(req.body.description, 1000),
    tags: tags(req.body.tags),
    github: link(req.body.github),
    demo: link(req.body.demo),
  })
  save()
  res.json(item)
})

app.delete('/api/projects/:id', requireAuth, (req, res) => {
  const db = load()
  const item = db.projects.find((p) => p.id === req.params.id)
  if (!item) return res.status(404).json({ error: 'Project not found.' })
  ;[...item.images, item.video].forEach(removeFile)
  db.projects = db.projects.filter((p) => p !== item)
  save()
  res.json({ ok: true })
})

/* ---------- skills ---------- */
app.get('/api/skills', (_req, res) => res.json(load().skills))

const readSkill = (b) => ({ category: str(b.category, 60), name: str(b.name, 60), level: level(b.level) })

app.post('/api/skills', requireAuth, (req, res) => {
  const s = readSkill(req.body)
  if (!s.category || !s.name) return bad(res, 'Category and skill name are required.')
  const item = { id: crypto.randomUUID(), ...s, createdAt: new Date().toISOString() }
  load().skills.push(item)
  save()
  res.status(201).json(item)
})

app.put('/api/skills/:id', requireAuth, (req, res) => {
  const item = load().skills.find((s) => s.id === req.params.id)
  if (!item) return res.status(404).json({ error: 'Skill not found.' })
  const s = readSkill(req.body)
  if (!s.category || !s.name) return bad(res, 'Category and skill name are required.')
  Object.assign(item, s)
  save()
  res.json(item)
})

app.delete('/api/skills/:id', requireAuth, (req, res) => {
  const db = load()
  if (!db.skills.some((s) => s.id === req.params.id)) return res.status(404).json({ error: 'Skill not found.' })
  db.skills = db.skills.filter((s) => s.id !== req.params.id)
  save()
  res.json({ ok: true })
})

/* ---------- certificates ---------- */
app.get('/api/certificates', (_req, res) => res.json(load().certificates))

const readCert = (b) => ({
  title: str(b.title, 140),
  issuer: str(b.issuer, 100),
  date: str(b.date, 40),
  credentialUrl: link(b.credentialUrl),
})

app.post('/api/certificates', requireAuth, certUpload, (req, res) => {
  const c = readCert(req.body)
  if (!c.title) return discard(req), bad(res, 'Certificate title is required.')
  const item = { id: crypto.randomUUID(), ...c, file: req.file ? url(req.file) : '', createdAt: new Date().toISOString() }
  load().certificates.push(item)
  save()
  res.status(201).json(item)
})

app.put('/api/certificates/:id', requireAuth, certUpload, (req, res) => {
  const item = load().certificates.find((c) => c.id === req.params.id)
  if (!item) return discard(req), res.status(404).json({ error: 'Certificate not found.' })
  const c = readCert(req.body)
  if (!c.title) return discard(req), bad(res, 'Certificate title is required.')
  if (req.file) {
    removeFile(item.file)
    item.file = url(req.file)
  } else if (req.body.removeFile === 'true') {
    removeFile(item.file)
    item.file = ''
  }
  Object.assign(item, c)
  save()
  res.json(item)
})

app.delete('/api/certificates/:id', requireAuth, (req, res) => {
  const db = load()
  const item = db.certificates.find((c) => c.id === req.params.id)
  if (!item) return res.status(404).json({ error: 'Certificate not found.' })
  removeFile(item.file)
  db.certificates = db.certificates.filter((c) => c !== item)
  save()
  res.json({ ok: true })
})

/* ---------- experience, services, testimonials (text only) ---------- */
const ICONS = ['Code2', 'PenTool', 'Webhook', 'Lightbulb', 'Layout', 'Server', 'Database', 'Cloud', 'Wrench', 'Sparkles']

function crud(name, read, validate) {
  app.get(`/api/${name}`, (_req, res) => res.json(load()[name]))

  app.post(`/api/${name}`, requireAuth, (req, res) => {
    const data = read(req.body || {})
    const err = validate(data)
    if (err) return bad(res, err)
    const item = { id: crypto.randomUUID(), ...data, createdAt: new Date().toISOString() }
    load()[name].push(item)
    save()
    res.status(201).json(item)
  })

  app.put(`/api/${name}/:id`, requireAuth, (req, res) => {
    const item = load()[name].find((x) => x.id === req.params.id)
    if (!item) return res.status(404).json({ error: 'Not found.' })
    const data = read(req.body || {})
    const err = validate(data)
    if (err) return bad(res, err)
    Object.assign(item, data)
    save()
    res.json(item)
  })

  app.delete(`/api/${name}/:id`, requireAuth, (req, res) => {
    const db = load()
    if (!db[name].some((x) => x.id === req.params.id)) return res.status(404).json({ error: 'Not found.' })
    db[name] = db[name].filter((x) => x.id !== req.params.id)
    save()
    res.json({ ok: true })
  })

  // Move an item up (-1) or down (1) in the list shown on the site
  app.post(`/api/${name}/:id/move`, requireAuth, (req, res) => {
    const list = load()[name]
    const i = list.findIndex((x) => x.id === req.params.id)
    const j = i + (req.body?.dir === -1 ? -1 : 1)
    if (i < 0) return res.status(404).json({ error: 'Not found.' })
    if (j >= 0 && j < list.length) {
      ;[list[i], list[j]] = [list[j], list[i]]
      save()
    }
    res.json(list)
  })
}

crud(
  'experience',
  (b) => ({
    type: b.type === 'education' ? 'education' : 'work',
    title: str(b.title, 140),
    org: str(b.org, 120),
    period: str(b.period, 60),
    summary: str(b.summary, 300),
    details: (Array.isArray(b.details) ? b.details.join('\n') : str(b.details, 2400))
      .split('\n').map((l) => l.trim().slice(0, 300)).filter(Boolean).slice(0, 8),
  }),
  (d) => (d.title ? '' : 'Title is required.'),
)

crud(
  'services',
  (b) => ({ icon: ICONS.includes(b.icon) ? b.icon : 'Sparkles', title: str(b.title, 80), text: str(b.text, 400) }),
  (d) => (d.title ? '' : 'Service title is required.'),
)

crud(
  'testimonials',
  (b) => ({ name: str(b.name, 80), role: str(b.role, 120), quote: str(b.quote, 600) }),
  (d) => (d.name && d.quote ? '' : 'Name and review text are required.'),
)

/* ---------- serve the built site in production ---------- */
if (fs.existsSync(DIST)) {
  app.use(express.static(DIST))
  app.get('*', (req, res, next) =>
    req.path.startsWith('/api') || req.path.startsWith('/uploads') ? next() : res.sendFile(path.join(DIST, 'index.html')),
  )
}

app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found.' }))
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const tooBig = err.code === 'LIMIT_FILE_SIZE'
  res.status(err instanceof multer.MulterError || err.message?.includes("isn't allowed") ? 400 : 500).json({
    error: tooBig ? 'That file is too large (150 MB max).' : err.message || 'Something went wrong.',
  })
})

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))
