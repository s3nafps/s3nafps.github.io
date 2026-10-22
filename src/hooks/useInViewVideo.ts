import { useEffect, type RefObject } from 'react'
import { useReducedMotion } from 'motion/react'

/**
 * Plays a muted video only while `active` is true and the element is at least
 * half visible; pauses otherwise. Never autoplays when the user prefers reduced
 * motion. Pair with `preload="none"` so nothing downloads until it plays.
 */
export function useInViewVideo(ref: RefObject<HTMLVideoElement | null>, active = true) {
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (reduceMotion || !active) {
      video.pause()
      return
    }

    let visible = false
    const play = () => {
      if (!visible) return
      video.play().catch(() => {
        // Autoplay can be blocked (data saver, low power); the poster stays visible.
      })
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) play()
        else video.pause()
      },
      { threshold: 0.5 },
    )
    observer.observe(video)
    return () => {
      observer.disconnect()
      video.pause()
    }
  }, [ref, active, reduceMotion])
}
