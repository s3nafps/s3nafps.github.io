import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { Check, Copy, MousePointerClick, SquareTerminal } from 'lucide-react'
import { EASE_OUT } from '../../components/motion/ease.ts'
import type { Snippets } from '../../lib/apify.ts'
import { highlight } from './highlight.ts'
import { SNIPPET_TABS } from './shared.ts'
import './api-panel.css'

type CopyState = 'idle' | 'copied' | 'selected'

const COPY_LABEL: Record<CopyState, string> = { idle: 'Copy', copied: 'Copied', selected: 'Selected' }
const COPY_ANNOUNCE: Record<CopyState, string> = {
  idle: '',
  copied: 'Code copied to clipboard.',
  selected: 'Clipboard unavailable. The code is selected: press Ctrl+C or Cmd+C to copy it.',
}

/** cURL / JavaScript / Python / MCP examples for one Actor, with copy-to-clipboard. */
export function ApiPanel({ snippets, slug }: { snippets: Snippets; slug: string }) {
  const baseId = useId()
  const [tab, setTab] = useState<keyof Snippets>('curl')
  const [copyState, setCopyState] = useState<CopyState>('idle')
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const codeRef = useRef<HTMLElement>(null)
  const code = snippets[tab]
  const lines = useMemo(() => highlight(code), [code])

  useEffect(() => {
    if (copyState === 'idle') return
    const timer = window.setTimeout(() => setCopyState('idle'), 2200)
    return () => window.clearTimeout(timer)
  }, [copyState])

  const select = (index: number) => {
    const next = SNIPPET_TABS[(index + SNIPPET_TABS.length) % SNIPPET_TABS.length]
    setTab(next.id)
    setCopyState('idle')
    tabRefs.current[SNIPPET_TABS.indexOf(next)]?.focus()
  }

  const onTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = SNIPPET_TABS.findIndex((item) => item.id === tab)
    const moves: Record<string, number> = { ArrowRight: current + 1, ArrowLeft: current - 1, Home: 0, End: SNIPPET_TABS.length - 1 }
    if (!(event.key in moves)) return
    event.preventDefault()
    select(moves[event.key])
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopyState('copied')
    } catch {
      // No clipboard permission (or insecure context): select the code so a keyboard copy works.
      const node = codeRef.current
      const selection = window.getSelection()
      if (node && selection) selection.selectAllChildren(node)
      setCopyState('selected')
    }
  }

  const panelId = `${baseId}-panel`
  const tabId = (id: string) => `${baseId}-tab-${id}`

  return (
    <section className="apis-api" aria-labelledby={`${baseId}-title`}>
      <div className="apis-api-head">
        <h3 id={`${baseId}-title`} className="apis-api-title">
          <SquareTerminal size={16} aria-hidden="true" /> Call it as an API
        </h3>
      </div>

      <div className="apis-code">
        <div className="apis-code-bar">
          <LayoutGroup id={`apis-tabs-${slug}`}>
            <div className="apis-tabs" role="tablist" aria-label="Example language" onKeyDown={onTabKeyDown}>
              {SNIPPET_TABS.map((item, index) => {
                const active = item.id === tab
                return (
                  <button
                    key={item.id}
                    ref={(node) => {
                      tabRefs.current[index] = node
                    }}
                    type="button"
                    role="tab"
                    id={tabId(item.id)}
                    className="apis-tab"
                    aria-selected={active}
                    aria-controls={panelId}
                    tabIndex={active ? 0 : -1}
                    onClick={() => select(index)}
                  >
                    {item.label}
                    {active ? <motion.span className="apis-tab-line" layoutId="line" transition={{ type: 'spring', stiffness: 420, damping: 36 }} /> : null}
                  </button>
                )
              })}
            </div>
          </LayoutGroup>

          <button type="button" className="apis-copy" data-state={copyState} onClick={copy}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={copyState}
                className="apis-copy-icon"
                initial={{ opacity: 0, scale: 0.4, rotate: -45, filter: 'blur(3px)' }}
                animate={{ opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.4, rotate: 45, filter: 'blur(3px)' }}
                transition={{ duration: 0.28, ease: EASE_OUT }}
              >
                {copyState === 'copied' ? (
                  <Check size={14} strokeWidth={2.5} aria-hidden="true" />
                ) : copyState === 'selected' ? (
                  <MousePointerClick size={14} aria-hidden="true" />
                ) : (
                  <Copy size={14} aria-hidden="true" />
                )}
              </motion.span>
            </AnimatePresence>
            <span className="apis-copy-label">{COPY_LABEL[copyState]}</span>
            <span className="sr-only"> {SNIPPET_TABS.find((item) => item.id === tab)?.label} example</span>
          </button>
        </div>

        <div id={panelId} className="apis-code-scroll" role="tabpanel" aria-labelledby={tabId(tab)} tabIndex={0}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.pre
              key={tab}
              className="apis-pre"
              initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -4, filter: 'blur(4px)' }}
              transition={{ duration: 0.22, ease: EASE_OUT }}
            >
              <code ref={codeRef}>
                {lines.map((tokens, lineIndex) => (
                  <span className="apis-line" key={lineIndex}>
                    {tokens.map((token, tokenIndex) =>
                      token.kind === 'plain' ? (
                        token.text
                      ) : (
                        <span key={tokenIndex} className={`apis-tok-${token.kind}`}>
                          {token.text}
                        </span>
                      ),
                    )}
                    {lineIndex < lines.length - 1 ? '\n' : null}
                  </span>
                ))}
              </code>
            </motion.pre>
          </AnimatePresence>
        </div>
      </div>

      <p className="apis-api-note">
        Set <code>APIFY_TOKEN</code> to the API token from a{' '}
        <a href="https://console.apify.com/sign-up" target="_blank" rel="noreferrer">
          free Apify account
        </a>
        . MCP clients can sign in with OAuth instead.
      </p>
      <p className="sr-only" aria-live="polite">
        {COPY_ANNOUNCE[copyState]}
      </p>
    </section>
  )
}
