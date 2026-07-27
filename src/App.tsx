import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Menu,
  X,
} from 'lucide-react'
import { capabilities, experience } from './content'

const EMAIL = 'mohamed.senator@icloud.com'
const CV_PATH = '/Mohamed_Senator_CV_2026.pdf'

const proofPoints = [
  { value: '4+', label: 'Years in live environments' },
  { value: '4,000+', label: 'Users supported' },
  { value: 'ACE', label: 'Google Cloud certified' },
  { value: 'Algiers', label: 'Based in Algeria' },
]

const approach = [
  {
    number: '01',
    title: 'Reliability',
    copy: 'Keep critical systems available, governed, documented, and supportable.',
  },
  {
    number: '02',
    title: 'Automation',
    copy: 'Turn recurring checks, audits, and reporting into consistent PowerShell workflows.',
  },
  {
    number: '03',
    title: 'Cloud',
    copy: 'Extend proven infrastructure discipline into virtualized and Google Cloud environments.',
  },
]

function usePrefersReducedMotion() {
  const [reduceMotion, setReduceMotion] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduceMotion(query.matches)

    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return reduceMotion
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
  const reduceMotion = usePrefersReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { y: 28, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        duration: 0.7,
        delay: reduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

function HeroPipeline() {
  const pipelineRef = useRef<HTMLDivElement>(null)
  const stackRef = useRef<HTMLSpanElement>(null)
  const centerRef = useRef<HTMLSpanElement>(null)
  const shieldRef = useRef<HTMLSpanElement>(null)
  const glowPathRef = useRef<SVGPathElement>(null)
  const corePathRef = useRef<SVGPathElement>(null)
  const gradientRef = useRef<SVGLinearGradientElement>(null)
  const splashRef = useRef<HTMLSpanElement>(null)
  const reduceMotion = usePrefersReducedMotion()

  useEffect(() => {
    const pipeline = pipelineRef.current
    const stack = stackRef.current
    const centerNode = centerRef.current
    const shield = shieldRef.current
    const glowPath = glowPathRef.current
    const corePath = corePathRef.current
    const gradient = gradientRef.current
    const splash = splashRef.current

    if (
      !pipeline ||
      !stack ||
      !centerNode ||
      !shield ||
      !glowPath ||
      !corePath ||
      !gradient ||
      !splash
    ) {
      return
    }

    const measurePath = () => {
      const pipelineRect = pipeline.getBoundingClientRect()
      const centerOf = (node: HTMLElement) => {
        const rect = node.getBoundingClientRect()
        return {
          x: rect.left + rect.width / 2 - pipelineRect.left,
          y: rect.top + rect.height / 2 - pipelineRect.top,
        }
      }
      const start = centerOf(stack)
      const middle = centerOf(centerNode)
      const end = centerOf(shield)
      const path = `M ${start.x},${start.y} L ${middle.x},${middle.y} L ${end.x},${end.y}`

      glowPath.setAttribute('d', path)
      corePath.setAttribute('d', path)
    }

    const setBeam = (percentage: number) => {
      const beamCenter = percentage * 100
      gradient.setAttribute('x1', `${beamCenter - 5}%`)
      gradient.setAttribute('x2', `${beamCenter + 5}%`)
      gradient.setAttribute('y1', '0%')
      gradient.setAttribute('y2', '0%')
    }

    const setBeamVisible = (visible: boolean) => {
      glowPath.style.opacity = visible ? '0.6' : '0'
      corePath.style.opacity = visible ? '1' : '0'
    }

    let frame = 0
    let phase: 'p1' | 'splash' | 'p2' | 'idle' = 'p1'
    let lastStateChange = performance.now()

    const animate = (time: number) => {
      const elapsed = time - lastStateChange

      if (phase === 'p1') {
        const progress = Math.min(elapsed / 800, 1)
        setBeam(progress * 0.5)
        stack.classList.toggle('active', progress < 0.4)
        if (progress === 1) {
          stack.classList.remove('active')
          setBeamVisible(false)
          splash.classList.add('animate')
          phase = 'splash'
          lastStateChange = time
        }
      } else if (phase === 'splash' && elapsed >= 800) {
        splash.classList.remove('animate')
        setBeamVisible(true)
        phase = 'p2'
        lastStateChange = time
      } else if (phase === 'p2') {
        const progress = Math.min(elapsed / 800, 1)
        setBeam(0.5 + progress * 0.5)
        shield.classList.toggle('active', progress > 0.6)
        if (progress === 1) {
          shield.classList.remove('active')
          phase = 'idle'
          lastStateChange = time
        }
      } else if (phase === 'idle' && elapsed >= 1000) {
        phase = 'p1'
        lastStateChange = time
      }

      frame = requestAnimationFrame(animate)
    }

    measurePath()
    setBeamVisible(true)
    setBeam(reduceMotion ? 0.5 : 0)
    window.addEventListener('resize', measurePath)

    if (!reduceMotion) {
      frame = requestAnimationFrame(animate)
    }

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', measurePath)
      stack.classList.remove('active')
      shield.classList.remove('active')
      splash.classList.remove('animate')
    }
  }, [reduceMotion])

  return (
    <div
      className="icon-pipeline"
      ref={pipelineRef}
      aria-label="Infrastructure to secure cloud delivery"
    >
      <svg className="beam-svg" aria-hidden="true">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient
            id="beam-gradient"
            ref={gradientRef}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#b04090" stopOpacity="0" />
            <stop offset="20%" stopColor="#b04090" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#fff" stopOpacity="1" />
            <stop offset="80%" stopColor="#c8a0e0" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#c8a0e0" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path className="beam-glow" ref={glowPathRef} />
        <path className="beam-core" ref={corePathRef} />
      </svg>

      <span
        className="icon-node node-light-right"
        ref={stackRef}
        aria-label="Windows infrastructure"
        role="img"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      </span>

      <span className="pipeline-line" aria-hidden="true" />

      <span className="center-wrap">
        <span className="splash" ref={splashRef} aria-hidden="true" />
        <span
          className="icon-node-center"
          ref={centerRef}
          aria-label="Mohamed Senator automation"
          role="img"
        >
          <span className="monogram-mark">MS</span>
        </span>
      </span>

      <span className="pipeline-line right" aria-hidden="true" />

      <span
        className="icon-node node-light-left"
        ref={shieldRef}
        aria-label="Secure cloud delivery"
        role="img"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      </span>
    </div>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const reduceMotion = usePrefersReducedMotion()

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = menuOpen ? 'hidden' : previousOverflow

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <main>
      <section id="hero" className="hero-shell" aria-labelledby="hero-title">
        <nav className="site-nav" aria-label="Primary navigation">
          <a className="nav-logo" href="#hero" onClick={closeMenu}>
            Mohamed Senator
          </a>
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
          <div className={`nav-menu${menuOpen ? ' active' : ''}`}>
            <ul className="nav-links">
              <li>
                <a href="#experience" onClick={closeMenu}>
                  Experience
                </a>
              </li>
              <li>
                <a href="#capabilities" onClick={closeMenu}>
                  Capabilities
                </a>
              </li>
              <li>
                <a href={CV_PATH} onClick={closeMenu}>
                  CV
                </a>
              </li>
              <li>
                <a href="#contact" onClick={closeMenu}>
                  Contact
                </a>
              </li>
            </ul>
            <div className="nav-actions">
              <a className="button button-ghost" href="#approach" onClick={closeMenu}>
                How I work
              </a>
              <a className="button button-light" href={`mailto:${EMAIL}`}>
                Let&apos;s talk
              </a>
            </div>
          </div>
        </nav>

        <div className="hero-card">
          <p className="eyebrow">Systems Administrator · Cloud Engineer</p>
          <HeroPipeline />
          <div className="hero-content">
            <h1 id="hero-title">
              Systems built to{' '}
              <strong>stay available.</strong>
            </h1>
            <p>
              I engineer secure Windows infrastructure, automate recurring
              operations, and extend reliable systems into the cloud.
            </p>
            <div className="hero-actions">
              <a className="button button-light button-large" href="#experience">
                View experience <ArrowRight size={16} aria-hidden="true" />
              </a>
              <a className="button button-ghost button-large" href={CV_PATH}>
                Download CV <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="proof-rail" aria-label="Professional proof points">
        {proofPoints.map((item) => (
          <div className="proof-item" key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      <section id="capabilities" className="section capabilities-section">
        <Reveal className="section-heading">
          <p className="eyebrow">Capabilities</p>
          <h2>Operational depth across the systems that keep work moving.</h2>
          <p>
            Infrastructure first, strengthened through automation, security,
            virtualization, and cloud practice.
          </p>
        </Reveal>

        <div className="capabilities-grid">
          {capabilities.map((capability, index) => (
            <Reveal
              className={`capability-card capability-card-${index + 1}`}
              delay={index * 0.08}
              key={capability.number}
            >
              <div className="capability-image">
                <img src={capability.image} alt="" aria-hidden="true" />
              </div>
              <div className="capability-body">
                <span className="card-number">{capability.number}</span>
                <h3>{capability.title}</h3>
                <p>{capability.description}</p>
                <ul>
                  {capability.items.map((item) => (
                    <li key={item}>
                      <Check size={14} aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="experience" className="section experience-section">
        <Reveal className="section-heading section-heading-row">
          <div>
            <p className="eyebrow">Experience</p>
            <h2>Built in live environments.</h2>
          </div>
          <span>2021 — Present</span>
        </Reveal>

        <ol className="timeline">
          {experience.map((item, index) => (
            <motion.li
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: reduceMotion ? 0 : 0.55,
                delay: reduceMotion ? 0 : index * 0.05,
              }}
              key={`${item.company}-${item.dates}`}
            >
              <p className="timeline-date">{item.dates}</p>
              <div className="timeline-role">
                <h3>{item.role}</h3>
                <p>
                  {item.company} · {item.location}
                </p>
              </div>
              <p className="timeline-summary">{item.summary}</p>
            </motion.li>
          ))}
        </ol>
      </section>

      <section id="approach" className="section approach-section">
        <Reveal className="approach-intro">
          <p className="eyebrow">Operating approach</p>
          <h2>Reliability is the foundation. Automation and cloud extend it.</h2>
          <p>
            Across enterprise, manufacturing, and government environments, I
            have supported infrastructure serving up to 4,000+ users while
            building clearer, repeatable operational workflows.
          </p>
        </Reveal>

        <div className="approach-grid">
          {approach.map((item, index) => (
            <Reveal className="approach-card" delay={index * 0.1} key={item.title}>
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <footer id="contact" className="contact-shell">
        <div className="contact-card">
          <div>
            <p className="eyebrow">Open to systems and cloud opportunities</p>
            <h2>Let&apos;s keep important systems moving.</h2>
          </div>
          <a className="contact-email" href={`mailto:${EMAIL}`}>
            {EMAIL}
            <ArrowUpRight aria-hidden="true" />
          </a>
          <div className="contact-meta">
            <div>
              <a
                href="https://linkedin.com/in/mohamedsenator"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn <ArrowUpRight size={13} aria-hidden="true" />
              </a>
              <a
                href="https://github.com/s3nafps"
                target="_blank"
                rel="noreferrer"
              >
                GitHub <ArrowUpRight size={13} aria-hidden="true" />
              </a>
              <a href={CV_PATH}>
                Download CV <ArrowUpRight size={13} aria-hidden="true" />
              </a>
            </div>
            <p>Algiers, Algeria · © 2026</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default App
