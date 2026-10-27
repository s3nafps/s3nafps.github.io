import type { SyntheticEvent } from 'react'
import type { Variants } from 'motion/react'
import { Building2, Podcast, Radar, Radio, Search, Sparkles, type LucideIcon } from 'lucide-react'
import { EASE_OUT } from '../../components/motion/ease.ts'
import { actorCategories } from '../../data/actors.ts'
import type { ActorCategory, ActorWithStats } from '../../data/types.ts'
import type { StoreStatus } from '../../hooks/useApifyStore.ts'
import { APIFY_USERNAME, type Snippets } from '../../lib/apify.ts'

export type CategoryFilter = ActorCategory | 'All'

export const PROFILE_HOST = `apify.com/${APIFY_USERNAME}`
export const ENDPOINT_PATH = `/v2/store?username=${APIFY_USERNAME}`

export const STATUS_COPY: Record<StoreStatus, string> = {
  loading: 'Connecting to api.apify.com…',
  live: 'Live from the Apify Store API',
  offline: 'Offline snapshot',
}

/** `.live-dot` tone per store status (undefined = green). */
export const STATUS_TONE: Record<StoreStatus, 'warn' | 'idle' | undefined> = {
  loading: 'warn',
  live: undefined,
  offline: 'idle',
}

export const SNIPPET_TABS: ReadonlyArray<{ id: keyof Snippets; label: string }> = [
  { id: 'curl', label: 'cURL' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'python', label: 'Python' },
  { id: 'mcp', label: 'MCP' },
]

/** Shared-element id: the card media and the dialog media morph into each other. */
export const mediaLayoutId = (slug: string) => `apis-media-${slug}`

/** Same radius on both ends of the shared-element morph (Motion corrects it while scaling). */
export const MEDIA_RADIUS = 2

const FALLBACK_ICON = '/favicon.svg'

/** `onError` for Actor icons: a broken Store picture falls back to the site icon (once, so it cannot loop). */
export function iconFallback(event: SyntheticEvent<HTMLImageElement>): void {
  const img = event.currentTarget
  if (img.getAttribute('src') !== FALLBACK_ICON) img.src = FALLBACK_ICON
}

/** Featured Actors first, original order otherwise. */
export function featuredFirst(actors: ActorWithStats[]): ActorWithStats[] {
  return [...actors.filter((actor) => actor.featured), ...actors.filter((actor) => !actor.featured)]
}

export function countByCategory(actors: ActorWithStats[]): Array<{ id: CategoryFilter; count: number }> {
  return [
    { id: 'All', count: actors.length },
    ...actorCategories.map((category) => ({
      id: category,
      count: actors.filter((actor) => actor.category === category).length,
    })),
  ]
}

const CATEGORY_ICONS: Record<ActorCategory, LucideIcon> = {
  'AI & RAG': Sparkles,
  'Search & SEO': Search,
  'Intel & security': Radar,
  'Real estate': Building2,
  Media: Radio,
}

/** Icon for the generated cover shown when an Actor has no poster. */
export function coverIcon(actor: ActorWithStats): LucideIcon {
  if (/podcast|rss/i.test(`${actor.title} ${actor.tags.join(' ')}`)) return Podcast
  return CATEGORY_ICONS[actor.category]
}

/** Grid items: rise and sharpen in (staggered by index), blur out when filtered away. */
export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.97, filter: 'blur(8px)' },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.75, ease: EASE_OUT, delay: Math.min(index, 8) * 0.06 },
  }),
  exit: { opacity: 0, scale: 0.94, filter: 'blur(6px)', transition: { duration: 0.25, ease: EASE_OUT } },
}

export const LAYOUT_SPRING = { type: 'spring', stiffness: 320, damping: 32, mass: 0.9 } as const

/** Fade-and-rise once in view, without `filter` (keeps backdrop-filter glass working inside). */
export const riseInView = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -10% 0px' },
  transition: { duration: 0.9, ease: EASE_OUT, delay },
})
