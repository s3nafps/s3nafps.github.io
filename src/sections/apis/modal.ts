import { useEffect, type RefObject } from 'react'

export { trapTab } from '../../lib/focus.ts'

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
