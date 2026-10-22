import { useState, type CSSProperties } from 'react'
import { Pause, Play } from 'lucide-react'
import { stackRows } from '../data/profile.ts'
import './stack.css'

/** Loop length per item, so both rows drift at the same slow pace whatever their length. */
const SECONDS_PER_ITEM = 4.4

/** One copy of a row. Each row renders two copies so the CSS loop can wrap seamlessly. */
function StackGroup({ items, clone }: { items: string[]; clone: boolean }) {
  return (
    <div className="stack-group" data-clone={clone || undefined}>
      {items.map((item) => (
        <span key={item} className="stack-item">
          <span className="stack-sep" />
          {item}
        </span>
      ))}
    </div>
  )
}

/** Full-bleed band of tools: two rows drifting in opposite directions, paused on hover or with the toggle. */
export function Stack() {
  const [paused, setPaused] = useState(false)
  return (
    <section id="stack" className="stack" aria-labelledby="stack-title" data-paused={paused || undefined}>
      <div className="stack-head container">
        <h2 id="stack-title" className="eyebrow stack-label">
          Daily stack
        </h2>
        <button
          type="button"
          className="stack-toggle"
          aria-pressed={paused}
          aria-label="Pause the tool marquee"
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
        </button>
      </div>

      {/* The moving rows are decorative copies; this is the list assistive tech reads. */}
      <ul className="sr-only">
        {stackRows.flat().map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div className="stack-rows" aria-hidden="true">
        {stackRows.map((row, index) => (
          <div
            key={row[0]}
            className="stack-row"
            data-direction={index % 2 === 0 ? 'left' : 'right'}
            style={{ '--stack-duration': `${row.length * SECONDS_PER_ITEM}s` } as CSSProperties}
          >
            <StackGroup items={row} clone={false} />
            <StackGroup items={row} clone />
          </div>
        ))}
      </div>
    </section>
  )
}
