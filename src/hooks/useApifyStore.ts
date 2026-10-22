import { useEffect, useMemo, useState } from 'react'
import { actors as curated } from '../data/actors.ts'
import type { ActorWithStats } from '../data/types.ts'
import { fetchStoreActors, mergeActors, summarize, type LiveActor, type StoreSummary } from '../lib/apify.ts'

export type StoreStatus = 'loading' | 'live' | 'offline'

export type ApifyStoreState = {
  status: StoreStatus
  actors: ActorWithStats[]
  summary: StoreSummary
}

/**
 * Curated Actors merged with live stats from the public Apify Store API.
 * Renders immediately with the curated list; `status` moves to `live` when
 * the API answers or `offline` if it fails or times out.
 */
export function useApifyStore(): ApifyStoreState {
  const [live, setLive] = useState<LiveActor[] | null>(null)
  const [status, setStatus] = useState<StoreStatus>('loading')

  useEffect(() => {
    const controller = new AbortController()
    fetchStoreActors({ signal: controller.signal })
      .then((result) => {
        if (controller.signal.aborted) return
        setLive(result)
        setStatus('live')
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus('offline')
      })
    return () => controller.abort()
  }, [])

  return useMemo(() => {
    const actors = mergeActors(curated, live)
    return { status, actors, summary: summarize(actors) }
  }, [live, status])
}
