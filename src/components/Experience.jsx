import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Briefcase, ChevronDown, GraduationCap } from 'lucide-react'
import Section, { Reveal } from './Section'

const filters = [
  { id: 'all', label: 'All' },
  { id: 'work', label: 'Work' },
  { id: 'education', label: 'Education' },
]
const icons = { work: Briefcase, education: GraduationCap }

function Entry({ entry, open, onToggle, id }) {
  const Icon = icons[entry.type] || Briefcase
  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.3 }}
      className="relative pl-14"
    >
      <span
        aria-hidden="true"
        className={`absolute left-0 top-1 grid h-10 w-10 place-items-center rounded-xl border transition-colors ${
          open ? 'border-transparent text-white' : 'glass text-accent'
        }`}
        style={open ? { backgroundImage: 'linear-gradient(135deg, rgb(var(--accent)), rgb(var(--accent2)))' } : undefined}
      >
        <Icon size={18} />
      </span>
      <div className="glass rounded-2xl">
        <h3>
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            aria-controls={id}
            className="flex w-full items-start justify-between gap-4 rounded-2xl p-5 text-left"
          >
            <span>
              <span className="block text-sm text-muted">{entry.period}</span>
              <span className="mt-0.5 block text-lg font-bold">{entry.title}</span>
              <span className="block text-sm text-accent">{entry.org}</span>
              <span className="mt-2 block text-sm font-normal text-muted">{entry.summary}</span>
            </span>
            <ChevronDown
              size={20}
              aria-hidden="true"
              className={`mt-1 shrink-0 text-muted transition-transform ${open ? 'rotate-180' : ''}`}
            />
          </button>
        </h3>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={id}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <ul className="list-disc space-y-2 px-5 pb-5 pl-10 text-sm text-muted marker:text-accent2">
                {entry.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.li>
  )
}

export default function Experience({ items }) {
  const [filter, setFilter] = useState('all')
  const [openIdx, setOpenIdx] = useState(0)
  const list = items.filter((t) => filter === 'all' || t.type === filter)

  return (
    <Section id="experience" title="Experience & education" intro="Newest first. Select an entry to see what I actually did.">
      <Reveal>
        <div role="group" aria-label="Filter timeline" className="mb-8 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => {
                setFilter(f.id)
                setOpenIdx(null)
              }}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                filter === f.id ? 'border-transparent text-white' : 'glass text-muted hover:text-fg'
              }`}
              style={
                filter === f.id
                  ? { backgroundImage: 'linear-gradient(135deg, rgb(var(--accent)), rgb(var(--accent2)))' }
                  : undefined
              }
            >
              {f.label}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="relative max-w-3xl">
        <span aria-hidden="true" className="absolute bottom-4 left-5 top-4 w-px bg-line" />
        <ol className="space-y-5">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((entry, i) => (
              <Entry
                key={entry.id || entry.title}
                id={`timeline-${i}`}
                entry={entry}
                open={openIdx === i}
                onToggle={() => setOpenIdx(openIdx === i ? null : i)}
              />
            ))}
          </AnimatePresence>
        </ol>
      </div>
    </Section>
  )
}
