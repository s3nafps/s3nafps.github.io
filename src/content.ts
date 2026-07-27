export type Capability = {
  number: string
  title: string
  description: string
  items: string[]
  image: string
}

export type Experience = {
  dates: string
  company: string
  role: string
  location: string
  summary: string
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
      'Microsoft Exchange & Microsoft 365',
    ],
    image: '/images/windows-infrastructure.webp',
  },
  {
    number: '02',
    title: 'PowerShell Automation',
    description:
      'Recurring operations converted into consistent, reviewable workflows.',
    items: [
      'Infrastructure health checks',
      'System audits & data collection',
      'Dashboards & operational reporting',
    ],
    image: '/images/powershell-automation.webp',
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
    image: '/images/networking-security.webp',
  },
  {
    number: '04',
    title: 'Cloud & Virtualization',
    description:
      'Virtualized infrastructure experience with an expanding Google Cloud practice.',
    items: [
      'Google Cloud Platform',
      'VMware vSphere & Hyper-V',
      'Google Cloud Associate Cloud Engineer',
    ],
    image: '/images/cloud-virtualization.webp',
  },
]

export const experience: Experience[] = [
  {
    dates: 'Feb 2025 — Present',
    company: 'AGCE',
    role: 'IT Support & Systems Administration',
    location: 'Algiers, Algeria',
    summary:
      'Building PowerShell automation, infrastructure health checks, system audits, dashboards, and operational reporting in a security-sensitive government environment.',
  },
  {
    dates: 'Feb 2024 — Aug 2024',
    company: 'Agrofilm Packaging Algeria',
    role: 'IT Support Engineer — Contract',
    location: 'Algeria',
    summary:
      'Supported Active Directory, Windows endpoints, connectivity, remote administration, and infrastructure incidents in a production environment.',
  },
  {
    dates: 'Dec 2022 — Dec 2023',
    company: 'Samsung',
    role: 'IT Support / Infrastructure Support',
    location: 'Algeria',
    summary:
      'Supported Windows services, 20+ virtual machines, Active Directory, Exchange, Cisco networking, FortiGate, and escalated infrastructure incidents.',
  },
  {
    dates: 'May 2022 — Nov 2022',
    company: 'IRIS SATEREX',
    role: 'IT Support — Contract',
    location: 'Algeria',
    summary:
      'Monitored manufacturing infrastructure and responded to user, system, network, and production-availability incidents.',
  },
  {
    dates: 'Apr 2021 — Apr 2022',
    company: 'Brandt Algeria',
    role: 'IT Support Technician',
    location: 'Algeria',
    summary:
      'Supported an enterprise environment serving 4,000+ users while documenting recurring issues and coordinating infrastructure escalations.',
  },
]
