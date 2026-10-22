import { MotionConfig } from 'motion/react'
import { Footer } from './components/Footer.tsx'
import { Nav } from './components/Nav.tsx'
import { ScrollProgress } from './components/ScrollProgress.tsx'
import { useApifyStore } from './hooks/useApifyStore.ts'
import { useTheme } from './hooks/useTheme.ts'
import { Apis } from './sections/Apis.tsx'
import { Capabilities } from './sections/Capabilities.tsx'
import { Contact } from './sections/Contact.tsx'
import { Experience } from './sections/Experience.tsx'
import { Hero } from './sections/Hero.tsx'
import { Projects } from './sections/Projects.tsx'
import { Stack } from './sections/Stack.tsx'

function App() {
  const { theme, toggle } = useTheme()
  const store = useApifyStore()

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">Skip to content</a>
      <ScrollProgress />
      <Nav theme={theme} onToggleTheme={toggle} />
      <main id="main">
        <Hero store={store} />
        <Stack />
        <Capabilities />
        <Apis store={store} />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  )
}

export default App
