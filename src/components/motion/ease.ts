import type { Variants } from 'motion/react'

/** Shared easing for all reveal motion: fast start, long soft landing. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const

/** Child variant used inside a `Stagger` parent. */
export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 26, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: EASE_OUT } },
}
