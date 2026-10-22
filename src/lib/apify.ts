import type { Actor, ActorCategory, ActorWithStats } from '../data/types.ts'

export const APIFY_USERNAME = 's3nafps'
export const APIFY_PROFILE_URL = `https://apify.com/${APIFY_USERNAME}`
export const STORE_URL = `https://api.apify.com/v2/store?username=${APIFY_USERNAME}&limit=100`

const CACHE_KEY = 'apify-store-v1'
const CACHE_TTL_MS = 10 * 60_000
const TIMEOUT_MS = 6_000

/** One Actor as returned by the public Apify Store API, reduced to what the page uses. */
export type LiveActor = {
  name: string
  title: string
  description: string
  pictureUrl?: string
  categories: string[]
  runs: number
  users: number
  lastRunAt?: string
}

export type StoreSummary = {
  actorCount: number
  totalRuns: number
  totalUsers: number
  lastRunAt?: string
}

type CacheLike = {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

type FetchLike = (url: string, init?: RequestInit) => Promise<Response>

export function actorStoreUrl(slug: string): string {
  return `${APIFY_PROFILE_URL}/${slug}`
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function toCount(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

/** Validates the `GET /v2/store` response and maps it to `LiveActor`s. Throws on an unexpected shape. */
export function parseStoreResponse(json: unknown): LiveActor[] {
  const items = isRecord(json) && isRecord(json.data) ? json.data.items : undefined
  if (!Array.isArray(items)) throw new Error('Unexpected Apify store response shape')

  return items.map((item) => {
    if (!isRecord(item) || typeof item.name !== 'string' || typeof item.title !== 'string') {
      throw new Error('Unexpected Apify store item shape')
    }
    const stats = isRecord(item.stats) ? item.stats : {}
    return {
      name: item.name,
      title: item.title,
      description: typeof item.description === 'string' ? item.description : '',
      pictureUrl: typeof item.pictureUrl === 'string' ? item.pictureUrl : undefined,
      categories: Array.isArray(item.categories) ? item.categories.filter((c): c is string => typeof c === 'string') : [],
      runs: toCount(stats.totalRuns),
      users: toCount(stats.totalUsers),
      lastRunAt: typeof stats.lastRunStartedAt === 'string' ? stats.lastRunStartedAt : undefined,
    }
  })
}

const CATEGORY_MAP: Record<string, ActorCategory> = {
  AI: 'AI & RAG',
  SEO_TOOLS: 'Search & SEO',
  REAL_ESTATE: 'Real estate',
  VIDEOS: 'Media',
  SOCIAL_MEDIA: 'Media',
  NEWS: 'Media',
  LEAD_GENERATION: 'Intel & security',
  AUTOMATION: 'Intel & security',
}

/** Maps Apify Store categories onto the page's filter groups (first known one wins). */
export function categoryFor(categories: string[]): ActorCategory {
  for (const category of categories) {
    const mapped = CATEGORY_MAP[category]
    if (mapped) return mapped
  }
  return 'Intel & security'
}

/**
 * Overlays live stats on the curated list (matched by slug) and appends any
 * Actor that is live in the store but not curated yet, so new Actors show up
 * without a code change. Curated copy always wins over live copy.
 */
export function mergeActors(curated: Actor[], live: LiveActor[] | null): ActorWithStats[] {
  if (!live) return curated.map((actor) => ({ ...actor }))

  const bySlug = new Map(live.map((actor) => [actor.name, actor]))
  const merged: ActorWithStats[] = curated.map((actor) => {
    const match = bySlug.get(actor.slug)
    if (!match) return { ...actor }
    bySlug.delete(actor.slug)
    return { ...actor, stats: { runs: match.runs, users: match.users, lastRunAt: match.lastRunAt } }
  })

  for (const extra of bySlug.values()) {
    merged.push({
      slug: extra.name,
      title: extra.title,
      storeTitle: extra.title,
      tagline: extra.description,
      category: categoryFor(extra.categories),
      tags: [],
      priceLabel: 'See Apify Store',
      featured: false,
      media: { icon: extra.pictureUrl ?? '/favicon.svg' },
      exampleInput: {},
      stats: { runs: extra.runs, users: extra.users, lastRunAt: extra.lastRunAt },
    })
  }
  return merged
}

export function summarize(actors: ActorWithStats[]): StoreSummary {
  let totalRuns = 0
  let totalUsers = 0
  let lastRunAt: string | undefined
  for (const actor of actors) {
    if (!actor.stats) continue
    totalRuns += actor.stats.runs
    totalUsers += actor.stats.users
    const candidate = actor.stats.lastRunAt
    if (candidate && (!lastRunAt || Date.parse(candidate) > Date.parse(lastRunAt))) lastRunAt = candidate
  }
  return { actorCount: actors.length, totalRuns, totalUsers, lastRunAt }
}

function readCache(cache: CacheLike | null, now: number): LiveActor[] | null {
  if (!cache) return null
  try {
    const raw = cache.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!isRecord(parsed) || typeof parsed.savedAt !== 'number' || !Array.isArray(parsed.actors)) return null
    if (now - parsed.savedAt > CACHE_TTL_MS) return null
    return parsed.actors as LiveActor[]
  } catch {
    return null
  }
}

function writeCache(cache: CacheLike | null, actors: LiveActor[], now: number): void {
  if (!cache) return
  try {
    cache.setItem(CACHE_KEY, JSON.stringify({ savedAt: now, actors }))
  } catch {
    // Storage can be full or blocked; the data is still returned.
  }
}

function defaultCache(): CacheLike | null {
  try {
    return typeof sessionStorage === 'undefined' ? null : sessionStorage
  } catch {
    return null
  }
}

/** Fetches the public store listing (no token needed). Cached for 10 minutes, 6 s timeout. */
export async function fetchStoreActors(options: {
  fetchImpl?: FetchLike
  cache?: CacheLike | null
  signal?: AbortSignal
  now?: () => number
} = {}): Promise<LiveActor[]> {
  const fetchImpl = options.fetchImpl ?? ((url, init) => fetch(url, init))
  const cache = options.cache === undefined ? defaultCache() : options.cache
  const now = options.now ?? Date.now

  const cached = readCache(cache, now())
  if (cached) return cached

  const timeout = new AbortController()
  const timer = setTimeout(() => timeout.abort(), TIMEOUT_MS)
  const onAbort = () => timeout.abort()
  options.signal?.addEventListener('abort', onAbort)
  try {
    const response = await fetchImpl(STORE_URL, { signal: timeout.signal, headers: { Accept: 'application/json' } })
    if (!response.ok) throw new Error(`Apify store request failed with ${response.status}`)
    const actors = parseStoreResponse(await response.json())
    writeCache(cache, actors, now())
    return actors
  } finally {
    clearTimeout(timer)
    options.signal?.removeEventListener('abort', onAbort)
  }
}

/** JSON -> Python literal (True/False/None), 4-space indent like `json.dumps(indent=4)`. */
export function toPythonLiteral(value: unknown, depth = 0): string {
  const pad = '    '.repeat(depth + 1)
  const end = '    '.repeat(depth)
  if (value === null || value === undefined) return 'None'
  if (value === true) return 'True'
  if (value === false) return 'False'
  if (typeof value === 'number' || typeof value === 'string') return JSON.stringify(value)
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    return `[\n${value.map((item) => pad + toPythonLiteral(item, depth + 1)).join(',\n')}\n${end}]`
  }
  if (isRecord(value)) {
    const entries = Object.entries(value)
    if (entries.length === 0) return '{}'
    return `{\n${entries.map(([key, item]) => `${pad}${JSON.stringify(key)}: ${toPythonLiteral(item, depth + 1)}`).join(',\n')}\n${end}}`
  }
  return JSON.stringify(String(value))
}

function indentLines(text: string, prefix: string): string {
  return text.split('\n').map((line, index) => (index === 0 ? line : prefix + line)).join('\n')
}

export type Snippets = { curl: string; javascript: string; python: string; mcp: string }

/** Copy-paste examples for calling an Actor as an API. */
export function buildSnippets(slug: string, input: Record<string, unknown>): Snippets {
  const id = `${APIFY_USERNAME}/${slug}`
  const json = JSON.stringify(input, null, 2)
  const shellJson = json.replaceAll("'", "'\\''")

  const curl = [
    `curl -X POST "https://api.apify.com/v2/acts/${APIFY_USERNAME}~${slug}/run-sync-get-dataset-items" \\`,
    '  -H "Authorization: Bearer $APIFY_TOKEN" \\',
    '  -H "Content-Type: application/json" \\',
    `  -d '${shellJson}'`,
  ].join('\n')

  const javascript = [
    "import { ApifyClient } from 'apify-client'",
    '',
    'const client = new ApifyClient({ token: process.env.APIFY_TOKEN })',
    `const run = await client.actor('${id}').call(${indentLines(json, '')})`,
    'const { items } = await client.dataset(run.defaultDatasetId).listItems()',
    'console.log(items)',
  ].join('\n')

  const python = [
    'import os',
    'from apify_client import ApifyClient',
    '',
    'client = ApifyClient(os.environ["APIFY_TOKEN"])',
    `run = client.actor("${id}").call(run_input=${toPythonLiteral(input)})`,
    'items = client.dataset(run["defaultDatasetId"]).list_items().items',
    'print(items)',
  ].join('\n')

  const mcp = JSON.stringify({ mcpServers: { apify: { url: `https://mcp.apify.com?tools=${id}` } } }, null, 2)

  return { curl, javascript, python, mcp }
}
