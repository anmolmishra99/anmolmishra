#!/usr/bin/env python3
"""
Resume Generator for Anmol Mishra
Run: python3 generate_resume.py
Generates Anmol_Mishra_Resume_2026.pdf in both root and public/ directories.
"""

import os
import shutil
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
    KeepTogether,
)

# ==============================================================================
# RESUME CONTENT DATA (Easily edit this section anytime!)
# ==============================================================================

PERSONAL_INFO = {
    "name": "ANMOL MISHRA",
    "title": "AI/ML Engineer · Full-Stack Developer (Next.js · Flutter) · Technical Lead",
    "headline": "RAG Pipelines · LLM Agents · Vector Databases · Voice AI · Python · Firebase | 3+ Years | Govt & Product Deployments | 2 Acquired Products",
    "email": "mishraanmol258@gmail.com",
    "phone": "+91-7275299418",
    "location": "Noida / Mau, India",
    "github": "github.com/anmolmishra99",
    "linkedin": "linkedin.com/in/anmolmishra99",
}

PROFESSIONAL_SUMMARY = (
    "AI/ML engineer and technical lead with 3+ years shipping production AI for Indian government bodies and SaaS. "
    "Government systems built for municipal and district offices serve 21.6K citizen conversations and track "
    "Rs. 7,531 Cr of land-acquisition compensation across 16,375 land records. Two self-built SaaS products acquired in 2024 "
    "(toasty.ai, launchpage.me); co-founded Payge (payge.store) and built vela.video (autonomous AI motion graphics engine)."
)

TECHNICAL_SKILLS = [
    ("AI / ML", "RAG Pipeline Design · LangChain (Agents, Chains, Tools, Memory) · CrewAI (Multi-Agent Orchestration, Role-based Agents, Task Delegation) · Vector DBs: Pinecone · LLM Prompt Engineering · Voice AI (Whisper, STT/TTS) · AI Agent Orchestration"),
    ("Frontend", "Next.js (App Router, SSR, API Routes) · React 19 · Tailwind CSS · Flutter (iOS & Android) · Remotion · Web Components"),
    ("Backend", "Python (FastAPI, Flask) · Firebase (Firestore, Auth, Cloud Functions) · REST APIs · Razorpay Route Split Payouts · Smart Contracts"),
    ("Engineering", "System Design · Code Review & Mentoring · Agile / Sprint Delivery · Govt Tech Client Discovery · API Documentation"),
    ("Tools", "Git · GitHub · Postman · VS Code · Figma (Design Handoff)"),
]

KEY_ACHIEVEMENTS = [
    "<b>Built AI Mitra</b>, a RAG citizen chatbot for Chh. Sambhaji Nagar Municipal Corporation & Smart City — 21,596 conversations, 58,706 messages and an estimated 16,197 citizen-hours saved.",
    "<b>Delivered eSulabh</b>, a blockchain land acquisition system with an AI layer for Palghar Collector Office — tracks Rs. 7,531 Cr compensation across 16,375 land records and 221 villages.",
    "<b>Built Sanvichar</b> (sanvichar.online), an AI board meeting platform for Shivshahi Punarvasan Prakalp Ltd (Govt Board) — hosted 3 live board meetings with bilingual transcription and resolution tracking.",
    "<b>Two self-built SaaS products acquired in 2024</b>: toasty.ai → Lumination.ai (USA) and launchpage.me → Canadian entrepreneur.",
    "<b>Built Payge</b> (payge.store), an Indian Shopify for social sellers — 100+ live seller stores, automated Razorpay Route payouts (95% to seller, 5% to Payge) and an AI growth engine.",
    "<b>Built vela.video</b> (vela.video), an AI motion graphics video engine with Remotion and Gemini API — 3.3K unique visitors, 4.7K page views with complete client-side on-device export.",
    "Worked directly with government officials, district collectors, and Smart City programme officers to formulate technical specs and deliver high-uptime systems.",
]

PROJECTS_PAGE1 = [
    {
        "title": "Project 1 · AI Mitra — AI Citizen Chatbot — Chh. Sambhaji Nagar Municipal Corp & Smart City",
        "tags": "Python · LangChain · CrewAI · RAG · Pinecone · FastAPI · Next.js · Voice AI · STT / TTS",
        "bullets": [
            "Built a production RAG chatbot grounded on official municipal documents (chunking, embeddings, semantic retrieval). In production it has handled 21,596 conversations and 58,706 messages, averaging 2.7 messages per conversation (~3 turns per citizen).",
            "Saved citizens an estimated 16,197 hours (971,820 min) and delivered 8,806 official links straight into chat. Top intents: Development Plan (DP), property tax, occupancy and marriage certificates.",
            "Ultra-high precision: only 0.5% of queries (100) were flagged as complex needing human follow-up.",
            "Serves English (92%) and Marathi (8%), with voice input and output (STT/TTS) for non-technical citizens.",
            "Built a CrewAI reporting crew (data analyst, trend detection, report writer) summarizing query clusters directly for municipal leadership.",
            "Shipped the Next.js citizen portal (chat UI, voice toggle, query history) with the design team.",
        ],
    },
]

PROJECTS_PAGE2 = [
    {
        "title": "Project 2 · eSulabh — Blockchain Land Acquisition System + AI Layer — Palghar Collector Office",
        "tags": "Blockchain · Smart Contracts · Python · LangChain · RAG · Next.js · Firebase · AI Agents",
        "bullets": [
            "Built the AI and analytics layer of a land-acquisition tracking system for 10+ mega infrastructure projects (expressways, freight corridor, rail), 16,375 land records and 221 villages: tracking Rs. 7,531 Cr total compensation across 3,313 Ha of land.",
            "Contributed to on-chain data models and smart contracts (approval sequencing, invalid-state rejection) making ownership transfers and multi-party approvals tamper-proof.",
            "Built role-scoped RAG: access enforced directly in retrieval queries so officers only retrieve their division's records.",
            "Added public citizen lookup: landowners track compensation status with mobile + Gat number after official clearance.",
            "Delivered 6 one-click executive intelligence reports for the Collector (Collector Briefing, Bottlenecks, Financials, Timelines, Pending Cases, Structure Report).",
        ],
    },
    {
        "title": "Project 3 · Sanvichar — AI Board Meeting Platform — Shivshahi Punarvasan Prakalp Ltd (Govt Board)",
        "tags": "Python · Whisper STT · LLM · Next.js · Firebase · Bilingual NLP · Marathi · sanvichar.online",
        "bullets": [
            "Hosted 3 live government board meetings transcribed and structured in real time.",
            "Built real-time Whisper transcription with structured extraction of agenda items, decisions, action points, and recorded votes.",
            "Generated bilingual (English + Marathi) summaries and official resolution text for Maharashtra government documentation.",
            "Built a diff-aware notes review editor ensuring secretariat review before finalization, plus direct resolution certificate generation from votes.",
        ],
    },
    {
        "title": "Project 4 · Payge — Indian Shopify for Social Sellers — payge.store · Co-founder & CTO",
        "tags": "Next.js · Firebase · Tailwind CSS · Razorpay Route · Instagram API · LLM Agents",
        "bullets": [
            "Built Payge, enabling social sellers to launch single-product online stores with checkout, orders, and analytics in one place. Handled 100+ live stores, 30K+ tracked events, 14K page views, and 2K unique visitors.",
            "Implemented Razorpay Route with partner OAuth onboarding, automatically splitting every sale: 95% straight to seller bank account and 5% to Payge with zero manual payouts.",
            "Built Growth OS: connects seller and competitors' Instagram accounts, analyses top-performing reels from past 7 days via Instagram API, and AI generates weekly viral content hooks.",
        ],
    },
]

SHIPPED_PRODUCTS = [
    {
        "name": "toasty.ai — Testimonial Collection SaaS",
        "meta": "Acquired by Lumination.ai (USA) · 2024",
        "tags": "Next.js · Web Components · Firebase · Multimedia CDN · Micro-SaaS",
        "desc": "Multi-tenant SaaS for automated testimonial collection. Handled and stored 10+ GBs of multimedia testimonials (video, audio, text) and rendered them seamlessly on client websites via custom Web Components (<custom-tag> HTML tag). Designed custom embed widgets, wall-of-love displays, and automated review collection sequences. Bootstrapped to paying MRR; acquired by Lumination.ai (USA) in 2024.",
    },
    {
        "name": "launchpage.me — Startup Validation Tool",
        "meta": "Acquired by Canadian Entrepreneur · 2024",
        "tags": "Next.js · Firebase · Tailwind CSS · Viral Growth · Landing Page Builder",
        "desc": "Conversion-focused no-code waitlist builder and startup idea validator. Enabled early-stage founders to launch high-converting landing pages with viral milestone referral mechanisms and automated email capture in under 60 seconds. Acquired by a Canadian entrepreneur in 2024.",
    },
    {
        "name": "vela.video — AI Motion Graphics Engine",
        "meta": "Active · 2024 – Present · https://www.vela.video/",
        "tags": "Next.js · Remotion · Gemini API · Motion Graphics · WebCodecs · On-Device Export",
        "desc": "Autonomous motion graphics video engine combining Remotion composition skills with Google Gemini API for automated script-to-visual generation. Scaled to 3.3K unique visitors, 4.7K page views, and 3.6K+ sessions with strong organic acquisition (1.2K Google organic, 558 ChatGPT organic, 1.7K direct). All video rendering and export executes client-side on-device with zero server GPU overhead.",
    },
]

EDUCATION = {
    "degree": "B.Tech – Computer Science & Engineering",
    "institution": "Dr. A.P.J. Abdul Kalam Technical University (AKTU)",
    "year": "2023 · 70%",
    "notes": "Relevant coursework: Data Structures & Algorithms, Machine Learning, DBMS, Computer Networks, Operating Systems. Began building AI/web systems and freelance government tech during final year — transitioned directly into full-time technical lead & engineering post-graduation.",
}


# ==============================================================================
# PDF GENERATION LOGIC
# ==============================================================================

def generate_pdf(filename="Anmol_Mishra_Resume_2026.pdf"):
    # Margins: 32pt (~0.44 in) for balanced 2-page fit
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=32,
        rightMargin=32,
        topMargin=26,
        bottomMargin=26,
    )

    styles = getSampleStyleSheet()

    # Custom typography styles
    style_name = ParagraphStyle(
        "ResumeName",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=17,
        leading=19,
        textColor=colors.HexColor("#111827"),
    )

    style_title = ParagraphStyle(
        "ResumeTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9,
        leading=11,
        textColor=colors.HexColor("#105bff"),
    )

    style_headline = ParagraphStyle(
        "ResumeHeadline",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor("#4b5563"),
    )

    style_contact = ParagraphStyle(
        "ResumeContact",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor("#374151"),
    )

    style_section_heading = ParagraphStyle(
        "ResumeSection",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8.5,
        leading=10.5,
        textColor=colors.HexColor("#111827"),
        spaceBefore=5,
        spaceAfter=2,
    )

    style_body = ParagraphStyle(
        "ResumeBody",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=7.3,
        leading=9.3,
        textColor=colors.HexColor("#1f2937"),
    )

    style_bullet = ParagraphStyle(
        "ResumeBullet",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=7.2,
        leading=9.0,
        textColor=colors.HexColor("#1f2937"),
        leftIndent=10,
        firstLineIndent=-7,
    )

    style_project_title = ParagraphStyle(
        "ProjectTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=7.8,
        leading=9.8,
        textColor=colors.HexColor("#111827"),
    )

    style_tags = ParagraphStyle(
        "ProjectTags",
        parent=styles["Normal"],
        fontName="Helvetica-Oblique",
        fontSize=6.8,
        leading=8.5,
        textColor=colors.HexColor("#2563eb"),
    )

    story = []

    def section_header(title):
        story.append(Paragraph(title.upper(), style_section_heading))
        story.append(HRFlowable(width="100%", thickness=0.6, color=colors.HexColor("#9ca3af"), spaceAfter=3, spaceBefore=1))

    # --- HEADER ---
    story.append(Paragraph(PERSONAL_INFO["name"], style_name))
    story.append(Spacer(1, 1))
    story.append(Paragraph(PERSONAL_INFO["title"], style_title))
    story.append(Spacer(1, 1))
    story.append(Paragraph(PERSONAL_INFO["headline"], style_headline))
    story.append(Spacer(1, 2))

    contact_text = (
        f"<b>Email:</b> {PERSONAL_INFO['email']}  |  "
        f"<b>Phone:</b> {PERSONAL_INFO['phone']}  |  "
        f"<b>Location:</b> {PERSONAL_INFO['location']}  |  "
        f"<b>GitHub:</b> {PERSONAL_INFO['github']}  |  "
        f"<b>LinkedIn:</b> {PERSONAL_INFO['linkedin']}"
    )
    story.append(Paragraph(contact_text, style_contact))
    story.append(Spacer(1, 2))

    # --- PROFESSIONAL SUMMARY ---
    section_header("Professional Summary")
    story.append(Paragraph(PROFESSIONAL_SUMMARY, style_body))
    story.append(Spacer(1, 3))

    # --- TECHNICAL SKILLS ---
    section_header("Technical Skills")
    skills_data = []
    for cat, items in TECHNICAL_SKILLS:
        skills_data.append([
            Paragraph(f"<b>{cat}</b>", style_body),
            Paragraph(items, style_body),
        ])
    skills_table = Table(skills_data, colWidths=[65, 465])
    skills_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 0.5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0.5),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
    ]))
    story.append(skills_table)
    story.append(Spacer(1, 3))

    # --- KEY ACHIEVEMENTS ---
    section_header("Key Achievements")
    for ach in KEY_ACHIEVEMENTS:
        story.append(Paragraph(f"&bull; {ach}", style_bullet))
        story.append(Spacer(1, 0.8))
    story.append(Spacer(1, 2))

    # --- ENGINEERING EXPERIENCE: OVERVIEW & PROJECT 1 ---
    section_header("Engineering Experience")
    exp_header = "<b>AI/ML Engineer & Technical Lead</b> — Arixolve Ventures Pvt Ltd · Noida, India · 2022 – Present"
    story.append(Paragraph(exp_header, style_project_title))
    exp_sub = "Led engineering, architecture, and client delivery across product and government project portfolio; direct client discovery with District Collectors and Smart City programme officers."
    story.append(Paragraph(exp_sub, style_body))
    story.append(Spacer(1, 2))

    for p in PROJECTS_PAGE1:
        story.append(Paragraph(p["title"], style_project_title))
        story.append(Paragraph(p["tags"], style_tags))
        story.append(Spacer(1, 1))
        for b in p["bullets"]:
            story.append(Paragraph(f"&bull; {b}", style_bullet))
            story.append(Spacer(1, 0.8))

    # Force exact 2-page structure
    from reportlab.platypus import PageBreak
    story.append(PageBreak())

    # ==============================================================================
    # PAGE 2: PROJECTS 2, 3, 4 + SHIPPED PRODUCTS + EDUCATION
    # ==============================================================================
    section_header("Engineering Experience (Continued)")

    for p in PROJECTS_PAGE2:
        story.append(Paragraph(p["title"], style_project_title))
        story.append(Paragraph(p["tags"], style_tags))
        story.append(Spacer(1, 1))
        for b in p["bullets"]:
            story.append(Paragraph(f"&bull; {b}", style_bullet))
            story.append(Spacer(1, 0.8))
        story.append(Spacer(1, 2.5))

    # --- SHIPPED PRODUCTS · 2 ACQUIRED (2024) ---
    section_header("Shipped Products · 2 Acquired (2024)")
    for prod in SHIPPED_PRODUCTS:
        prod_title = f"<b>{prod['name']}</b> — <font color='#4b5563'>{prod['meta']}</font>"
        story.append(Paragraph(prod_title, style_project_title))
        story.append(Paragraph(prod['tags'], style_tags))
        story.append(Spacer(1, 1))
        story.append(Paragraph(f"&bull; {prod['desc']}", style_bullet))
        story.append(Spacer(1, 2.5))

    # --- EDUCATION ---
    section_header("Education")
    edu_title = f"<b>{EDUCATION['degree']}</b> · {EDUCATION['institution']} · <b>{EDUCATION['year']}</b>"
    story.append(Paragraph(edu_title, style_project_title))
    story.append(Spacer(1, 1))
    story.append(Paragraph(f"&bull; {EDUCATION['notes']}", style_bullet))

    doc.build(story)
    print(f"Generated PDF: {filename}")

    # Also sync to public folder for website download
    public_dest = os.path.join("public", filename)
    shutil.copyfile(filename, public_dest)
    print(f"Synced to public folder: {public_dest}")


if __name__ == "__main__":
    generate_pdf()
