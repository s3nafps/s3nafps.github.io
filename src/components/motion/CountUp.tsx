import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'

type CountUpProps = {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
  /** Formats the in-between and final numbers, e.g. compactNumber. */
  format?: (value: number) => string
  className?: string
  /** IntersectionObserver margin; the default waits until the number is clearly on screen. */
  margin?: InViewMargin
}

type InViewMargin = NonNullable<Parameters<typeof useInView>[1]>['margin']

const defaultFormat = (value: number) => Math.round(value).toLocaleString('en-US')

/** Counts from 0 (or the previous value) to `value` once visible. Re-animates when `value` changes. */
export function CountUp({
  value,
  prefix = '',
  suffix = '',
  duration = 1.6,
  format = defaultFormat,
  className,
  margin = '0px 0px -10% 0px',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin })
  const reduceMotion = useReducedMotion()
  const from = useRef(0)
  const [display, setDisplay] = useState(() => format(0))

  useEffect(() => {
    if (!inView) return
    if (reduceMotion) {
      setDisplay(format(value))
      from.current = value
      return
    }
    const controls = animate(from.current, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(format(latest)),
    })
    from.current = value
    return () => controls.stop()
  }, [inView, value, duration, format, reduceMotion])

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      <span aria-hidden="true">
        {prefix}
        {display}
        {suffix}
      </span>
      <span className="sr-only">
        {prefix}
        {format(value)}
        {suffix}
      </span>
    </span>
  )
}
