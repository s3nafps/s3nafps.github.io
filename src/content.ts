export type Capability = {
  number: string
  title: string
  description: string
  items: string[]
}

export type Experience = {
  dates: string
  company: string
  role: string
  location: string
  summary: string
}

export type Project = {
  number: string
  title: string
  description: string
  tags: string[]
  href?: string
  featured: boolean
  context?: string
}

export type Certification = {
  title: string
  issuer: string
  url?: string
}

export const capabilities: Capability[] = [
  {
    number: '01',
    title: 'Windows Infrastructure',
    description:
      'Enterprise Windows environments kept available, governed, and supportable.',
    items: [
      'Windows Server',
      'Active Directory & Group Policy',
      'Exchange, Microsoft 365 & SCCM/MECM',
    ],
  },
  {
    number: '02',
    title: 'PowerShell Automation',
    description:
      'Recurring operations converted into consistent, reviewable workflows.',
    items: [
      'Infrastructure health checks',
      'Audits, reporting & data collection',
      'Bash, GitHub Actions & CI/CD',
    ],
  },
  {
    number: '03',
    title: 'Networking & Security',
    description:
      'Operational support across enterprise connectivity and security controls.',
    items: [
      'TCP/IP, Cisco & LAN/WAN',
      'Fortinet FortiGate & PKI',
      'Vulnerability remediation & patching',
    ],
  },
  {
    number: '04',
    title: 'Cloud & Virtualization',
    description:
      'Virtualized infrastructure experience with an expanding Google Cloud practice.',
    items: [
      'GCP, Terraform & private GKE',
      'VMware vSphere & Hyper-V',
      'Google Cloud Associate Cloud Engineer (ACE)',
    ],
  },
]

export const experience: Experience[] = [
  {
    dates: 'Feb 2025 — Present',
    company: 'AGCE',
    role: 'IT Support & Systems Administration',
    location: 'Algiers, Algeria',
    summary:
      'Administering air-gapped Windows infrastructure, building 3+ PowerShell tools, and delivering dashboards for management, cybersecurity, and audit teams.',
  },
  {
    dates: 'Feb 2024 — Aug 2024',
    company: 'Agrofilm Packaging Algeria',
    role: 'IT Support Engineer — Contract',
    location: 'Algeria',
    summary:
      'Helped rebuild and stabilize system and network infrastructure across multiple sites while maintaining approximately 95% availability.',
  },
  {
    dates: 'Dec 2022 — Dec 2023',
    company: 'Samsung',
    role: 'IT Support / Infrastructure Support',
    location: 'Algeria',
    summary:
      'Administered 20+ virtual machines and maintained Active Directory, Exchange, Cisco, and FortiGate services for 500+ users.',
  },
  {
    dates: 'May 2022 — Nov 2022',
    company: 'IRIS SATEREX',
    role: 'IT Support — Contract',
    location: 'Algeria',
    summary:
      'Monitored manufacturing IT and resolved user, system, and network incidents in a shift-based production environment.',
  },
  {
    dates: 'Apr 2021 — Apr 2022',
    company: 'Brandt Algeria',
    role: 'IT Support Technician',
    location: 'Algeria',
    summary:
      'Resolved 150+ GLPI tickets per month for 4,000+ users and contributed to a GLPI-to-ServiceNow migration.',
  },
]

export const projects: Project[] = [
  {
    number: 'P1',
    title: 'ForecastFoundry',
    description:
      'Paper-first prediction-market research and execution engine — CLI, REST/OpenAPI, and MCP server.',
    tags: ['Python', 'FastAPI', 'MCP', 'Alembic', 'Docker'],
    href: 'https://github.com/s3nafps/ForecastFoundry',
    featured: true,
  },
  {
    number: 'P2',
    title: 'Automated Health-Check Suite',
    description:
      'Weekly infrastructure health checks cut from ~3 hours to ~5 minutes (~97%) with consistent, accurate results.',
    tags: ['PowerShell', 'Scheduled tasks'],
    featured: false,
    context: 'AGCE',
  },
  {
    number: 'P3',
    title: 'Ops & Audit Dashboards',
    description:
      'Dashboards for management, cybersecurity, and audit teams in an air-gapped environment.',
    tags: ['PowerShell', 'Reporting'],
    featured: false,
    context: 'AGCE',
  },
]

export const certifications: Certification[] = [
  {
    title: 'Google Cloud Associate Cloud Engineer (ACE)',
    issuer: 'Google Cloud',
  },
]
