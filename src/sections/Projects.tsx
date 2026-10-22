import type { ReactNode } from 'react'
import { Reveal, Stagger, StaggerItem } from '../components/motion/Reveal.tsx'
import { SplitText } from '../components/motion/SplitText.tsx'
import { repoProjects, trackr } from '../data/projects.ts'
import type { RepoProject } from '../data/types.ts'
import { LandingZoneDiagram } from './projects/LandingZoneDiagram.tsx'
import { RepoCard } from './projects/RepoCard.tsx'
import { ReportWindow } from './projects/ReportWindow.tsx'
import { ServiceBoard } from './projects/ServiceBoard.tsx'
import { TrackrShowcase } from './projects/TrackrShowcase.tsx'
import './projects.css'

/** The repo that gets the full-width card. */
const WIDE_SLUG = 'adhealthcheck'

/** Each repo's animated visual, by slug. */
function visualFor(project: RepoProject): ReactNode {
  switch (project.slug) {
    case 'adhealthcheck':
      return <ReportWindow project={project} />
    case 'gcp-landing-zone':
      return <LandingZoneDiagram />
    case 'vps-platform':
      return <ServiceBoard />
    default:
      return null
  }
}

/** Numbered divider that opens each half of the section. */
function Chapter({ index, label, meta, className = '' }: { index: string; label: string; meta: string; className?: string }) {
  return (
    <Reveal as="p" className={`proj-chapter ${className}`} y={14} blur={false}>
      <span className="proj-chapter-index">{index}</span>
      <span className="proj-chapter-label">{label}</span>
      <span className="proj-chapter-line" aria-hidden="true" />
      <span className="proj-chapter-meta">{meta}</span>
    </Reveal>
  )
}

export function Projects() {
  return (
    <section id="projects" className="section proj" aria-labelledby="proj-title">
      <div className="proj-glow" aria-hidden="true" />

      <div className="container">
        <div className="section-head section-head--split proj-head">
          <div>
            <Reveal>
              <p className="eyebrow">Projects</p>
            </Reveal>
            <h2 id="proj-title" className="section-title proj-title">
              <SplitText parts={['Shipped in the', { text: 'open.', className: 'serif-accent gradient-text proj-accent' }]} />
            </h2>
          </div>
          <Reveal delay={0.15} className="proj-lead-wrap">
            <p className="section-lead proj-lead">
              An Android app and three infrastructure repos, all public on GitHub: install the APK, or read the code
              behind each one.
            </p>
          </Reveal>
        </div>

        <Chapter index="01" label="Android app" meta={trackr.stack.slice(0, 2).join(' · ')} />
        <TrackrShowcase />

        <Chapter
          className="proj-chapter--repos"
          index="02"
          label="Infrastructure repos"
          meta={`${repoProjects.length} repos on GitHub`}
        />
        <Stagger as="ul" className="proj-repos" stagger={0.12}>
          {repoProjects.map((project) => {
            const wide = project.slug === WIDE_SLUG
            return (
              <StaggerItem as="li" key={project.slug} className={`proj-cell${wide ? ' proj-cell--wide' : ''}`}>
                <RepoCard project={project} wide={wide} visual={visualFor(project)} />
              </StaggerItem>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}
