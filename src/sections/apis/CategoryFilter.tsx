import { LayoutGroup, motion } from 'motion/react'
import type { CategoryFilter as Filter } from './shared.ts'
import './filter.css'

type CategoryFilterProps = {
  options: Array<{ id: Filter; count: number }>
  value: Filter
  onChange: (value: Filter) => void
  /** id of the element whose content the filter controls. */
  controls: string
}

/** Toggle buttons with a pill that slides to the active one. */
export function CategoryFilter({ options, value, onChange, controls }: CategoryFilterProps) {
  return (
    <LayoutGroup id="apis-filter">
      <motion.div className="apis-filter" role="group" aria-label="Filter Actors by category" layoutScroll>
        {options.map((option) => {
          const active = option.id === value
          return (
            <button
              key={option.id}
              type="button"
              className="apis-filter-btn"
              aria-pressed={active}
              aria-controls={controls}
              onClick={() => onChange(option.id)}
            >
              {active ? (
                <motion.span className="apis-filter-pill" layoutId="pill" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />
              ) : null}
              <span className="apis-filter-label">{option.id}</span>
              <span className="apis-filter-count">{option.count}</span>
            </button>
          )
        })}
      </motion.div>
    </LayoutGroup>
  )
}
