import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { Reveal } from '../components/motion/Reveal.tsx'
import { SplitText } from '../components/motion/SplitText.tsx'
import { profile } from '../data/profile.ts'
import type { ApifyStoreState } from '../hooks/useApifyStore.ts'
import { useMediaQuery } from '../hooks/useMediaQuery.ts'
import { ActorDialog } from './apis/ActorDialog.tsx'
import { ActorGrid } from './apis/ActorGrid.tsx'
import { CategoryFilter } from './apis/CategoryFilter.tsx'
import { LivePanel } from './apis/LivePanel.tsx'
import { useModalLock } from './apis/modal.ts'
import { SNIPPET_TABS, countByCategory, featuredFirst, riseInView, type CategoryFilter as Filter } from './apis/shared.ts'
import './apis.css'

const GRID_ID = 'apis-grid'
/** On phones the grid starts with this many cards and a "Show all" button. */
const PHONE_PREVIEW = 6

export function Apis({ store }: { store: ApifyStoreState }) {
  const [filter, setFilter] = useState<Filter>('All')
  const [openSlug, setOpenSlug] = useState<string | null>(null)
  const openerRef = useRef<HTMLElement | null>(null)

  const ordered = useMemo(() => featuredFirst(store.actors), [store.actors])
  const options = useMemo(() => countByCategory(store.actors), [store.actors])
  const visible = filter === 'All' ? ordered : ordered.filter((actor) => actor.category === filter)
  const phone = useMediaQuery('(max-width: 640px)')
  const [expanded, setExpanded] = useState(false)
  const clipped = phone && !expanded && visible.length > PHONE_PREVIEW + 1
  const shown = clipped ? visible.slice(0, PHONE_PREVIEW) : visible
  const spotlightSlug = ordered.find((actor) => actor.featured)?.slug
  const selected = openSlug ? (store.actors.find((actor) => actor.slug === openSlug) ?? null) : null
  const hasStats = store.actors.some((actor) => actor.stats)

  useModalLock(selected !== null, openerRef)

  const openActor = useCallback((slug: string, opener: HTMLElement) => {
    openerRef.current = opener
    setOpenSlug(slug)
  }, [])
  const closeActor = useCallback(() => setOpenSlug(null), [])

  // After "Show all", continue keyboard focus at the first newly revealed card.
  const revealFocus = useRef(false)
  useEffect(() => {
    if (!expanded || !revealFocus.current) return
    revealFocus.current = false
    document.querySelectorAll<HTMLElement>(`#${GRID_ID} .apis-card-open`)[PHONE_PREVIEW]?.focus({ preventScroll: true })
  }, [expanded])

  return (
    <section id="apis" className="section apis" aria-labelledby="apis-title">
      <div className="apis-bg" aria-hidden="true" />

      <div className="container">
        <div className="section-head section-head--split apis-head">
          <div>
            <Reveal>
              <p className="eyebrow">APIs on Apify</p>
            </Reveal>
            <h2 id="apis-title" className="section-title apis-title">
              <SplitText
                parts={[
                  'Public web data, as',
                  { text: 'APIs', className: 'gradient-text' },
                  { text: 'anyone', className: 'serif-accent apis-title-serif' },
                  'can call.',
                ]}
              />
            </h2>
          </div>
          <Reveal delay={0.15} className="apis-head-aside">
            <p className="section-lead">
              Each Actor runs in the Apify cloud and bills per result. Call it over REST, from the JavaScript or Python SDK,
              or let an AI agent use it through MCP.
            </p>
            <ul className="chip-list apis-protocols" aria-label="Ways to call an Actor">
              {SNIPPET_TABS.map((tab) => (
                <li key={tab.id} className="chip">
                  {tab.label}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <LivePanel status={store.status} summary={store.summary} hasStats={hasStats} />

        <motion.div className="apis-toolbar" {...riseInView(0.15)}>
          <CategoryFilter options={options} value={filter} onChange={setFilter} controls={GRID_ID} />
          <p className="apis-showing" aria-live="polite">
            Showing {shown.length} of {store.actors.length}
          </p>
        </motion.div>

        <ActorGrid id={GRID_ID} actors={shown} spotlightSlug={spotlightSlug} suspended={selected !== null} onOpen={openActor} />

        {clipped ? (
          <div className="apis-more">
            <button
              type="button"
              className="btn btn-ghost"
              aria-controls={GRID_ID}
              aria-expanded="false"
              onClick={() => {
                revealFocus.current = true
                setExpanded(true)
              }}
            >
              Show all {visible.length} Actors <ChevronDown size={16} aria-hidden="true" />
            </button>
          </div>
        ) : null}

        <motion.div className="apis-cta" {...riseInView(0.05)}>
          <div className="apis-cta-icons" aria-hidden="true">
            {ordered.slice(0, 5).map((actor) => (
              <img key={actor.slug} src={actor.media.icon} alt="" width={40} height={40} loading="lazy" decoding="async" />
            ))}
          </div>
          <div className="apis-cta-copy">
            <p className="apis-cta-title">{store.summary.actorCount} public Actors on the Apify Store</p>
            <p className="apis-cta-sub">New Actors show up on this page automatically, straight from the Store API.</p>
          </div>
          <a className="btn btn-primary apis-cta-btn" href={profile.links.apify} target="_blank" rel="noreferrer">
            Browse all Actors on Apify <ArrowUpRight size={16} className="icon-lift" aria-hidden="true" />
          </a>
        </motion.div>
      </div>

      {createPortal(
        <AnimatePresence>{selected ? <ActorDialog key={selected.slug} actor={selected} onClose={closeActor} /> : null}</AnimatePresence>,
        document.body,
      )}
    </section>
  )
}
