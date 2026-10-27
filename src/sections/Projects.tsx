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
      <div className="container">
        <div className="section-head section-head--split proj-head">
          <div>
            <Reveal>
              <p className="eyebrow">03 — Projects</p>
            </Reveal>
            <h2 id="proj-title" className="section-title proj-title">
              <SplitText parts={['Four things, in public.']} />
            </h2>
          </div>
          <Reveal delay={0.1} className="proj-lead-wrap">
            <p className="section-lead proj-lead">
              Trackr for Android, then three infrastructure repos. Install the APK, or read the code.
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
        <Stagger as="ul" className="proj-repos" stagger={0.08}>
          {repoProjects.map((project, index) => (
            <StaggerItem as="li" key={project.slug} className="proj-cell">
              <RepoCard project={project} index={String(index + 1).padStart(2, '0')} visual={visualFor(project)} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
