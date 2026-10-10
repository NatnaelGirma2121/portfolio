import { motion } from 'framer-motion'
import Section, { Reveal } from './Section'
import Icon from './Icon'

export default function Services({ services }) {
  return (
    <Section id="services" title="How I can help" intro="Pick one service or combine them. I work solo or alongside your existing team.">
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s, i) => (
          <li key={s.id || s.title}>
            <Reveal delay={i * 0.06} className="h-full">
              <motion.article
                whileHover={{ y: -5 }}
                className="glass h-full rounded-3xl p-6 transition-colors hover:border-accent/50"
              >
                <span
                  className="grid h-12 w-12 place-items-center rounded-2xl text-white"
                  style={{ backgroundImage: 'linear-gradient(135deg, rgb(var(--accent)), rgb(var(--accent2)))' }}
                >
                  <Icon name={s.icon} size={22} />
                </span>
                <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
              </motion.article>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}
