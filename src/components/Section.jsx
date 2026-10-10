import { motion } from 'framer-motion'

export function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function Section({ id, title, intro, children, className = '' }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`py-24 sm:py-32 ${className}`}>
      <div className="container-x">
        <Reveal>
          <h2 id={`${id}-title`} className="max-w-2xl text-3xl font-bold sm:text-5xl">
            {title}
          </h2>
          {intro && <p className="mt-4 max-w-xl text-base text-muted sm:text-lg">{intro}</p>}
        </Reveal>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  )
}
