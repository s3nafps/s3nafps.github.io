import assert from 'node:assert/strict'
import { capabilities, certifications, experience, projects } from './content.ts'

assert.equal(capabilities.length, 4)
assert.deepEqual(
  capabilities.map(({ number }) => number),
  ['01', '02', '03', '04'],
)
assert.deepEqual(
  capabilities.map((capability) => 'image' in capability),
  [false, false, false, false],
)
assert.equal(experience.length, 5)
assert.deepEqual(
  experience.map(({ company }) => company),
  ['AGCE', 'Agrofilm Packaging Algeria', 'Samsung', 'IRIS SATEREX', 'Brandt Algeria'],
)
assert.equal(projects.length, 3)
assert.equal(projects.filter((project) => project.featured).length, 1)
assert.equal(
  projects.find((project) => project.featured)?.href,
  'https://github.com/s3nafps/ForecastFoundry',
)
assert.deepEqual(
  projects.filter((project) => !project.featured).map((project) => project.href),
  [undefined, undefined],
)
assert.deepEqual(
  projects.map((project) => project.number),
  ['P1', 'P2', 'P3'],
)
assert.equal(certifications.length, 1)
assert.equal(certifications[0].issuer, 'Google Cloud')

console.log('CV content check passed')
