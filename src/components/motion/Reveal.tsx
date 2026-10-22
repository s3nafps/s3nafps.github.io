import type { ReactNode } from 'react'
import { motion, type Variants } from 'motion/react'
import { EASE_OUT, staggerChild } from './ease.ts'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  /** Vertical travel in px. */
  y?: number
  /** Start blurred and sharpen into place. */
  blur?: boolean
  duration?: number
  as?: 'div' | 'section' | 'li' | 'article' | 'header' | 'p' | 'span' | 'figure'
}

/** Fades, rises and (optionally) un-blurs its children once they scroll into view. */
export function Reveal({ children, className, delay = 0, y = 28, blur = true, duration = 0.9, as = 'div' }: RevealProps) {
  const Component = motion[as]
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y, filter: blur ? 'blur(10px)' : 'blur(0px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration, delay, ease: EASE_OUT }}
    >
      {children}
    </Component>
  )
}

const staggerParent = (stagger: number, delay: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
})

type StaggerProps = {
  children: ReactNode
  className?: string
  stagger?: number
  delay?: number
  as?: 'div' | 'ul' | 'ol' | 'section'
}

/** Parent that reveals its `StaggerItem` children one after another when scrolled into view. */
export function Stagger({ children, className, stagger = 0.09, delay = 0, as = 'div' }: StaggerProps) {
  const Component = motion[as]
  return (
    <Component
      className={className}
      variants={staggerParent(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
    >
      {children}
    </Component>
  )
}

export function StaggerItem({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'li' | 'article'
}) {
  const Component = motion[as]
  return (
    <Component className={className} variants={staggerChild}>
      {children}
    </Component>
  )
}
