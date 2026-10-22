import type { Certification, Experience } from './types.ts'

export const experience: Experience[] = [
  {
    dates: 'Feb 2025 — Present',
    company: 'AGCE',
    role: 'IT Support — Infrastructure & Automation',
    location: 'Algiers, Algeria',
    summary:
      'Administering air-gapped Windows infrastructure, building 3+ PowerShell tools, and delivering dashboards for management, cybersecurity, and audit teams.',
    highlights: [
      'Weekly health checks cut from ~3 hours to ~5 minutes',
      'Containerized PowerShell diagnostics dashboard',
      'Reusable PowerShell modules for FortiWeb administration',
    ],
  },
  {
    dates: 'Feb 2024 — Aug 2024',
    company: 'Agrofilm Packaging Algeria',
    role: 'Systems Administrator — Contract',
    location: 'Algeria',
    summary:
      'Helped rebuild and stabilize system and network infrastructure across multiple sites while maintaining approximately 95% availability.',
    highlights: ['Windows Server, AD, GPO, DNS & DHCP', 'Standardized workstation provisioning', 'Primary L2 escalation point'],
  },
  {
    dates: 'Dec 2022 — Dec 2023',
    company: 'Samsung Algeria',
    role: 'Systems Support Specialist',
    location: 'Algeria',
    summary:
      'Administered 20+ virtual machines and maintained Active Directory, Exchange, Cisco, and FortiGate services for 500+ users.',
    highlights: ['99.9% measured network availability', 'Fortinet appliances & VPN access', 'PowerShell + GPO maintenance automation'],
  },
  {
    dates: 'May 2022 — Nov 2022',
    company: 'IRIS Electronics',
    role: '24/7 Infrastructure Monitoring',
    location: 'Algeria',
    summary:
      'Monitored manufacturing IT and resolved user, system, and network incidents in a shift-based production environment.',
    highlights: ['System & network alert triage', 'Escalation & recovery coordination'],
  },
  {
    dates: 'Apr 2021 — Apr 2022',
    company: 'Brandt Algeria',
    role: 'IT Operations Specialist',
    location: 'Algeria',
    summary:
      'Resolved 150+ GLPI tickets per month for 4,000+ users and contributed to a GLPI-to-ServiceNow migration.',
    highlights: ['GLPI asset & incident workflows (ITIL)', 'Teams & Exchange administration'],
  },
]

export const certifications: Certification[] = [
  { title: 'Google Cloud Associate Cloud Engineer (ACE)', issuer: 'Google Cloud', year: '2026' },
]
