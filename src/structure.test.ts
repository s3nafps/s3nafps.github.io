import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('../', import.meta.url)
const read = (path: string) => readFileSync(new URL(path, root), 'utf8')
const exists = (path: string) => existsSync(new URL(path, root))

// Page structure: sections render in the approved order
const app = read('src/App.tsx')
const order = ['<Hero ', '<Stack ', '<Capabilities ', '<Apis ', '<Projects ', '<Experience ', '<Contact ']
let previous = -1
for (const tag of order) {
  const index = app.indexOf(tag)
  assert.ok(index > previous, `${tag.trim()} must render after the previous section`)
  previous = index
}
assert.match(app, /<MotionConfig reducedMotion="user">/, 'motion respects reduced-motion preferences')
assert.match(app, /className="skip-link" href="#main"/)
assert.ok(app.indexOf('<Footer />') > app.indexOf('</main>'), 'footer is a contentinfo landmark after <main>')

const sectionIds: Array<[string, string]> = [
  ['src/sections/Hero.tsx', 'top'],
  ['src/sections/Capabilities.tsx', 'capabilities'],
  ['src/sections/Apis.tsx', 'apis'],
  ['src/sections/Projects.tsx', 'projects'],
  ['src/sections/Experience.tsx', 'experience'],
  ['src/sections/Contact.tsx', 'contact'],
]
for (const [file, id] of sectionIds) {
  assert.match(read(file), new RegExp(`id="${id}"`), `${file} renders #${id}`)
}
const nav = read('src/components/Nav.tsx')
for (const id of ['capabilities', 'apis', 'projects', 'experience', 'contact']) {
  assert.match(nav, new RegExp(`id: '${id}'`), `nav links to #${id}`)
}

// Source hygiene across every TS/TSX file
function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
}
const sources = walk(new URL('src', root).pathname).filter((f) => /\.(tsx?|css)$/.test(f) && !f.endsWith('.test.ts'))
for (const file of sources) {
  const text = readFileSync(file, 'utf8')
  assert.doesNotMatch(text, /dangerouslySetInnerHTML/, `${file} must not inject HTML`)
  assert.doesNotMatch(text, /@astryxdesign|tailwind/i, `${file} must not use the removed Astryx/Tailwind setup`)
  let at = text.indexOf('target="_blank"')
  while (at !== -1) {
    const window = text.slice(Math.max(0, at - 240), at + 240)
    assert.match(window, /rel="(noopener )?noreferrer"/, `${file}: external links need rel="noreferrer"`)
    at = text.indexOf('target="_blank"', at + 1)
  }
}
assert.match(read('src/styles/base.css'), /prefers-reduced-motion: reduce/)
assert.match(read('src/styles/tokens.css'), /\[data-theme='light'\]/)

// Dependencies
const pkg = JSON.parse(read('package.json')) as { dependencies: Record<string, string>; devDependencies: Record<string, string> }
const deps = { ...pkg.dependencies, ...pkg.devDependencies }
for (const removed of ['@astryxdesign/core', '@astryxdesign/theme-neutral', 'tailwindcss', 'postcss', 'autoprefixer']) {
  assert.equal(deps[removed], undefined, `${removed} must stay removed`)
}
assert.match(pkg.dependencies.motion, /^\d+\.\d+\.\d+$/, 'motion is pinned to an exact version')
assert.ok(!exists('tailwind.config.js') && !exists('postcss.config.js'))

// index.html metadata
const html = read('index.html')
const meta: Array<[string, RegExp]> = [
  ['title', /<title>Mohamed Senator<\/title>/],
  ['description', /name="description"/],
  ['theme-color', /name="theme-color"/],
  ['dark default', /<html lang="en" data-theme="dark">/],
  ['saved theme', /portfolio-theme/],
  ['og:title', /og:title/],
  ['og:image', /og:image" content="https:\/\/s3nafps\.github\.io\/og\.png"/],
  ['twitter card', /twitter:card/],
  ['canonical', /rel="canonical"/],
  ['JSON-LD Person', /"@type":\s*"Person"/],
  ['Apify profile', /https:\/\/apify\.com\/s3nafps/],
  ['noscript', /<noscript>/],
]
for (const [name, pattern] of meta) assert.match(html, pattern, `${name} must exist in index.html`)

// Public files
for (const file of ['robots.txt', 'sitemap.xml', 'og.png', 'favicon.svg', 'Mohamed_Senator_Master_CV.pdf']) {
  assert.ok(exists(`public/${file}`), `public/${file} must exist`)
}
// Apify Store READMEs link to these files: they must never move.
const mediaDirs = readdirSync(new URL('public/media', root))
assert.equal(mediaDirs.length, 12, 'twelve Actor media folders')
for (const dir of mediaDirs) {
  for (const file of ['promo.mp4', 'promo.gif', 'promo-thumbnail.png']) {
    assert.ok(exists(`public/media/${dir}/${file}`), `public/media/${dir}/${file} is linked from Apify and must stay`)
  }
}

console.log('structure check passed')
