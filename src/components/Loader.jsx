import { motion } from 'framer-motion'
import { Code2 } from 'lucide-react'

export default function Loader() {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[90] grid place-items-center bg-bg"
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <span className="sr-only">Loading portfolio</span>
      <div className="flex flex-col items-center gap-5">
        <motion.div
          className="grid h-16 w-16 place-items-center rounded-2xl text-white"
          style={{ backgroundImage: 'linear-gradient(135deg, rgb(var(--accent)), rgb(var(--accent2)))' }}
          animate={{ rotate: [0, 0, 180, 180, 0], borderRadius: ['16px', '32px', '32px', '16px', '16px'] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Code2 aria-hidden="true" />
        </motion.div>
        <div className="h-1 w-32 overflow-hidden rounded-full bg-line">
          <motion.div
            className="h-full w-1/2 rounded-full bg-accent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </motion.div>
  )
}
