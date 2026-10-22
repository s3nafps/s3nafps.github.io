// Renders scripts/og-card.html to public/og.png (1200x630) with Playwright.
// Usage: node scripts/make-og.mjs   (needs the `playwright` package; a global install works via NODE_PATH)
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const { chromium } = createRequire(import.meta.url)('playwright')

const card = new URL('./og-card.html', import.meta.url)
const out = fileURLToPath(new URL('../public/og.png', import.meta.url))

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
await page.goto(card.href, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.screenshot({ path: out })
await browser.close()
console.log(`wrote ${out}`)
