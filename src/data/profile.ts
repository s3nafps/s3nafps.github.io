import type { Capability, ProofStat, TerminalScene } from './types.ts'

export const profile = {
  name: 'Mohamed Senator',
  initials: 'MS',
  role: 'Systems Administrator · Cloud Infrastructure & Automation',
  location: 'Algiers, Algeria',
  email: 'mohamed.senator@icloud.com',
  status: 'Open to systems and cloud roles',
  summary:
    'I support Windows, network and security-sensitive infrastructure, then automate the recurring work around it. Outside the day job I ship data APIs on Apify, open-source infrastructure, and an Android app.',
  links: {
    cv: '/Mohamed_Senator_Master_CV.pdf',
    linkedin: 'https://linkedin.com/in/mohamedsenator',
    github: 'https://github.com/s3nafps',
    apify: 'https://apify.com/s3nafps',
  },
} as const

export const proofStats: ProofStat[] = [
  { value: 4, suffix: '+', label: 'Years in live environments' },
  { value: 97, suffix: '%', label: 'Less time on weekly health checks' },
  { value: 4000, suffix: '+', label: 'Users supported' },
  { value: 13, label: 'Public Apify Actors' },
]

/** Commands and output shown by the hero terminal. Output lines come from the repos' READMEs. */
export const terminalScenes: TerminalScene[] = [
  {
    command: 'Invoke-ADHealthCheck -OutputPath C:\\Reports',
    output: [
      { text: 'Domain   : contoso.com', tone: 'muted' },
      { text: 'Rules    : 27 across 10 areas', tone: 'muted' },
      { text: 'Score    : 82 · Grade B', tone: 'ok' },
      { text: 'Results  : 21 pass · 4 warn · 2 fail', tone: 'warn' },
      { text: '✓ HTML + JSON report written', tone: 'ok' },
    ],
  },
  {
    command: 'terraform plan && checkov -d .',
    output: [
      { text: 'private GKE · Workload Identity · Binary Authorization', tone: 'muted' },
      { text: 'keyless CI: GitHub OIDC → Workload Identity Federation', tone: 'muted' },
      { text: 'checkov: 0 failed', tone: 'ok' },
    ],
  },
  {
    command: 'apify call s3nafps/ai-ready-webpage-extractor',
    output: [
      { text: 'rendering https://docs.apify.com/actors …', tone: 'muted' },
      { text: '✓ clean Markdown + RAG-ready chunks', tone: 'ok' },
      { text: '$3 per 1,000 pages · failed pages are free', tone: 'accent' },
    ],
  },
  {
    command: 'make deploy',
    output: [
      { text: 'caddy · prometheus · grafana · loki · alertmanager …', tone: 'muted' },
      { text: '10 services · 18 alert rules · nightly restic backups', tone: 'muted' },
      { text: '✓ monthly restore test passed', tone: 'ok' },
    ],
  },
  {
    command: './gradlew assembleRelease',
    output: [
      { text: 'Kotlin · Jetpack Compose · Room · Supabase', tone: 'muted' },
      { text: 'BUILD SUCCESSFUL', tone: 'ok' },
      { text: 'trackr-release.apk ready to sideload', tone: 'accent' },
    ],
  },
]

/** Two rows for the stack marquee. */
export const stackRows: string[][] = [
  [
    'Windows Server',
    'Active Directory',
    'Group Policy',
    'Exchange',
    'Microsoft 365',
    'PowerShell',
    'FortiGate',
    'FortiWeb',
    'Cisco',
    'PKI',
    'VMware vSphere',
    'Hyper-V',
    'GLPI · ITIL',
  ],
  [
    'Google Cloud',
    'Terraform',
    'GKE',
    'Ansible',
    'Docker Compose',
    'Prometheus',
    'Grafana',
    'GitHub Actions',
    'Apify',
    'Node.js',
    'Python',
    'Kotlin',
    'Jetpack Compose',
    'Supabase',
    'MCP',
  ],
]

export const capabilities: Capability[] = [
  {
    pillar: 'Operate',
    title: 'Windows infrastructure',
    description: 'Enterprise Windows environments kept available, governed and supportable.',
    items: ['Windows Server', 'Active Directory & Group Policy', 'Exchange, Microsoft 365 & SCCM/MECM'],
  },
  {
    pillar: 'Operate',
    title: 'Networking & security',
    description: 'Day-to-day operation of enterprise connectivity and security controls.',
    items: ['TCP/IP, Cisco & LAN/WAN', 'FortiGate, FortiWeb & PKI', 'Vulnerability remediation & patching'],
  },
  {
    pillar: 'Operate',
    title: 'Cloud & virtualization',
    description: 'Virtualized infrastructure, with a growing Google Cloud practice.',
    items: ['GCP, Terraform & private GKE', 'VMware vSphere & Hyper-V', 'Google Cloud Associate Cloud Engineer'],
  },
  {
    pillar: 'Build',
    title: 'Automation',
    description: 'Recurring operations turned into consistent, reviewable workflows.',
    items: ['PowerShell modules & health checks', 'Ansible, Bash & GitHub Actions', 'Audits, reporting & dashboards'],
  },
  {
    pillar: 'Build',
    title: 'Data APIs',
    description: 'Public web data turned into clean, structured APIs anyone can call.',
    items: ['13 public Actors on Apify', 'REST, SDK & MCP access', 'Pay-per-result pricing'],
  },
  {
    pillar: 'Build',
    title: 'Apps',
    description: 'Products people use every day, from first sketch to release.',
    items: ['Trackr for Android (Kotlin, Compose)', 'Supabase auth, Postgres & RLS', 'Offline-first sync'],
  },
]
