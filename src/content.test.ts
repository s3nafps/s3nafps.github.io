import assert from 'node:assert/strict'
import { capabilities, experience } from './content.ts'

assert.equal(capabilities.length, 4)
assert.deepEqual(
  capabilities.map(({ number }) => number),
  ['01', '02', '03', '04'],
)
assert.deepEqual(
  capabilities.map(({ image }) => image),
  [
    '/images/windows-infrastructure.webp',
    '/images/powershell-automation.webp',
    '/images/networking-security.webp',
    '/images/cloud-virtualization.webp',
  ],
)
assert.equal(experience.length, 5)
assert.deepEqual(
  experience.map(({ company }) => company),
  ['AGCE', 'Agrofilm Packaging Algeria', 'Samsung', 'IRIS SATEREX', 'Brandt Algeria'],
)

console.log('CV content check passed')
