import assert from 'node:assert/strict'
import { compactNumber, relativeTime } from './format.ts'

assert.equal(compactNumber(0), '0')
assert.equal(compactNumber(999), '999')
assert.equal(compactNumber(1_000), '1K')
assert.equal(compactNumber(1_299), '1.3K')
assert.equal(compactNumber(12_400), '12.4K')
assert.equal(compactNumber(1_250_000), '1.3M')

const now = Date.parse('2026-10-22T12:00:00Z')
assert.equal(relativeTime('2026-10-22T11:59:40Z', now), 'just now')
assert.equal(relativeTime('2026-10-22T11:55:00Z', now), '5 min ago')
assert.equal(relativeTime('2026-10-22T09:00:00Z', now), '3 h ago')
assert.equal(relativeTime('2026-10-20T12:00:00Z', now), '2 days ago')
assert.equal(relativeTime('2026-10-21T11:00:00Z', now), '1 day ago')
assert.equal(relativeTime('not a date', now), '')
assert.equal(relativeTime(undefined, now), '')
// a timestamp slightly in the future (clock skew) reads as just now
assert.equal(relativeTime('2026-10-22T12:00:30Z', now), 'just now')

console.log('format lib check passed')
