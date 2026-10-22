import { useRef, type HTMLAttributes, type PointerEvent, type ReactNode } from 'react'

type SpotlightCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  as?: 'div' | 'article' | 'li'
}

/**
 * A `.card` whose border and surface light up around the cursor.
 * Styling lives in base.css (`.spotlight`); this only feeds --mx/--my/--spot.
 */
export function SpotlightCard({ children, className = '', as = 'div', ...rest }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const Component = as as 'div'

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const node = ref.current
    if (!node || event.pointerType !== 'mouse') return
    const rect = node.getBoundingClientRect()
    node.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    node.style.setProperty('--my', `${event.clientY - rect.top}px`)
    node.style.setProperty('--spot', '1')
  }
  const onLeave = () => ref.current?.style.setProperty('--spot', '0')

  return (
    <Component ref={ref} className={`card spotlight ${className}`} onPointerMove={onMove} onPointerLeave={onLeave} {...rest}>
      {children}
    </Component>
  )
}
