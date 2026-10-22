import type { ActorWithStats } from '../../data/types.ts'
import { PROFILE_HOST, coverIcon } from './shared.ts'
import './media.css'

/** Generated poster for Actors without one: glow, big icon, title. Matches the dark promo stills. */
export function ActorCover({ actor }: { actor: ActorWithStats }) {
  const Icon = coverIcon(actor)
  return (
    <div className="apis-cover" aria-hidden="true">
      <span className="apis-cover-grid" />
      <span className="apis-cover-icon">
        <Icon strokeWidth={1.4} />
      </span>
      <span className="apis-cover-title">{actor.title}</span>
      <span className="apis-cover-meta">
        <i /> {PROFILE_HOST}
      </span>
    </div>
  )
}
