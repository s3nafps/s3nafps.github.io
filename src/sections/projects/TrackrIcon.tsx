import { motion, type Variants } from 'motion/react'
import { EASE_OUT } from '../../components/motion/ease.ts'

const ring: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 1, transition: { duration: 1.2, delay: 0.25, ease: EASE_OUT } },
}
const play: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.7, delay: 0.7, ease: EASE_OUT } },
}
const dot: Variants = {
  hidden: { opacity: 0, scale: 0 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 420, damping: 13, delay: 1.15 } },
}

/**
 * Trackr's adaptive launcher icon, redrawn from its Android vector: a 108dp canvas
 * (72dp visible) with the foreground scaled 0.62 around the center. Draws itself in on view.
 */
export function TrackrIcon({ className }: { className?: string }) {
  return (
    <motion.svg
      className={className}
      viewBox="18 18 72 72"
      aria-hidden="true"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
    >
      <rect x="18" y="18" width="72" height="72" fill="#1A1D24" />
      <g transform="translate(54 54) scale(0.62) translate(-54 -54)">
        <motion.path
          d="M54,22 A32,32 0 1,1 22,54"
          fill="none"
          stroke="#7C5CFF"
          strokeWidth="4.3"
          strokeLinecap="round"
          variants={ring}
        />
        <motion.path d="M46,40L70,54L46,68Z" fill="#7C5CFF" variants={play} />
        <motion.circle cx="74" cy="36" r="5.4" fill="#FFB547" variants={dot} />
      </g>
    </motion.svg>
  )
}
