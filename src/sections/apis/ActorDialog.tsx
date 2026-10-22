import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { motion, useIsPresent, useReducedMotion } from 'motion/react'
import { ArrowUpRight, Sparkles, X } from 'lucide-react'
import { EASE_OUT } from '../../components/motion/ease.ts'
import type { ActorWithStats } from '../../data/types.ts'
import { actorStoreUrl, buildSnippets } from '../../lib/apify.ts'
import { relativeTime } from '../../lib/format.ts'
import { ActorCover } from './ActorCover.tsx'
import { ApiPanel } from './ApiPanel.tsx'
import { trapTab } from './modal.ts'
import { MEDIA_RADIUS, PROFILE_HOST, iconFallback, mediaLayoutId } from './shared.ts'
import './dialog.css'

/** Content blocks rise in after the media has started its flight from the card. */
const appear = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT, delay } },
  exit: { opacity: 0, y: 8, transition: { duration: 0.18 } },
})

/** Autoplay the promo (several MB) only on wider screens without Data Saver. */
function promoAutoplayAllowed(): boolean {
  const { connection } = navigator as Navigator & { connection?: { saveData?: boolean } }
  return window.matchMedia('(min-width: 641px)').matches && !connection?.saveData
}

type ActorDialogProps = {
  actor: ActorWithStats
  onClose: () => void
}

/**
 * Modal with the promo video, pricing, live stats and API examples.
 * The media shares a layoutId with the card, so it expands out of the grid and back.
 * Scroll lock, inert page and focus return are handled by `useModalLock` in the section.
 */
export function ActorDialog({ actor, onClose }: ActorDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const isPresent = useIsPresent()
  const reduceMotion = useReducedMotion()
  const snippets = useMemo(() => buildSnippets(actor.slug, actor.exampleInput), [actor.slug, actor.exampleInput])
  const { poster, promo, icon } = actor.media
  const stats = actor.stats
  // While the media flies in from the card it sits above everything; once it has landed it
  // drops below the sticky bar, and only then does the promo (several MB) start loading.
  const [landed, setLanded] = useState(false)
  const [autoplayAllowed] = useState(promoAutoplayAllowed)

  useEffect(() => {
    panelRef.current?.focus({ preventScroll: true })
    // Fallback for when no layout animation runs (reduced motion).
    const timer = window.setTimeout(() => setLanded(true), 900)
    return () => window.clearTimeout(timer)
  }, [])

  // Escape closes; Tab stays inside. Released as soon as the exit animation starts.
  useEffect(() => {
    if (!isPresent) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      } else {
        trapTab(event, panelRef.current)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isPresent, onClose])

  return (
    <div className="apis-dialog-layer" data-closing={isPresent ? undefined : true}>
      <motion.div
        className="apis-dialog-backdrop"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
      />
      <div
        className="apis-dialog-frame"
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose()
        }}
      >
        <div ref={panelRef} className="apis-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
          <motion.div
            className="apis-dialog-surface"
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
          />

          <motion.header className="apis-dialog-bar" {...appear(0.1)}>
            <img className="apis-dialog-icon" src={icon} alt="" width={28} height={28} decoding="async" onError={iconFallback} />
            <span className="apis-dialog-path">
              {PROFILE_HOST}/<strong>{actor.slug}</strong>
            </span>
            <button type="button" className="apis-dialog-close" onClick={onClose} aria-label="Close">
              <X size={18} aria-hidden="true" />
            </button>
          </motion.header>

          <div className="apis-dialog-main">
            <motion.div
              className="apis-media apis-dialog-media"
              layoutId={mediaLayoutId(actor.slug)}
              style={{ borderRadius: MEDIA_RADIUS }}
              data-flying={landed ? undefined : true}
              onLayoutAnimationComplete={() => setLanded(true)}
            >
              {poster ? (
                <img src={poster} alt={promo ? '' : `Promo still for ${actor.title}`} width={960} height={540} decoding="async" />
              ) : (
                <ActorCover actor={actor} />
              )}
              {promo && landed ? (
                <video
                  src={promo}
                  poster={poster}
                  controls
                  muted
                  playsInline
                  autoPlay={autoplayAllowed && !reduceMotion}
                  preload="metadata"
                  aria-label={`${actor.title} promo video`}
                />
              ) : null}
            </motion.div>

            <motion.div className="apis-dialog-info" {...appear(0.16)}>
              <p className="apis-dialog-kicker">
                <span>{actor.category}</span>
                {actor.featured ? (
                  <span className="apis-dialog-featured">
                    <Sparkles size={12} aria-hidden="true" /> Featured
                  </span>
                ) : null}
              </p>
              <h2 id={titleId} className="apis-dialog-title">
                {actor.storeTitle}
              </h2>
              <p className="apis-dialog-tagline">{actor.tagline}</p>

              <dl className="apis-facts">
                <div className="apis-fact apis-fact--price">
                  <dt>Price</dt>
                  <dd>{actor.priceLabel}</dd>
                </div>
                {stats ? (
                  <>
                    <div className="apis-fact">
                      <dt>Runs</dt>
                      <dd>{stats.runs.toLocaleString('en-US')}</dd>
                    </div>
                    <div className="apis-fact">
                      <dt>Last run</dt>
                      <dd>{relativeTime(stats.lastRunAt) || '—'}</dd>
                    </div>
                  </>
                ) : null}
              </dl>

              {actor.tags.length > 0 ? (
                <ul className="chip-list" aria-label="Tags">
                  {actor.tags.map((tag) => (
                    <li key={tag} className="chip">
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : null}

              <a className="btn btn-primary apis-dialog-cta" href={actorStoreUrl(actor.slug)} target="_blank" rel="noreferrer">
                Open in Apify Store <ArrowUpRight size={16} className="icon-lift" aria-hidden="true" />
              </a>
            </motion.div>
          </div>

          <motion.div className="apis-dialog-api" {...appear(0.24)}>
            <ApiPanel snippets={snippets} slug={actor.slug} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
