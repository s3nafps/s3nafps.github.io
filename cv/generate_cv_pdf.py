from pathlib import Path
from shutil import copyfile

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    HRFlowable,
    ListFlowable,
    ListItem,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
)


ROOT = Path(__file__).resolve().parents[1]
PRIMARY_PDF = ROOT / "public" / "Mohamed_Senator_CV_2026.pdf"
LEGACY_PDF = ROOT / "public" / "Mohamed_Senator_CV.pdf"

PROFILE = {
    "name": "Mohamed Senator",
    "title": "Cloud / DevOps Support Engineer",
    "location": "Algiers, Algeria",
    "phone": "+213 541 176 852",
    "email": "mohamed.senator@icloud.com",
    "linkedin": "linkedin.com/in/mohamedsenator",
    "github": "github.com/s3nafps",
    "portfolio": "mohamedsenator.vercel.app",
}

SUMMARY = (
    "Cloud/DevOps support-focused engineer with hands-on experience in Linux VPS "
    "operations, Docker Compose deployments, monitoring, backup and restore workflows, "
    "Cloudflare and DNS troubleshooting, and customer-facing incident documentation. "
    "Strong at turning unclear operational problems into repeatable checks, runbooks, "
    "and support evidence."
)

SKILLS = [
    (
        "Linux and support",
        "Ubuntu server basics, SSH workflows, services, logs, permissions, firewall checks, first-response troubleshooting",
    ),
    (
        "Containers and delivery",
        "Docker, Docker Compose, container logs, health checks, restart behavior, volume handling, deployment checks",
    ),
    (
        "Cloud and web operations",
        "Google Cloud Platform, VPS hosting, DNS, Cloudflare, HTTPS, reverse proxy concepts, load balancing",
    ),
    (
        "Automation and recovery",
        "Bash, PowerShell, GitHub Actions, backup scripts, restore testing, checksum verification, support runbooks",
    ),
    (
        "Network and security",
        "FortiGate, FortiWeb, FortiMail, VPN, VLANs, PKI, endpoint protection, vulnerability remediation",
    ),
]

EXPERIENCE = [
    {
        "company": "Autorite Gouvernementale de Certification Electronique (AGCE)",
        "role": "IT Support - Infrastructure and Automation",
        "dates": "Feb 2025 - Present",
        "location": "Algiers, Algeria",
        "bullets": [
            "Support Windows, network, and security infrastructure in a regulated air-gapped environment with high availability requirements.",
            "Built a containerized PowerShell diagnostics dashboard to centralize recurring network and system health checks.",
            "Developed reusable PowerShell modules for FortiWeb administration and standardized repetitive security tasks.",
            "Troubleshoot escalated connectivity, authentication, endpoint, and security-appliance incidents and document recovery steps.",
        ],
    },
    {
        "company": "Agrofilm Packaging",
        "role": "Systems Administrator (Contract)",
        "dates": "Feb 2024 - Aug 2024",
        "location": "Algeria",
        "bullets": [
            "Administered Windows Server, Active Directory, Group Policy, DNS, DHCP, permissions, and workstation lifecycle operations.",
            "Standardized workstation provisioning and technical documentation to reduce onboarding and configuration inconsistency.",
            "Served as the primary L2 escalation point for server access failures, identity issues, and infrastructure troubleshooting.",
        ],
    },
    {
        "company": "Samsung Algeria",
        "role": "Systems Support Specialist",
        "dates": "Dec 2022 - Dec 2023",
        "location": "Algeria",
        "bullets": [
            "Supported enterprise systems and network operations for 500+ users while contributing to 99.9 percent measured network availability.",
            "Supported Fortinet appliances and VPN access for office-based and remote users.",
            "Automated recurring endpoint maintenance with PowerShell and Group Policy and reduced recurring incidents through user training.",
        ],
    },
    {
        "company": "IRIS Electronics",
        "role": "24/7 Infrastructure Monitoring",
        "dates": "May 2022 - Nov 2022",
        "location": "Algeria",
        "bullets": [
            "Monitored manufacturing infrastructure, triaged system and network alerts, and coordinated escalation and recovery actions.",
        ],
    },
    {
        "company": "Brandt Algeria",
        "role": "IT Operations Specialist",
        "dates": "Apr 2021 - Apr 2022",
        "location": "Algeria",
        "bullets": [
            "Structured GLPI asset and incident workflows using ITIL practices and handled endpoint, user, and service requests.",
            "Administered Microsoft Teams and Exchange services supporting internal operations.",
        ],
    },
]

PROJECTS = [
    {
        "name": "CloudOps Rescue Kit",
        "stack": "Bash, Docker, Docker Compose, Linux, Uptime Kuma, GitHub Actions",
        "bullets": [
            "Built a public VPS and Docker support toolkit for diagnostics, endpoint checks, monitoring, backup and restore proof, and client handover notes.",
            "Created scripts for diagnostics collection, health checks, Docker Compose preflight review, volume backups, and restore testing.",
            "Published CI-backed case-study evidence showing backup, restore, and service-recovery workflow on a reproducible demo lab.",
        ],
    },
    {
        "name": "Self-Hosted Automation Lab",
        "stack": "Linux VPS, Docker Compose, Caddy, n8n, PostgreSQL, Cloudflare, Uptime Kuma",
        "bullets": [
            "Built and hardened a VPS environment with key-only SSH, disabled password login, firewall controls, reverse proxying, and service monitoring.",
            "Used the lab to validate practical support workflows around deployments, monitoring, backups, and authenticated access.",
        ],
    },
    {
        "name": "GCP Infrastructure Projects",
        "stack": "Terraform, Google Cloud, GKE, GitHub Actions, tfsec",
        "bullets": [
            "Built private Google Cloud web and Kubernetes architectures with least-privilege access, CI validation, and security scanning.",
        ],
    },
]

CERTIFICATIONS = [
    "Google Cloud Associate Cloud Engineer (ACE) - issued February 2026",
    "Selected Google Cloud Skills Boost labs - Terraform, IAM and service accounts, secure networking, internal load balancing, cloud security fundamentals",
    "Technicien Superieur (BTS), Database Management - INSFP Baiche Abdelkader, Setif",
]


def build_styles():
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="HeaderName",
            parent=styles["Title"],
            fontName="Helvetica-Bold",
            fontSize=22,
            leading=26,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#111827"),
            spaceAfter=4,
        )
    )
    styles.add(
        ParagraphStyle(
            name="HeaderRole",
            parent=styles["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=11.5,
            leading=14,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#b45309"),
            spaceAfter=6,
        )
    )
    styles.add(
        ParagraphStyle(
            name="ContactLine",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=9.3,
            leading=12,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#374151"),
            spaceAfter=3,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SectionHeading",
            parent=styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=11,
            leading=13,
            textColor=colors.HexColor("#111827"),
            spaceBefore=4,
            spaceAfter=3,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SummaryText",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=9.4,
            leading=12.3,
            textColor=colors.HexColor("#111827"),
            spaceAfter=2,
        )
    )
    styles.add(
        ParagraphStyle(
            name="BodySmall",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=8.9,
            leading=11.4,
            textColor=colors.HexColor("#111827"),
            spaceAfter=1.2,
        )
    )
    styles.add(
        ParagraphStyle(
            name="RoleLine",
            parent=styles["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=9.6,
            leading=12,
            textColor=colors.HexColor("#111827"),
            spaceAfter=0,
        )
    )
    styles.add(
        ParagraphStyle(
            name="MetaLine",
            parent=styles["BodyText"],
            fontName="Helvetica-Oblique",
            fontSize=8.6,
            leading=10.8,
            textColor=colors.HexColor("#4b5563"),
            spaceAfter=1.2,
        )
    )
    styles.add(
        ParagraphStyle(
            name="BulletText",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=8.9,
            leading=11.2,
            leftIndent=8,
            firstLineIndent=0,
            textColor=colors.HexColor("#111827"),
        )
    )
    return styles


def bullet_list(items, style):
    return ListFlowable(
        [
            ListItem(Paragraph(item, style), leftIndent=0)
            for item in items
        ],
        bulletType="bullet",
        bulletFontName="Helvetica",
        bulletFontSize=8,
        leftIndent=10,
        bulletOffsetY=1,
        spaceBefore=0,
        spaceAfter=2,
    )


def add_section(story, title, styles):
    story.append(Paragraph(title, styles["SectionHeading"]))
    story.append(HRFlowable(width="100%", thickness=0.7, color=colors.HexColor("#d1d5db")))
    story.append(Spacer(1, 2.5 * mm))


def add_experience(story, styles):
    add_section(story, "Professional Experience", styles)
    for entry in EXPERIENCE:
        story.append(
            Paragraph(
                f"{entry['company']} - {entry['role']}",
                styles["RoleLine"],
            )
        )
        story.append(
            Paragraph(
                f"{entry['location']} | {entry['dates']}",
                styles["MetaLine"],
            )
        )
        story.append(bullet_list(entry["bullets"], styles["BulletText"]))


def add_projects(story, styles):
    add_section(story, "Selected Proof Projects", styles)
    for project in PROJECTS:
        story.append(
            Paragraph(
                f"{project['name']} - {project['stack']}",
                styles["RoleLine"],
            )
        )
        story.append(bullet_list(project["bullets"], styles["BulletText"]))


def add_certifications(story, styles):
    add_section(story, "Certifications and Education", styles)
    story.append(bullet_list(CERTIFICATIONS, styles["BulletText"]))


def add_footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#6b7280"))
    canvas.drawString(doc.leftMargin, 10 * mm, PROFILE["name"])
    canvas.drawRightString(doc.pagesize[0] - doc.rightMargin, 10 * mm, f"Page {doc.page}")
    canvas.restoreState()


def build_pdf(output_path: Path):
    styles = build_styles()
    doc = SimpleDocTemplate(
        str(output_path),
        pagesize=A4,
        topMargin=11.5 * mm,
        bottomMargin=12 * mm,
        leftMargin=13 * mm,
        rightMargin=13 * mm,
        title=f"{PROFILE['name']} CV",
        author=PROFILE["name"],
    )

    contact_links = (
        f"{PROFILE['location']} | {PROFILE['phone']} | "
        f"<link href='mailto:{PROFILE['email']}' color='blue'>{PROFILE['email']}</link><br/>"
        f"<link href='https://{PROFILE['linkedin']}' color='blue'>{PROFILE['linkedin']}</link> | "
        f"<link href='https://{PROFILE['github']}' color='blue'>{PROFILE['github']}</link> | "
        f"<link href='https://{PROFILE['portfolio']}' color='blue'>{PROFILE['portfolio']}</link>"
    )

    story = [
        Paragraph(PROFILE["name"], styles["HeaderName"]),
        Paragraph(PROFILE["title"], styles["HeaderRole"]),
        Paragraph(contact_links, styles["ContactLine"]),
        Spacer(1, 2.4 * mm),
    ]

    add_section(story, "Professional Summary", styles)
    story.append(Paragraph(SUMMARY, styles["SummaryText"]))

    add_section(story, "Core Skills", styles)
    for label, body in SKILLS:
        story.append(Paragraph(f"<b>{label}:</b> {body}", styles["BodySmall"]))

    add_experience(story, styles)
    add_projects(story, styles)
    add_certifications(story, styles)

    doc.build(story, onFirstPage=add_footer, onLaterPages=add_footer)


def main():
    PRIMARY_PDF.parent.mkdir(parents=True, exist_ok=True)
    build_pdf(PRIMARY_PDF)
    copyfile(PRIMARY_PDF, LEGACY_PDF)
    print(f"Wrote {PRIMARY_PDF}")
    print(f"Updated {LEGACY_PDF}")


if __name__ == "__main__":
    main()
