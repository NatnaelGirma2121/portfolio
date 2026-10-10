import { motion } from 'framer-motion'
import { ArrowDown, Download, Github, Linkedin, Mail } from 'lucide-react'
import { useProfile } from '../lib/ProfileContext'

const stack = ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS']

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

export default function Hero({ ready }) {
  const { profile, about } = useProfile()
  const lead = about.stats?.[0]
  return (
    <section id="home" aria-label="Introduction" className="relative flex min-h-[100svh] items-center pb-16 pt-28">
      <div className="container-x grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div variants={container} initial="hidden" animate={ready ? 'show' : 'hidden'}>
          <motion.p variants={item} className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-muted">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent2 opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent2" />
            </span>
            Available for new projects
          </motion.p>

          <motion.h1 variants={item} className="mt-6 text-5xl font-bold leading-[1.02] sm:text-7xl">
            Hi, I&apos;m {profile.name}.
            <span className="gradient-text mt-2 block">{profile.title}</span>
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            {profile.intro}
          </motion.p>

          <motion.ul variants={item} className="mt-6 flex flex-wrap gap-2" aria-label="Core technologies">
            {stack.map((s) => (
              <li key={s} className="chip">{s}</li>
            ))}
          </motion.ul>

          <motion.div variants={item} className="mt-9 flex flex-wrap gap-3">
            <a href="#projects" className="btn-primary">
              View Projects <ArrowDown size={16} aria-hidden="true" />
            </a>
            {profile.resume && (
              <a href={profile.resume} download className="btn-ghost">
                <Download size={16} aria-hidden="true" /> Download Resume
              </a>
            )}
            <a href="#contact" className="btn-ghost">
              <Mail size={16} aria-hidden="true" /> Contact Me
            </a>
          </motion.div>

          <motion.div variants={item} className="mt-8 flex items-center gap-3 text-muted">
            {profile.socials.github && (
              <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in a new tab)" className="hover:text-accent">
                <Github size={20} aria-hidden="true" />
              </a>
            )}
            {profile.socials.linkedin && (
              <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)" className="hover:text-accent">
                <Linkedin size={20} aria-hidden="true" />
              </a>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          className="relative mx-auto w-full max-w-sm"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={ready ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            aria-hidden="true"
            className="absolute -inset-4 rounded-[2.5rem] opacity-60 blur-2xl"
            style={{ backgroundImage: 'linear-gradient(135deg, rgb(var(--accent)), rgb(var(--accent2)))' }}
          />
          <div
            className="relative rounded-[2rem] p-1.5"
            style={{ backgroundImage: 'linear-gradient(135deg, rgb(var(--accent)), rgb(var(--accent2)))' }}
          >
            <img
              src={profile.avatar}
              alt={`Portrait of ${profile.name}`}
              width="600"
              height="600"
              fetchpriority="high"
              className="aspect-square w-full rounded-[1.65rem] bg-card object-cover"
            />
          </div>
          {lead && (
            <motion.div
              className="glass absolute -bottom-5 -left-3 rounded-2xl px-4 py-3 sm:-left-8"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <p className="font-display text-2xl font-bold">{lead.value}</p>
              <p className="text-xs text-muted">{lead.label}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
