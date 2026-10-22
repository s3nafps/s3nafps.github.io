import { useEffect, useId, useRef, useState, type FocusEvent, type PointerEvent } from 'react'
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from 'motion/react'
import { Pause, Play } from 'lucide-react'
import { EASE_OUT } from '../../components/motion/ease.ts'
import type { AppProject } from '../../data/types.ts'
import { CYCLE_MS } from './content.ts'
import { useAutoAdvance, usePageVisible } from './hooks.ts'
import { PhoneFrame } from './PhoneFrame.tsx'
import './phones.css'

type Shot = AppProject['screenshots'][number]

/** Intrinsic size of every Trackr screenshot. */
const SHOT_SIZE = { width: 540, height: 1097 }

/** Center screen: slides in the direction of travel while crossfading. */
const slide: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: `${direction * 18}%`, scale: 1.03 }),
  center: { opacity: 1, x: '0%', scale: 1, transition: { duration: 0.8, ease: EASE_OUT } },
  exit: (direction: number) => ({
    opacity: 0,
    x: `${direction * -14}%`,
    scale: 0.97,
    transition: { duration: 0.6, ease: EASE_OUT },
  }),
}

/** Phones rise into place once, the center one first. */
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 90 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -8% 0px' },
  transition: { duration: 1.2, delay, ease: EASE_OUT },
})

/** Side phones show the neighbouring screenshots and simply crossfade. */
function SideScreen({ shot }: { shot: Shot }) {
  return (
    <AnimatePresence initial={false}>
      <motion.img
        key={shot.src}
        className="proj-shot"
        src={shot.src}
        alt=""
        {...SHOT_SIZE}
        loading="lazy"
        decoding="async"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.9, ease: 'easeInOut' }}
      />
    </AnimatePresence>
  )
}

/**
 * Three fanned phones with scroll parallax. The center phone cycles through the
 * screenshots; it pauses off-screen, in background tabs, on hover, while focus is in
 * the fan, and stops once the user pauses it or picks a screenshot. It never cycles
 * under reduced motion.
 */
export function PhoneFan({ shots }: { shots: Shot[] }) {
  const fanRef = useRef<HTMLDivElement>(null)
  const preloaded = useRef(false)
  const screenId = useId()
  const reduceMotion = useReducedMotion()
  const inView = useInView(fanRef, { margin: '-10% 0px -10% 0px' })
  const pageVisible = usePageVisible()
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [userPaused, setUserPaused] = useState(false)

  const running = inView && pageVisible && !hovered && !focused && !userPaused && !reduceMotion
  const { index, direction, goTo } = useAutoAdvance(shots.length, CYCLE_MS, running)
  const count = shots.length
  const prev = shots[(index - 1 + count) % count]
  const next = shots[(index + 1) % count]
  const current = shots[index]

  // Warm the cache once the fan is near, so every slide change is instant.
  useEffect(() => {
    if (!inView || preloaded.current) return
    preloaded.current = true
    for (const shot of shots) {
      const image = new Image()
      image.decoding = 'async'
      image.src = shot.src
    }
  }, [inView, shots])

  // Scroll parallax: each phone drifts at its own speed; the fan opens as it enters.
  const { scrollYProgress } = useScroll({ target: fanRef, offset: ['start end', 'end start'] })
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.5 })
  const centerY = useTransform(progress, [0, 1], [40, -40])
  const leftY = useTransform(progress, [0, 1], [70, -50])
  const rightY = useTransform(progress, [0, 1], [130, -110])
  const leftRotate = useTransform(progress, [0, 1], [-13, -6])
  const rightRotate = useTransform(progress, [0, 1], [14, 6])
  const spread = useTransform(progress, [0.08, 0.42], [0.55, 1])

  useMotionValueEvent(spread, 'change', (value) => {
    if (!reduceMotion) fanRef.current?.style.setProperty('--fan', value.toFixed(3))
  })
  useEffect(() => {
    if (reduceMotion) fanRef.current?.style.removeProperty('--fan')
  }, [reduceMotion])

  const onPointerEnter = (event: PointerEvent) => {
    if (event.pointerType === 'mouse') setHovered(true)
  }
  const onPointerLeave = () => setHovered(false)
  const onBlur = (event: FocusEvent) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
  }
  // Pressing play resumes right away, even with focus still on the button.
  const onToggle = () => {
    setFocused(false)
    setUserPaused((paused) => !paused)
  }

  return (
    <div
      ref={fanRef}
      className="proj-fan"
      data-motion={reduceMotion ? 'reduced' : 'full'}
      role="group"
      aria-roledescription="carousel"
      aria-label="Trackr screenshots"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onFocus={() => setFocused(true)}
      onBlur={onBlur}
    >
      <div className="proj-fan-glow" aria-hidden="true">
        <span className="proj-fan-glow-violet" />
        <span className="proj-fan-glow-amber" />
      </div>

      <div className="proj-fan-stage">
        <motion.div
          className="proj-fan-slot proj-fan-slot--side proj-fan-slot--left"
          style={reduceMotion ? undefined : { y: leftY, rotate: leftRotate }}
          aria-hidden="true"
        >
          <motion.div {...rise(0.3)}>
            <PhoneFrame className="proj-phone--back">
              <SideScreen shot={prev} />
            </PhoneFrame>
          </motion.div>
        </motion.div>

        <motion.div
          className="proj-fan-slot proj-fan-slot--side proj-fan-slot--right"
          style={reduceMotion ? undefined : { y: rightY, rotate: rightRotate }}
          aria-hidden="true"
        >
          <motion.div {...rise(0.42)}>
            <PhoneFrame className="proj-phone--back">
              <SideScreen shot={next} />
            </PhoneFrame>
          </motion.div>
        </motion.div>

        <motion.div className="proj-fan-slot proj-fan-slot--center" style={reduceMotion ? undefined : { y: centerY }}>
          <motion.div {...rise(0.1)}>
            <PhoneFrame screenId={screenId} live={running ? 'off' : 'polite'}>
              <AnimatePresence initial={false} custom={direction}>
                <motion.img
                  key={current.src}
                  className="proj-shot"
                  src={current.src}
                  alt={current.alt}
                  {...SHOT_SIZE}
                  loading="lazy"
                  decoding="async"
                  custom={direction}
                  variants={slide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                />
              </AnimatePresence>
            </PhoneFrame>
          </motion.div>
        </motion.div>

        <span className="proj-fan-floor" aria-hidden="true" />
      </div>

      <div className="proj-fan-controls">
        <div className="proj-dots" role="group" aria-label="Choose a screenshot">
          {shots.map((shot, dotIndex) => {
            const active = dotIndex === index
            return (
              <button
                key={shot.src}
                type="button"
                className="proj-dot"
                aria-pressed={active}
                aria-controls={screenId}
                aria-label={`Screenshot ${dotIndex + 1} of ${count}: ${shot.alt}`}
                onClick={() => {
                  goTo(dotIndex)
                  setUserPaused(true)
                }}
              >
                <span className="proj-dot-track">
                  {active && running ? (
                    <motion.span
                      key={`run-${dotIndex}`}
                      className="proj-dot-fill"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: CYCLE_MS / 1000, ease: 'linear' }}
                    />
                  ) : active ? (
                    <span className="proj-dot-fill" />
                  ) : null}
                </span>
              </button>
            )
          })}
        </div>
        {reduceMotion ? null : (
          <button
            type="button"
            className="proj-fan-toggle"
            aria-label={userPaused ? 'Play screenshot slideshow' : 'Pause screenshot slideshow'}
            onClick={onToggle}
          >
            {userPaused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
          </button>
        )}
      </div>
    </div>
  )
}
