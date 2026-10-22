import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { EASE_OUT } from '../../components/motion/ease.ts'
import { DIAGRAM_STEP, DIAGRAM_TALL, DIAGRAM_WIDE, type DiagramLayout, type DiagramNode } from './content.ts'
import './visuals.css'

/** Seconds between draw-in steps, and the line height of multi-line labels (viewBox units). */
const STEP_S = 0.17
const LINE_H = 14
/** Packets start once the last edge has drawn. */
const FLOW_DELAY = 1.9

type Phase = { show: boolean; instant: boolean }

const timing = (id: string, phase: Phase, duration: number) =>
  phase.instant ? { duration: 0 } : { duration, delay: (DIAGRAM_STEP[id] ?? 0) * STEP_S, ease: EASE_OUT }

function Node({ node, phase }: { node: DiagramNode; phase: Phase }) {
  const cx = node.x + node.w / 2
  const cy = node.y + node.h / 2
  const offset = (node.lines.length - 1) / 2
  return (
    <motion.g
      className={`proj-lz-node${node.tone ? ` is-${node.tone}` : ''}`}
      initial={{ opacity: 0, y: 6 }}
      animate={phase.show ? { opacity: 1, y: 0 } : undefined}
      transition={timing(node.id, phase, 0.6)}
    >
      <rect x={node.x} y={node.y} width={node.w} height={node.h} rx={node.tone === 'pill' ? node.h / 2 : 9} />
      <text textAnchor="middle" dominantBaseline="central">
        {node.lines.map((line, index) => (
          <tspan key={line} x={cx} y={cy + (index - offset) * LINE_H}>
            {line}
          </tspan>
        ))}
      </text>
    </motion.g>
  )
}

/** A dot that travels along a polyline at constant speed, then rests and repeats. */
function Packet({ points, delay }: { points: Array<[number, number]>; delay: number }) {
  const lengths = points.slice(1).map(([x, y], index) => Math.hypot(x - points[index][0], y - points[index][1]))
  const total = lengths.reduce((sum, length) => sum + length, 0)
  let travelled = 0
  const times = [0, ...lengths.map((length) => (travelled += length) / total)]
  const duration = Math.max(0.8, total / 110)
  const loop = { duration, ease: 'linear' as const, repeat: Infinity, repeatDelay: 1.4, delay }

  return (
    <motion.g
      className="proj-lz-packet"
      initial={{ x: points[0][0], y: points[0][1], opacity: 0 }}
      animate={{ x: points.map(([x]) => x), y: points.map(([, y]) => y), opacity: [0, 1, 1, 0] }}
      transition={{ x: { ...loop, times }, y: { ...loop, times }, opacity: { ...loop, times: [0, 0.1, 0.85, 1] } }}
    >
      <circle r="6.5" className="proj-lz-packet-halo" />
      <circle r="2.6" className="proj-lz-packet-core" />
    </motion.g>
  )
}

function Sketch({ layout, phase, flowing, className }: { layout: DiagramLayout; phase: Phase; flowing: boolean; className: string }) {
  const { zone } = layout
  return (
    <svg className={`proj-lz-svg ${className}`} viewBox={`0 0 ${layout.width} ${layout.height}`} aria-hidden="true">
      <motion.g
        className="proj-lz-zone"
        initial={{ opacity: 0 }}
        animate={phase.show ? { opacity: 1 } : undefined}
        transition={timing('zone', phase, 0.8)}
      >
        <rect x={zone.x} y={zone.y} width={zone.w} height={zone.h} rx="14" />
        <text x={zone.labelX} y={zone.labelY}>
          custom VPC
        </text>
      </motion.g>

      {layout.edges.map((edge) =>
        edge.dashed ? (
          // Dashes would be overwritten by pathLength, so the dashed edge fades in instead.
          <motion.path
            key={edge.id}
            d={edge.d}
            className="proj-lz-edge is-dashed"
            initial={{ opacity: 0 }}
            animate={phase.show ? { opacity: 1 } : undefined}
            transition={timing(edge.id, phase, 0.7)}
          />
        ) : (
          <motion.path
            key={edge.id}
            d={edge.d}
            className="proj-lz-edge"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={phase.show ? { pathLength: 1, opacity: 1 } : undefined}
            transition={timing(edge.id, phase, 0.7)}
          />
        ),
      )}

      {flowing
        ? layout.packets.map((points, index) => (
            <Packet key={points.join(' ')} points={points} delay={FLOW_DELAY + index * 0.55} />
          ))
        : null}

      {layout.nodes.map((node) => (
        <Node key={node.id} node={node} phase={phase} />
      ))}
    </svg>
  )
}

/**
 * GCP Landing Zone: an architecture sketch that draws itself in, then carries packets
 * from GitHub Actions through Workload Identity Federation to private GKE.
 * Two layouts of the same graph; a container query picks one for the card width.
 */
export function LandingZoneDiagram() {
  const ref = useRef<HTMLElement>(null)
  const show = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const active = useInView(ref)
  const reduceMotion = useReducedMotion()
  const phase: Phase = { show, instant: Boolean(reduceMotion) }
  const flowing = show && active && !reduceMotion

  return (
    <figure ref={ref} className="proj-visual proj-lz">
      <Sketch layout={DIAGRAM_WIDE} phase={phase} flowing={flowing} className="proj-lz-svg--wide" />
      <Sketch layout={DIAGRAM_TALL} phase={phase} flowing={flowing} className="proj-lz-svg--tall" />
      <figcaption className="sr-only">
        Architecture: GitHub Actions signs in with OIDC through Workload Identity Federation, which grants a plan
        service account and a deploy service account. Both reach private GKE nodes inside a custom VPC, which use
        Cloud KMS and Artifact Registry at project level, outside the VPC.
      </figcaption>
    </figure>
  )
}
