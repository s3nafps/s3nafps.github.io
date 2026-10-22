import { useCallback, useEffect, useState } from 'react'

/** False while the tab is in the background. */
export function usePageVisible(): boolean {
  const [visible, setVisible] = useState(() => document.visibilityState !== 'hidden')
  useEffect(() => {
    const update = () => setVisible(document.visibilityState !== 'hidden')
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])
  return visible
}

type Slide = { index: number; direction: 1 | -1 }

/**
 * A slide index that advances every `interval` ms while `running`.
 * Picking a slide by hand restarts the timer; `direction` drives the slide animation.
 */
export function useAutoAdvance(count: number, interval: number, running: boolean) {
  const [slide, setSlide] = useState<Slide>({ index: 0, direction: 1 })

  useEffect(() => {
    if (!running || count < 2) return
    const timer = window.setTimeout(() => {
      setSlide((current) => ({ index: (current.index + 1) % count, direction: 1 }))
    }, interval)
    return () => window.clearTimeout(timer)
  }, [running, slide, count, interval])

  const goTo = useCallback((index: number) => {
    setSlide((current) => (index === current.index ? current : { index, direction: index > current.index ? 1 : -1 }))
  }, [])

  return { index: slide.index, direction: slide.direction, goTo }
}
