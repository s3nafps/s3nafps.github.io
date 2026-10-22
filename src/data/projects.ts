import type { AppProject, RepoProject } from './types.ts'

const screenshot = (name: string, alt: string) => ({ src: `/previews/trackr/${name}.webp`, alt })

export const trackr: AppProject = {
  slug: 'trackr',
  title: 'Trackr',
  tagline: 'Track movies, TV and anime with your friends.',
  description:
    'An Android app for logging what you watch, rating it, ticking off episodes and seeing what your friends are up to. Movies and TV come from TMDB, anime from AniList, and everything syncs through Supabase, so your list works offline and follows you across devices.',
  highlights: ['Offline-first sync', 'Friends & shared watchlists', 'Imports from AniList, MAL & Letterboxd'],
  stack: ['Kotlin', 'Jetpack Compose', 'Material 3', 'Hilt', 'Room', 'WorkManager', 'Supabase', 'TMDB', 'AniList GraphQL'],
  repo: 'https://github.com/s3nafps/trackr',
  release: 'https://github.com/s3nafps/trackr/releases/latest',
  features: [
    { title: 'Discover', copy: 'Trending, airing this week, and a "For You" row built from what you rated highly.' },
    { title: 'My List', copy: 'Watching, completed, plan to watch and dropped, with +1 episode and new-episode alerts.' },
    { title: 'Friends', copy: 'Activity feed with reactions, Watch Together, recommendations and shared watchlists.' },
    { title: 'Where to watch', copy: 'Streaming, rent and buy options for your country, plus trailers, cast and seasons.' },
    { title: 'Year in review', copy: 'Titles finished, hours watched and top ratings, shareable as an image.' },
    { title: 'Your data', copy: 'Import from AniList, MyAnimeList and Letterboxd; export to JSON or CSV.' },
  ],
  screenshots: [
    screenshot('home', 'Trackr home screen with continue watching and trending movies'),
    screenshot('detail', 'Title details with rating, cast and where to watch'),
    screenshot('mylist', 'My List grouped by watching status'),
    screenshot('friends', 'Friends activity feed'),
    screenshot('search', 'Search across movies, TV and anime'),
    screenshot('profile', 'Profile with watching stats and charts'),
  ],
}

export const repoProjects: RepoProject[] = [
  {
    slug: 'adhealthcheck',
    title: 'ADHealthCheck',
    tagline: 'Active Directory audits in minutes, not hours.',
    description:
      'A PowerShell module that audits an AD domain for health and security problems and produces a scored HTML report plus JSON. It grew out of a weekly manual check that took about three hours.',
    highlights: ['27 rules across 10 areas', 'Scored HTML + JSON reports', 'Kerberos, delegation, LAPS & replication checks'],
    stack: ['PowerShell 5.1 & 7', 'Pester', 'PSScriptAnalyzer', 'GitHub Actions'],
    repo: 'https://github.com/s3nafps/ADHealthCheck-PowerShell',
    image: '/previews/projects/adhealthcheck-report.webp',
  },
  {
    slug: 'gcp-landing-zone',
    title: 'GCP Landing Zone',
    tagline: 'A private, hardened GKE platform with keyless CI.',
    description:
      'A Terraform landing zone for Google Cloud: custom VPC, private GKE, customer-managed keys and least-privilege IAM, deployed from GitHub Actions through Workload Identity Federation with no stored keys.',
    highlights: ['Private nodes, Workload Identity, Binary Authorization', 'CMEK with 90-day rotation', 'checkov: 0 failed'],
    stack: ['Terraform', 'Google Cloud', 'GKE', 'Cloud KMS', 'GitHub Actions', 'checkov'],
    repo: 'https://github.com/s3nafps/gcp-landing-zone',
  },
  {
    slug: 'vps-platform',
    title: 'VPS Platform',
    tagline: 'One VPS, hardened and run entirely from code.',
    description:
      'One command takes a fresh Ubuntu server to a monitored, backed-up host serving HTTPS: hardening, Caddy, Prometheus, Grafana, Loki, alerting and nightly backups that are restore-tested every month.',
    highlights: ['10 services, only ports 80/443 published', '18 alert rules to Telegram or e-mail', 'Monthly automated restore test'],
    stack: ['Ansible', 'Docker Compose', 'Caddy', 'Prometheus', 'Grafana', 'Loki', 'restic'],
    repo: 'https://github.com/s3nafps/vps-platform',
  },
]
