import { motion } from 'motion/react'
import { ArrowRight, Download, Github, Linkedin, MapPin } from 'lucide-react'
import { profile, proofStats, terminalScenes } from '../data/profile.ts'
import type { ApifyStoreState } from '../hooks/useApifyStore.ts'
import { CountUp } from '../components/motion/CountUp.tsx'
import { EASE_OUT } from '../components/motion/ease.ts'
import { SplitText } from '../components/motion/SplitText.tsx'
import { Terminal } from '../components/Terminal.tsx'
import './hero.css'

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: EASE_OUT },
})

export function Hero({ store }: { store: ApifyStoreState }) {
  const actorCount = store.summary.actorCount

  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="container hero-mast">
        <p className="hero-mast-kicker">{profile.role}</p>
        <p className="hero-mast-status">
          <span className="live-dot" />
          {profile.status}
        </p>
      </div>

      <div className="hero-inner container">
        <div className="hero-copy">
          <h1 id="hero-title" className="hero-title">
            <SplitText
              immediate
              delay={0.04}
              parts={[
                { text: 'Mohamed', br: true },
                { text: 'Senator', className: 'hero-name-last' },
              ]}
            />
          </h1>

          <motion.p className="hero-summary" {...fade(0.28)}>
            {profile.summary}
          </motion.p>

          <motion.div className="hero-actions" {...fade(0.38)}>
            <a className="btn btn-primary" href="#projects">
              The work <ArrowRight size={16} className="icon-shift" aria-hidden="true" />
            </a>
            <a className="btn btn-ghost" href={profile.links.cv} download>
              Download CV <Download size={15} aria-hidden="true" />
            </a>
          </motion.div>

          <motion.ul className="hero-meta" {...fade(0.48)}>
            <li>
              <MapPin size={14} aria-hidden="true" /> {profile.location}
            </li>
            <li>
              <a href={profile.links.github} target="_blank" rel="noreferrer">
                <Github size={14} aria-hidden="true" /> github.com/s3nafps
              </a>
            </li>
            <li>
              <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
                <Linkedin size={14} aria-hidden="true" /> linkedin.com/in/mohamedsenator
              </a>
            </li>
            <li>
              <a href={profile.links.apify} target="_blank" rel="noreferrer">
                apify.com/s3nafps
              </a>
            </li>
          </motion.ul>
        </div>

        <motion.div className="hero-visual" {...fade(0.2)}>
          <p className="hero-log-label">
            <span>log</span>
            <span>commands from the repos</span>
          </p>
          <Terminal scenes={terminalScenes} />
        </motion.div>
      </div>

      <dl className="hero-stats container">
        {proofStats.map((stat, index) => {
          const value = stat.label.includes('Apify') ? actorCount : stat.value
          return (
            <motion.div className="hero-stat" key={stat.label} {...fade(0.5 + index * 0.05)}>
              <dd>
                <CountUp className="hero-stat-value" value={value} prefix={stat.prefix} suffix={stat.suffix} margin="0px" />
              </dd>
              <dt className="hero-stat-label">{stat.label}</dt>
            </motion.div>
          )
        })}
      </dl>
    </section>
  )
}
