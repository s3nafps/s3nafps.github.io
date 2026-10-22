import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { actorCategories, actors } from './actors.ts'
import { certifications, experience } from './experience.ts'
import { capabilities, profile, proofStats, stackRows, terminalScenes } from './profile.ts'
import { repoProjects, trackr } from './projects.ts'

const publicFile = (path: string) => new URL(`../../public${path}`, import.meta.url)
const assertPublic = (path: string, what: string) =>
  assert.ok(existsSync(publicFile(path)), `${what}: ${path} must exist in public/`)

// Actors
assert.equal(actors.length, 13, 'all 13 public Actors are listed')
assert.equal(new Set(actors.map((a) => a.slug)).size, actors.length, 'Actor slugs are unique')
assert.equal(actors.filter((a) => a.featured).length, 6, 'six featured Actors')
for (const actor of actors) {
  assert.ok(actorCategories.includes(actor.category), `${actor.slug} has a known category`)
  assert.ok(actor.tagline.length > 40 && actor.tagline.length < 180, `${actor.slug} tagline length`)
  assert.ok(actor.priceLabel.length > 0, `${actor.slug} has a price label`)
  assert.ok(Object.keys(actor.exampleInput).length > 0, `${actor.slug} has an example input`)
  assert.deepEqual(JSON.parse(JSON.stringify(actor.exampleInput)), actor.exampleInput, `${actor.slug} input is plain JSON`)
  assertPublic(actor.media.icon, `${actor.slug} icon`)
  for (const key of ['poster', 'preview', 'promo'] as const) {
    const path = actor.media[key]
    if (path) assertPublic(path, `${actor.slug} ${key}`)
  }
}
for (const category of actorCategories) {
  assert.ok(actors.some((a) => a.category === category), `category ${category} is not empty`)
}

// Projects
assert.equal(trackr.repo, 'https://github.com/s3nafps/trackr')
assert.ok(trackr.screenshots.length >= 3)
for (const shot of trackr.screenshots) {
  assertPublic(shot.src, 'Trackr screenshot')
  assert.ok(shot.alt.length > 10, 'screenshots have alt text')
}
assert.deepEqual(
  repoProjects.map((p) => p.repo),
  [
    'https://github.com/s3nafps/ADHealthCheck-PowerShell',
    'https://github.com/s3nafps/gcp-landing-zone',
    'https://github.com/s3nafps/vps-platform',
  ],
)
for (const project of repoProjects) {
  if (project.image) assertPublic(project.image, `${project.slug} image`)
  assert.ok(project.highlights.length >= 3)
}

// Experience and profile
assert.deepEqual(
  experience.map(({ company }) => company),
  ['AGCE', 'Agrofilm Packaging Algeria', 'Samsung', 'IRIS SATEREX', 'Brandt Algeria'],
)
assert.equal(certifications[0].issuer, 'Google Cloud')
assertPublic(profile.links.cv, 'CV')
assert.equal(profile.email, 'mohamed.senator@icloud.com')
assert.equal(proofStats.find((s) => s.label.includes('Apify'))?.value, actors.length, 'Actor count stat matches the list')
assert.equal(capabilities.filter((c) => c.pillar === 'Operate').length, 3)
assert.equal(capabilities.filter((c) => c.pillar === 'Build').length, 3)
assert.equal(stackRows.length, 2)
assert.ok(terminalScenes.length >= 3)

console.log('data check passed')
