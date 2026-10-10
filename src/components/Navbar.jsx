import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { nav } from '../data/content'
import { useProfile } from '../lib/ProfileContext'

export default function Navbar({ theme, toggleTheme }) {
  const { profile } = useProfile()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    nav.forEach((n) => {
      const el = document.getElementById(n.id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
      <div
        className={`container-x flex h-14 max-w-6xl items-center justify-between rounded-2xl !px-4 transition-all duration-300 ${
          scrolled || open ? 'glass' : 'border border-transparent'
        }`}
      >
        <a href="#home" className="font-display text-lg font-bold" aria-label={`${profile.name}, home`}>
          {profile.name}
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  aria-current={active === n.id ? 'true' : undefined}
                  className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active === n.id ? 'text-fg' : 'text-muted hover:text-fg'
                  }`}
                >
                  {active === n.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-lg bg-accent/12"
                      style={{ backgroundColor: 'rgb(var(--accent) / 0.12)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <button
            type="button"
            className="glass grid h-10 w-10 place-items-center rounded-xl lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="glass mx-auto mt-2 max-w-6xl rounded-2xl p-3 lg:hidden"
          >
            <ul className="grid grid-cols-2 gap-1">
              {nav.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    onClick={() => setOpen(false)}
                    aria-current={active === n.id ? 'true' : undefined}
                    className={`block rounded-xl px-4 py-3 text-sm font-medium ${
                      active === n.id ? 'bg-accent/15 text-fg' : 'text-muted hover:bg-line/40'
                    }`}
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
