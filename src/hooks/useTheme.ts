import { useCallback, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'portfolio-theme'
const THEME_COLORS: Record<Theme, string> = { dark: '#141311', light: '#f3efe6' }

function readInitialTheme(): Theme {
  const fromDom = document.documentElement.dataset.theme
  if (fromDom === 'light' || fromDom === 'dark') return fromDom
  try {
    return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme])
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void> }
}

/**
 * Dark by default, remembered in localStorage. Toggling uses a circular
 * View Transition reveal from the click point where the browser supports it.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readInitialTheme)

  useEffect(() => {
    applyTheme(theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Storage can be unavailable (private mode); the toggle still works for this visit.
    }
  }, [theme])

  const toggle = useCallback((origin?: { x: number; y: number }) => {
    const next: Theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'
    const doc = document as ViewTransitionDocument
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!doc.startViewTransition || reduceMotion) {
      setTheme(next)
      return
    }

    const x = origin?.x ?? window.innerWidth - 40
    const y = origin?.y ?? 40
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    const transition = doc.startViewTransition(() => {
      flushSync(() => setTheme(next))
      applyTheme(next)
    })
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 650, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
        )
      })
      .catch(() => {})
  }, [])

  return { theme, toggle }
}
