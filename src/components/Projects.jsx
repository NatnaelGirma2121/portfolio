import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, Github, Images, X } from 'lucide-react'
import Section, { Reveal } from './Section'

function MediaModal({ project, onClose }) {
  const closeRef = useRef(null)

  useEffect(() => {
    const prev = document.activeElement
    closeRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      prev?.focus?.()
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} photos and video`}
        className="glass !bg-card relative my-auto w-full max-w-3xl rounded-3xl p-4 sm:p-6"
        initial={{ y: 24, scale: 0.97 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 24, scale: 0.97 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="text-xl font-bold">{project.title}</h3>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className="glass grid h-10 w-10 shrink-0 place-items-center rounded-xl">
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="space-y-4">
          {project.video && (
            <video src={project.video} controls preload="metadata" className="w-full rounded-2xl bg-black">
              Your browser can't play this video.
            </video>
          )}
          {project.images.map((src, i) => (
            <img key={src} src={src} alt={`${project.title} screenshot ${i + 1}`} loading="lazy" className="w-full rounded-2xl" />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Projects({ projects }) {
  const [open, setOpen] = useState(null)
  const close = useCallback(() => setOpen(null), [])

  return (
    <Section id="projects" title="Selected projects" intro="A few things I've built recently. Each links to source and a live version.">
      {projects.length === 0 && <p className="text-muted">No projects added yet.</p>}
      <ul className="grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => {
          const hasMore = p.images.length > 1 || p.video
          return (
            <li key={p.id || p.title}>
              <Reveal delay={(i % 2) * 0.08} className="h-full">
                <motion.article
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  className="glass group flex h-full flex-col overflow-hidden rounded-3xl transition-colors hover:border-accent/50"
                >
                  <div className="overflow-hidden">
                    {p.images[0] ? (
                      <img
                        src={p.images[0]}
                        alt={`Screenshot of ${p.title}`}
                        width="800"
                        height="500"
                        loading="lazy"
                        decoding="async"
                        className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none"
                      />
                    ) : p.video ? (
                      <video src={p.video} muted preload="metadata" className="aspect-[16/10] w-full object-cover" aria-label={`Preview of ${p.title}`} />
                    ) : (
                      <div className="aspect-[16/10] w-full" style={{ backgroundImage: 'linear-gradient(135deg, rgb(var(--accent) / 0.3), rgb(var(--accent2) / 0.3))' }} />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-bold">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{p.description}</p>
                    <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies used">
                      {p.tags.map((t) => (
                        <li key={t} className="chip">{t}</li>
                      ))}
                    </ul>
                    <div className="mt-auto flex flex-wrap gap-3 pt-6">
                      {p.github && (
                        <a href={p.github} target="_blank" rel="noopener noreferrer" className="btn-ghost !px-4 !py-2" aria-label={`${p.title} source code on GitHub (opens in a new tab)`}>
                          <Github size={16} aria-hidden="true" /> Code
                        </a>
                      )}
                      {p.demo && (
                        <a href={p.demo} target="_blank" rel="noopener noreferrer" className="btn-primary !px-4 !py-2" aria-label={`${p.title} live demo (opens in a new tab)`}>
                          <ExternalLink size={16} aria-hidden="true" /> Live demo
                        </a>
                      )}
                      {hasMore && (
                        <button type="button" onClick={() => setOpen(p)} className="btn-ghost !px-4 !py-2" aria-label={`View photos and video for ${p.title}`}>
                          <Images size={16} aria-hidden="true" /> {p.video ? 'Video & photos' : 'Photos'}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.article>
              </Reveal>
            </li>
          )
        })}
      </ul>
      <AnimatePresence>{open && <MediaModal key="modal" project={open} onClose={close} />}</AnimatePresence>
    </Section>
  )
}
