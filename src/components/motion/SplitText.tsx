import { Fragment } from 'react'
import { motion } from 'motion/react'
import { EASE_OUT } from './ease.ts'

export type TextPart = string | { text: string; className?: string; br?: boolean }

type SplitTextProps = {
  parts: TextPart[]
  /** Delay before the first word, in seconds. */
  delay?: number
  stagger?: number
  /** Animate on mount instead of when scrolled into view (use for the hero). */
  immediate?: boolean
}

/**
 * Word-by-word headline reveal: each word rises out of a clipped line.
 * Screen readers get the plain sentence once; the animated words are hidden from them.
 * Render it inside your own heading element.
 */
export function SplitText({ parts, delay = 0, stagger = 0.055, immediate = false }: SplitTextProps) {
  const label = parts.map((part) => (typeof part === 'string' ? part : part.text)).join(' ').replace(/\s+/g, ' ').trim()
  let index = 0

  const trigger = immediate
    ? { animate: 'show' as const }
    : { whileInView: 'show' as const, viewport: { once: true, margin: '0px 0px -10% 0px' } }

  return (
    <>
      <span className="sr-only">{label}</span>
      <motion.span aria-hidden="true" initial="hidden" {...trigger} style={{ display: 'inline' }}>
        {parts.map((part, partIndex) => {
          const text = typeof part === 'string' ? part : part.text
          const className = typeof part === 'string' ? undefined : part.className
          const lineBreak = typeof part !== 'string' && part.br
          const words = text.split(/\s+/).filter(Boolean)
          return (
            <Fragment key={partIndex}>
              {words.map((word) => {
                const order = index++
                return (
                  <Fragment key={`${partIndex}-${order}`}>
                  <span
                    style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.12em', marginBottom: '-0.12em' }}
                  >
                    <motion.span
                      className={className}
                      style={{ display: 'inline-block', willChange: 'transform' }}
                      variants={{
                        hidden: { y: '110%' },
                        show: {
                          y: '0%',
                          transition: { duration: 0.95, ease: EASE_OUT, delay: delay + order * stagger },
                        },
                      }}
                    >
                      {word}
                    </motion.span>
                  </span>{' '}
                  </Fragment>
                )
              })}
              {lineBreak ? <br /> : null}
            </Fragment>
          )
        })}
      </motion.span>
    </>
  )
}
