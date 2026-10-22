import { useEffect, type RefObject } from 'react'

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, video[controls], [tabindex]'

function focusables(container: HTMLElement): HTMLElement[] {
  return [...container.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (node) => node.tabIndex >= 0 && !node.hasAttribute('disabled') && node.getClientRects().length > 0,
  )
}

/** Keeps Tab / Shift+Tab cycling inside `container`. Call from a keydown handler. */
export function trapTab(event: KeyboardEvent, container: HTMLElement | null) {
  if (event.key !== 'Tab' || !container) return
  const items = focusables(container)
  if (items.length === 0) {
    event.preventDefault()
    container.focus()
    return
  }
  const first = items[0]
  const last = items[items.length - 1]
  const active = document.activeElement
  const outside = !(active instanceof Node) || !container.contains(active)
  if (event.shiftKey && (outside || active === first || active === container)) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && (outside || active === last)) {
    event.preventDefault()
    first.focus()
  }
}

/**
 * While `open`: locks page scroll (keeping the scrollbar gap so nothing shifts) and makes
 * the app root inert, so only the portalled dialog is reachable. On close it restores both
 * and moves focus back to `returnFocus` (the card that opened the dialog).
 */
export function useModalLock(open: boolean, returnFocus: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open) return
    const { body } = document
    const root = document.getElementById('root')
    const opener = returnFocus.current
    const gap = window.innerWidth - document.documentElement.clientWidth
    const previous = { overflow: body.style.overflow, paddingRight: body.style.paddingRight }
    body.style.overflow = 'hidden'
    if (gap > 0) body.style.paddingRight = `${gap}px`
    root?.setAttribute('inert', '')

    return () => {
      body.style.overflow = previous.overflow
      body.style.paddingRight = previous.paddingRight
      root?.removeAttribute('inert')
      opener?.focus({ preventScroll: true })
    }
  }, [open, returnFocus])
}
