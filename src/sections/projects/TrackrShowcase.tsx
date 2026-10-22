import { motion } from 'motion/react'
import { Check, Download, Github, Sparkles } from 'lucide-react'
import { Magnetic } from '../../components/motion/Magnetic.tsx'
import { Stagger, StaggerItem } from '../../components/motion/Reveal.tsx'
import { EASE_OUT } from '../../components/motion/ease.ts'
import { trackr } from '../../data/projects.ts'
import { FEATURE_ICONS, repoPath } from './content.ts'
import { PhoneFan } from './PhoneFan.tsx'
import { TrackrIcon } from './TrackrIcon.tsx'
import './trackr.css'

/** Trackr feature panel: copy and actions beside three fanned phones, features underneath. */
export function TrackrShowcase() {
  return (
    <motion.article
      className="proj-trackr"
      aria-labelledby="proj-trackr-title"
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 1, ease: EASE_OUT }}
    >
      <div className="proj-trackr-bg" aria-hidden="true" />

      <div className="proj-trackr-main">
        <Stagger className="proj-trackr-copy" stagger={0.08} delay={0.1}>
          <StaggerItem className="proj-trackr-brand">
            <span className="proj-trackr-icon">
              <TrackrIcon />
            </span>
            <span className="proj-trackr-id">
              <span className="proj-trackr-name">{trackr.title}</span>
              <span className="proj-trackr-repo">
                <Github size={12} aria-hidden="true" /> {repoPath(trackr.repo)}
              </span>
            </span>
          </StaggerItem>

          <StaggerItem>
            <h3 id="proj-trackr-title" className="proj-trackr-tagline">
              <span className="sr-only">{trackr.title}: </span>
              {trackr.tagline}
            </h3>
          </StaggerItem>

          <StaggerItem>
            <p className="proj-trackr-desc">{trackr.description}</p>
          </StaggerItem>

          <StaggerItem>
            <ul className="proj-trackr-highlights">
              {trackr.highlights.map((highlight) => (
                <li key={highlight}>
                  <span className="proj-trackr-check" aria-hidden="true">
                    <Check size={11} strokeWidth={3} />
                  </span>
                  {highlight}
                </li>
              ))}
            </ul>
          </StaggerItem>

          <StaggerItem>
            <ul className="chip-list proj-trackr-stack" aria-label="Built with">
              {trackr.stack.map((item) => (
                <li key={item} className="chip">
                  {item}
                </li>
              ))}
            </ul>
          </StaggerItem>

          <StaggerItem className="proj-trackr-actions">
            <Magnetic>
              <a className="btn btn-primary" href={trackr.release} target="_blank" rel="noreferrer">
                <Download size={16} aria-hidden="true" />
                <span>
                  Download APK<span className="sr-only"> from GitHub releases</span>
                </span>
              </a>
            </Magnetic>
            <Magnetic>
              <a className="btn btn-ghost" href={trackr.repo} target="_blank" rel="noreferrer">
                <Github size={16} aria-hidden="true" />
                <span>
                  View source<span className="sr-only"> of Trackr on GitHub</span>
                </span>
              </a>
            </Magnetic>
          </StaggerItem>
        </Stagger>

        <PhoneFan shots={trackr.screenshots} />
      </div>

      <Stagger as="ul" className="proj-features" stagger={0.07}>
        {trackr.features.map((feature) => {
          const Icon = FEATURE_ICONS[feature.title] ?? Sparkles
          return (
            <StaggerItem as="li" key={feature.title} className="proj-feature">
              <span className="proj-feature-icon" aria-hidden="true">
                <Icon size={16} strokeWidth={1.8} />
              </span>
              <h4 className="proj-feature-title">{feature.title}</h4>
              <p className="proj-feature-copy">{feature.copy}</p>
            </StaggerItem>
          )
        })}
      </Stagger>
    </motion.article>
  )
}
