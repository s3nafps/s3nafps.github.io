import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import type { TerminalScene } from '../data/types.ts'
import './terminal.css'

const TYPE_MS = 34
const LINE_MS = 260
const HOLD_MS = 2600
/** Stop after this many passes so the content doesn't move forever (WCAG 2.2.2). */
const MAX_CYCLES = 2

type Phase = { scene: number; typed: number; lines: number; cycle: number }

/**
 * A terminal that types each scene's command, prints its output line by line,
 * holds, then moves to the next scene. Pauses off-screen, in hidden tabs, and on
 * hover or keyboard focus; stops for good after two passes, on the last scene.
 * With reduced motion it shows the first scene fully and does not cycle.
 */
export function Terminal({ scenes, title = 'mohamed@ops: ~' }: { scenes: TerminalScene[]; title?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '0px 0px -10% 0px' })
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = useState<Phase>({ scene: 0, typed: 0, lines: 0, cycle: 0 })
  const [pageVisible, setPageVisible] = useState(true)
  const [held, setHeld] = useState(false)

  useEffect(() => {
    const onVisibility = () => setPageVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const lastScene = phase.scene === scenes.length - 1
  const finished = phase.cycle >= MAX_CYCLES - 1 && lastScene && phase.lines === scenes[phase.scene].output.length
  const running = inView && pageVisible && !held && !reduceMotion && !finished
  const scene = scenes[phase.scene]

  useEffect(() => {
    if (!running) return
    let delay: number
    let next: Phase
    if (phase.typed < scene.command.length) {
      delay = phase.typed === 0 ? 500 : TYPE_MS + (scene.command[phase.typed] === ' ' ? 40 : 0)
      next = { ...phase, typed: phase.typed + 1 }
    } else if (phase.lines < scene.output.length) {
      delay = phase.lines === 0 ? 420 : LINE_MS
      next = { ...phase, lines: phase.lines + 1 }
    } else {
      delay = HOLD_MS
      next = { scene: (phase.scene + 1) % scenes.length, typed: 0, lines: 0, cycle: phase.cycle + (lastScene ? 1 : 0) }
    }
    const timer = window.setTimeout(() => setPhase(next), delay)
    return () => window.clearTimeout(timer)
  }, [running, phase, scene, scenes.length, lastScene])

  const shown = reduceMotion ? { ...phase, scene: 0, typed: scenes[0].command.length, lines: scenes[0].output.length } : phase
  const current = scenes[shown.scene]
  const typing = shown.typed < current.command.length

  return (
    <div
      ref={ref}
      className="terminal"
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      role="img"
      aria-label={`Terminal replaying commands from my projects: ${scenes.map((s) => s.command).join('; ')}`}
    >
      <div className="terminal-bar" aria-hidden="true">
        <span className="terminal-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="terminal-title">{title}</span>
        <span className="terminal-scene">
          {shown.scene + 1}/{scenes.length}
        </span>
      </div>
      <div className="terminal-body" aria-hidden="true">
        <AnimatePresence mode="wait">
          <motion.div
            key={shown.scene}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
            transition={{ duration: 0.35 }}
          >
            <p className="terminal-line">
              <span className="terminal-prompt">❯</span>
              <span className="terminal-command">{current.command.slice(0, shown.typed)}</span>
              {typing || shown.lines === current.output.length ? <span className="terminal-caret" /> : null}
            </p>
            {current.output.slice(0, shown.lines).map((line, index) => (
              <motion.p
                key={index}
                className={`terminal-out tone-${line.tone ?? 'plain'}`}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
              >
                {line.text}
              </motion.p>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="terminal-progress" aria-hidden="true">
        {scenes.map((_, index) => (
          <span key={index} className={index === shown.scene ? 'is-active' : undefined} />
        ))}
      </div>
    </div>
  )
}
