import { motion } from 'motion/react'
import { Check, Cloud, Layers, Server, ShieldCheck, Smartphone, Webhook, Workflow, type LucideIcon } from 'lucide-react'
import { capabilities } from '../data/profile.ts'
import type { Capability } from '../data/types.ts'
import { Reveal, Stagger, StaggerItem } from '../components/motion/Reveal.tsx'
import { SplitText } from '../components/motion/SplitText.tsx'
import { SpotlightCard } from '../components/motion/SpotlightCard.tsx'
import { EASE_OUT } from '../components/motion/ease.ts'
import './capabilities.css'

type Pillar = {
  name: Capability['pillar']
  index: string
  intent: string
  delay: number
}

/** Connective copy for the two pillars; the cards themselves come from profile.ts. */
const PILLARS: Pillar[] = [
  { name: 'Operate', index: '01', intent: 'Keep enterprise infrastructure available, secure and supportable.', delay: 0 },
  { name: 'Build', index: '02', intent: 'Turn the recurring work around it into tools, data APIs and apps.', delay: 0.18 },
]

const ICONS: Record<string, LucideIcon> = {
  'Windows infrastructure': Server,
  'Networking & security': ShieldCheck,
  'Cloud & virtualization': Cloud,
  Automation: Workflow,
  'Data APIs': Webhook,
  Apps: Smartphone,
}

/** Keeps hyphenated names such as "Hyper-V" from breaking across lines. */
function keepHyphenated(text: string) {
  return text.split(/(\S*-\S*)/).map((part, index) =>
    part.includes('-') ? (
      <span key={index} className="caps-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  )
}

function CapabilityCard({ capability, wide }: { capability: Capability; wide: boolean }) {
  const Icon = ICONS[capability.title] ?? Layers
  return (
    <SpotlightCard className={`caps-card${wide ? ' caps-card--wide' : ''}`}>
      {wide ? <span className="caps-card-deco" aria-hidden="true" /> : null}
      <div className="caps-card-top">
        <span className="caps-icon">
          <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
        </span>
        <span className="chip caps-chip">{capability.pillar}</span>
      </div>
      <div className="caps-card-body">
        <h3 className="caps-card-title">{capability.title}</h3>
        <p className="caps-card-desc">{capability.description}</p>
      </div>
      <ul className="caps-items">
        {capability.items.map((item) => (
          <li key={item}>
            <span className="caps-check" aria-hidden="true">
              <Check size={11} strokeWidth={3} />
            </span>
            <span>{keepHyphenated(item)}</span>
          </li>
        ))}
      </ul>
    </SpotlightCard>
  )
}

function PillarColumn({ pillar }: { pillar: Pillar }) {
  const items = capabilities.filter((capability) => capability.pillar === pillar.name)
  const key = pillar.name.toLowerCase()
  const labelId = `caps-pillar-${key}`

  return (
    <div className="caps-pillar" data-pillar={key} role="group" aria-labelledby={labelId}>
      <Reveal className="caps-pillar-head" delay={pillar.delay} blur={false} y={18}>
        <div className="caps-pillar-top" aria-hidden="true">
          <span className="caps-node">{pillar.index}</span>
          <span className="caps-pillar-line" />
        </div>
        <p className="caps-pillar-name" id={labelId}>
          {pillar.name}
        </p>
        <p className="caps-pillar-intent">{pillar.intent}</p>
      </Reveal>

      <Stagger as="ul" className="caps-cards" delay={pillar.delay + 0.1} stagger={0.1}>
        {items.map((capability, index) => (
          <StaggerItem as="li" key={capability.title} className={`caps-cell${index === 0 ? ' caps-cell--wide' : ''}`}>
            <CapabilityCard capability={capability} wide={index === 0} />
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  )
}

export function Capabilities() {
  return (
    <section id="capabilities" className="section caps" aria-labelledby="caps-title">
      <div className="caps-glow" aria-hidden="true" />
      <div className="container">
        <div className="section-head section-head--split caps-head">
          <div>
            <Reveal>
              <p className="eyebrow">Capabilities</p>
            </Reveal>
            <h2 id="caps-title" className="section-title caps-title">
              <SplitText
                parts={[
                  { text: 'Operate the systems.', br: true },
                  'Build the',
                  { text: 'tools.', className: 'serif-accent gradient-text caps-accent' },
                ]}
              />
            </h2>
          </div>
          <Reveal delay={0.15} className="caps-lead-wrap">
            <p className="section-lead caps-lead">
              Two halves of one practice: supporting Windows, network and security-sensitive infrastructure, and
              building the automation, data APIs and apps around it.
            </p>
          </Reveal>
        </div>

        <div className="caps-board">
          {/* Signature detail: a rail that draws from Operate to Build, with a signal pulse travelling along it. */}
          <motion.div
            className="caps-rail"
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '0px 0px -12% 0px' }}
            transition={{ duration: 1.6, delay: 0.2, ease: EASE_OUT }}
          >
            <span className="caps-rail-pulse" />
          </motion.div>

          {PILLARS.map((pillar) => (
            <PillarColumn key={pillar.name} pillar={pillar} />
          ))}
        </div>
      </div>
    </section>
  )
}
