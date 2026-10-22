import type { ReactNode } from 'react'
import { ArrowUpRight, Check, Github } from 'lucide-react'
import { SpotlightCard } from '../../components/motion/SpotlightCard.tsx'
import type { RepoProject } from '../../data/types.ts'
import { repoPath } from './content.ts'
import './repo.css'

type RepoCardProps = {
  project: RepoProject
  /** The card's animated illustration. */
  visual: ReactNode
  wide?: boolean
}

/** Bento card for an infrastructure repo: copy and links, plus its own animated visual. */
export function RepoCard({ project, visual, wide = false }: RepoCardProps) {
  const titleId = `proj-${project.slug}-title`
  return (
    <SpotlightCard as="article" className={`proj-repo${wide ? ' proj-repo--wide' : ''}`} aria-labelledby={titleId}>
      <div className="proj-repo-body">
        <p className="proj-repo-kicker">
          <Github size={13} aria-hidden="true" /> {repoPath(project.repo)}
        </p>
        <h3 id={titleId} className="proj-repo-title">
          {project.title}
        </h3>
        <p className="proj-repo-tagline">{project.tagline}</p>
        <p className="proj-repo-desc">{project.description}</p>
        <ul className="proj-repo-highlights">
          {project.highlights.map((highlight) => (
            <li key={highlight}>
              <Check size={14} strokeWidth={2.4} aria-hidden="true" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
        <div className="proj-repo-foot">
          <ul className="chip-list" aria-label={`${project.title} stack`}>
            {project.stack.map((item) => (
              <li key={item} className="chip">
                {item}
              </li>
            ))}
          </ul>
          <a className="btn btn-ghost btn-sm proj-repo-link" href={project.repo} target="_blank" rel="noreferrer">
            <span>
              View<span className="sr-only"> {project.title}</span> on GitHub
            </span>
            <ArrowUpRight size={15} className="icon-lift" aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="proj-repo-visual">{visual}</div>
    </SpotlightCard>
  )
}
