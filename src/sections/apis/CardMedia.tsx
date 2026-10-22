import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Play, Sparkles } from 'lucide-react'
import type { ActorWithStats } from '../../data/types.ts'
import { useInViewVideo } from '../../hooks/useInViewVideo.ts'
import { ActorCover } from './ActorCover.tsx'
import { MEDIA_RADIUS, mediaLayoutId } from './shared.ts'
import './media.css'

type CardMediaProps = {
  actor: ActorWithStats
  /** Play the muted preview loop (hover/focus, or in view for the spotlight card). */
  active: boolean
}

/**
 * 16:9 poster that cross-fades into the muted preview loop while `active`.
 * The <video> is only mounted the first time it is needed, so idle cards cost one image.
 */
export function CardMedia({ actor, active }: CardMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduceMotion = useReducedMotion()
  const { poster, preview } = actor.media
  const canPreview = Boolean(preview) && !reduceMotion
  const [armed, setArmed] = useState(false)
  const [playing, setPlaying] = useState(false)

  if (active && canPreview && !armed) setArmed(true)
  useInViewVideo(videoRef, active && armed)

  return (
    <motion.div
      className="apis-media"
      layoutId={mediaLayoutId(actor.slug)}
      style={{ borderRadius: MEDIA_RADIUS }}
      data-playing={playing || undefined}
    >
      {poster ? (
        <img src={poster} alt={`Promo still for ${actor.title}`} width={960} height={540} loading="lazy" decoding="async" />
      ) : (
        <ActorCover actor={actor} />
      )}
      {armed && preview ? (
        <video
          ref={videoRef}
          className="apis-media-preview"
          src={preview}
          poster={poster}
          muted
          playsInline
          loop
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      ) : null}
      <span className="apis-media-shade" aria-hidden="true" />
      {actor.featured ? (
        <span className="apis-badge">
          <Sparkles size={12} aria-hidden="true" /> Featured
        </span>
      ) : null}
      {canPreview ? (
        <span className="apis-play" aria-hidden="true">
          {playing ? (
            <span className="apis-bars">
              <i />
              <i />
              <i />
            </span>
          ) : (
            <Play size={13} fill="currentColor" />
          )}
        </span>
      ) : null}
    </motion.div>
  )
}
