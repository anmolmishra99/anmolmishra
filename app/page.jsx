"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Mail,
  Phone,
  FileDown,
  Check,
  Copy,
  ExternalLink,
  MapPin,
  ArrowRight,
  Terminal,
  Sparkles,
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

// Verified Checkmark Badge as in reference image
function VerifiedBadge({ className = "w-5 h-5 text-[#3b72fe]" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-label="Verified">
      <path d="M12 1L9.27 3.32L5.69 2.87L4.41 6.29L1.13 7.84L2.09 11.31L0.5 14.59L3.18 17.03L3.58 20.63L7.15 21.05L9.36 23.91L12 22.61L14.64 23.91L16.85 21.05L20.42 20.63L20.82 17.03L23.5 14.59L21.91 11.31L22.87 7.84L19.59 6.29L18.31 2.87L14.73 3.32L12 1Z" />
      <path d="M9.5 16.2L5.8 12.5L7.2 11.1L9.5 13.4L16.8 6.1L18.2 7.5L9.5 16.2Z" fill="white" />
    </svg>
  );
}

// Minimal inline text highlight as in reference image (clean text + dotted underline)
function InlineHighlight({ children }) {
  return (
    <span className="text-white font-medium underline decoration-dotted decoration-zinc-500/80 underline-offset-[5px] hover:decoration-[#60a5fa] transition-colors">
      {children}
    </span>
  );
}

// Highlighted Tech Badge for standalone pill lists (supports default blue/indigo or warm amber/orange)
function TechBadge({ children, color = "blue" }) {
  if (color === "orange") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#281b12] border border-[#7a461b] text-[#ffa852] font-medium text-[11px] sm:text-xs font-mono mx-0.5 align-middle shadow-sm hover:border-[#fe8500] hover:text-white transition-colors">
        {children}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#1d233a] border border-[#3c4a75] text-[#f1f5f9] font-medium text-[11px] sm:text-xs font-mono mx-0.5 align-middle shadow-sm hover:border-[#60a5fa] hover:text-white transition-colors">
      {children}
    </span>
  );
}

// Prominent Highlight Pill as in reference image
function HighlightPill({ children, icon, variant = "blue" }) {
  if (variant === "orange") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#271a12] border border-[#693d1b] text-[#ffa347] text-xs sm:text-[13px] font-medium font-mono shadow-sm hover:border-[#fe8500] hover:text-white transition-colors">
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#131b31] border border-[#2d3d6b] text-[#8ea8f7] text-xs sm:text-[13px] font-medium font-mono shadow-sm hover:border-[#105bff] hover:text-white transition-colors">
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
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

      {/* 
        [POSITION CONTROL - PIXEL CLOUD]:
        - Change `top-2` (e.g. top-1, top-3) to nudge clouds up/down
        - Change `right-2` to nudge clouds left/right
        - Change `scale-[0.65]` to make clouds smaller/larger
      */}
      <div className="absolute top-2 right-2 sm:top-3 sm:right-6 md:right-10 z-20 pointer-events-auto">
        <div className="scale-[0.65] sm:scale-75 md:scale-90 origin-top-right">
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

      {/* 
        [POSITION CONTROL - NAME & HERO DISTANCE FROM TOP]:
        - Change `pt-24` on mobile or `sm:pt-20 md:pt-24` on desktop to nudge the name up/down.
        - Options to test:
            `pt-16` (closer to top)
            `pt-20` (medium gap)
            `pt-24` (recommended: safely clears cloud on phone)
            `pt-28` (extra spacious gap)
      */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 sm:pt-20 md:pt-24 pb-32 sm:pb-36">
        {/* HERO / PROFILE HEADER */}
        <div className="flex items-start gap-3 sm:gap-5 pb-4 sm:pb-5">
          {/* Avatar with blue glowing border matching reference */}
          <div className="relative group shrink-0">
            <button
              onClick={() => {
                if (soundEnabled) playPixelBlip(640, "sine", 0.04);
                setPhotoOpen(true);
              }}
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 border-[#105bff]/60 bg-[#1b1d26] shadow-[0_0_24px_rgba(16,91,255,0.35)] relative block text-left cursor-zoom-in transition-all group-hover:scale-105 group-hover:border-[#105bff] group-hover:shadow-[0_0_30px_rgba(16,91,255,0.55)]"
              title="Click to view full photo"
            >
              <Image
                src={anmolAvatar}
                alt="Anmol Mishra"
                priority
                className="object-cover w-full h-full transition-transform duration-300"
                style={{ objectPosition: "50% 38%" }}
              />
            </button>
          </div>

          {/* Name & Title */}
          <div className="space-y-1 sm:space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight break-words">
                Anmol Mishra
              </h1>
              <VerifiedBadge className="w-5 h-5 sm:w-6 sm:h-6 text-[#1d9bf0] shrink-0" />
            </div>

            <p className="text-xs sm:text-sm md:text-base text-zinc-300 font-normal leading-snug">
              AI/ML Engineer · Full-Stack Developer · Technical Lead
            </p>

            <div className="flex items-center gap-1.5 pt-0.5 text-xs sm:text-sm text-zinc-400 font-mono">
              <span className="text-[#fe8500] text-sm">📍</span>
              <span>India</span>
            </div>

            {/* Two highlight pills matching reference image */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-2">
              <HighlightPill variant="blue" icon={<Sparkles className="w-3.5 h-3.5 text-[#5e82ff] shrink-0" />}>
                3+ Years Production AI
              </HighlightPill>

              <HighlightPill variant="orange" icon={<span className="text-xs sm:text-sm">🏆</span>}>
                2 Acquired SaaS
              </HighlightPill>
            </div>
          </div>
        </div>

        {/* EDITORIAL MANIFESTO & BIO MATCHING REFERENCE IMAGE */}
        <div className="space-y-4 pt-3 text-[13px] sm:text-sm md:text-[15px] leading-relaxed text-zinc-300 font-normal border-b border-[#2e3242] pb-8 sm:pb-10">
          <p className="text-white font-semibold text-sm sm:text-base md:text-[16px] leading-snug sm:leading-relaxed pb-1">
            Real-world AI isn&apos;t demo-ware. It&apos;s high-uptime, fault-tolerant infrastructure delivering measurable human impact.
          </p>

          <p className="leading-relaxed">
            I architect and ship production <InlineHighlight>RAG pipelines</InlineHighlight>, autonomous{" "}
            <InlineHighlight>LLM agents</InlineHighlight>, and high-performance full-stack web and mobile applications.
            I build robust backends in <InlineHighlight>Python (FastAPI, Flask)</InlineHighlight>, engineer reactive
            interfaces in <InlineHighlight>Next.js</InlineHighlight> and <InlineHighlight>Flutter</InlineHighlight>, orchestrate
            multi-agent crews with <InlineHighlight>LangChain</InlineHighlight> and <InlineHighlight>CrewAI</InlineHighlight>,
            and deploy semantic retrieval across <InlineHighlight>Pinecone</InlineHighlight> with{" "}
            <InlineHighlight>Voice AI (Whisper STT/TTS)</InlineHighlight>. The goal is simple: systems that eliminate human
            friction, feel fast, and operate at true scale.
          </p>

          <p className="leading-relaxed">
            These days I do that as AI/ML Engineer &amp; Technical Lead at{" "}
            <InlineHighlight>Arixolve Ventures</InlineHighlight>. Over the past 3+ years, I&apos;ve shipped municipal citizen AI for{" "}
            <InlineHighlight>Chh. Sambhaji Nagar Smart City</InlineHighlight> (serving <span className="text-white font-medium">21,596 citizen conversations</span> and <span className="text-white font-medium">58,706 messages</span>), delivered blockchain land-acquisition
            intelligence with{" "}
            <a
              href="https://esulabh.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-medium underline decoration-dotted decoration-zinc-400 underline-offset-[5px] hover:text-[#60a5fa] hover:decoration-[#60a5fa] transition-colors"
            >
              eSulabh (esulabh.in)
            </a>{" "}
            for the <InlineHighlight>Palghar Collector Office</InlineHighlight> tracking <span className="text-white font-medium">₹7,531 Cr compensation</span> across <span className="text-white font-medium">16,375 records</span> and 221 villages, and built{" "}
            <a
              href="https://www.sanvichar.online/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-medium underline decoration-dotted decoration-zinc-400 underline-offset-[5px] hover:text-[#60a5fa] hover:decoration-[#60a5fa] transition-colors"
            >
              Sanvichar (sanvichar.online)
            </a>
            , a real-time bilingual board meeting platform for Maharashtra state boards running <span className="text-white font-medium">3 live government meetings</span>.
          </p>

          <p className="leading-relaxed">
            Two self-built SaaS products bootstrapped and acquired in 2024:{" "}
            <a
              href="https://toasty.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-medium underline decoration-dotted decoration-zinc-400 underline-offset-[5px] hover:text-[#60a5fa] hover:decoration-[#60a5fa] transition-colors"
            >
              toasty.ai (acquired)
            </a>{" "}
            by <InlineHighlight>Lumination.ai (USA)</InlineHighlight> (10+ GBs multimedia &amp; Web Components) and{" "}
            <a
              href="https://launchpage.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-medium underline decoration-dotted decoration-zinc-400 underline-offset-[5px] hover:text-[#60a5fa] hover:decoration-[#60a5fa] transition-colors"
            >
              launchpage.me (acquired)
            </a>{" "}
            by a Canadian entrepreneur. Currently co-founding and building{" "}
            <a
              href="https://payge.store"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-medium underline decoration-dotted decoration-zinc-400 underline-offset-[5px] hover:text-[#60a5fa] hover:decoration-[#60a5fa] transition-colors"
            >
              Payge (payge.store)
            </a>
            , an Indian Shopify for social sellers with automated <InlineHighlight>Razorpay Route</InlineHighlight> split payouts (95% to seller, 5% to Payge) and an AI growth engine. Also built{" "}
            <a
              href="https://www.vela.video/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-medium underline decoration-dotted decoration-zinc-400 underline-offset-[5px] hover:text-[#60a5fa] hover:decoration-[#60a5fa] transition-colors"
            >
              vela.video
            </a>
            , an AI motion graphics video engine powered by <InlineHighlight>Remotion</InlineHighlight> &amp; <InlineHighlight>Gemini API</InlineHighlight> (3.3K unique visitors, client-side on-device export).
          </p>

          <p className="leading-relaxed">
            I&apos;m self-taught with a <InlineHighlight>B.Tech in Computer Science &amp; Engineering (AKTU)</InlineHighlight>. I work directly
            with government officials, District Collectors, and founders to translate messy, manual workflows
            into bulletproof automated systems, usually with lo-fi beats in my ears.
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
            <div className="flex items-center gap-2.5">
              <h2 className="text-xs font-mono tracking-widest text-[#fe8500] uppercase font-semibold">
                Selected Work
              </h2>
              <HighlightPill variant="blue" icon="✦">7 Production Systems</HighlightPill>
            </div>
            <span className="text-[11px] font-mono text-[#105bff] font-medium hidden sm:inline">
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
              highlightPill={[
                { text: "Razorpay Route 95/5 Split", variant: "orange", icon: "⚡" },
                { text: "100+ Live Stores", variant: "blue", icon: "✦" },
              ]}
              description={
                <>
                  Where a creator launches a single-product online store with instant checkout, orders, and analytics. Scaled to <span className="text-white font-medium">30K+ tracked events</span>, <span className="text-white font-medium">14K page views</span>, and <span className="text-white font-medium">2K unique visitors</span>. Engineered <InlineHighlight>Razorpay Route</InlineHighlight> with partner OAuth onboarding so every transaction splits automatically: <span className="text-white font-medium">95% straight to seller bank account</span> and 5% to Payge with zero manual payouts.
                </>
              }
              bullets={[
                <>Automated <span className="text-white font-medium">95/5 split payouts</span> via <InlineHighlight>Razorpay Route OAuth</InlineHighlight> partner onboarding, eliminating manual disbursement with zero monthly subscription fee.</>,
                <>Built <InlineHighlight>Growth OS</InlineHighlight>: connects seller and competitor Instagram Graph APIs, analyzes top-performing reels over 7 days, and AI generates high-converting scripts.</>,
                <>High-performance <InlineHighlight>Next.js 16 App Router</InlineHighlight> storefront architecture achieving sub-second checkout conversion.</>,
              ]}
              tags={["Next.js", "Firebase", "Tailwind CSS", "Razorpay Route", "Instagram API", "LLM Agents"]}
              link="https://payge.store"
              linkText="payge.store"
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
              highlightPill={[
                { text: "Smart City Govt AI · 21.6K Chats", variant: "blue", icon: "✦" },
                { text: "0.5% Human Escalation", variant: "orange", icon: "⚡" },
              ]}
              description={
                <>
                  Built a production <InlineHighlight>RAG chatbot</InlineHighlight> grounded on official municipal documents (chunking, embeddings, semantic search via <InlineHighlight>Pinecone</InlineHighlight>). In production it resolved <span className="text-white font-medium">21,596 citizen conversations</span> and <span className="text-white font-medium">58,706 messages</span> (averaging 2.7 msgs/conversation, answering queries in ~3 turns). Saved citizens an estimated <span className="text-white font-medium">16,197 hours</span> and delivered 8,806 official links directly into chat.
                </>
              }
              bullets={[
                <>Saved <span className="text-white font-medium">971,820 citizen minutes</span>. Top intents: Development Plan (DP), property tax, occupancy, and marriage certificates.</>,
                <>Ultra-high precision grounding: only <span className="text-white font-medium">0.5% of queries (100)</span> required escalation for human follow-up.</>,
                <>Vernacular engine: English (92%) and Marathi (8%) with <InlineHighlight>Voice AI (Whisper STT/TTS)</InlineHighlight> for non-technical citizens.</>,
                <>Autonomous <InlineHighlight>CrewAI multi-agent reporting crew</InlineHighlight> (data analyst, trend detection, report writer) summarizing query clusters directly for municipal leadership.</>,
              ]}
              tags={["Python", "LangChain", "CrewAI", "Pinecone", "FastAPI", "Next.js", "Voice AI"]}
              linkText="View Deployment Architecture"
              soundEnabled={soundEnabled}
              isCreative={true}
            />

            {/* 3. eSulabh */}
            <ProjectCard
              metric="₹7,531 Cr"
              metricSub="compensation"
              title="eSulabh"
              tagline="Blockchain Land Acquisition System + AI Layer · Palghar Collector Office"
              highlightPill={[
                { text: "Palghar Collector Office · ₹7,531 Cr", variant: "blue", icon: "✦" },
                { text: "16.3K Land Records", variant: "orange", icon: "⚡" },
              ]}
              description={
                <>
                  Built the AI and analytics layer of a land-acquisition tracking platform for <span className="text-white font-medium">10+ mega infrastructure projects</span> (bullet train, expressways, freight corridors) covering <span className="text-white font-medium">16,375 land records</span> and 221 villages. Tracks <span className="text-white font-medium">₹7,531 Cr total compensation</span> across 3,313 Ha of land. Contributed to <InlineHighlight>on-chain smart contracts</InlineHighlight> with tamper-proof ownership transfers and multi-party approvals.
                </>
              }
              bullets={[
                <><InlineHighlight>Role-scoped RAG</InlineHighlight>: multi-tenant security boundaries enforced directly inside vector retrieval queries so officers only retrieve their authorized division records.</>,
                <>Public citizen lookup: landowners track land acquisition and disbursement status via mobile + Gat number after district clearance.</>,
                <><span className="text-white font-medium">6 one-click executive intelligence reports</span> for the District Collector: Briefing, Bottlenecks, Financials, Timelines, Pending Cases, and Structure Reports.</>,
              ]}
              tags={["Blockchain", "Smart Contracts", "Python", "LangChain", "RAG", "Next.js", "Firebase"]}
              link="https://esulabh.in"
              linkText="esulabh.in"
              soundEnabled={soundEnabled}
              isCreative={true}
            />

            {/* 4. toasty.ai (Acquired) */}
            <ProjectCard
              metric="Acquired"
              metricSub="USA Exit (2024)"
              title="toasty.ai"
              tagline="Testimonial & Review Collection SaaS · Acquired by Lumination.ai (USA)"
              highlightPill={[
                { text: "Acquired by Lumination.ai (USA)", variant: "orange", icon: "🏆" },
                { text: "10+ GBs Multimedia", variant: "blue", icon: "✦" },
              ]}
              description={
                <>
                  Multi-tenant SaaS platform engineered for automated testimonial and social proof capture. Handled and stored <span className="text-white font-medium">10+ GBs of multimedia testimonials</span> (video, audio, text) and rendered them seamlessly on client websites using <InlineHighlight>custom Web Components</InlineHighlight> (lightweight &lt;custom-tag&gt;). Engineered embeddable widgets, wall-of-love displays, automated review collection sequences, and multi-tenant subdomains. Bootstrapped to paying MRR and acquired by <InlineHighlight>Lumination.ai (USA)</InlineHighlight> in 2024.
                </>
              }
              bullets={[
                <>Managed and stored <span className="text-white font-medium">10+ GBs of multimedia testimonials</span> (video, audio, and rich text) with high-efficiency CDN streaming and multi-region storage.</>,
                <>Zero-dependency <InlineHighlight>custom Web Components</InlineHighlight> (&lt;toasty-widget&gt;) enabling one-line client site embeds with sub-50ms render time.</>,
                <>Multi-tenant infrastructure with Next.js, Firebase Firestore, and automated review request email campaigns.</>,
                <>Bootstrapped from conception to paying customer MRR; acquired by <InlineHighlight>Lumination.ai (USA)</InlineHighlight> in 2024.</>,
              ]}
              tags={["Next.js", "Web Components", "Firebase", "Video / Multimedia", "Micro-SaaS", "Acquired"]}
              link="https://toasty.ai/"
              linkText="toasty.ai (acquired)"
              soundEnabled={soundEnabled}
              isCreative={true}
            />

            {/* 5. launchpage.me (Acquired) */}
            <ProjectCard
              metric="Acquired"
              metricSub="Micro-SaaS Exit"
              title="launchpage.me"
              tagline="No-Code Startup Waitlist Builder · Acquired by Canadian Entrepreneur"
              highlightPill={[
                { text: "Acquired by Canadian Entrepreneur", variant: "orange", icon: "🏆" },
                { text: "<60s Waitlist Builder", variant: "blue", icon: "✦" },
              ]}
              description={
                <>
                  Conversion-focused no-code waitlist builder and startup idea validator. Enabled early-stage founders to launch high-converting landing pages with <InlineHighlight>viral milestone referral mechanisms</InlineHighlight> and automated email capture in <span className="text-white font-medium">under 60 seconds</span>. Bootstrapped and acquired by a Canadian entrepreneur in 2024.
                </>
              }
              bullets={[
                <>Built a <InlineHighlight>viral milestone referral engine</InlineHighlight> (e.g. invite 3 friends for VIP early access) driving exponential organic user acquisition.</>,
                <>Zero-config analytics, webhook delivery, and double opt-in email verification pipelines.</>,
                <>Bootstrapped to hundreds of early founder waitlists; acquired by a Canadian entrepreneur in 2024.</>,
              ]}
              tags={["Next.js", "Firebase", "Tailwind CSS", "Viral Growth", "Acquired"]}
              link="https://launchpage.me/"
              linkText="launchpage.me (acquired)"
              soundEnabled={soundEnabled}
              isCreative={true}
            />

            {/* 6. Sanvichar */}
            <ProjectCard
              metric="3 Live"
              metricSub="board meetings"
              title="Sanvichar"
              tagline="AI Board Meeting Platform · Shivshahi Punarvasan Prakalp Ltd (Govt Board)"
              highlightPill={[
                { text: "3 Live Govt Board Meetings", variant: "blue", icon: "✦" },
                { text: "Bilingual NLP (EN+MR)", variant: "orange", icon: "⚡" },
              ]}
              description={
                <>
                  Hosted <span className="text-white font-medium">3 live government board meetings</span> transcribed and structured in real time for <InlineHighlight>Shivshahi Punarvasan Prakalp Ltd</InlineHighlight>. Engineered <InlineHighlight>Whisper-based speech transcription</InlineHighlight> with automated extraction of agenda items, decisions, action points, and recorded votes. Generates <InlineHighlight>bilingual (English + Marathi)</InlineHighlight> summaries and official resolution text with a diff-aware notes editor.
                </>
              }
              bullets={[
                <>Real-time <InlineHighlight>Whisper speech transcription</InlineHighlight> with structured agenda item extraction and voting tally records.</>,
                <><InlineHighlight>Diff-aware versioning notes editor</InlineHighlight> enabling the secretariat to review, audit, and approve summaries prior to official gazette publication.</>,
                <>Direct resolution-certificate generator producing legally compliant PDF certificates with digital signatures.</>,
              ]}
              tags={["Python", "Whisper STT", "LLM", "Next.js", "Firebase", "Bilingual NLP"]}
              link="https://www.sanvichar.online/"
              linkText="sanvichar.online"
              soundEnabled={soundEnabled}
              isCreative={true}
            />

            {/* 7. vela.video */}
            <ProjectCard
              metric="3.3K"
              metricSub="unique visitors"
              title="vela.video"
              tagline="AI Motion Graphics & Video Generation Platform · Creator & Developer"
              highlightPill={[
                { text: "3.3K Visitors · Gemini + Remotion", variant: "blue", icon: "✦" },
                { text: "Client-Side Export", variant: "orange", icon: "⚡" },
              ]}
              description={
                <>
                  Built <a href="https://www.vela.video/" target="_blank" rel="noopener noreferrer" className="text-white font-medium underline decoration-dotted decoration-zinc-400 underline-offset-[5px] hover:text-[#60a5fa] hover:decoration-[#60a5fa] transition-colors">vela.video</a>, an autonomous motion graphics video engine powered by <InlineHighlight>Remotion</InlineHighlight> composition skills and the <InlineHighlight>Google Gemini API</InlineHighlight>. Handled <span className="text-white font-medium">3.3K unique visitors</span>, <span className="text-white font-medium">4.7K page views</span>, and over 3.6K sessions with organic discovery (1.2K from Google, 558 from ChatGPT, 1.7K direct). Generates programmatic motion graphic videos with complete <InlineHighlight>client-side on-device export</InlineHighlight> for zero server rendering costs.
                </>
              }
              bullets={[
                <>Programmatic motion graphics pipeline combining <InlineHighlight>Remotion</InlineHighlight> compositions with <InlineHighlight>Gemini API</InlineHighlight> for instant script-to-visual video generation.</>,
                <><InlineHighlight>Client-side on-device export engine</InlineHighlight> delivering instant video previews and complete rendering directly in the browser via <InlineHighlight>WebCodecs</InlineHighlight>.</>,
                <>Organic distribution engine: scaled to <span className="text-white font-medium">3.3K unique visitors</span> and 4.7K page views (1.2K Google organic, 558 ChatGPT organic, 80 Bing, ProductHunt).</>,
              ]}
              tags={["Remotion", "Gemini API", "Next.js", "Motion Graphics", "On-Device Export", "WebCodecs"]}
              link="https://www.vela.video/"
              linkText="vela.video"
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
            <HighlightPill variant="blue" icon="⚡">Core Capabilities</HighlightPill>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
            {/* AI / ML */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#1b1d26] border border-[#2e3242] hover:border-[#105bff]/60 transition-colors space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono text-[#fe8500] font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fe8500] shadow-[0_0_6px_#fe8500]" />
                  AI &amp; Multi-Agent Systems
                </div>
                <HighlightPill variant="blue">Production Grade</HighlightPill>
              </div>
              <p className="text-xs text-zinc-400">
                Battle-tested RAG, autonomous agents, and voice pipelines serving millions of message interactions.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <TechBadge>RAG Pipeline Design</TechBadge>
                <TechBadge>LangChain Agents</TechBadge>
                <TechBadge>CrewAI Multi-Agent</TechBadge>
                <TechBadge>Pinecone Vector DB</TechBadge>
                <TechBadge>Whisper STT/TTS</TechBadge>
                <TechBadge>Prompt Engineering</TechBadge>
                <TechBadge>Autonomous Agent Crews</TechBadge>
                <TechBadge>Semantic Chunking</TechBadge>
              </div>
            </div>

            {/* Frontend */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#1b1d26] border border-[#2e3242] hover:border-[#105bff]/60 transition-colors space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono text-[#105bff] font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#105bff] shadow-[0_0_6px_#105bff]" />
                  Frontend Architecture
                </div>
                <HighlightPill variant="blue">Reactive &amp; Fast</HighlightPill>
              </div>
              <p className="text-xs text-zinc-400">
                High-conversion, sub-second web applications and cross-platform native mobile interfaces.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <TechBadge>Next.js 16 (App Router)</TechBadge>
                <TechBadge>React 19</TechBadge>
                <TechBadge>Tailwind CSS</TechBadge>
                <TechBadge>Flutter (iOS &amp; Android)</TechBadge>
                <TechBadge>Remotion Motion Graphics</TechBadge>
                <TechBadge>Web Components</TechBadge>
                <TechBadge>Responsive UI Systems</TechBadge>
                <TechBadge>WebCodecs</TechBadge>
              </div>
            </div>

            {/* Backend & Cloud */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#1b1d26] border border-[#2e3242] hover:border-[#105bff]/60 transition-colors space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono text-[#fe8500] font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fe8500] shadow-[0_0_6px_#fe8500]" />
                  Backend &amp; Cloud Infrastructure
                </div>
                <HighlightPill variant="orange">High Uptime</HighlightPill>
              </div>
              <p className="text-xs text-zinc-400">
                Scalable APIs, automated payment routing, event streaming, and tamper-proof smart contracts.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <TechBadge>Python (FastAPI, Flask)</TechBadge>
                <TechBadge>Firebase (Firestore, Functions)</TechBadge>
                <TechBadge>REST APIs</TechBadge>
                <TechBadge color="orange">Razorpay Route Split Payouts</TechBadge>
                <TechBadge>Smart Contracts &amp; Blockchain</TechBadge>
                <TechBadge>Redis Caching</TechBadge>
                <TechBadge>Vector Search Indexing</TechBadge>
              </div>
            </div>

            {/* Engineering & Delivery */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#1b1d26] border border-[#2e3242] hover:border-[#105bff]/60 transition-colors space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono text-[#105bff] font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#105bff] shadow-[0_0_6px_#105bff]" />
                  Engineering Leadership
                </div>
                <HighlightPill variant="blue">Execution</HighlightPill>
              </div>
              <p className="text-xs text-zinc-400">
                Direct discovery with government leadership, sprint velocity, and end-to-end product delivery.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <TechBadge>System Design</TechBadge>
                <TechBadge>Technical Architecture</TechBadge>
                <TechBadge>District Collector Client Discovery</TechBadge>
                <TechBadge>Agile Sprint Delivery</TechBadge>
                <TechBadge>Code Review &amp; Mentoring</TechBadge>
                <TechBadge>Production Observability</TechBadge>
              </div>
            </div>
          </div>
        </section>

        {/* WORK EXPERIENCE */}
        <section className="pt-14 border-t border-[#2e3242] mt-10">
          <div className="flex items-center justify-between pb-6">
            <h2 className="text-xs font-mono tracking-widest text-[#fe8500] uppercase font-semibold">
              Experience
            </h2>
            <HighlightPill variant="blue" icon="✦">2022 – Present · 3+ Years</HighlightPill>
          </div>

          <div className="space-y-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#1b1d26] border border-[#2e3242] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
                <div>
                  <h3 className="text-base font-semibold text-white">
                    AI/ML Engineer &amp; Technical Lead
                  </h3>
                  <p className="text-xs text-[#105bff] font-medium pt-0.5">
                    Arixolve Ventures Pvt Ltd · Kanpur, India
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <HighlightPill variant="orange" icon="⚡">Technical Lead</HighlightPill>
                  <HighlightPill variant="blue" icon="✦">Full-Time</HighlightPill>
                </div>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Lead architecture and delivery across the company&apos;s product and government project portfolio. Direct client discovery sessions with <InlineHighlight>District Collectors</InlineHighlight> and <InlineHighlight>Smart City programme officers</InlineHighlight> to formulate technical specs, <InlineHighlight>multi-agent pipelines</InlineHighlight>, and high-availability production systems. Oversee full-stack engineers across web, mobile, and AI infrastructure.
              </p>
              <ul className="space-y-1.5 border-l border-[#2e3242] pl-3.5 text-xs text-zinc-300 pt-1">
                <li>
                  <span className="text-[#fe8500] mr-1.5 font-bold">▪</span>
                  Architected <InlineHighlight>municipal citizen AI</InlineHighlight> for <InlineHighlight>Chh. Sambhaji Nagar Smart City</InlineHighlight> (<span className="text-white font-medium">21.6K chats</span>, <span className="text-white font-medium">58.7K messages</span>).
                </li>
                <li>
                  <span className="text-[#fe8500] mr-1.5 font-bold">▪</span>
                  Engineered <InlineHighlight>blockchain land records system</InlineHighlight> for <InlineHighlight>Palghar Collector Office</InlineHighlight> (<span className="text-white font-medium">₹7,531 Cr compensation</span>, <span className="text-white font-medium">16,375 records</span>).
                </li>
                <li>
                  <span className="text-[#fe8500] mr-1.5 font-bold">▪</span>
                  Spearheaded <InlineHighlight>Sanvichar board meeting engine</InlineHighlight> running <span className="text-white font-medium">3 live government meetings</span> with bilingual transcription.
                </li>
              </ul>
              <div className="flex flex-wrap gap-1.5 pt-2">
                <TechBadge>RAG Systems</TechBadge>
                <TechBadge>Multi-Agent Crews</TechBadge>
                <TechBadge>Govt Tech Specs</TechBadge>
                <TechBadge>Production Scaling</TechBadge>
                <TechBadge color="orange">99.9% Uptime</TechBadge>
              </div>
            </div>
          </div>
        </section>

        {/* EDUCATION & BACKGROUND */}
        <section className="pt-14 border-t border-[#2e3242] mt-10">
          <div className="flex items-center justify-between pb-4">
            <h2 className="text-xs font-mono tracking-widest text-[#fe8500] uppercase font-semibold">
              Education
            </h2>
            <HighlightPill variant="blue" icon="🎓">B.Tech (CSE)</HighlightPill>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-300 p-4 sm:p-5 rounded-2xl bg-[#1b1d26] border border-[#2e3242]">
            <div>
              <span className="text-white font-semibold text-sm">B.Tech in Computer Science &amp; Engineering</span>
              <p className="text-zinc-400 pt-0.5">Dr. A.P.J. Abdul Kalam Technical University (AKTU) · Class of 2023</p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                <TechBadge>Data Structures &amp; Algorithms</TechBadge>
                <TechBadge>Machine Learning</TechBadge>
                <TechBadge>DBMS</TechBadge>
                <TechBadge>Operating Systems</TechBadge>
                <TechBadge>Computer Networks</TechBadge>
                <TechBadge>Distributed Systems</TechBadge>
              </div>
            </div>
            <HighlightPill variant="orange" icon="🏆">70% Aggregate</HighlightPill>
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
              className="w-full sm:w-auto px-6 sm:px-8 py-2.5 rounded-xl bg-[#105bff] hover:bg-[#105bff]/90 text-white text-xs sm:text-sm font-mono flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,91,255,0.45)] hover:shadow-[0_0_28px_rgba(16,91,255,0.7)] hover:scale-[1.02] shrink-0"
            >
              <Mail className="w-4 h-4 text-white" />
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
              <TechBadge color="orange">📍 IN · IST</TechBadge>
              <TechBadge>⚡ Available Immediately</TechBadge>
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
