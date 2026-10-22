const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, video[controls], [tabindex]'

/** Visible, tabbable elements inside `container`, in DOM order. */
export function focusables(container: HTMLElement): HTMLElement[] {
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
