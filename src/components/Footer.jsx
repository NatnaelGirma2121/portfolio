import { Github, Linkedin, Twitter } from 'lucide-react'
import { nav } from '../data/content'
import { useProfile } from '../lib/ProfileContext'

export default function Footer() {
  const { profile } = useProfile()
  const socials = [
    { href: profile.socials.github, icon: Github, name: 'GitHub' },
    { href: profile.socials.linkedin, icon: Linkedin, name: 'LinkedIn' },
    { href: profile.socials.twitter, icon: Twitter, name: 'X (Twitter)' },
  ].filter((l) => l.href)
  return (
    <footer className="border-t border-line/70 py-10">
      <div className="container-x flex flex-col items-center justify-between gap-6 md:flex-row">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
            {nav.slice(1).map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} className="text-muted hover:text-accent">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="flex gap-3">
          {socials.map(({ href, icon: I, name }) => (
            <li key={name}>
              <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${name} (opens in a new tab)`} className="text-muted hover:text-accent">
                <I size={20} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
