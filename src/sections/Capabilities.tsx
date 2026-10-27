import type { Capability } from '../data/types.ts'
import { capabilities } from '../data/profile.ts'
import { Reveal } from '../components/motion/Reveal.tsx'
import { SplitText } from '../components/motion/SplitText.tsx'
import './capabilities.css'

type Pillar = {
  name: Capability['pillar']
  index: string
  intent: string
}

const PILLARS: Pillar[] = [
  { name: 'Operate', index: '01', intent: 'Keep the infrastructure up, patched, and explainable.' },
  { name: 'Build', index: '02', intent: 'Write the tool so the same job is shorter next week.' },
]

export function Capabilities() {
  return (
    <section id="capabilities" className="section caps" aria-labelledby="caps-title">
      <div className="container">
        <div className="section-head">
          <Reveal>
            <p className="eyebrow">01 — Practice</p>
          </Reveal>
          <h2 id="caps-title" className="section-title">
            <SplitText parts={['Day job, and the tools around it.']} />
          </h2>
          <Reveal delay={0.08}>
            <p className="section-lead">
              Windows, network and security-sensitive infrastructure during the day. Automation, data APIs and an
              Android app around the edges.
            </p>
          </Reveal>
        </div>

        <div className="caps-ledger">
          {PILLARS.map((pillar) => (
            <PillarColumn key={pillar.name} pillar={pillar} />
          ))}
        </div>
      </div>
    </section>
  )
}

function PillarColumn({ pillar }: { pillar: Pillar }) {
  const items = capabilities.filter((capability) => capability.pillar === pillar.name)
  const labelId = `caps-pillar-${pillar.name.toLowerCase()}`

  return (
    <div className="caps-pillar" role="group" aria-labelledby={labelId}>
      <header className="caps-pillar-head">
        <p className="caps-pillar-index">{pillar.index}</p>
        <h3 id={labelId} className="caps-pillar-name">
          {pillar.name}
        </h3>
        <p className="caps-pillar-intent">{pillar.intent}</p>
      </header>
      <ol className="caps-list">
        {items.map((capability, index) => (
          <li key={capability.title}>
            <span className="caps-num" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <h4 className="caps-title">{capability.title}</h4>
              <p className="caps-desc">{capability.description}</p>
              <p className="caps-items">{capability.items.join('  /  ')}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
