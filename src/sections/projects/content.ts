import { ArrowLeftRight, CalendarRange, Compass, ListChecks, MonitorPlay, Users, type LucideIcon } from 'lucide-react'

/** How long each Trackr screenshot stays on the center phone. */
export const CYCLE_MS = 3200

/** Icons for trackr.features, keyed by feature title. */
export const FEATURE_ICONS: Record<string, LucideIcon> = {
  Discover: Compass,
  'My List': ListChecks,
  Friends: Users,
  'Where to watch': MonitorPlay,
  'Year in review': CalendarRange,
  'Your data': ArrowLeftRight,
}

/** "owner/repo" from a GitHub URL, shown as a mono kicker. */
export const repoPath = (url: string) => url.replace(/^https:\/\/github\.com\//, '')

/** The services named in the vps-platform README. Roles describe the tools, not live state. */
export const VPS_EDGE = { name: 'caddy', role: 'reverse proxy · TLS' }
export const VPS_SERVICES = [
  { name: 'uptime-kuma', role: 'uptime checks' },
  { name: 'prometheus', role: 'metrics' },
  { name: 'alertmanager', role: 'alert routing' },
  { name: 'grafana', role: 'dashboards' },
  { name: 'loki', role: 'logs' },
  { name: 'alloy', role: 'collector' },
  { name: 'node-exporter', role: 'host metrics' },
  { name: 'cadvisor', role: 'container metrics' },
  { name: 'blackbox-exporter', role: 'probes' },
]

/* GCP Landing Zone architecture sketch: two layouts of the same graph (wide card / narrow card). */
export type DiagramNode = {
  id: string
  x: number
  y: number
  w: number
  h: number
  lines: string[]
  tone?: 'pill' | 'key' | 'accent'
}
export type DiagramLayout = {
  width: number
  height: number
  zone: { x: number; y: number; w: number; h: number; labelX: number; labelY: number }
  nodes: DiagramNode[]
  edges: Array<{ id: string; d: string; dashed?: boolean }>
  /** Polylines that small packets travel along once the sketch has drawn in. */
  packets: Array<Array<[number, number]>>
}

/** Draw-in order (multiplied by a step in seconds). Shared by both layouts. */
export const DIAGRAM_STEP: Record<string, number> = {
  gh: 0,
  'gh-wif': 1,
  oidc: 1.6,
  wif: 2.2,
  'wif-plan': 3,
  'wif-deploy': 3,
  plan: 3.8,
  deploy: 3.8,
  zone: 4.2,
  'plan-gke': 4.6,
  'deploy-gke': 4.6,
  gke: 5.4,
  kms: 5.9,
  ar: 5.9,
  'kms-gke': 6.4,
  'ar-gke': 6.4,
}

export const DIAGRAM_WIDE: DiagramLayout = {
  width: 440,
  height: 268,
  zone: { x: 10, y: 154, w: 420, h: 106, labelX: 24, labelY: 173 },
  nodes: [
    { id: 'gh', x: 12, y: 16, w: 136, h: 40, lines: ['GitHub Actions'] },
    { id: 'oidc', x: 174, y: 26, w: 52, h: 20, lines: ['OIDC'], tone: 'pill' },
    { id: 'wif', x: 252, y: 12, w: 176, h: 48, lines: ['Workload Identity', 'Federation'], tone: 'key' },
    { id: 'plan', x: 116, y: 100, w: 100, h: 34, lines: ['plan SA'] },
    { id: 'deploy', x: 230, y: 100, w: 104, h: 34, lines: ['deploy SA'] },
    { id: 'kms', x: 24, y: 190, w: 104, h: 44, lines: ['Cloud KMS'] },
    { id: 'gke', x: 150, y: 186, w: 140, h: 52, lines: ['GKE', 'private nodes'], tone: 'accent' },
    { id: 'ar', x: 312, y: 186, w: 104, h: 52, lines: ['Artifact', 'Registry'] },
  ],
  edges: [
    { id: 'gh-wif', d: 'M148 36 H252' },
    { id: 'wif-plan', d: 'M340 60 V80 H166 V100' },
    { id: 'wif-deploy', d: 'M340 60 V80 H282 V100' },
    { id: 'plan-gke', d: 'M166 134 V186', dashed: true },
    { id: 'deploy-gke', d: 'M282 134 V186' },
    { id: 'kms-gke', d: 'M128 212 H150' },
    { id: 'ar-gke', d: 'M312 212 H290' },
  ],
  packets: [
    [[148, 36], [252, 36]],
    [[340, 60], [340, 80], [282, 80], [282, 186]],
    [[340, 60], [340, 80], [166, 80], [166, 100]],
  ],
}

export const DIAGRAM_TALL: DiagramLayout = {
  width: 300,
  height: 400,
  zone: { x: 8, y: 226, w: 284, h: 166, labelX: 20, labelY: 245 },
  nodes: [
    { id: 'gh', x: 70, y: 12, w: 160, h: 38, lines: ['GitHub Actions'] },
    { id: 'oidc', x: 124, y: 66, w: 52, h: 20, lines: ['OIDC'], tone: 'pill' },
    { id: 'wif', x: 20, y: 102, w: 260, h: 38, lines: ['Workload Identity Federation'], tone: 'key' },
    { id: 'plan', x: 36, y: 170, w: 106, h: 34, lines: ['plan SA'] },
    { id: 'deploy', x: 158, y: 170, w: 106, h: 34, lines: ['deploy SA'] },
    { id: 'gke', x: 70, y: 256, w: 160, h: 48, lines: ['GKE', 'private nodes'], tone: 'accent' },
    { id: 'kms', x: 18, y: 334, w: 126, h: 44, lines: ['Cloud KMS'] },
    { id: 'ar', x: 156, y: 334, w: 126, h: 44, lines: ['Artifact', 'Registry'] },
  ],
  edges: [
    { id: 'gh-wif', d: 'M150 50 V102' },
    { id: 'wif-plan', d: 'M150 140 V155 H89 V170' },
    { id: 'wif-deploy', d: 'M150 140 V155 H211 V170' },
    { id: 'plan-gke', d: 'M89 204 V256', dashed: true },
    { id: 'deploy-gke', d: 'M211 204 V256' },
    { id: 'kms-gke', d: 'M100 334 V304' },
    { id: 'ar-gke', d: 'M200 334 V304' },
  ],
  packets: [
    [[150, 50], [150, 102]],
    [[150, 140], [150, 155], [211, 155], [211, 256]],
    [[150, 140], [150, 155], [89, 155], [89, 170]],
  ],
}
