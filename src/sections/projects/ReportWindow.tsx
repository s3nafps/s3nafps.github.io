import { useRef } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowRight, Lock } from 'lucide-react'
import type { RepoProject } from '../../data/types.ts'
import './visuals.css'

/**
 * ADHealthCheck: the HTML report in a light browser window that drifts with scroll,
 * with a scan line sweeping down it while the card is on screen.
 */
export function ReportWindow({ project }: { project: RepoProject }) {
  const ref = useRef<HTMLElement>(null)
  const active = useInView(ref)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [24, -24])

  if (!project.image) return null

  return (
    <figure ref={ref} className="proj-visual proj-report" data-active={active ? '' : undefined}>
      <motion.div className="proj-report-window" style={reduceMotion ? undefined : { y }}>
        <div className="proj-report-bar" aria-hidden="true">
          <span className="proj-report-dots">
            <i />
            <i />
            <i />
          </span>
          <span className="proj-report-url">
            <Lock size={10} strokeWidth={2.4} />
            <span className="proj-report-url-text">ADHealthCheck · HTML report</span>
          </span>
        </div>
        <div className="proj-report-view">
          <img
            src={project.image}
            alt="ADHealthCheck HTML report: an overall score, counts of failed, warning and passed rules, and findings listed by severity"
            width={1200}
            height={1000}
            loading="lazy"
            decoding="async"
          />
          <span className="proj-report-scan" aria-hidden="true" />
        </div>
      </motion.div>
      <figcaption className="proj-report-badge">
        <span className="proj-report-badge-label">weekly check</span>
        <strong>
          ~3 h <ArrowRight size={13} aria-hidden="true" />
          <span className="sr-only"> down to </span> minutes
        </strong>
      </figcaption>
    </figure>
  )
}
