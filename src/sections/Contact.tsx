import { useEffect, useRef, useState, type PointerEvent, type RefObject } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Check, Clock, Copy, Download, Github, Linkedin, MapPin, Webhook, type LucideIcon } from 'lucide-react'
import { profile } from '../data/profile.ts'
import { Magnetic } from '../components/motion/Magnetic.tsx'
import { Reveal } from '../components/motion/Reveal.tsx'
import { SplitText } from '../components/motion/SplitText.tsx'
import { EASE_OUT } from '../components/motion/ease.ts'
import './contact.css'

type ContactLink = { label: string; detail: string; href: string; icon: LucideIcon; download?: boolean }

const bareUrl = (url: string) => url.replace(/^https?:\/\//, '')

const LINKS: ContactLink[] = [
  { label: 'LinkedIn', detail: new URL(profile.links.linkedin).pathname.slice(1), href: profile.links.linkedin, icon: Linkedin },
  { label: 'GitHub', detail: bareUrl(profile.links.github), href: profile.links.github, icon: Github },
  { label: 'Apify', detail: bareUrl(profile.links.apify), href: profile.links.apify, icon: Webhook },
  { label: 'Download CV', detail: 'PDF', href: profile.links.cv, icon: Download, download: true },
]

// Algiers runs on CET (UTC+1) all year.
const localTime = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Algiers', hour: '2-digit', minute: '2-digit' })

export function Contact() {
  const panelRef = useRef<HTMLDivElement>(null)
  const emailRef = useRef<HTMLSpanElement>(null)

  // Soft light that follows the cursor across the panel (CSS variables only, no re-render).
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const node = panelRef.current
    if (!node || event.pointerType !== 'mouse') return
    const rect = node.getBoundingClientRect()
    node.style.setProperty('--cx', `${event.clientX - rect.left}px`)
    node.style.setProperty('--cy', `${event.clientY - rect.top}px`)
  }

  return (
      <section id="contact" className="section contact" aria-labelledby="contact-title">
        <div className="container">
          <motion.div
            ref={panelRef}
            className="contact-panel"
            onPointerMove={onPointerMove}
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '0px 0px -15% 0px' }}
            transition={{ duration: 1.1, ease: EASE_OUT }}
          >
            <div className="contact-bg" aria-hidden="true">
              <div className="contact-aura" />
              <div className="contact-grid" />
              <div className="contact-horizon" />
              <div className="contact-spot" />
            </div>

            <div className="contact-inner">
              <Reveal className="contact-top" y={18}>
                <p className="eyebrow contact-eyebrow">Contact</p>
                <p className="contact-status">
                  <span className="live-dot" />
                  {profile.status}
                </p>
              </Reveal>

              <h2 id="contact-title" className="contact-title">
                <SplitText
                  delay={0.1}
                  parts={[
                    "Let's make",
                    { text: 'important', className: 'serif-accent contact-serif' },
                    'systems easier to',
                    { text: 'run.', className: 'gradient-text' },
                  ]}
                />
              </h2>

              <Reveal className="contact-email-row" delay={0.35} y={20}>
                <Magnetic strength={0.18}>
                  <a className="contact-email" href={`mailto:${profile.email}`}>
                    <span ref={emailRef} className="contact-email-text">
                      {profile.email}
                    </span>
                    <ArrowUpRight className="contact-email-arrow" size={28} strokeWidth={1.75} aria-hidden="true" />
                  </a>
                </Magnetic>
                <CopyEmail email={profile.email} fallbackTarget={emailRef} />
              </Reveal>

              <motion.ul
                className="contact-links"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '0px 0px -8% 0px' }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.45 } } }}
              >
                {LINKS.map((link) => (
                  <motion.li
                    key={link.label}
                    variants={{
                      hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
                      show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: EASE_OUT } },
                    }}
                  >
                    <LinkTile link={link} />
                  </motion.li>
                ))}
              </motion.ul>

              <Reveal className="contact-meta" delay={0.6} y={12} blur={false}>
                <span>
                  <MapPin size={14} aria-hidden="true" /> {profile.location}
                </span>
                <LocalTime />
              </Reveal>
            </div>
          </motion.div>
        </div>
      </section>
  )
}

function LinkTile({ link }: { link: ContactLink }) {
  const Icon = link.icon
  const external = !link.download
  return (
    <a
      className="contact-link"
      href={link.href}
      download={link.download || undefined}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
    >
      <span className="contact-link-icon">
        <Icon size={18} aria-hidden="true" />
      </span>
      <span className="contact-link-text">
        <span className="contact-link-label">{link.label}</span>
        <span className="contact-link-detail">{link.detail}</span>
      </span>
      {external ? (
        <ArrowUpRight className="contact-link-arrow" size={17} aria-hidden="true" />
      ) : (
        <Download className="contact-link-arrow contact-link-arrow--down" size={16} aria-hidden="true" />
      )}
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  )
}

type CopyState = 'idle' | 'copied' | 'failed'

/** Copies the address; if the clipboard is unavailable, selects it and explains how to copy by hand. */
function CopyEmail({ email, fallbackTarget }: { email: string; fallbackTarget: RefObject<HTMLElement | null> }) {
  const [state, setState] = useState<CopyState>('idle')
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const settle = (next: CopyState) => {
    setState(next)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState('idle'), next === 'copied' ? 2200 : 4000)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      settle('copied')
    } catch {
      const target = fallbackTarget.current
      const selection = window.getSelection()
      if (target && selection) selection.selectAllChildren(target)
      settle('failed')
    }
  }

  // Touch screens have no copy shortcut to point at.
  const hint = window.matchMedia('(pointer: coarse)').matches
    ? 'long-press to copy'
    : `press ${/Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘C' : 'Ctrl+C'} to copy`
  const message = state === 'copied' ? 'Email copied to clipboard' : state === 'failed' ? `Selected, ${hint}` : ''

  return (
    <span className="contact-copy-wrap">
      <button type="button" className="btn btn-ghost contact-copy" onClick={copy} data-state={state}>
        <span className="contact-copy-icon" aria-hidden="true">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={state === 'copied' ? 'check' : 'copy'}
              initial={{ opacity: 0, scale: 0.4, rotate: -45 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.4, rotate: 45 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
            >
              {state === 'copied' ? <Check size={16} strokeWidth={2.4} /> : <Copy size={16} />}
            </motion.span>
          </AnimatePresence>
        </span>
        {state === 'copied' ? 'Copied' : 'Copy email'}
      </button>

      <AnimatePresence>
        {state !== 'idle' ? (
          <motion.span
            key={state}
            className="contact-toast"
            data-tone={state}
            aria-hidden="true"
            initial={{ opacity: 0, y: 10, scale: 0.92, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, scale: 0.96, filter: 'blur(4px)' }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
          >
            {state === 'copied' ? <Check size={14} strokeWidth={2.4} aria-hidden="true" /> : null}
            {message}
          </motion.span>
        ) : null}
      </AnimatePresence>
      <span className="sr-only" role="status">
        {message}
      </span>
    </span>
  )
}

function LocalTime() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <span>
      <Clock size={14} aria-hidden="true" />
      <time dateTime={now.toISOString()}>{localTime.format(now)}</time> local time
    </span>
  )
}
