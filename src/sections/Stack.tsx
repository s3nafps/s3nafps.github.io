import { stackRows } from '../data/profile.ts'
import './stack.css'

const ROW_LABELS = ['Systems', 'Build'] as const

/** Static index of the tools behind the day job and the side projects. */
export function Stack() {
  return (
    <section id="stack" className="stack" aria-labelledby="stack-title">
      <div className="container stack-sheet">
        <h2 id="stack-title" className="stack-title">
          Tools
        </h2>
        {stackRows.map((row, index) => (
          <div className="stack-row" key={ROW_LABELS[index]}>
            <p className="stack-label">{ROW_LABELS[index]}</p>
            <ul className="stack-list">
              {row.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
