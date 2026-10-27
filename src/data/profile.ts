import type { Capability, ProofStat, TerminalScene } from './types.ts'

export const profile = {
  name: 'Mohamed Senator',
  initials: 'MS',
  role: 'Systems Administrator · Cloud Infrastructure & Automation',
  location: 'Algiers, Algeria',
  email: 'mohamed.senator@icloud.com',
  status: 'Open to systems and cloud roles',
  summary:
    'I look after Windows, network and security-sensitive infrastructure, and I automate the jobs that come back every week. I also publish data APIs on Apify, a few infrastructure repos, and an Android app.',
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
  { value: 12, label: 'Public Apify Actors' },
]

/** Commands and output shown by the hero terminal. Output lines come from the repos' READMEs. */
export const terminalScenes: TerminalScene[] = [
  {
    command: 'Invoke-ADHealthCheck -OutputPath C:\\Reports',
    output: [
      { text: 'Domain   : contoso.com', tone: 'muted' },
      { text: 'Rules    : 27 across 10 areas', tone: 'muted' },
      { text: 'Results  : 18 pass · 6 warn · 2 fail · 1 skipped', tone: 'warn' },
      { text: 'Score    : 46/100 · Grade F (sample domain)', tone: 'warn' },
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
      { text: '10 services · 18 alert rules · Caddy auto HTTPS', tone: 'muted' },
      { text: '✓ nightly backup + monthly restore-test timers enabled', tone: 'ok' },
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
    description: 'Windows Server, directory services, and the Microsoft stack around them.',
    items: ['Windows Server', 'Active Directory & Group Policy', 'Exchange, Microsoft 365 & SCCM/MECM'],
  },
  {
    pillar: 'Operate',
    title: 'Networking & security',
    description: 'The network, and the firewalls and certificates in front of it.',
    items: ['TCP/IP, Cisco & LAN/WAN', 'FortiGate, FortiWeb & PKI', 'Vulnerability remediation & patching'],
  },
  {
    pillar: 'Operate',
    title: 'Cloud & virtualization',
    description: 'vSphere and Hyper-V in production, and a Google Cloud practice I am still building.',
    items: ['GCP, Terraform & private GKE', 'VMware vSphere & Hyper-V', 'Google Cloud Associate Cloud Engineer'],
  },
  {
    pillar: 'Build',
    title: 'Automation',
    description: 'Weekly jobs turned into scripts, modules, and reports someone else can run.',
    items: ['PowerShell modules & health checks', 'Ansible, Bash & GitHub Actions', 'Audits, reporting & dashboards'],
  },
  {
    pillar: 'Build',
    title: 'Data APIs',
    description: 'Public web pages turned into APIs, with a price on each one.',
    items: ['Public Actors on the Apify Store', 'REST, API clients & MCP access', 'Pay-per-event pricing'],
  },
  {
    pillar: 'Build',
    title: 'Apps',
    description: 'Trackr, from the first screen to a signed release.',
    items: ['Trackr for Android (Kotlin, Compose)', 'Supabase auth, Postgres & RLS', 'Offline-first sync'],
  },
]
