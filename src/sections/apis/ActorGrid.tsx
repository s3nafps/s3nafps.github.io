import { useRef } from 'react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import type { ActorWithStats } from '../../data/types.ts'
import { ActorCard } from './ActorCard.tsx'
import { LAYOUT_SPRING, cardVariants } from './shared.ts'
import './grid.css'

type ActorGridProps = {
  id: string
  actors: ActorWithStats[]
  /** The one Actor shown as the wide spotlight card. */
  spotlightSlug?: string
  suspended: boolean
  onOpen: (slug: string, opener: HTMLElement) => void
}

/**
 * Layout-animated grid. Cards stagger in once the grid is in view; on filter changes
 * leavers blur out (popped out of flow) while the rest glide to their new cells.
 */
export function ActorGrid({ id, actors, spotlightSlug, suspended, onOpen }: ActorGridProps) {
  const ref = useRef<HTMLUListElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -8% 0px' })

  return (
    <motion.ul ref={ref} id={id} className="apis-grid" initial="hidden" animate={inView ? 'show' : 'hidden'}>
      <AnimatePresence mode="popLayout">
        {actors.map((actor, index) => {
          const wide = actor.slug === spotlightSlug
          return (
            <motion.li
              key={actor.slug}
              className={`apis-grid-item${wide ? ' apis-grid-item--wide' : ''}`}
              layout
              custom={index}
              variants={cardVariants}
              exit="exit"
              transition={{ layout: LAYOUT_SPRING }}
            >
              <ActorCard actor={actor} wide={wide} suspended={suspended} onOpen={onOpen} />
            </motion.li>
          )
        })}
      </AnimatePresence>
    </motion.ul>
  )
}
