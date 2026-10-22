import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Download, Menu, Moon, Sun, X } from 'lucide-react'
import { profile } from '../data/profile.ts'
import { useMediaQuery } from '../hooks/useMediaQuery.ts'
import { useScrollSpy } from '../hooks/useScrollSpy.ts'
import { trapTab } from '../lib/focus.ts'
import type { Theme } from '../hooks/useTheme.ts'
import { EASE_OUT } from './motion/ease.ts'
import './nav.css'

const NAV_ITEMS = [
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'apis', label: 'APIs' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
] as const

const SECTION_IDS = NAV_ITEMS.map((item) => item.id)

type NavProps = {
  theme: Theme
  onToggleTheme: (origin: { x: number; y: number }) => void
}

export function Nav({ theme, onToggleTheme }: NavProps) {
  const active = useScrollSpy(SECTION_IDS)
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const compact = useMediaQuery('(max-width: 920px)')
  const shellRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    setScrolled(latest > 24)
    // Tuck the bar away on a clear downward scroll, bring it back on a clear upward one.
    // Small deltas (end of a wheel notch, trackpad momentum) leave it as it is.
    const focusInside = headerRef.current?.contains(document.activeElement) ?? false
    if (menuOpen || focusInside || latest <= 480) setHidden(false)
    else if (latest > previous + 4) setHidden(true)
    else if (latest < previous - 4) setHidden(false)
  })

  // The sheet only exists on compact layouts: close it if the viewport grows (tablet rotation).
  useEffect(() => {
    if (!compact) setMenuOpen(false)
  }, [compact])

  // While the sheet is open it behaves like a modal: page scroll locked, page content inert,
  // Tab cycles through the header and sheet, Escape closes and returns focus to the menu button.
  useEffect(() => {
    if (!menuOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const background = [document.getElementById('main'), document.querySelector('.site-footer')]
    for (const node of background) node?.setAttribute('inert', '')
    const frame = requestAnimationFrame(() => {
      document.querySelector<HTMLElement>('#mobile-menu a')?.focus({ preventScroll: true })
    })
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      } else {
        trapTab(event, shellRef.current)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(frame)
      document.body.style.overflow = previousOverflow
      for (const node of background) node?.removeAttribute('inert')
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const toggleTheme = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    onToggleTheme({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
  }

  return (
    <div ref={shellRef}>
      <motion.header
        ref={headerRef}
        className={`nav${scrolled ? ' is-scrolled' : ''}`}
        onFocusCapture={() => setHidden(false)}
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: hidden ? -96 : 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
      >
        <nav className="nav-inner container" aria-label="Primary">
          <a className="nav-brand" href="#top">
            <span className="nav-mark" aria-hidden="true">{profile.initials}</span>
            <span className="nav-brand-text">
              {profile.name}
              <span>Systems · Cloud · Builder</span>
            </span>
            <span className="sr-only">, back to top</span>
          </a>

          <ul className="nav-links">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} aria-current={active === item.id ? 'location' : undefined}>
                  {active === item.id ? (
                    <motion.span className="nav-pill" layoutId="nav-pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                  ) : null}
                  <span className="nav-link-label">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="nav-tools">
            <button
              type="button"
              className="icon-btn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE_OUT }}
                  style={{ display: 'grid' }}
                >
                  {theme === 'dark' ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
                </motion.span>
              </AnimatePresence>
            </button>
            <a className="btn btn-ghost btn-sm nav-cv" href={profile.links.cv} download>
              <Download size={15} aria-hidden="true" />
              CV
            </a>
            <button
              ref={menuButtonRef}
              type="button"
              className="icon-btn nav-menu-btn"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && compact ? (
          <motion.div
            id="mobile-menu"
            className="mobile-menu"
            initial={{ opacity: 0, clipPath: 'circle(0% at calc(100% - 40px) 34px)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at calc(100% - 40px) 34px)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at calc(100% - 40px) 34px)' }}
            transition={{ duration: 0.55, ease: EASE_OUT }}
          >
            <motion.ul
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }}
            >
              {NAV_ITEMS.map((item, index) => (
                <motion.li
                  key={item.id}
                  variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } } }}
                >
                  <a href={`#${item.id}`} onClick={() => setMenuOpen(false)}>
                    <span className="mobile-menu-index">0{index + 1}</span>
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
            <div className="mobile-menu-footer">
              <a className="btn btn-primary" href={profile.links.cv} download onClick={() => setMenuOpen(false)}>
                <Download size={16} aria-hidden="true" /> Download CV
              </a>
              <a className="mobile-menu-email" href={`mailto:${profile.email}`}>{profile.email}</a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
