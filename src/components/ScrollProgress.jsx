import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.2 })
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left"
      style={{ scaleX, backgroundImage: 'linear-gradient(90deg, rgb(var(--accent)), rgb(var(--accent2)))' }}
    />
  )
}
