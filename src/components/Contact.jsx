import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Github, Linkedin, Loader2, Mail, MapPin, Phone, Send, Twitter } from 'lucide-react'
import Section, { Reveal } from './Section'
import { useProfile } from '../lib/ProfileContext'

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(v) {
  const e = {}
  if (v.name.trim().length < 2) e.name = 'Enter your name (at least 2 characters).'
  if (!emailRe.test(v.email)) e.email = 'Enter a valid email address, like name@example.com.'
  if (v.message.trim().length < 10) e.message = 'Write a message of at least 10 characters.'
  return e
}

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 text-sm text-red-500"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

const inputCls =
  'w-full rounded-xl border border-line bg-bg/60 px-4 py-3 text-sm outline-none transition placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent/30 aria-[invalid=true]:border-red-500'

export default function Contact() {
  const { profile } = useProfile()
  const [values, setValues] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const { lat, lon, label } = profile.location
  const d = 0.04
  const map = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - d},${lat - d},${lon + d},${lat + d}&layer=mapnik&marker=${lat},${lon}`

  const onChange = (e) => {
    const next = { ...values, [e.target.name]: e.target.value }
    setValues(next)
    if (errors[e.target.name]) setErrors(validate(next))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) {
      document.getElementById(Object.keys(found)[0])?.focus()
      return
    }
    setStatus('sending')
    try {
      // TODO: connect a real endpoint (Formspree, EmailJS, your own API...).
      await new Promise((r) => setTimeout(r, 1200))
      setStatus('sent')
      setValues({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  const aria = (k) => ({
    'aria-invalid': errors[k] ? 'true' : 'false',
    'aria-describedby': errors[k] ? `${k}-error` : undefined,
  })

  const links = [
    { href: `mailto:${profile.email}`, icon: Mail, text: profile.email },
    { href: `tel:${profile.phone.replace(/[^+\d]/g, '')}`, icon: Phone, text: profile.phone },
  ].filter((l) => l.text)
  const socials = [
    { href: profile.socials.linkedin, icon: Linkedin, name: 'LinkedIn' },
    { href: profile.socials.github, icon: Github, name: 'GitHub' },
    { href: profile.socials.twitter, icon: Twitter, name: 'X (Twitter)' },
  ].filter((l) => l.href)

  return (
    <Section id="contact" title="Let's build something together" intro="Tell me about your project. I reply within one business day.">
      <div className="grid gap-8 lg:grid-cols-2">
        <Reveal>
          <form onSubmit={onSubmit} noValidate className="glass space-y-5 rounded-3xl p-6 sm:p-8">
            <Field id="name" label="Name" error={errors.name}>
              <input id="name" name="name" autoComplete="name" value={values.name} onChange={onChange} className={inputCls} placeholder="Jane Doe" {...aria('name')} />
            </Field>
            <Field id="email" label="Email" error={errors.email}>
              <input id="email" name="email" type="email" autoComplete="email" value={values.email} onChange={onChange} className={inputCls} placeholder="jane@company.com" {...aria('email')} />
            </Field>
            <Field id="message" label="Message" error={errors.message}>
              <textarea id="message" name="message" rows={5} value={values.message} onChange={onChange} className={`${inputCls} resize-y`} placeholder="What are you building, and when do you need it?" {...aria('message')} />
            </Field>

            <button type="submit" disabled={status === 'sending'} className="btn-primary w-full disabled:opacity-70">
              {status === 'sending' ? (
                <>
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" /> Sending…
                </>
              ) : (
                <>
                  <Send size={16} aria-hidden="true" /> Send message
                </>
              )}
            </button>

            <div role="status" aria-live="polite">
              {status === 'sent' && (
                <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-sm text-accent2">
                  <CheckCircle2 size={18} aria-hidden="true" /> Message sent. I&apos;ll reply soon.
                </motion.p>
              )}
              {status === 'error' && (
                <p className="text-sm text-red-500">Couldn&apos;t send your message. Email {profile.email} instead.</p>
              )}
            </div>
          </form>
        </Reveal>

        <Reveal delay={0.1} className="space-y-6">
          <div className="glass rounded-3xl p-6">
            <ul className="space-y-3">
              {links.map(({ href, icon: I, text }) => (
                <li key={text}>
                  <a href={href} className="flex items-center gap-3 text-sm hover:text-accent">
                    <I size={18} className="text-accent" aria-hidden="true" /> {text}
                  </a>
                </li>
              ))}
              {label && (
                <li className="flex items-center gap-3 text-sm">
                  <MapPin size={18} className="text-accent" aria-hidden="true" /> {label}
                </li>
              )}
            </ul>
            <ul className="mt-5 flex gap-3 border-t border-line pt-5">
              {socials.map(({ href, icon: I, name }) => (
                <li key={name}>
                  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${name} (opens in a new tab)`} className="glass grid h-10 w-10 place-items-center rounded-xl transition hover:border-accent/60 hover:text-accent">
                    <I size={18} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass overflow-hidden rounded-3xl p-1.5">
            <iframe
              title={`Map showing ${label}`}
              src={map}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="h-64 w-full rounded-[1.3rem] border-0 dark:[filter:invert(0.9)_hue-rotate(180deg)_contrast(0.9)]"
            />
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
