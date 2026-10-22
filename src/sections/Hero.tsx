import { useRef, type PointerEvent } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { ArrowDown, ArrowRight, Download, Github, Linkedin, MapPin } from 'lucide-react'
import { profile, proofStats, terminalScenes } from '../data/profile.ts'
import type { ApifyStoreState } from '../hooks/useApifyStore.ts'
import { useFinePointer } from '../hooks/useMediaQuery.ts'
import { CountUp } from '../components/motion/CountUp.tsx'
import { Magnetic } from '../components/motion/Magnetic.tsx'
import { EASE_OUT } from '../components/motion/ease.ts'
import { SplitText } from '../components/motion/SplitText.tsx'
import { Terminal } from '../components/Terminal.tsx'
import './hero.css'

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.9, delay, ease: EASE_OUT },
})

export function Hero({ store }: { store: ApifyStoreState }) {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const finePointer = useFinePointer()

  // Scroll parallax: copy drifts up and fades, terminal sinks slightly.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -120])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 80])

  // Pointer tilt for the terminal.
  const tiltX = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 })
  const tiltY = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 })

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const node = sectionRef.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    node.style.setProperty('--hx', `${event.clientX - rect.left}px`)
    node.style.setProperty('--hy', `${event.clientY - rect.top}px`)
    if (!finePointer || reduceMotion) return
    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5
    tiltY.set(px * 10)
    tiltX.set(-py * 8)
  }
  const onPointerLeave = () => {
    tiltX.set(0)
    tiltY.set(0)
  }

  const actorCount = store.summary.actorCount

  return (
    <section id="top" ref={sectionRef} className="hero" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave} aria-labelledby="hero-title">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-aurora">
          <span className="blob blob-1" />
          <span className="blob blob-2" />
          <span className="blob blob-3" />
        </div>
        <div className="hero-grid" />
        <div className="hero-spot" />
        <div className="hero-fade" />
      </div>

      <div className="hero-inner container">
        <motion.div className="hero-head" style={reduceMotion ? undefined : { y: copyY, opacity: copyOpacity }}>
          <motion.p className="hero-badge" {...fadeUp(0.15)}>
            <span className="live-dot" />
            {profile.status}
          </motion.p>

          <motion.p className="hero-kicker" {...fadeUp(0.25)}>
            {profile.name} <span aria-hidden="true">/</span> Systems Administrator
          </motion.p>

          <h1 id="hero-title" className="hero-title">
            <SplitText
              immediate
              delay={0.35}
              parts={[
                'I keep systems',
                { text: 'running', className: 'serif-accent hero-accent', br: true },
                { text: 'and build the tools', br: true },
                { text: 'around them.', className: 'gradient-text' },
              ]}
            />
          </h1>
        </motion.div>

        <motion.div className="hero-copy" style={reduceMotion ? undefined : { y: copyY, opacity: copyOpacity }}>
          <motion.p className="hero-summary" {...fadeUp(0.95)}>
            {profile.summary}
          </motion.p>

          <motion.div className="hero-actions" {...fadeUp(1.1)}>
            <Magnetic>
              <a className="btn btn-primary" href="#apis">
                See my work <ArrowRight size={17} className="icon-shift" aria-hidden="true" />
              </a>
            </Magnetic>
            <Magnetic>
              <a className="btn btn-ghost" href={profile.links.cv} download>
                Download CV <Download size={16} aria-hidden="true" />
              </a>
            </Magnetic>
          </motion.div>

          <motion.div className="hero-meta" {...fadeUp(1.25)}>
            <span>
              <MapPin size={14} aria-hidden="true" /> {profile.location}
            </span>
            <a href={profile.links.github} target="_blank" rel="noreferrer">
              <Github size={14} aria-hidden="true" /> s3nafps
            </a>
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
              <Linkedin size={14} aria-hidden="true" /> mohamedsenator
            </a>
          </motion.div>
        </motion.div>

        <motion.div className="hero-visual" style={reduceMotion ? undefined : { y: visualY }}>
          <motion.div
            className="hero-terminal-wrap"
            initial={{ opacity: 0, scale: 0.92, y: 40, rotateX: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1.2, delay: 0.55, ease: EASE_OUT }}
          >
            <motion.div style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 1200 }}>
              <Terminal scenes={terminalScenes} />
            </motion.div>

            <motion.div className="hero-float hero-float-1" {...fadeUp(1.5)}>
              <span className="live-dot" data-tone={store.status === 'offline' ? 'idle' : undefined} />
              <span>
                <strong>{actorCount} Actors</strong> on Apify
              </span>
            </motion.div>
            <motion.div className="hero-float hero-float-2" {...fadeUp(1.7)}>
              <span className="hero-float-label">weekly health check</span>
              <strong>
                3h <ArrowRight size={13} aria-hidden="true" /> 5 min
              </strong>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <div className="hero-stats container">
        {proofStats.map((stat, index) => {
          const value = stat.label.includes('Apify') ? actorCount : stat.value
          return (
            <motion.div className="hero-stat" key={stat.label} {...fadeUp(1.3 + index * 0.08)}>
              <CountUp className="hero-stat-value" value={value} prefix={stat.prefix} suffix={stat.suffix} />
              <span className="hero-stat-label">{stat.label}</span>
            </motion.div>
          )
        })}
      </div>

      <motion.a className="hero-scroll" href="#capabilities" aria-label="Scroll to capabilities" {...fadeUp(1.8)}>
        <ArrowDown size={16} aria-hidden="true" />
      </motion.a>
    </section>
  )
}
