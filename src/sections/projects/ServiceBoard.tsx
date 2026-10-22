import { useRef, type CSSProperties } from 'react'
import { useInView } from 'motion/react'
import { VPS_EDGE, VPS_SERVICES } from './content.ts'
import './visuals.css'

/** Columns of the service grid on a wide card; the wave runs diagonally across it. */
const COLUMNS = 3

type ServiceProps = {
  service: { name: string; role: string }
  /** Position in the wave (0 = first to light up). */
  step: number
  edge?: boolean
}

function Service({ service, step, edge = false }: ServiceProps) {
  const Tag = edge ? 'div' : 'li'
  return (
    <Tag className={`proj-svc${edge ? ' proj-svc--edge' : ''}`} style={{ '--step': step } as CSSProperties}>
      <span className="proj-svc-dot" />
      <span className="proj-svc-name">{service.name}</span>
      <span className="proj-svc-role">{service.role}</span>
    </Tag>
  )
}

/**
 * VPS Platform: an illustrative service board. Only caddy faces the internet on 80/443;
 * the rest run behind it. Dots boot one by one, then a health wave ripples across.
 */
export function ServiceBoard() {
  const ref = useRef<HTMLElement>(null)
  const booted = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const active = useInView(ref)
  const total = VPS_SERVICES.length + 1

  return (
    <figure
      ref={ref}
      className="proj-visual proj-board"
      data-booted={booted ? '' : undefined}
      data-active={active ? '' : undefined}
    >
      <div className="proj-board-ui" aria-hidden="true">
        <div className="proj-board-head">
          <span className="proj-board-title">
            <span className="proj-board-glyph" /> docker compose
          </span>
          <span className="proj-board-count">{total} services</span>
        </div>

        <div className="proj-board-edge">
          <span className="proj-board-ports">
            <span>:80</span>
            <span>:443</span>
          </span>
          <span className="proj-board-wire" />
          <Service service={VPS_EDGE} step={0} edge />
        </div>

        <p className="proj-board-zone">
          <span>internal</span>
        </p>

        <ul className="proj-board-grid">
          {VPS_SERVICES.map((service, index) => (
            <Service
              key={service.name}
              service={service}
              step={1 + Math.floor(index / COLUMNS) + (index % COLUMNS)}
            />
          ))}
        </ul>
      </div>
      <figcaption className="sr-only">
        Illustration of the {total} services: {VPS_EDGE.name} is the only one published, on ports 80 and 443, in front
        of {VPS_SERVICES.map((service) => service.name).join(', ')}.
      </figcaption>
    </figure>
  )
}
