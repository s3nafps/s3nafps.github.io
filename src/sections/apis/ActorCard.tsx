import { useRef, useState, type PointerEvent } from 'react'
import { Activity, ArrowUpRight } from 'lucide-react'
import type { ActorWithStats } from '../../data/types.ts'
import { useFinePointer } from '../../hooks/useMediaQuery.ts'
import { compactNumber } from '../../lib/format.ts'
import { CardMedia } from './CardMedia.tsx'
import './card.css'

type ActorCardProps = {
  actor: ActorWithStats
  /** Spotlight layout: spans the grid, media beside the copy, preview plays while in view. */
  wide?: boolean
  /** Pause previews while the dialog covers the grid. */
  suspended?: boolean
  onOpen: (slug: string, opener: HTMLElement) => void
}

/**
 * The title is the card's one button; its ::after stretches over the whole card,
 * so the entire card is clickable without nesting a heading inside a button.
 */
export function ActorCard({ actor, wide = false, suspended = false, onOpen }: ActorCardProps) {
  const ref = useRef<HTMLElement>(null)
  const finePointer = useFinePointer()
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const previewActive = !suspended && (wide || (finePointer && (hovered || focused)))

  // Spotlight border (base.css .spotlight) follows the mouse.
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const node = ref.current
    if (!node || event.pointerType !== 'mouse') return
    const rect = node.getBoundingClientRect()
    node.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    node.style.setProperty('--my', `${event.clientY - rect.top}px`)
    node.style.setProperty('--spot', '1')
  }
  const onPointerEnter = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse') setHovered(true)
  }
  const onPointerLeave = () => {
    setHovered(false)
    ref.current?.style.setProperty('--spot', '0')
  }

  const runs = actor.stats?.runs

  return (
    <article
      ref={ref}
      className={`card spotlight apis-card${wide ? ' apis-card--wide' : ''}`}
      data-featured={actor.featured || undefined}
      onPointerMove={onPointerMove}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <div className="apis-card-inner">
        <CardMedia actor={actor} active={previewActive} />

        <div className="apis-card-body">
          <div className="apis-card-top">
            <img className="apis-card-icon" src={actor.media.icon} alt="" width={40} height={40} loading="lazy" decoding="async" />
            <span className="apis-card-category">{actor.category}</span>
          </div>

          <h3 className="apis-card-title">
            <button
              type="button"
              className="apis-card-open"
              aria-haspopup="dialog"
              onClick={(event) => onOpen(actor.slug, event.currentTarget)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            >
              {actor.title}
              <span className="sr-only">: details and API examples</span>
            </button>
          </h3>
          <p className="apis-card-tagline">{actor.tagline}</p>

          {wide && actor.tags.length > 0 ? (
            <ul className="chip-list apis-card-tags" aria-label="Tags">
              {actor.tags.map((tag) => (
                <li key={tag} className="chip">
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="apis-card-foot">
            <span className="apis-card-price">{actor.priceLabel}</span>
            {runs !== undefined ? (
              <span className="apis-card-runs">
                <Activity size={13} aria-hidden="true" />
                {compactNumber(runs)} {runs === 1 ? 'run' : 'runs'}
              </span>
            ) : null}
            <span className="apis-card-go" aria-hidden="true">
              {wide ? <span className="apis-card-go-label">Details &amp; API</span> : null}
              <span className="apis-card-go-icon">
                <ArrowUpRight size={15} />
              </span>
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
