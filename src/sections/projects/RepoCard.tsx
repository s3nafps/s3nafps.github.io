import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import type { RepoProject } from '../../data/types.ts'
import { repoPath } from './content.ts'
import './repo.css'

type RepoCardProps = {
  project: RepoProject
  /** Two-digit index in the infrastructure list. */
  index: string
  visual: ReactNode
}

/** One infrastructure repo: copy and links beside its own diagram. */
export function RepoCard({ project, index, visual }: RepoCardProps) {
  const titleId = `proj-${project.slug}-title`
  return (
    <article className="proj-repo" aria-labelledby={titleId}>
      <div className="proj-repo-body">
        <p className="proj-repo-kicker">
          <span className="proj-repo-index">{index}</span>
          {repoPath(project.repo)}
        </p>
        <h3 id={titleId} className="proj-repo-title">
          {project.title}
        </h3>
        <p className="proj-repo-tagline">{project.tagline}</p>
        <p className="proj-repo-desc">{project.description}</p>
        <ul className="proj-repo-highlights">
          {project.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
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
    </article>
  )
}
