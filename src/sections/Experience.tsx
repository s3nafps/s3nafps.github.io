import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type Variants } from 'motion/react'
import { BadgeCheck } from 'lucide-react'
import { certifications, experience } from '../data/experience.ts'
import type { Certification, Experience as Role } from '../data/types.ts'
import { Reveal } from '../components/motion/Reveal.tsx'
import { SplitText } from '../components/motion/SplitText.tsx'
import { EASE_OUT } from '../components/motion/ease.ts'
import './experience.css'

// Range shown beside the heading: the earliest start year in the data, through today.
const firstYear = experience.at(-1)?.dates.match(/\d{4}/)?.[0] ?? ''
const isCurrent = (role: Role) => /present/i.test(role.dates)

// Entry choreography: the node pops, dates drift in from the rail's left, content from its right.
const entry: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const fromLeft: Variants = {
  hidden: { opacity: 0, x: -18, filter: 'blur(6px)' },
  show: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: EASE_OUT } },
}
const fromRight: Variants = {
  hidden: { opacity: 0, x: 32, filter: 'blur(10px)' },
  show: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: EASE_OUT } },
}
const pop: Variants = {
  hidden: { opacity: 0, scale: 0.3 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 320, damping: 18 } },
}

export function Experience() {
  return (
    <section id="experience" className="section exp" aria-labelledby="exp-title">
      <div className="exp-glow" aria-hidden="true" />
      <div className="container">
        <div className="section-head section-head--split exp-head">
          <div>
            <Reveal>
              <p className="eyebrow">04 — Experience</p>
            </Reveal>
            <h2 id="exp-title" className="section-title exp-title">
              <SplitText parts={['Where the work happened.']} />
            </h2>
            <Reveal delay={0.1}>
              <p className="section-lead">Most recent first. Service desk, then networks, then air-gapped Windows.</p>
            </Reveal>
          </div>
          <Reveal className="exp-range" delay={0.25} y={16}>
            <span className="exp-range-label">{experience.length} roles</span>
            <span className="exp-range-value">
              {firstYear} <span aria-hidden="true">—</span>
              <span className="sr-only">to</span> Present
            </span>
          </Reveal>
        </div>

        <Timeline />

        {certifications.map((cert) => (
          <CertificationCard key={cert.title} cert={cert} />
        ))}
      </div>
    </section>
  )
}

/** Vertical rail whose fill follows scroll progress; each node lights up once the fill reaches it. */
function Timeline() {
  const listRef = useRef<HTMLOListElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const stops = useRef<number[]>([])
  const [reached, setReached] = useState(0)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 75%', 'end 60%'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })
  const fill = reduceMotion ? scrollYProgress : smooth
  const tipY = useTransform(fill, (value) => `${value * 100}%`)
  const tipOpacity = useTransform(fill, [0, 0.03, 0.97, 1], [0, 1, 1, 0])

  const sync = useCallback((progress: number) => {
    // The first node sits at the very top of the rail, so it waits for the fill to start.
    setReached(stops.current.filter((stop) => progress > Math.max(stop, 0.005)).length)
  }, [])

  // Where each node sits along the rail (0 → 1). Re-measured whenever the list resizes.
  useLayoutEffect(() => {
    const list = listRef.current
    const rail = railRef.current
    if (!list || !rail) return
    const measure = () => {
      const railBox = rail.getBoundingClientRect()
      if (railBox.height === 0) return
      stops.current = Array.from(list.querySelectorAll<HTMLElement>('[data-node]')).map((node) => {
        const box = node.getBoundingClientRect()
        return (box.top + box.height / 2 - railBox.top) / railBox.height
      })
      sync(fill.get())
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    return () => observer.disconnect()
  }, [fill, sync])

  // Follow the drawn fill (not raw scroll) so a node lights exactly as the spark passes it.
  useMotionValueEvent(fill, 'change', sync)

  return (
    <div className="exp-timeline">
      <div ref={railRef} className="exp-rail" aria-hidden="true">
        <motion.div className="exp-rail-fill" style={{ scaleY: fill }} />
        <motion.div className="exp-rail-tip-track" style={{ y: tipY, opacity: tipOpacity }}>
          <span className="exp-rail-tip" />
        </motion.div>
      </div>
      <ol ref={listRef} className="exp-list">
        {experience.map((role, index) => (
          <TimelineEntry key={`${role.company}-${role.dates}`} role={role} lit={index < reached} />
        ))}
      </ol>
    </div>
  )
}

function TimelineEntry({ role, lit }: { role: Role; lit: boolean }) {
  const current = isCurrent(role)
  return (
    <motion.li
      className="exp-item"
      data-lit={lit || undefined}
      variants={entry}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
    >
      <motion.div className="exp-when" variants={fromLeft}>
        <span className="exp-dates">{role.dates}</span>
        {current ? (
          <span className="exp-now">
            <span className="live-dot" /> Current
          </span>
        ) : null}
      </motion.div>

      <div className="exp-node-cell">
        <motion.span className="exp-node" data-node="" data-current={current || undefined} variants={pop} aria-hidden="true">
          <span className="exp-node-core" />
        </motion.span>
      </div>

      <motion.div className="exp-body" variants={fromRight}>
        <h3 className="exp-role">{role.role}</h3>
        <p className="exp-org">
          <span className="exp-company">{role.company}</span>
          <span className="exp-org-sep" aria-hidden="true">·</span>
          <span>{role.location}</span>
        </p>
        <p className="exp-summary">{role.summary}</p>
        <ul className="chip-list exp-chips" aria-label={`${role.company} highlights`}>
          {role.highlights.map((highlight) => (
            <li key={highlight} className="chip exp-chip">
              {highlight}
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.li>
  )
}

function CertificationCard({ cert }: { cert: Certification }) {
  return (
    <Reveal className="exp-cert-wrap" y={36}>
      <article className="exp-cert">
        <span className="exp-cert-sheen" aria-hidden="true" />
        <motion.div
          className="exp-cert-icon"
          initial={{ opacity: 0, scale: 0.5, rotate: -16 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, margin: '0px 0px -12% 0px' }}
          transition={{ type: 'spring', stiffness: 220, damping: 15, delay: 0.3 }}
        >
          <BadgeCheck size={28} strokeWidth={1.7} aria-hidden="true" />
        </motion.div>
        <div className="exp-cert-copy">
          <p className="exp-cert-kicker">
            <span>Certification</span>
            <span className="exp-cert-kicker-sep" aria-hidden="true">
              /
            </span>
            <span>{cert.issuer}</span>
          </p>
          <h3 className="exp-cert-title">{cert.title}</h3>
        </div>
        {cert.year ? (
          <p className="exp-cert-year">
            <span className="exp-cert-year-label">Certified</span>
            <span className="exp-cert-year-value">{cert.year}</span>
          </p>
        ) : null}
      </article>
    </Reveal>
  )
}
