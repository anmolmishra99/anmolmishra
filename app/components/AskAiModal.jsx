"use client";

import React, { useState } from "react";
import { Sparkles, X, Send, Bot, User, CheckCircle2, ArrowRight } from "lucide-react";
import { playPixelBlip, playPixelChirp } from "./SoundEffects";

const KNOWLEDGE_BASE = [
  {
    triggers: ["smart city", "ai mitra", "citizen", "sambhaji", "government", "municipal"],
    answer:
      "At Arixolve Ventures, Anmol built **AI Mitra**, a production RAG citizen chatbot for Chh. Sambhaji Nagar Municipal Corporation & Smart City. It has handled **21,596 citizen conversations** and **58,706 messages** (averaging 2.7 messages/chat), saving citizens over **16,197 hours**. Built with Python, LangChain, CrewAI, Pinecone, and Next.js with bilingual support (English + Marathi) and voice STT/TTS.",
  },
  {
    triggers: ["esulabh", "blockchain", "land", "palghar", "collector"],
    answer:
      "Anmol delivered **eSulabh**, a blockchain land acquisition system + AI layer for the Palghar Collector Office. It tracks **10+ mega infrastructure projects** across 221 villages, monitoring **₹7,531 Cr** in total compensation across **16,375 land records**. He engineered role-scoped RAG ensuring each officer only retrieves records for their division, plus 6 one-click intelligence reports for the District Collector.",
  },
  {
    triggers: ["payge", "social sellers", "shopify", "razorpay", "ecommerce"],
    answer:
      "Anmol is Co-founder & CTO of **Payge** (payge.store) — an Indian Shopify for social sellers. Sellers launch single-product stores with checkout, orders, and analytics in one place (100+ live stores, 30K+ tracked events). Features automated Razorpay Route 95/5 split payouts (zero manual reconciliation) and an automated AI Growth OS analyzing competitor Instagram reels.",
  },
  {
    triggers: ["acquired", "exit", "toasty", "launchpage", "saas", "products sold"],
    answer:
      "In 2024, Anmol had **two self-built SaaS products acquired**: \n1. **toasty.ai**: Testimonial collection SaaS handling 10+ GBs of multimedia testimonials rendered using custom Web Components (<custom-tag> HTML tag), acquired by Lumination.ai (USA).\n2. **launchpage.me**: Conversion-focused no-code waitlist builder and startup validator, acquired by a Canadian entrepreneur.",
  },
  {
    triggers: ["vela", "vela.video", "video", "remotion", "motion graphics", "gemini"],
    answer:
      "Anmol built **vela.video** (https://www.vela.video/), an AI motion graphics video engine combining Remotion and the Google Gemini API with on-device browser export. It has attracted **3.3K unique visitors** and **4.7K page views** (1.2K from Google organic, 558 from ChatGPT organic).",
  },
  {
    triggers: ["tech stack", "skills", "technologies", "frameworks", "tools"],
    answer:
      "**AI/ML**: RAG Pipelines, LangChain, CrewAI multi-agent orchestration, Vector DBs (Pinecone), Prompt Engineering, Whisper STT/TTS.\n**Frontend**: Next.js (App Router, SSR, Server Actions), React 19, Tailwind CSS, Flutter, Remotion, Web Components.\n**Backend**: Python (FastAPI, Flask), Firebase (Firestore, Cloud Functions), REST APIs, Smart Contracts, Razorpay Route.",
  },
  {
    triggers: ["sanvichar", "board meeting", "whisper", "transcription", "marathi"],
    answer:
      "Anmol built **Sanvichar** (https://www.sanvichar.online/), an AI board meeting platform for Shivshahi Punarvasan Prakalp Ltd (Govt of Maharashtra). It hosted 3 live board meetings with real-time Whisper-based transcription, automated extraction of agenda items and votes, bilingual (English + Marathi) resolution summaries, and a diff-aware notes review editor.",
  },
  {
    triggers: ["contact", "hire", "email", "reach", "linkedin", "phone"],
    answer:
      "You can reach Anmol directly:\n- **Email**: mishraanmol258@gmail.com\n- **LinkedIn**: linkedin.com/in/anmolmishra99\n- **GitHub**: github.com/anmolmishra99\n- **Phone**: +91-7275299418\nHe is open to select technical lead roles, AI advisory, and high-impact engineering projects.",
  },
];

export default function AskAiModal({ isOpen, onClose, soundEnabled }) {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content:
        "Hello! I am Anmol's interactive portfolio agent. Ask me anything about his production AI deployments, SaaS acquisitions, or technical architecture!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleSend = (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    if (soundEnabled) playPixelBlip(440, "sine", 0.05);

    const newMessages = [...messages, { role: "user", content: query }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const lower = query.toLowerCase();
      let matched = KNOWLEDGE_BASE.find((item) =>
        item.triggers.some((t) => lower.includes(t))
      );

      const reply = matched
        ? matched.answer
        : "Anmol is an AI/ML Engineer & Technical Lead with 3+ years experience shipping citizen AI for Indian governments (21.6K+ chats, ₹7,531 Cr tracked) and scaling SaaS (2 products acquired in 2024, now building Payge.store). Feel free to ask about AI Mitra, eSulabh, Payge, or his tech stack!";

      if (soundEnabled) playPixelChirp();
      setMessages([...newMessages, { role: "bot", content: reply }]);
      setIsTyping(false);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#1b1d26] border border-[#2e3242] rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#2e3242] bg-[#21232e]/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#105bff]/20 border border-[#105bff]/40 flex items-center justify-center text-[#fe8500]">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-100 flex items-center gap-1.5">
                Ask Anmol&apos;s AI
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#fe8500]/20 text-[#fe8500] font-mono">
                  RAG Preview
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">Trained on verified resume &amp; deployments</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-[#2e3242] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm scrollbar-thin">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "bot" && (
                <div className="w-6 h-6 rounded-md bg-[#21232e] border border-[#2e3242] flex items-center justify-center text-[#fe8500] shrink-0 text-xs mt-0.5 shadow-sm">
                  🤖
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-xl px-3.5 py-2.5 leading-relaxed whitespace-pre-line ${
                  m.role === "user"
                    ? "bg-[#105bff] text-white shadow-[0_0_12px_rgba(16,91,255,0.35)]"
                    : "bg-[#21232e] border border-[#2e3242] text-zinc-200"
                }`}
              >
                {m.content}
              </div>
              {m.role === "user" && (
                <div className="w-6 h-6 rounded-md bg-[#105bff]/80 border border-[#105bff] flex items-center justify-center text-white shrink-0 text-xs mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2 items-center text-xs text-[#fe8500] italic py-1">
              <span className="w-2 h-2 rounded-full bg-[#fe8500] animate-ping" />
              Retrieving resume knowledge...
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-[#2e3242] bg-[#21232e]/90 flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
          <span className="text-[11px] text-zinc-400 whitespace-nowrap">Suggested:</span>
          {[
            "AI Mitra Chatbot",
            "eSulabh Blockchain",
            "2 SaaS Acquired",
            "Payge.store",
            "Tech Stack",
          ].map((chip) => (
            <button
              key={chip}
              onClick={() => handleSend(chip)}
              className="px-2.5 py-1 rounded-full bg-[#1b1d26] border border-[#2e3242] text-zinc-300 hover:text-[#fe8500] hover:border-[#fe8500]/60 whitespace-nowrap transition-colors text-[11px]"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-[#21232e] border-t border-[#2e3242] flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Anmol's projects, RAG architecture, or background..."
            className="flex-1 bg-[#1b1d26] border border-[#2e3242] rounded-lg px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-[#105bff] transition-colors"
          />
          <button
            type="submit"
            className="px-3.5 py-2 rounded-lg bg-[#105bff] hover:bg-[#105bff]/90 text-white font-medium text-sm flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-[0_0_12px_rgba(16,91,255,0.4)]"
            disabled={!input.trim()}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
