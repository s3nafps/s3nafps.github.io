import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowUpRight, Check, Menu, Moon, Sun, X } from 'lucide-react'
import { Button } from '@astryxdesign/core/Button'
import { Theme } from '@astryxdesign/core/theme'
import { neutralTheme } from '@astryxdesign/theme-neutral/built'
import { capabilities, experience, type Experience } from './content'

const EMAIL = 'mohamed.senator@icloud.com'
const CV_PATH = '/Mohamed_Senator_Master_CV.pdf'

const proofPoints = [
  { value: '4+', label: 'Years in live environments' },
  { value: '97%', label: 'Health-check time reduced' },
  { value: '4,000+', label: 'Users supported' },
  { value: 'ACE', label: 'Google Cloud certified' },
]

const approach = [
  {
    number: '01',
    title: 'Reliability',
    copy: 'Build and maintain systems that are available, supportable, and ready for change.',
  },
  {
    number: '02',
    title: 'Automation',
    copy: 'Turn recurring checks, audits, and reporting into clear, repeatable workflows.',
  },
  {
    number: '03',
    title: 'Cloud',
    copy: 'Apply proven operational discipline to Terraform, private GKE, and secure delivery.',
  },
]

function usePrefersReducedMotion() {
  const [reduceMotion, setReduceMotion] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduceMotion(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return reduceMotion
}

function useReveal<T extends HTMLElement>(delay = 0) {
  const ref = useRef<T>(null)
  const reduceMotion = usePrefersReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (reduceMotion) {
      node.classList.add('is-visible')
      return
    }
    if (delay > 0) {
      node.style.transitionDelay = `${delay}s`
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [reduceMotion, delay])

  return ref
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useReveal<HTMLDivElement>(delay)
  return (
    <div ref={ref} className={`reveal${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  )
}

function TimelineItem({ item, index }: { item: Experience; index: number }) {
  const ref = useReveal<HTMLLIElement>(index * 0.04)
  return (
    <li ref={ref} className="reveal">
      <p className="timeline-date">{item.dates}</p>
      <div>
        <h3>{item.role}</h3>
        <p className="timeline-company">{item.company} · {item.location}</p>
      </div>
      <p className="timeline-summary">{item.summary}</p>
    </li>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      return localStorage.getItem('portfolio-theme') === 'dark' ? 'dark' : 'light'
    } catch {
      return 'light'
    }
  })
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = menuOpen ? 'hidden' : previousOverflow
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)
  const toggleTheme = () => {
    setTheme((current) => {
      const next = current === 'light' ? 'dark' : 'light'
      localStorage.setItem('portfolio-theme', next)
      return next
    })
  }

  return (
    <Theme theme={neutralTheme} mode={theme}>
      <main>
        <header className="site-header">
          <nav className="site-nav" aria-label="Primary navigation">
            <a className="nav-logo" href="#hero" onClick={closeMenu}>
              Mohamed Senator<span aria-hidden="true">.</span>
            </a>
            <div className="nav-desktop">
              <a href="#capabilities">Capabilities</a>
              <a href="#experience">Experience</a>
              <a href={CV_PATH}>CV</a>
              <a href="#contact">Contact</a>
            </div>
            <div className="nav-tools">
              <button
                className="theme-toggle"
                type="button"
                aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
                onClick={toggleTheme}
              >
                {theme === 'light' ? <Moon size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />}
              </button>
              <button
                className="menu-toggle"
                type="button"
                aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
              >
                {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
              </button>
            </div>
            <div className={`mobile-menu${menuOpen ? ' is-open' : ''}`}>
              <a href="#capabilities" onClick={closeMenu}>Capabilities</a>
              <a href="#experience" onClick={closeMenu}>Experience</a>
              <a href={CV_PATH} onClick={closeMenu}>Download CV</a>
              <a href="#contact" onClick={closeMenu}>Contact</a>
            </div>
          </nav>
        </header>

        <section id="hero" className="hero section-wrap" aria-labelledby="hero-title">
          <Reveal className="hero-copy">
            <p className="eyebrow">Systems Administrator · Cloud Infrastructure &amp; Automation</p>
            <h1 id="hero-title">Reliable systems.<br />Clear operations.</h1>
            <p className="hero-summary">
              I support Windows, virtualization, network, and security-sensitive
              infrastructure — then make recurring operational work faster,
              clearer, and more reliable.
            </p>
            <div className="hero-actions">
              <Button label="View experience" href="#experience" variant="primary" endContent={<ArrowUpRight size={16} aria-hidden="true" />} />
              <Button label="Download CV" href={CV_PATH} variant="secondary" endContent={<ArrowUpRight size={16} aria-hidden="true" />} />
            </div>
            <p className="hero-note">Based in Algiers, Algeria · Open to systems and cloud opportunities</p>
          </Reveal>
          <Reveal className="hero-panel" delay={0.1}>
            <p className="eyebrow">Operational focus</p>
            <strong>Windows</strong>
            <span aria-hidden="true" />
            <strong>Automation</strong>
            <span aria-hidden="true" />
            <strong>Cloud</strong>
            <p>Secure infrastructure, repeatable work, measured outcomes.</p>
          </Reveal>
        </section>

        <section className="proof-rail section-wrap" aria-label="Professional proof points">
          {proofPoints.map((item) => (
            <div className="proof-item" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </section>

        <section id="capabilities" className="section section-wrap">
          <Reveal className="section-heading">
            <p className="eyebrow">Capabilities</p>
            <h2>Infrastructure depth, built for the next layer of cloud operations.</h2>
          </Reveal>
          <div className="capabilities-grid">
            {capabilities.map((capability, index) => (
              <Reveal className="capability-card" delay={index * 0.06} key={capability.number}>
                <span className="card-number">{capability.number}</span>
                <h3>{capability.title}</h3>
                <p>{capability.description}</p>
                <ul>
                  {capability.items.map((item) => (
                    <li key={item}><Check size={15} aria-hidden="true" />{item}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="experience" className="section section-wrap experience-section">
          <Reveal className="section-heading section-heading-row">
            <div>
              <p className="eyebrow">Experience</p>
              <h2>Built in the environments where uptime matters.</h2>
            </div>
            <span>2021 — Present</span>
          </Reveal>
          <ol className="timeline">
            {experience.map((item, index) => (
              <TimelineItem item={item} index={index} key={`${item.company}-${item.dates}`} />
            ))}
          </ol>
        </section>

        <section id="approach" className="section section-wrap approach-section">
          <Reveal className="section-heading approach-heading">
            <p className="eyebrow">Operating approach</p>
            <h2>From three hours to five minutes.</h2>
            <p>
              At AGCE, a weekly automated health check cut a recurring process by
              about 97% while making reported results more consistent and accurate.
            </p>
          </Reveal>
          <div className="approach-grid">
            {approach.map((item, index) => (
              <Reveal className="approach-card" delay={index * 0.08} key={item.title}>
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <footer id="contact" className="contact section-wrap">
          <div className="contact-card">
            <div>
              <p className="eyebrow">Open to systems and cloud opportunities</p>
              <h2>Let&apos;s make important systems easier to run.</h2>
            </div>
            <a className="contact-email" href={`mailto:${EMAIL}`}>{EMAIL}<ArrowUpRight aria-hidden="true" /></a>
            <div className="contact-links">
              <a href="https://linkedin.com/in/mohamedsenator" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14} aria-hidden="true" /></a>
              <a href="https://github.com/s3nafps" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} aria-hidden="true" /></a>
              <a href={CV_PATH}>Download CV <ArrowUpRight size={14} aria-hidden="true" /></a>
            </div>
            <p className="contact-location">Algiers, Algeria · © 2026</p>
          </div>
        </footer>
      </main>
    </Theme>
  )
}

export default App
