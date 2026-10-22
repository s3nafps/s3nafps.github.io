export type ActorCategory = 'AI & RAG' | 'Search & SEO' | 'Intel & security' | 'Real estate' | 'Media'

export type Actor = {
  /** Apify Actor name, e.g. `ai-ready-webpage-extractor`. */
  slug: string
  /** Short display title. */
  title: string
  /** Title as listed in the Apify Store. */
  storeTitle: string
  tagline: string
  category: ActorCategory
  tags: string[]
  /** Price on the Free plan for the main billing event, e.g. "$3 / 1,000 pages". */
  priceLabel: string
  featured: boolean
  media: {
    icon: string
    poster?: string
    preview?: string
    promo?: string
  }
  /** Example input used for the API snippets. */
  exampleInput: Record<string, unknown>
}

export type ActorStats = {
  runs: number
  users: number
  lastRunAt?: string
}

export type ActorWithStats = Actor & { stats?: ActorStats }

export type Experience = {
  dates: string
  company: string
  role: string
  location: string
  summary: string
  highlights: string[]
}

export type Certification = {
  title: string
  issuer: string
  year?: string
}

export type Capability = {
  pillar: 'Operate' | 'Build'
  title: string
  description: string
  items: string[]
}

export type ProofStat = {
  value: number
  prefix?: string
  suffix?: string
  label: string
}

export type TerminalScene = {
  command: string
  output: Array<{ text: string; tone?: 'ok' | 'warn' | 'muted' | 'accent' }>
}

export type RepoProject = {
  slug: string
  title: string
  tagline: string
  description: string
  highlights: string[]
  stack: string[]
  repo: string
  image?: string
}

export type AppProject = RepoProject & {
  release: string
  features: Array<{ title: string; copy: string }>
  screenshots: Array<{ src: string; alt: string }>
}
