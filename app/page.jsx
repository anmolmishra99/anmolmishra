"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Mail,
  Phone,
  FileDown,
  Sparkles,
  Check,
  Copy,
  ExternalLink,
  MapPin,
  ArrowRight,
  Terminal,
} from "lucide-react";

// Clean inline SVGs for brand icons
function GithubIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

import PixelSky from "./components/PixelSky";
import ProjectCard from "./components/ProjectCard";
import AquariumRain from "./components/AquariumRain";
import PixelCompanion from "./components/PixelCompanion";
import { playPixelBlip, playPixelChirp } from "./components/SoundEffects";
import anmolAvatar from "../public/anmol-avatar.jpg";

export default function Home() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [photoOpen, setPhotoOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [rainBurst, setRainBurst] = useState(0);
  const [waterHeight, setWaterHeight] = useState(0);

  const email = "mishraanmol258@gmail.com";

  const handleCopyEmail = () => {
    if (soundEnabled) playPixelChirp();
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  return (
    <div className="relative min-h-screen bg-[#21232e] text-[#f1f3f9] font-sans antialiased selection:bg-[#105bff] selection:text-white">
      {/* Royal Blue background glow (only royal blue in background, no orange) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 right-1/4 w-96 h-96 bg-[#105bff]/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-[#105bff]/15 rounded-full blur-3xl" />
      </div>

      {/* Animated Pixel Sky (On mobile sits gracefully in top sky row; on desktop floats absolute top-right) */}
      <div className="w-full flex justify-end pr-2 pt-2 sm:pt-0 sm:pr-0 sm:absolute sm:top-6 sm:right-6 md:right-12 lg:right-20 z-20 pointer-events-auto">
        <div className="scale-75 sm:scale-90 md:scale-100 origin-top-right">
          <PixelSky
            isCreative={true}
            soundEnabled={soundEnabled}
            onCloudClick={() => setRainBurst((prev) => prev + 1)}
          />
        </div>
      </div>

      {/* Aquarium Rain & Water Floor System */}
      <AquariumRain
        soundEnabled={soundEnabled}
        rainBurstTrigger={rainBurst}
        onWaterHeightChange={setWaterHeight}
      />

      {/* Flying Pixel Companion across bottom (flies, jumps on click, automatically steps above rising water) */}
      <PixelCompanion
        waterHeight={waterHeight}
        soundEnabled={soundEnabled}
        isCreative={true}
      />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-2 sm:pt-16 md:pt-20 pb-32 sm:pb-36">
        {/* HERO / PROFILE HEADER */}
        <div className="flex items-start gap-3 sm:gap-4 pb-5 sm:pb-6">
          {/* Avatar */}
          <div className="relative group shrink-0">
            <button
              onClick={() => {
                if (soundEnabled) playPixelBlip(640, "sine", 0.04);
                setPhotoOpen(true);
              }}
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border border-[#2e3242] bg-[#1b1d26] shadow-xl relative block text-left cursor-zoom-in transition-all group-hover:border-[#105bff]/60 group-hover:shadow-[0_0_15px_rgba(16,91,255,0.25)]"
              title="Click to view full photo"
            >
              <Image
                src={anmolAvatar}
                alt="Anmol Mishra"
                priority
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                style={{ objectPosition: "50% 38%" }}
              />
            </button>
          </div>

          {/* Name & Title */}
          <div className="space-y-1 flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white tracking-tight break-words">
              Anmol Mishra
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-zinc-300 font-normal leading-snug">
              AI/ML Engineer · Full-Stack Developer · Technical Lead
            </p>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-0.5 text-[11px] sm:text-xs text-zinc-400 font-mono">
              <span className="inline-flex items-center gap-1 text-zinc-400">
                <MapPin className="w-3 h-3 text-[#fe8500] shrink-0" />
                <span>Noida / Mau, India</span>
              </span>
              <span className="text-zinc-600 hidden sm:inline">•</span>
              <span className="text-[#105bff] font-semibold">3+ Years Production AI</span>
              <span className="text-zinc-600 hidden sm:inline">•</span>
              <span className="text-[#fe8500] font-semibold">2 Acquired SaaS</span>
            </div>
          </div>
        </div>

        {/* BIO & EDITORIAL MANIFESTO */}
        <div className="space-y-3.5 sm:space-y-4 pt-3 sm:pt-4 text-[13px] sm:text-sm md:text-[15px] leading-relaxed text-zinc-300 font-normal border-b border-[#2e3242] pb-8 sm:pb-10">
          <p className="text-white font-medium text-sm sm:text-base leading-relaxed">
            Real-world AI isn&apos;t demo-ware. It&apos;s high-uptime, fault-tolerant infrastructure delivering measurable human impact.
          </p>

          <p>
            I architect and ship production{" "}
            <span className="border-b border-dotted border-zinc-500 text-white font-medium hover:border-[#fe8500] hover:text-[#fe8500] transition-colors cursor-default">
              RAG pipelines
            </span>
            , autonomous{" "}
            <span className="border-b border-dotted border-zinc-500 text-white font-medium hover:border-[#fe8500] hover:text-[#fe8500] transition-colors cursor-default">
              LLM agents
            </span>
            , and high-performance full-stack web and mobile applications. I build robust backends in{" "}
            <span className="border-b border-dotted border-zinc-500 text-white font-medium hover:border-[#fe8500] hover:text-[#fe8500] transition-colors cursor-default">
              Python (FastAPI, Flask)
            </span>
            , engineer reactive interfaces in{" "}
            <span className="border-b border-dotted border-zinc-500 text-white font-medium hover:border-[#fe8500] hover:text-[#fe8500] transition-colors cursor-default">
              Next.js
            </span>{" "}
            and{" "}
            <span className="border-b border-dotted border-zinc-500 text-white font-medium hover:border-[#fe8500] hover:text-[#fe8500] transition-colors cursor-default">
              Flutter
            </span>
            , orchestrate multi-agent crews with{" "}
            <span className="border-b border-dotted border-zinc-500 text-white font-medium hover:border-[#fe8500] hover:text-[#fe8500] transition-colors cursor-default">
              LangChain
            </span>{" "}
            and{" "}
            <span className="border-b border-dotted border-zinc-500 text-white font-medium hover:border-[#fe8500] hover:text-[#fe8500] transition-colors cursor-default">
              CrewAI
            </span>
            , and deploy semantic retrieval across{" "}
            <span className="border-b border-dotted border-zinc-500 text-white font-medium hover:border-[#fe8500] hover:text-[#fe8500] transition-colors cursor-default">
              FAISS &amp; Pinecone
            </span>{" "}
            with{" "}
            <span className="border-b border-dotted border-zinc-500 text-white font-medium hover:border-[#fe8500] hover:text-[#fe8500] transition-colors cursor-default">
              Voice AI (Whisper STT/TTS)
            </span>
            . The goal is simple: systems that eliminate human friction, feel fast, and operate at true scale.
          </p>

          <p>
            These days I do that as AI/ML Engineer &amp; Technical Lead at{" "}
            <span className="border-b border-dotted border-zinc-500 text-white font-medium hover:border-[#fe8500] hover:text-[#fe8500] transition-colors cursor-default">
              Arixolve Ventures
            </span>
            . Over the past 3+ years, I&apos;ve shipped municipal citizen AI for{" "}
            <span className="border-b border-dotted border-zinc-500 text-white font-medium hover:border-[#fe8500] hover:text-[#fe8500] transition-colors cursor-default">
              Chh. Sambhaji Nagar Smart City
            </span>{" "}
            (serving 21,596 citizen conversations and 58,706 messages), delivered blockchain land-acquisition
            intelligence for the{" "}
            <span className="border-b border-dotted border-zinc-500 text-white font-medium hover:border-[#fe8500] hover:text-[#fe8500] transition-colors cursor-default">
              Palghar Collector Office
            </span>{" "}
            tracking ₹7,531 Cr compensation across 16,375 records and 221 villages, and built{" "}
            <span className="border-b border-dotted border-zinc-500 text-white font-medium hover:border-[#fe8500] hover:text-[#fe8500] transition-colors cursor-default">
              Sanvichar
            </span>
            , a real-time bilingual board meeting platform for Maharashtra state boards.
          </p>

          <p>
            Two self-built SaaS products bootstrapped and acquired in 2024:{" "}
            <span className="border-b border-dotted border-zinc-500 text-white font-medium hover:border-[#fe8500] hover:text-[#fe8500] transition-colors cursor-default">
              toasty.ai
            </span>{" "}
            (acquired by Lumination.ai, USA) and{" "}
            <span className="border-b border-dotted border-zinc-500 text-white font-medium hover:border-[#fe8500] hover:text-[#fe8500] transition-colors cursor-default">
              launchpage.me
            </span>{" "}
            (acquired by a Canadian entrepreneur). Currently co-founding and building{" "}
            <a
              href="https://payge.store"
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-dotted border-[#fe8500] text-[#fe8500] font-medium hover:text-white transition-colors"
            >
              Payge
            </a>{" "}
            (payge.store), an Indian Shopify for social sellers with automated Razorpay Route
            split payouts (95% to seller, 5% to Payge) and an AI growth engine.
          </p>

          <p>
            I&apos;m self-taught with a B.Tech in Computer Science &amp; Engineering (AKTU). I work directly
            with government officials, district collectors, and founders to translate messy, manual workflows
            into bulletproof automated systems, usually with{" "}
            <span className="border-b border-dotted border-zinc-500 text-white font-medium hover:border-[#fe8500] hover:text-[#fe8500] transition-colors cursor-default">
              lo-fi beats
            </span>{" "}
            in my ears.
          </p>

          {/* Quick Connect & Action Pills */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-2">
            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#1b1d26] border border-[#2e3242] text-[11px] sm:text-xs font-mono text-zinc-200 hover:border-[#105bff] hover:text-[#fe8500] transition-colors shadow-sm max-w-full"
              title="Click to copy email address"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#fe8500] shrink-0" />
                  <span className="text-[#fe8500] truncate">Copied mishraanmol258@gmail.com</span>
                </>
              ) : (
                <>
                  <Mail className="w-3.5 h-3.5 text-[#105bff] shrink-0" />
                  <span className="truncate">mishraanmol258@gmail.com</span>
                  <Copy className="w-3 h-3 text-zinc-500 shrink-0" />
                </>
              )}
            </button>

            <a
              href="/Anmol_Mishra_Resume_2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#1b1d26] border border-[#2e3242] text-[11px] sm:text-xs font-mono text-zinc-200 hover:border-[#105bff] hover:text-white transition-colors shadow-sm"
            >
              <FileDown className="w-3.5 h-3.5 text-[#105bff] shrink-0" />
              <span>Resume PDF</span>
            </a>

            <a
              href="https://linkedin.com/in/anmolmishra99"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#1b1d26] border border-[#2e3242] text-[11px] sm:text-xs font-mono text-zinc-200 hover:border-[#105bff] hover:text-white transition-colors shadow-sm"
            >
              <LinkedinIcon className="w-3.5 h-3.5 text-[#105bff] shrink-0" />
              <span>LinkedIn</span>
            </a>

            <a
              href="https://github.com/anmolmishra99"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#1b1d26] border border-[#2e3242] text-[11px] sm:text-xs font-mono text-zinc-200 hover:border-[#105bff] hover:text-white transition-colors shadow-sm"
            >
              <GithubIcon className="w-3.5 h-3.5 text-[#105bff] shrink-0" />
              <span>GitHub</span>
            </a>


          </div>
        </div>

        {/* SELECTED WORK SECTION */}
        <section className="pt-8">
          <div className="flex items-center justify-between pb-4">
            <h2 className="text-xs font-mono tracking-widest text-[#fe8500] uppercase font-semibold">
              Selected Work
            </h2>
            <span className="text-[11px] font-mono text-[#105bff] font-medium">
              Interactive Mode ✨
            </span>
          </div>

          <div className="divide-y divide-[#2e3242]">
            {/* 1. Payge */}
            <ProjectCard
              metric="100+"
              metricSub="live stores"
              title="Payge"
              tagline="Indian Shopify for Social Sellers · Co-founder & CTO"
              description="Where a seller launches their single-product online store with checkout, orders, and analytics in one place. Handled 30K+ tracked events, 14K page views, and 2K unique visitors. Engineered Razorpay Route with partner OAuth onboarding so every sale splits automatically: 95% straight to the seller's bank account and 5% to Payge with zero manual payouts."
              bullets={[
                "Automated 95/5 split payouts with Razorpay Route OAuth partner onboarding, zero subscription fee.",
                "Built Growth OS: connects seller and competitors' Instagram accounts, analyses top-performing reels from past 7 days, and AI generates high-converting hooks.",
                "High-performance Next.js store architecture with sub-second checkout conversion.",
              ]}
              tags={["Next.js", "Firebase", "Tailwind CSS", "Razorpay Route", "Instagram API", "LLM Agents"]}
              link="https://payge.store"
              linkText="payge.store →"
              hasCompanion={false}
              soundEnabled={soundEnabled}
              isCreative={true}
            />

            {/* 2. AI Mitra */}
            <ProjectCard
              metric="21.6K+"
              metricSub="conversations"
              title="AI Mitra"
              tagline="Citizen AI Chatbot · Chh. Sambhaji Nagar Municipal Corp & Smart City"
              description="Built a production RAG chatbot grounded on official municipal documents (chunking, embeddings, semantic retrieval). In production it has handled 21,596 conversations and 58,706 messages (averaging 2.7 messages per conversation, answering in ~3 turns). Saved citizens an estimated 16,197 hours and delivered 8,806 direct official links straight into chat."
              bullets={[
                "Saved 971,820 citizen minutes. Top intents: Development Plan (DP), property tax, occupancy and marriage certificates.",
                "Ultra-high precision: only 0.5% of queries (100) were flagged as complex needing human follow-up.",
                "Bilingual vernacular engine: English (92%) and Marathi (8%) with voice STT/TTS for non-technical citizens.",
                "CrewAI reporting crew (data analyst, trend detection, report writer) summarizing query clusters directly for municipal leadership.",
              ]}
              tags={["Python", "LangChain", "CrewAI", "FAISS / Pinecone", "FastAPI", "Next.js", "Voice AI"]}
              linkText="View Deployment Architecture →"
              soundEnabled={soundEnabled}
              isCreative={true}
            />

            {/* 3. eSulabh */}
            <ProjectCard
              metric="₹7,531 Cr"
              metricSub="compensation"
              title="eSulabh"
              tagline="Blockchain Land Acquisition System + AI Layer · Palghar Collector Office"
              description="Built the AI and analytics layer of a land-acquisition tracking system for 10+ mega infrastructure projects (expressways, rail, freight corridors) covering 16,375 land records and 221 villages. Tracks ₹7,531 Cr total compensation across 3,313 Ha of land. Contributed to on-chain smart contracts with tamper-proof ownership transfers and multi-party approvals."
              bullets={[
                "Role-scoped RAG: access enforced directly in retrieval queries so officers only retrieve their division's records.",
                "Public citizen lookup: landowners track compensation status with mobile + Gat number after official clearance.",
                "6 one-click executive intelligence reports for the Collector: Briefing, Bottlenecks, Financials, Timelines, Pending Cases, Structure Reports.",
              ]}
              tags={["Blockchain", "Smart Contracts", "Python", "LangChain", "RAG", "Next.js", "Firebase"]}
              linkText="Govt Case Study →"
              soundEnabled={soundEnabled}
              isCreative={true}
            />

            {/* 4. Two Acquired Products */}
            <ProjectCard
              metric="2 SaaS"
              metricSub="acquired (2024)"
              title="toasty.ai & launchpage.me"
              tagline="Bootstrapped Micro-SaaS Exits"
              description="Two self-built SaaS products engineered, scaled, and acquired in 2024. toasty.ai: multi-tenant SaaS for testimonial collection with custom embed widgets and automated collection sequences, acquired by Lumination.ai (USA). launchpage.me: no-code conversion-focused startup validation and waitlist builder, acquired by a Canadian entrepreneur."
              bullets={[
                "toasty.ai: reached paying customers before sale; acquired by Lumination.ai in 2024.",
                "launchpage.me: acquired for simplicity and high-conversion validation workflow.",
                "Built with Next.js, Firebase multi-tenant architecture, and clean design systems.",
              ]}
              tags={["Next.js", "Firebase", "Multi-tenant", "Tailwind CSS", "Micro-SaaS"]}
              linkText="Read Acquisition Notes →"
              soundEnabled={soundEnabled}
              isCreative={true}
            />

            {/* 5. Sanvichar */}
            <ProjectCard
              metric="3 Live"
              metricSub="board meetings"
              title="Sanvichar"
              tagline="AI Board Meeting Platform · Shivshahi Punarvasan Prakalp Ltd (Govt Board)"
              description="Hosted 3 live government board meetings transcribed and structured in real time. Built Whisper-based speech transcription with automated extraction of agenda items, decisions, action points, and recorded votes. Generates bilingual (English + Marathi) summaries and official resolution text with a diff-aware notes editor."
              bullets={[
                "Real-time Whisper transcription with structured agenda extraction and voting tracker.",
                "Diff-aware versioning notes editor ensuring the secretariat reviews and approves summaries before finalization.",
                "Direct resolution-certificate generator issuing legally-formatted certificates from recorded votes.",
              ]}
              tags={["Python", "Whisper STT", "LLM", "Next.js", "Firebase", "Bilingual NLP"]}
              linkText="Platform Architecture →"
              soundEnabled={soundEnabled}
              isCreative={true}
            />

            {/* 6. visionari.me */}
            <ProjectCard
              metric="Multi-Agent"
              metricSub="CrewAI system"
              title="visionari.me"
              tagline="AI Feedback & Market Intelligence · Active 2024 – Present"
              description="Built an autonomous multi-agent market intelligence platform. A research agent scrapes and analyses web data, a market analyst agent scores demand signals, and a report writer agent compiles prioritized feature lists with revenue-change estimates per item."
              bullets={[
                "Autonomous web scraping and qualitative market sentiment extraction.",
                "CrewAI agent orchestration with role-based division of labour and report compilation.",
              ]}
              tags={["Python", "CrewAI", "LangChain", "Multi-Agent", "Web Search", "Next.js"]}
              linkText="Agent System Overview →"
              soundEnabled={soundEnabled}
              isCreative={true}
            />
          </div>
        </section>

        {/* TECHNICAL EXPERTISE / SKILLS BREAKDOWN */}
        <section className="pt-14 border-t border-[#2e3242] mt-10">
          <div className="flex items-center justify-between pb-6">
            <h2 className="text-xs font-mono tracking-widest text-[#fe8500] uppercase font-semibold">
              Technical Stack &amp; Skills
            </h2>
            <span className="text-[11px] font-mono text-[#105bff] font-medium">Core Capabilities</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
            {/* AI / ML */}
            <div className="p-4 rounded-xl bg-[#1b1d26] border border-[#2e3242] hover:border-[#105bff]/60 transition-colors">
              <div className="text-xs font-mono text-[#fe8500] font-semibold mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#fe8500] shadow-[0_0_6px_#fe8500]" />
                AI &amp; Multi-Agent Systems
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                RAG Pipeline Design, LangChain (Agents, Tools, Memory), CrewAI Multi-Agent
                Orchestration, Vector DBs (FAISS, Pinecone), Prompt Engineering, Voice AI (Whisper,
                STT/TTS), AI Agent Automation.
              </p>
            </div>

            {/* Frontend */}
            <div className="p-4 rounded-xl bg-[#1b1d26] border border-[#2e3242] hover:border-[#105bff]/60 transition-colors">
              <div className="text-xs font-mono text-[#105bff] font-semibold mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#105bff] shadow-[0_0_6px_#105bff]" />
                Frontend Architecture
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Next.js (App Router, Server Actions, SSR), React 19, Tailwind CSS, Flutter (iOS &amp;
                Android), Responsive Design Systems, Performance Optimization.
              </p>
            </div>

            {/* Backend & Cloud */}
            <div className="p-4 rounded-xl bg-[#1b1d26] border border-[#2e3242] hover:border-[#105bff]/60 transition-colors">
              <div className="text-xs font-mono text-[#fe8500] font-semibold mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#fe8500] shadow-[0_0_6px_#fe8500]" />
                Backend &amp; Cloud Infrastructure
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Python (FastAPI, Flask), Firebase (Firestore, Auth, Cloud Functions), REST APIs,
                Razorpay Route Split Payouts, Smart Contracts &amp; Blockchain Integration.
              </p>
            </div>

            {/* Engineering & Delivery */}
            <div className="p-4 rounded-xl bg-[#1b1d26] border border-[#2e3242] hover:border-[#105bff]/60 transition-colors">
              <div className="text-xs font-mono text-[#105bff] font-semibold mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#105bff] shadow-[0_0_6px_#105bff]" />
                Engineering &amp; Technical Leadership
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                System Design, Technical Team Leadership, Govt Tech Client Discovery (District
                Collectors &amp; Municipal Officers), Agile Sprint Delivery, Code Review &amp; Mentoring.
              </p>
            </div>
          </div>
        </section>

        {/* WORK EXPERIENCE */}
        <section className="pt-14 border-t border-[#2e3242] mt-10">
          <div className="flex items-center justify-between pb-6">
            <h2 className="text-xs font-mono tracking-widest text-[#fe8500] uppercase font-semibold">
              Experience
            </h2>
            <span className="text-[11px] font-mono text-[#105bff] font-medium">2022 – Present</span>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#1b1d26] border border-[#2e3242]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    AI/ML Engineer &amp; Technical Lead
                  </h3>
                  <p className="text-xs text-[#105bff] font-medium">Arixolve Ventures Pvt Ltd · Noida, India</p>
                </div>
                <span className="text-xs font-mono text-[#fe8500]">2022 – Present</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Lead architecture and delivery across the company&apos;s product and government project
                portfolio. Direct client discovery sessions with District Collectors and Smart City
                programme officers to formulate technical specs, multi-agent pipelines, and
                high-availability production systems.
              </p>
            </div>
          </div>
        </section>

        {/* EDUCATION & BACKGROUND */}
        <section className="pt-14 border-t border-[#2e3242] mt-10">
          <div className="flex items-center justify-between pb-4">
            <h2 className="text-xs font-mono tracking-widest text-[#fe8500] uppercase font-semibold">
              Education
            </h2>
            <span className="text-[11px] font-mono text-[#105bff] font-medium">B.Tech (CSE)</span>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-300 p-4 rounded-xl bg-[#1b1d26] border border-[#2e3242]">
            <div>
              <span className="text-white font-medium">B.Tech in Computer Science &amp; Engineering</span>
              <p className="text-zinc-400">AKTU · Class of 2023</p>
            </div>
            <span className="font-mono text-[#fe8500] font-bold text-sm">70%</span>
          </div>
        </section>

        {/* FOOTER & CONTACT */}
        <footer className="pt-16 mt-14 border-t border-[#2e3242] space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-white font-medium">
                Want to build something impactful together?
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">
                Available for technical lead roles, AI advisory, and high-impact software.
              </p>
            </div>

            <a
              href="mailto:mishraanmol258@gmail.com"
              className="px-3.5 py-2 rounded-lg bg-[#105bff] hover:bg-[#105bff]/90 text-white text-xs font-mono inline-flex items-center gap-1.5 transition-all shadow-[0_0_16px_rgba(16,91,255,0.4)] w-fit"
            >
              <Mail className="w-3.5 h-3.5 text-[#fe8500]" />
              <span>Get in Touch</span>
            </a>
          </div>

          {/* Contact Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 pt-4 border-t border-[#2e3242]/70 text-[11px] sm:text-xs text-zinc-400 font-mono">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <a
                href="mailto:mishraanmol258@gmail.com"
                className="hover:text-[#fe8500] transition-colors flex items-center gap-1"
              >
                <Mail className="w-3.5 h-3.5 text-[#105bff]" />
                <span>Email</span>
              </a>
              <a
                href="https://linkedin.com/in/anmolmishra99"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#fe8500] transition-colors flex items-center gap-1"
              >
                <LinkedinIcon className="w-3.5 h-3.5 text-[#105bff]" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://github.com/anmolmishra99"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#fe8500] transition-colors flex items-center gap-1"
              >
                <GithubIcon className="w-3.5 h-3.5 text-[#105bff]" />
                <span>GitHub</span>
              </a>
              <a
                href="tel:+917275299418"
                className="hover:text-[#fe8500] transition-colors flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5 text-[#105bff]" />
                <span>+91-7275299418</span>
              </a>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#fe8500] animate-pulse shadow-[0_0_8px_#fe8500]" />
              <span>Noida, IN · IST</span>
            </div>
          </div>
        </footer>
      </main>

      {/* Full Photo Lightbox Modal */}
      {photoOpen && (
        <div
          onClick={() => setPhotoOpen(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full bg-[#1b1d26] border border-[#2e3242] rounded-2xl overflow-hidden shadow-2xl cursor-default"
          >
            <div className="relative aspect-square w-full bg-[#151720]">
              <Image
                src={anmolAvatar}
                alt="Anmol Mishra"
                priority
                className="object-contain w-full h-full"
              />
            </div>
            <div className="p-3.5 bg-[#171923] border-t border-[#2e3242] flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Anmol Mishra</p>
                <p className="text-xs text-zinc-400 font-mono">International Summit / Conference</p>
              </div>
              <button
                onClick={() => setPhotoOpen(false)}
                className="px-3 py-1 rounded-lg bg-[#21232e] hover:bg-[#2e3242] border border-[#2e3242] text-xs text-zinc-300 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
