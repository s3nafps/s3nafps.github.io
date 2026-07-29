import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const app = readFileSync(new URL('./App.tsx', import.meta.url), 'utf8')
const css = readFileSync(new URL('./index.css', import.meta.url), 'utf8')
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')

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

assert.match(app, /Reliable systems\./)
assert.match(app, /Download CV/)
assert.doesNotMatch(app, /<video|HERO_VIDEO/)
assert.match(app, /mohamed-senator-portrait\.webp/)
assert.match(app, /portfolio-theme/)
assert.match(app, /aria-label=.*dark theme/)
assert.doesNotMatch(app, /capability-image/)
assert.match(html, /<title>Mohamed Senator<\/title>/)
assert.match(css, /@astryxdesign\/core\/reset\.css/)
assert.match(css, /@astryxdesign\/theme-neutral\/theme\.css/)
assert.match(css, /:root\s*{/)
assert.match(css, /\[data-theme=['"]dark['"]\]/)
assert.doesNotMatch(css, /--accent-pink:/)
assert.match(css, /prefers-reduced-motion/)
assert.match(css, /font-family:\s*Inter/)

for (const image of [
  'windows-infrastructure.webp',
  'powershell-automation.webp',
  'networking-security.webp',
  'cloud-virtualization.webp',
]) {
  assert.equal(
    existsSync(new URL(`../public/images/${image}`, import.meta.url)),
    false,
    `${image} must be removed`,
  )
}

console.log('Portfolio structure check passed')
