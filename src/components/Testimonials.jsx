import { Quote } from 'lucide-react'
import Section, { Reveal } from './Section'

export default function Testimonials({ testimonials }) {
  return (
    <Section id="testimonials" title="Kind words from people I've worked with">
      <ul className="grid gap-5 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <li key={t.id || t.name}>
            <Reveal delay={i * 0.08} className="h-full">
              <figure className="glass flex h-full flex-col rounded-3xl p-6">
                <Quote size={28} className="text-accent" aria-hidden="true" />
                <blockquote className="mt-4 flex-1 text-base leading-relaxed">{t.quote}</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="grid h-10 w-10 place-items-center rounded-full font-bold text-white"
                    style={{ backgroundImage: 'linear-gradient(135deg, rgb(var(--accent)), rgb(var(--accent2)))' }}
                  >
                    {t.name[0]}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{t.name}</span>
                    <span className="block text-xs text-muted">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}
