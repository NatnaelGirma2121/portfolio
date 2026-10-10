import { motion } from 'framer-motion'
import Section, { Reveal } from './Section'
import Icon from './Icon'

function SkillBar({ name, level }) {
  return (
    <li>
      <div className="flex justify-between text-sm">
        <span>{name}</span>
        <span className="text-muted">{level}%</span>
      </div>
      <div
        role="progressbar"
        aria-label={`${name} proficiency`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={level}
        className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line/70"
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundImage: 'linear-gradient(90deg, rgb(var(--accent)), rgb(var(--accent2)))' }}
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.15 }}
        />
      </div>
    </li>
  )
}

export default function Skills({ skills }) {
  return (
    <Section id="skills" title="The tools I reach for" intro="Grouped by where they sit in the stack. Bars show how comfortable I am working without documentation open.">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((group, i) => (
          <Reveal key={group.category} delay={(i % 3) * 0.06}>
            <article className="glass h-full rounded-3xl p-6 transition-colors hover:border-accent/50">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl text-accent" style={{ backgroundColor: 'rgb(var(--accent) / 0.12)' }}>
                  <Icon name={group.icon} size={20} />
                </span>
                <h3 className="text-lg font-bold">{group.category}</h3>
              </div>
              {group.items?.length > 0 && (
                <ul className="mt-5 space-y-4">
                  {group.items.map((s) => (
                    <SkillBar key={s.name} {...s} />
                  ))}
                </ul>
              )}
              {group.badges?.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {group.badges.map((b) => (
                    <motion.li key={b} whileHover={{ y: -2 }} className="chip cursor-default">
                      {b}
                    </motion.li>
                  ))}
                </ul>
              )}
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
