import { Check } from 'lucide-react'
import Section, { Reveal } from './Section'
import { useProfile } from '../lib/ProfileContext'

export default function About() {
  const { about } = useProfile()
  return (
    <Section id="about" title="Engineering with a product mindset">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <Reveal className="space-y-5 text-base leading-relaxed text-muted sm:text-lg">
          {about.bio.map((p) => (
            <p key={p}>{p}</p>
          ))}
          {about.goals && (
            <div>
              <h3 className="text-lg font-bold text-fg">Where I&apos;m headed</h3>
              <p className="mt-2">{about.goals}</p>
            </div>
          )}
          {about.interests.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-fg">Interests</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {about.interests.map((i) => (
                <li key={i} className="chip">{i}</li>
              ))}
            </ul>
          </div>
          )}
        </Reveal>

        <Reveal delay={0.1} className="space-y-6">
          <div className="glass rounded-3xl p-6">
            <h3 className="text-lg font-bold">Key strengths</h3>
            <ul className="mt-4 space-y-3">
              {about.strengths.map((s) => (
                <li key={s} className="flex gap-3 text-sm text-muted">
                  <Check size={18} className="mt-0.5 shrink-0 text-accent2" aria-hidden="true" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <dl className="grid grid-cols-2 gap-3">
            {about.stats.map((s) => (
              <div key={s.label} className="glass rounded-2xl p-4">
                <dt className="text-xs text-muted">{s.label}</dt>
                <dd className="gradient-text mt-1 font-display text-3xl font-bold">{s.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  )
}
