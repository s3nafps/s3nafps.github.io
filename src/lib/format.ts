/** 1299 -> "1.3K", 1250000 -> "1.3M". */
export function compactNumber(value: number): string {
  if (value < 1_000) return String(value)
  const [divisor, unit] = value < 1_000_000 ? [1_000, 'K'] : [1_000_000, 'M']
  const scaled = Math.round((value / divisor) * 10) / 10
  return `${Number.isInteger(scaled) ? scaled.toFixed(0) : scaled.toFixed(1)}${unit}`
}

/** ISO timestamp -> "5 min ago". Empty string for missing or invalid input. */
export function relativeTime(iso: string | undefined, now: number = Date.now()): string {
  if (!iso) return ''
  const time = Date.parse(iso)
  if (Number.isNaN(time)) return ''
  const seconds = Math.max(0, (now - time) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} h ago`
  const days = Math.floor(hours / 24)
  return `${days} ${days === 1 ? 'day' : 'days'} ago`
}
