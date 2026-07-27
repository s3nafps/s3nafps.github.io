import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const app = readFileSync(new URL('./App.tsx', import.meta.url), 'utf8')
const css = readFileSync(new URL('./index.css', import.meta.url), 'utf8')

const sections = [
  'id="hero"',
  'className="proof-rail"',
  'id="capabilities"',
  'id="experience"',
  'id="approach"',
  'id="contact"',
]

let previousIndex = -1
for (const section of sections) {
  const index = app.indexOf(section)
  assert.ok(index > previousIndex, `${section} must exist in the approved order`)
  previousIndex = index
}

assert.match(app, /Systems built to/)
assert.match(app, /Download CV/)
assert.doesNotMatch(app, /<video|HERO_VIDEO/)
assert.match(css, /--accent-pink:/)
assert.match(css, /\.hero-card::before/)
assert.match(css, /prefers-reduced-motion/)
assert.match(css, /font-family:\s*Inter/)

console.log('Portfolio structure check passed')
