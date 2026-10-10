import { useCallback, useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, LogOut, Pencil, Plus, Trash2 } from 'lucide-react'
import { getToken, request, setToken } from './lib/api'

const inputCls =
  'w-full rounded-xl border border-line bg-bg/60 px-4 py-2.5 text-sm outline-none transition placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent/30'

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  )
}

/* ---------------- login ---------------- */
function Login({ onDone }) {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    const password = new FormData(e.currentTarget).get('password')
    setBusy(true)
    setError('')
    try {
      const { token } = await request('/auth/login', { method: 'POST', body: { password } })
      setToken(token)
      onDone()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="glass mx-auto mt-24 max-w-sm space-y-5 rounded-3xl p-8">
      <h1 className="text-2xl font-bold">Admin sign in</h1>
      <Field label="Password">
        <input name="password" type="password" required autoFocus autoComplete="current-password" className={inputCls} />
      </Field>
      {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
      <button className="btn-primary w-full disabled:opacity-70" disabled={busy}>
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
      <a href="/" className="block text-center text-sm text-muted hover:text-accent">Back to site</a>
    </form>
  )
}

/* ---------------- forms (uncontrolled; FormData reads the values) ---------------- */
function ProjectForm({ item }) {
  return (
    <>
      <Field label="Title"><input name="title" required maxLength={120} defaultValue={item?.title} className={inputCls} /></Field>
      <Field label="Description"><textarea name="description" rows={3} maxLength={1000} defaultValue={item?.description} className={inputCls} /></Field>
      <Field label="Technologies" hint="Separate with commas, e.g. React, Node.js, PostgreSQL">
        <input name="tags" defaultValue={item?.tags?.join(', ')} className={inputCls} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="GitHub link"><input name="github" type="url" placeholder="https://github.com/…" defaultValue={item?.github} className={inputCls} /></Field>
        <Field label="Live demo link"><input name="demo" type="url" placeholder="https://…" defaultValue={item?.demo} className={inputCls} /></Field>
      </div>

      {item?.images?.length > 0 && (
        <fieldset>
          <legend className="mb-2 text-sm font-medium">Current photos</legend>
          <div className="flex flex-wrap gap-3">
            {item.images.map((src) => (
              <label key={src} className="glass block w-28 cursor-pointer overflow-hidden rounded-xl text-xs">
                <img src={src} alt="" className="aspect-[4/3] w-full object-cover" />
                <span className="flex items-center gap-1.5 p-2">
                  <input type="checkbox" name="removeImages" value={src} /> Remove
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}
      <Field label="Add photos" hint="JPG, PNG, WebP, GIF or AVIF. Up to 10. The first photo is the card cover.">
        <input name="images" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" multiple className={inputCls} />
      </Field>

      {item?.video && (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="removeVideo" value="true" /> Remove current video
        </label>
      )}
      <Field label={item?.video ? 'Replace video' : 'Add video'} hint="MP4, WebM or MOV, up to 150 MB.">
        <input name="video" type="file" accept="video/mp4,video/webm,video/quicktime" className={inputCls} />
      </Field>
    </>
  )
}

function SkillForm({ item, categories }) {
  return (
    <>
      <Field label="Category" hint="Pick an existing one or type a new category.">
        <input name="category" required list="cats" maxLength={60} defaultValue={item?.category} className={inputCls} />
        <datalist id="cats">{categories.map((c) => <option key={c} value={c} />)}</datalist>
      </Field>
      <Field label="Skill name"><input name="name" required maxLength={60} defaultValue={item?.name} className={inputCls} /></Field>
      <Field label="Level (0–100)" hint="Leave empty to show it as a badge instead of a progress bar.">
        <input name="level" type="number" min="0" max="100" defaultValue={item?.level ?? ''} className={inputCls} />
      </Field>
    </>
  )
}

function CertForm({ item }) {
  return (
    <>
      <Field label="Title"><input name="title" required maxLength={140} defaultValue={item?.title} className={inputCls} /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Issuer"><input name="issuer" maxLength={100} defaultValue={item?.issuer} className={inputCls} /></Field>
        <Field label="Date"><input name="date" maxLength={40} placeholder="2024" defaultValue={item?.date} className={inputCls} /></Field>
      </div>
      <Field label="Verification link"><input name="credentialUrl" type="url" placeholder="https://…" defaultValue={item?.credentialUrl} className={inputCls} /></Field>
      {item?.file && (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="removeFile" value="true" /> Remove current file
        </label>
      )}
      <Field label={item?.file ? 'Replace certificate file' : 'Certificate file'} hint="Image or PDF, up to 150 MB.">
        <input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif,application/pdf" className={inputCls} />
      </Field>
    </>
  )
}

function ProfileForm({ item }) {
  const a = item.about
  return (
    <>
      <fieldset className="space-y-4">
        <legend className="mb-1 text-lg font-bold">Profile</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Your name"><input name="name" required maxLength={80} defaultValue={item.name} className={inputCls} /></Field>
          <Field label="Job title"><input name="title" maxLength={80} defaultValue={item.title} className={inputCls} /></Field>
        </div>
        <Field label="Short introduction" hint="Shown in the large intro at the top of the site.">
          <textarea name="intro" rows={3} maxLength={1000} defaultValue={item.intro} className={inputCls} />
        </Field>
        <div className="flex items-center gap-4">
          <img src={item.avatar} alt="Current profile picture" className="h-20 w-20 rounded-2xl object-cover" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="removeAvatar" value="true" /> Use the default picture
          </label>
        </div>
        <Field label="Profile picture" hint="JPG, PNG, WebP or AVIF. A square photo works best.">
          <input name="avatar" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" className={inputCls} />
        </Field>
        {item.resume && (
          <p className="text-sm">
            Current resume: <a href={item.resume} target="_blank" rel="noopener noreferrer" className="text-accent underline">open</a>
            <label className="ml-4 inline-flex items-center gap-2">
              <input type="checkbox" name="removeResume" value="true" /> Remove
            </label>
          </p>
        )}
        <Field label={item.resume ? 'Replace resume (PDF)' : 'Upload resume (PDF)'}>
          <input name="resume" type="file" accept="application/pdf" className={inputCls} />
        </Field>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-1 text-lg font-bold">Contact information</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email"><input name="email" type="email" maxLength={120} defaultValue={item.email} className={inputCls} /></Field>
          <Field label="Phone"><input name="phone" maxLength={40} defaultValue={item.phone} className={inputCls} /></Field>
        </div>
        <Field label="Location"><input name="locationLabel" maxLength={100} defaultValue={item.location.label} className={inputCls} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Map latitude" hint="e.g. 37.7749. Right-click your place in Google Maps to copy it.">
            <input name="lat" type="number" step="any" min="-90" max="90" defaultValue={item.location.lat} className={inputCls} />
          </Field>
          <Field label="Map longitude"><input name="lon" type="number" step="any" min="-180" max="180" defaultValue={item.location.lon} className={inputCls} /></Field>
        </div>
        <Field label="GitHub link"><input name="github" type="url" defaultValue={item.socials.github} className={inputCls} /></Field>
        <Field label="LinkedIn link"><input name="linkedin" type="url" defaultValue={item.socials.linkedin} className={inputCls} /></Field>
        <Field label="X (Twitter) link"><input name="twitter" type="url" defaultValue={item.socials.twitter} className={inputCls} /></Field>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-1 text-lg font-bold">About me</legend>
        <Field label="Biography" hint="Leave a blank line between paragraphs.">
          <textarea name="bio" rows={7} maxLength={4000} defaultValue={a.bio.join('\n\n')} className={inputCls} />
        </Field>
        <Field label="Career goals"><textarea name="goals" rows={3} maxLength={1000} defaultValue={a.goals} className={inputCls} /></Field>
        <Field label="Interests" hint="Separate with commas.">
          <input name="interests" defaultValue={a.interests.join(', ')} className={inputCls} />
        </Field>
        <Field label="Key strengths and achievements" hint="One per line.">
          <textarea name="strengths" rows={4} defaultValue={a.strengths.join('\n')} className={inputCls} />
        </Field>
        <Field label="Numbers" hint="One per line as value | label, e.g. 40+ | Projects shipped. The first one also appears on your photo.">
          <textarea name="stats" rows={4} defaultValue={a.stats.map((s) => `${s.value} | ${s.label}`).join('\n')} className={inputCls} />
        </Field>
      </fieldset>
    </>
  )
}

const ICON_CHOICES = [
  ['Code2', 'Code'], ['PenTool', 'Design'], ['Webhook', 'API'], ['Lightbulb', 'Idea'], ['Layout', 'Layout'],
  ['Server', 'Server'], ['Database', 'Database'], ['Cloud', 'Cloud'], ['Wrench', 'Tools'], ['Sparkles', 'Sparkle'],
]

function ExperienceForm({ item }) {
  return (
    <>
      <Field label="Type">
        <select name="type" defaultValue={item?.type || 'work'} className={inputCls}>
          <option value="work">Work experience or internship</option>
          <option value="education">Education</option>
        </select>
      </Field>
      <Field label="Title" hint="Job title, or the degree you studied.">
        <input name="title" required maxLength={140} defaultValue={item?.title} className={inputCls} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Company or school"><input name="org" maxLength={120} defaultValue={item?.org} className={inputCls} /></Field>
        <Field label="Period" hint="e.g. 2021 – Present"><input name="period" maxLength={60} defaultValue={item?.period} className={inputCls} /></Field>
      </div>
      <Field label="Short summary"><input name="summary" maxLength={300} defaultValue={item?.summary} className={inputCls} /></Field>
      <Field label="Details" hint="One achievement per line. Shown when a visitor opens the entry.">
        <textarea name="details" rows={5} defaultValue={item?.details?.join('\n')} className={inputCls} />
      </Field>
    </>
  )
}

function ServiceForm({ item }) {
  return (
    <>
      <Field label="Title"><input name="title" required maxLength={80} defaultValue={item?.title} className={inputCls} /></Field>
      <Field label="Description"><textarea name="text" rows={3} maxLength={400} defaultValue={item?.text} className={inputCls} /></Field>
      <Field label="Icon">
        <select name="icon" defaultValue={item?.icon || 'Code2'} className={inputCls}>
          {ICON_CHOICES.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
        </select>
      </Field>
    </>
  )
}

function ReviewForm({ item }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Client name"><input name="name" required maxLength={80} defaultValue={item?.name} className={inputCls} /></Field>
        <Field label="Role and company" hint="e.g. CTO, Northwind Labs"><input name="role" maxLength={120} defaultValue={item?.role} className={inputCls} /></Field>
      </div>
      <Field label="Review"><textarea name="quote" required rows={4} maxLength={600} defaultValue={item?.quote} className={inputCls} /></Field>
    </>
  )
}

/* ---------------- panel ---------------- */
const TABS = [['profile', 'Profile & About'], ['projects', 'Projects'], ['skills', 'Skills'], ['certificates', 'Certificates'],
  ['experience', 'Experience'], ['services', 'Services'], ['testimonials', 'Reviews']]
const JSON_TABS = ['skills', 'experience', 'services', 'testimonials']
const MOVABLE = ['experience', 'services', 'testimonials']

function Panel({ onLogout }) {
  const [tab, setTab] = useState('profile')
  const [data, setData] = useState({ profile: null, projects: [], skills: [], certificates: [], experience: [], services: [], testimonials: [] })
  const [saves, setSaves] = useState(0)
  const [editing, setEditing] = useState(null) // null | 'new' | item
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState(null)

  const fail = useCallback((e) => {
    if (e.status === 401) {
      setToken('')
      onLogout()
    } else setNote({ type: 'error', text: e.message })
  }, [onLogout])

  const load = useCallback(async () => {
    try {
      const [projects, skills, certificates, profile, experience, services, testimonials] = await Promise.all([
        request('/projects'), request('/skills'), request('/certificates'), request('/profile'),
        request('/experience'), request('/services'), request('/testimonials'),
      ])
      setData({ profile, projects, skills, certificates, experience, services, testimonials })
    } catch (e) {
      setNote({ type: 'error', text: e.message })
    }
  }, [])
  useEffect(() => { load() }, [load])

  const switchTab = (t) => { setTab(t); setEditing(null); setNote(null) }

  const submit = async (e) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const single = tab === 'profile'
    const isEdit = !single && editing && editing !== 'new'
    setBusy(true)
    setNote(null)
    try {
      await request(`/${tab}${isEdit ? `/${editing.id}` : ''}`, {
        method: single || isEdit ? 'PUT' : 'POST',
        body: JSON_TABS.includes(tab) ? Object.fromEntries(fd) : fd,
        auth: true,
      })
      setNote({ type: 'ok', text: single || isEdit ? 'Changes saved.' : "Added. It's live on your site." })
      setEditing(null)
      setSaves((n) => n + 1)
      await load()
    } catch (err) {
      fail(err)
    } finally {
      setBusy(false)
    }
  }

  const move = async (item, dir) => {
    try {
      await request(`/${tab}/${item.id}/move`, { method: 'POST', body: { dir }, auth: true })
      await load()
    } catch (err) {
      fail(err)
    }
  }

  const remove = async (item) => {
    if (!window.confirm(`Delete "${item.title || item.name}"? This can't be undone.`)) return
    try {
      await request(`/${tab}/${item.id}`, { method: 'DELETE', auth: true })
      setNote({ type: 'ok', text: 'Deleted.' })
      await load()
    } catch (err) {
      fail(err)
    }
  }

  const list = Array.isArray(data[tab]) ? data[tab] : []
  const categories = [...new Set(data.skills.map((s) => s.category))]
  const label = { projects: 'project', skills: 'skill', certificates: 'certificate', experience: 'experience entry', services: 'service', testimonials: 'review' }[tab]

  const describe = (it) =>
    tab === 'projects' ? `${it.images.length} photo${it.images.length === 1 ? '' : 's'}${it.video ? ' + video' : ''}`
    : tab === 'skills' ? `${it.category} • ${it.level == null ? 'badge' : `${it.level}%`}`
    : tab === 'experience' ? [it.org, it.period].filter(Boolean).join(' • ')
    : tab === 'services' ? it.text
    : tab === 'testimonials' ? it.role
    : [it.issuer, it.date].filter(Boolean).join(' • ')

  return (
    <div className="mx-auto max-w-4xl">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Manage portfolio</h1>
        <div className="flex gap-2">
          <a href="/" className="btn-ghost !py-2">View site</a>
          <button type="button" className="btn-ghost !py-2" onClick={() => { setToken(''); onLogout() }}>
            <LogOut size={16} aria-hidden="true" /> Sign out
          </button>
        </div>
      </header>

      <div role="tablist" aria-label="Content type" className="mt-8 flex flex-wrap gap-2">
        {TABS.map(([id, text]) => (
          <button
            key={id} role="tab" type="button" aria-selected={tab === id} onClick={() => switchTab(id)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium ${tab === id ? 'border-transparent text-white' : 'glass text-muted hover:text-fg'}`}
            style={tab === id ? { backgroundImage: 'linear-gradient(135deg, rgb(var(--accent)), rgb(var(--accent2)))' } : undefined}
          >
            {text}{id !== 'profile' && ` (${data[id].length})`}
          </button>
        ))}
      </div>

      <div role="status" aria-live="polite" className="mt-4 min-h-6 text-sm">
        {note && <p className={note.type === 'ok' ? 'text-accent2' : 'text-red-500'}>{note.text}</p>}
      </div>

      {tab === 'profile' ? (
        data.profile && (
          <form key={`profile-${saves}`} onSubmit={submit} className="glass space-y-8 rounded-3xl p-6">
            <ProfileForm item={data.profile} />
            <div className="flex flex-wrap items-center gap-3">
              <button className="btn-primary disabled:opacity-70" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button>
              {busy && <span className="text-sm text-muted">Uploading…</span>}
            </div>
          </form>
        )
      ) : editing ? (
        <form key={editing === 'new' ? 'new' : editing.id} onSubmit={submit} className="glass space-y-5 rounded-3xl p-6">
          <h2 className="text-xl font-bold">{editing === 'new' ? `Add ${label}` : `Edit ${label}`}</h2>
          {tab === 'projects' && <ProjectForm item={editing === 'new' ? null : editing} />}
          {tab === 'skills' && <SkillForm item={editing === 'new' ? null : editing} categories={categories} />}
          {tab === 'certificates' && <CertForm item={editing === 'new' ? null : editing} />}
          {tab === 'experience' && <ExperienceForm item={editing === 'new' ? null : editing} />}
          {tab === 'services' && <ServiceForm item={editing === 'new' ? null : editing} />}
          {tab === 'testimonials' && <ReviewForm item={editing === 'new' ? null : editing} />}
          <div className="flex flex-wrap items-center gap-3">
            <button className="btn-primary disabled:opacity-70" disabled={busy}>
              {busy ? 'Saving…' : 'Save'}
            </button>
            <button type="button" className="btn-ghost" onClick={() => setEditing(null)} disabled={busy}>Cancel</button>
            {busy && !JSON_TABS.includes(tab) && <span className="text-sm text-muted">Uploading. Large videos can take a minute.</span>}
          </div>
        </form>
      ) : (
        <>
          <button type="button" className="btn-primary" onClick={() => { setNote(null); setEditing('new') }}>
            <Plus size={16} aria-hidden="true" /> Add {label}
          </button>
          <ul className="mt-6 space-y-3">
            {list.length === 0 && <li className="text-muted">Nothing here yet.</li>}
            {list.map((it) => (
              <li key={it.id} className="glass flex items-center gap-4 rounded-2xl p-3 pr-4">
                {tab === 'projects' && (
                  it.images[0]
                    ? <img src={it.images[0]} alt="" className="h-14 w-20 rounded-lg object-cover" />
                    : <span className="h-14 w-20 rounded-lg bg-line/60" aria-hidden="true" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{it.title || it.name}</p>
                  <p className="truncate text-sm text-muted">{describe(it)}</p>
                </div>
                {MOVABLE.includes(tab) && (
                  <span className="flex flex-col">
                    <button type="button" onClick={() => move(it, -1)} aria-label={`Move ${it.title || it.name} up`} className="grid h-5 w-9 place-items-center text-muted hover:text-accent">
                      <ArrowUp size={14} aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => move(it, 1)} aria-label={`Move ${it.title || it.name} down`} className="grid h-5 w-9 place-items-center text-muted hover:text-accent">
                      <ArrowDown size={14} aria-hidden="true" />
                    </button>
                  </span>
                )}
                <button type="button" onClick={() => { setNote(null); setEditing(it) }} aria-label={`Edit ${it.title || it.name}`} className="glass grid h-9 w-9 place-items-center rounded-lg hover:text-accent">
                  <Pencil size={16} aria-hidden="true" />
                </button>
                <button type="button" onClick={() => remove(it)} aria-label={`Delete ${it.title || it.name}`} className="glass grid h-9 w-9 place-items-center rounded-lg hover:text-red-500">
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default function Admin() {
  const [authed, setAuthed] = useState(Boolean(getToken()))

  useEffect(() => {
    document.title = 'Admin | Portfolio'
    const m = document.createElement('meta')
    m.name = 'robots'
    m.content = 'noindex, nofollow'
    document.head.appendChild(m)
    return () => m.remove()
  }, [])

  return (
    <div className="min-h-screen px-4 py-10">
      {authed ? <Panel onLogout={() => setAuthed(false)} /> : <Login onDone={() => setAuthed(true)} />}
    </div>
  )
}
