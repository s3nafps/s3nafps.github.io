import assert from 'node:assert/strict'
import type { Actor } from '../data/types.ts'
import {
  APIFY_USERNAME,
  STORE_URL,
  actorStoreUrl,
  buildSnippets,
  categoryFor,
  fetchStoreActors,
  mergeActors,
  parseStoreResponse,
  summarize,
  toPythonLiteral,
} from './apify.ts'

const base: Actor = {
  slug: 'ai-ready-webpage-extractor',
  title: 'Website to Markdown Crawler',
  storeTitle: 'Website to Markdown Crawler for LLMs & RAG',
  tagline: 'Any site to Markdown.',
  category: 'AI & RAG',
  tags: ['RAG'],
  priceLabel: '$3 / 1,000 pages',
  featured: true,
  media: { icon: '/previews/actors/ai-ready-webpage-extractor-icon.webp' },
  exampleInput: { urls: ["https://docs.apify.com/it's"], maxPages: 5, render: true, proxy: null },
}
const other: Actor = { ...base, slug: 'doc-to-markdown', title: 'Doc to Markdown', featured: false }

const storeJson = {
  data: {
    total: 2,
    items: [
      {
        name: 'ai-ready-webpage-extractor',
        title: 'Website to Markdown Crawler for LLMs & RAG',
        description: 'desc',
        categories: ['AI'],
        pictureUrl: 'https://images.apifyusercontent.com/x.webp',
        stats: { totalRuns: 871, totalUsers: 8, lastRunStartedAt: '2026-10-21T18:44:34.372Z' },
      },
      {
        name: 'brand-new-actor',
        title: 'Brand New Actor',
        description: 'Fresh from the store.',
        categories: ['DEVELOPER_TOOLS'],
        pictureUrl: 'https://images.apifyusercontent.com/y.webp',
        stats: { totalRuns: 3, totalUsers: 1 },
      },
    ],
  },
}

// constants
assert.equal(APIFY_USERNAME, 's3nafps')
assert.equal(STORE_URL, 'https://api.apify.com/v2/store?username=s3nafps&limit=100')
assert.equal(actorStoreUrl('doc-to-markdown'), 'https://apify.com/s3nafps/doc-to-markdown')

// parseStoreResponse
const live = parseStoreResponse(storeJson)
assert.equal(live.length, 2)
assert.deepEqual(live[0], {
  name: 'ai-ready-webpage-extractor',
  title: 'Website to Markdown Crawler for LLMs & RAG',
  description: 'desc',
  pictureUrl: 'https://images.apifyusercontent.com/x.webp',
  categories: ['AI'],
  runs: 871,
  users: 8,
  lastRunAt: '2026-10-21T18:44:34.372Z',
})
assert.equal(live[1].lastRunAt, undefined)
assert.throws(() => parseStoreResponse({}), /shape/)
assert.throws(() => parseStoreResponse(null), /shape/)
// one malformed item is skipped instead of discarding all live data
assert.deepEqual(
  parseStoreResponse({ data: { items: [{ title: 'no name' }, null, { name: 'ok', title: 'OK' }] } }).map((a) => a.name),
  ['ok'],
)
// non-numeric stats become 0 instead of NaN
assert.equal(parseStoreResponse({ data: { items: [{ name: 'a', title: 'A', stats: { totalRuns: 'x' } }] } })[0].runs, 0)

// mergeActors: overlays stats by slug, keeps static order, appends unknown live Actors
const merged = mergeActors([base, other], live)
assert.deepEqual(
  merged.map((a) => a.slug),
  ['ai-ready-webpage-extractor', 'brand-new-actor'],
  'curated Actors the live Store no longer lists are dropped; new live Actors are appended',
)
assert.deepEqual(merged[0].stats, { runs: 871, users: 8, lastRunAt: '2026-10-21T18:44:34.372Z' })
assert.equal(merged[0].title, 'Website to Markdown Crawler', 'static copy wins over live copy')
assert.equal(merged[1].title, 'Brand New Actor')
assert.equal(merged[1].tagline, 'Fresh from the store.')
assert.equal(merged[1].media.icon, 'https://images.apifyusercontent.com/y.webp')
assert.equal(merged[1].featured, false)
assert.equal(merged[1].category, 'Intel & security', 'DEVELOPER_TOOLS maps to a known category')
// appended Actors with missing fields still get readable fallbacks
const sparse = mergeActors([], parseStoreResponse({ data: { items: [{ name: 'bare', title: 'Bare' }] } }))[0]
assert.equal(sparse.tagline, 'Live on the Apify Store.')
assert.equal(sparse.media.icon, '/favicon.svg')
// an empty live list is treated as no data rather than wiping the page
assert.equal(mergeActors([base, other], []).length, 2)

// categoryFor maps Apify categories onto the page's filter groups
assert.equal(categoryFor(['SEO_TOOLS', 'AI']), 'Search & SEO', 'first known category wins')
assert.equal(categoryFor(['REAL_ESTATE']), 'Real estate')
assert.equal(categoryFor(['VIDEOS']), 'Media')
assert.equal(categoryFor(['SOCIAL_MEDIA']), 'Media')
assert.equal(categoryFor(['LEAD_GENERATION']), 'Intel & security')
assert.equal(categoryFor(['SEO_TOOLS']), 'Search & SEO')
assert.equal(categoryFor([]), 'Intel & security')
assert.deepEqual(merged[1].exampleInput, {})
// no live data: static list unchanged, no stats
assert.deepEqual(mergeActors([base, other], null).map((a) => a.stats), [undefined, undefined])

// summarize
assert.deepEqual(summarize(merged), {
  actorCount: 2,
  totalRuns: 874,
  totalUsers: 9,
  lastRunAt: '2026-10-21T18:44:34.372Z',
})
assert.deepEqual(summarize(mergeActors([base], null)), {
  actorCount: 1,
  totalRuns: 0,
  totalUsers: 0,
  lastRunAt: undefined,
})

// toPythonLiteral
assert.equal(toPythonLiteral({ a: true, b: false, c: null, d: [1, 'x'] }), '{\n    "a": True,\n    "b": False,\n    "c": None,\n    "d": [\n        1,\n        "x"\n    ]\n}')
assert.equal(toPythonLiteral({}), '{}')
assert.equal(toPythonLiteral('true'), '"true"', 'strings that look like keywords stay strings')

// buildSnippets
const snippets = buildSnippets(base.slug, base.exampleInput)
assert.ok(snippets.curl.includes('https://api.apify.com/v2/acts/s3nafps~ai-ready-webpage-extractor/run-sync-get-dataset-items'))
assert.ok(snippets.curl.includes('Authorization: Bearer $APIFY_TOKEN'))
assert.ok(!snippets.curl.includes('?token='), 'token stays out of the URL')
// the JSON body inside single quotes must survive the shell: extract and parse it
const body = snippets.curl.slice(snippets.curl.indexOf("-d '") + 4, snippets.curl.lastIndexOf("'"))
assert.deepEqual(JSON.parse(body.replaceAll("'\\''", "'")), base.exampleInput)
assert.ok(snippets.javascript.includes("client.actor('s3nafps/ai-ready-webpage-extractor').call("))
assert.ok(snippets.javascript.includes('"maxPages": 5'))
assert.ok(snippets.python.includes('client.actor("s3nafps/ai-ready-webpage-extractor").call(run_input='))
assert.ok(snippets.python.includes('"render": True'))
assert.ok(snippets.python.includes('"proxy": None'))
assert.ok(snippets.python.includes('client.dataset(run.default_dataset_id).list_items().items'), 'apify-client 3.x returns a Run model')
assert.ok(!snippets.python.includes('run["defaultDatasetId"]'))
const mcp = JSON.parse(snippets.mcp)
assert.equal(mcp.mcpServers.apify.url, 'https://mcp.apify.com?tools=s3nafps/ai-ready-webpage-extractor')

// fetchStoreActors: success, bad status, invalid JSON shape, cache
{
  const calls: string[] = []
  const store = new Map<string, string>()
  const cache = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
  }
  const okFetch = async (url: string) => {
    calls.push(url)
    return new Response(JSON.stringify(storeJson), { status: 200 })
  }
  const first = await fetchStoreActors({ fetchImpl: okFetch, cache, now: () => 1_000 })
  assert.equal(first.length, 2)
  assert.deepEqual(calls, [STORE_URL])
  // served from cache within 10 minutes
  const second = await fetchStoreActors({ fetchImpl: okFetch, cache, now: () => 1_000 + 9 * 60_000 })
  assert.equal(second.length, 2)
  assert.equal(calls.length, 1)
  // cache expires after 10 minutes
  await fetchStoreActors({ fetchImpl: okFetch, cache, now: () => 1_000 + 11 * 60_000 })
  assert.equal(calls.length, 2)

  const badStatus = async () => new Response('nope', { status: 503 })
  await assert.rejects(fetchStoreActors({ fetchImpl: badStatus, cache: null }), /503/)
  const badShape = async () => new Response('{"data":{}}', { status: 200 })
  await assert.rejects(fetchStoreActors({ fetchImpl: badShape, cache: null }), /shape/)
  // a broken cache entry is ignored, not fatal
  const brokenCache = { getItem: () => '{not json', setItem: () => {} }
  assert.equal((await fetchStoreActors({ fetchImpl: okFetch, cache: brokenCache })).length, 2)
  // a cache that throws (private mode) is ignored, not fatal
  const throwingCache = {
    getItem: () => { throw new Error('denied') },
    setItem: () => { throw new Error('denied') },
  }
  assert.equal((await fetchStoreActors({ fetchImpl: okFetch, cache: throwingCache })).length, 2)
}

console.log('apify lib check passed')
