import { useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import useTheme from './hooks/useTheme'
import useContent from './hooks/useContent'
import { ProfileProvider } from './lib/ProfileContext'
import Loader from './components/Loader'
import ScrollProgress from './components/ScrollProgress'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Certificates from './components/Certificates'
import Services from './components/Services'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  const { theme, toggle } = useTheme()
  const content = useContent()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const done = () => setTimeout(() => setLoading(false), 700)
    // Wait for fonts so the hero doesn't reflow after the loader leaves.
    if (document.fonts?.ready) document.fonts.ready.then(done)
    else done()
  }, [])

  return (
    // reducedMotion="user" disables transform animations for people who ask for less motion
    <MotionConfig reducedMotion="user">
      <ProfileProvider value={{ profile: content.profile, about: content.about }}>
      <AnimatePresence>{loading && <Loader key="loader" />}</AnimatePresence>
      <a
        href="#main"
        className="sr-only z-[100] rounded-lg bg-accent px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <Navbar theme={theme} toggleTheme={toggle} />
      <main id="main">
        <Hero ready={!loading} />
        <About />
        <Skills skills={content.skills} />
        <Projects projects={content.projects} />
        <Experience items={content.experience} />
        <Certificates certificates={content.certificates} />
        <Services services={content.services} />
        <Testimonials testimonials={content.testimonials} />
        <Contact />
      </main>
      <Footer />
      </ProfileProvider>
    </MotionConfig>
  )
}
