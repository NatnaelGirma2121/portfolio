import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import seed from './seed.js'

// DATA_DIR lets a host store data on a persistent disk. Default: the server folder.
const base = process.env.DATA_DIR || path.dirname(fileURLToPath(import.meta.url))
const dir = path.join(base, 'data')
const FILE = path.join(dir, 'db.json')
let cache

export function save() {
  fs.mkdirSync(dir, { recursive: true })
  const tmp = `${FILE}.tmp`
  fs.writeFileSync(tmp, JSON.stringify(cache, null, 2)) // write then rename so a crash never leaves a half-written file
  fs.renameSync(tmp, FILE)
}

export function load() {
  if (cache) return cache
  if (fs.existsSync(FILE)) {
    cache = JSON.parse(fs.readFileSync(FILE, 'utf8'))
    // Database created by an older version: add whatever is missing
    const fresh = seed()
    let changed = false
    for (const key of ['profile', 'experience', 'services', 'testimonials']) {
      if (!cache[key]) {
        cache[key] = fresh[key]
        changed = true
      }
    }
    if (changed) save()
  } else {
    cache = seed()
    save()
  }
  return cache
}
