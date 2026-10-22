import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { CountUp } from '../../components/motion/CountUp.tsx'
import type { StoreStatus } from '../../hooks/useApifyStore.ts'
import { STORE_URL, type StoreSummary } from '../../lib/apify.ts'
import { relativeTime } from '../../lib/format.ts'
import { ENDPOINT_PATH, STATUS_COPY, STATUS_TONE, riseInView } from './shared.ts'
import './console.css'

type LivePanelProps = {
  status: StoreStatus
  summary: StoreSummary
  /** True once at least one Actor carries live stats. */
  hasStats: boolean
}

/** Cross-fades its content whenever `swapKey` changes. */
function Swap({ swapKey, children }: { swapKey: string; children: ReactNode }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={swapKey}
        className="apis-swap"
        initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
        transition={{ duration: 0.32 }}
      >
        {children}
      </motion.span>
    </AnimatePresence>
  )
}

/** Slim glass "console" strip fed by the public Apify Store API. */
export function LivePanel({ status, summary, hasStats }: LivePanelProps) {
  const lastRun = relativeTime(summary.lastRunAt)

  return (
    <motion.div className="apis-console" data-status={status} {...riseInView(0.1)}>
      <div className="apis-console-status" role="status">
        <span className="live-dot" data-tone={STATUS_TONE[status]} />
        <Swap swapKey={status}>{STATUS_COPY[status]}</Swap>
      </div>

      <dl className="apis-console-stats">
        <div className="apis-console-stat">
          <dt>Actors</dt>
          <dd>
            <CountUp value={summary.actorCount} duration={1.2} />
          </dd>
        </div>
        <div className="apis-console-stat">
          <dt>Total runs</dt>
          <dd>
            <Swap swapKey={hasStats ? 'live' : 'none'}>{hasStats ? <CountUp value={summary.totalRuns} /> : '—'}</Swap>
          </dd>
        </div>
        <div className="apis-console-stat">
          <dt>Last run</dt>
          <dd>
            <Swap swapKey={lastRun || 'none'}>{lastRun || '—'}</Swap>
          </dd>
        </div>
      </dl>

      <a className="apis-endpoint" href={STORE_URL} target="_blank" rel="noreferrer">
        <span className="apis-endpoint-method">GET</span>
        <span className="apis-endpoint-path">{ENDPOINT_PATH}</span>
        <ArrowUpRight size={14} aria-hidden="true" />
        <span className="sr-only">(raw JSON, opens in a new tab)</span>
      </a>
    </motion.div>
  )
}
