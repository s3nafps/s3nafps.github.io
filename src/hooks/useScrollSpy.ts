import { useEffect, useState } from 'react'

/** Returns the id of the section currently crossing the upper-middle of the viewport. */
export function useScrollSpy(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (elements.length === 0) return

    const visible = new Map<string, boolean>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting)
        const current = ids.find((id) => visible.get(id))
        setActive(current ?? null)
      },
      { rootMargin: '-35% 0px -55% 0px' },
    )
    for (const el of elements) observer.observe(el)
    return () => observer.disconnect()
  }, [ids])

  return active
}
