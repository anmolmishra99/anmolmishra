"use client";

import React, { useState, useEffect } from "react";
import { playPixelChirp, playPixelBlip } from "./SoundEffects";

const QUOTES = [
  "21.6K+ citizen chats delivered! ⚡",
  "100+ active stores on Payge 🛒",
  "2 SaaS products acquired in 2024! 🚀",
  "₹7,531 Cr compensation tracked 🏛️",
  "RAG + CrewAI multi-agent architecture 🤖",
  "Hi! I'm Anmol's pixel companion 🦉",
];

export default function PixelCompanion({ soundEnabled = true, isCreative = false }) {
  const [frame, setFrame] = useState(0);
  const [bubbleText, setBubbleText] = useState("");
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);

  // Wing flapping animation cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % 4);
    }, 180);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    if (soundEnabled) playPixelChirp();
    setIsSpinning(true);
    setBubbleText(QUOTES[quoteIdx]);
    setQuoteIdx((prev) => (prev + 1) % QUOTES.length);
    setBubbleVisible(true);

    setTimeout(() => setIsSpinning(false), 600);
    setTimeout(() => setBubbleVisible(false), 3400);
  };

  return (
    <div className="relative inline-block select-none pointer-events-auto">
      {/* Pixel Speech Bubble */}
      {bubbleVisible && (
        <div
          className="absolute -top-12 -left-6 z-30 whitespace-nowrap bg-[#1b1d26] border border-[#fe8500] text-[#fe8500] text-[11px] font-mono px-2.5 py-1 rounded shadow-[0_0_12px_rgba(254,133,0,0.3)] backdrop-blur-sm animate-fade-in"
          style={{ imageRendering: "pixelated" }}
        >
          {bubbleText}
          <div className="absolute -bottom-1.5 left-8 w-2 h-2 bg-[#1b1d26] border-r border-b border-[#fe8500] rotate-45 transform" />
        </div>
      )}

      {/* Interactive Bird Companion Container */}
      <div
        onClick={handleClick}
        className={`group relative cursor-pointer transition-transform duration-300 ${
          isSpinning ? "rotate-[360deg] scale-125" : "hover:scale-115 active:scale-95"
        }`}
        style={{
          animation: "pixelCompanionHover 2.4s ease-in-out infinite",
        }}
        title="Click me for a secret!"
      >
        {/* Glow behind companion in Creative Mode */}
        {isCreative && (
          <div className="absolute inset-0 bg-[#105bff]/30 rounded-full blur-md -z-10 animate-pulse shadow-[0_0_16px_#fe8500]" />
        )}

        {/* The Pixel Bird Sprite */}
        <PixelBirdSVG frame={frame} />

        {/* Pixel Shadow underneath */}
        <div
          className="mx-auto w-6 h-1 bg-black/40 rounded-full blur-[1px] mt-0.5"
          style={{
            animation: "pixelShadowSquash 2.4s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
}

// Authentic 20x18 Pixel Art Bird / Owl Sprite
function PixelBirdSVG({ frame }) {
  // Wing positions based on frame:
  // frame 0: neutral
  // frame 1: wing up
  // frame 2: wing high
  // frame 3: wing down
  const wingY = frame === 1 ? -1 : frame === 2 ? -2 : frame === 3 ? 1 : 0;

  return (
    <svg
      width="34"
      height="30"
      viewBox="0 0 20 18"
      style={{ shapeRendering: "crispEdges" }}
      className="pixelated drop-shadow-md"
    >
      {/* Outline */}
      {/* Head / Crest */}
      <rect x="7" y="2" width="6" height="1" fill="#2d1b09" />
      <rect x="5" y="3" width="2" height="1" fill="#2d1b09" />
      <rect x="13" y="3" width="2" height="1" fill="#2d1b09" />
      <rect x="4" y="4" width="1" height="6" fill="#2d1b09" />
      <rect x="15" y="4" width="1" height="6" fill="#2d1b09" />

      {/* Body Outlines */}
      <rect x="3" y="10" width="1" height="4" fill="#2d1b09" />
      <rect x="16" y="10" width="1" height="4" fill="#2d1b09" />
      <rect x="4" y="14" width="2" height="1" fill="#2d1b09" />
      <rect x="14" y="14" width="2" height="1" fill="#2d1b09" />
      <rect x="6" y="15" width="8" height="1" fill="#2d1b09" />

      {/* Body Fill (Golden Brown / Caramel) */}
      <rect x="5" y="4" width="10" height="6" fill="#b45309" />
      <rect x="4" y="10" width="12" height="4" fill="#92400e" />
      <rect x="6" y="14" width="8" height="1" fill="#78350f" />

      {/* Belly Highlight (Cream / Biscuit) */}
      <rect x="8" y="10" width="5" height="4" fill="#fde68a" />
      <rect x="9" y="9" width="3" height="1" fill="#fef3c7" />

      {/* Eyes */}
      {/* Eye Left */}
      <rect x="6" y="5" width="3" height="3" fill="#ffffff" />
      <rect x="7" y="6" width="2" height="2" fill="#09090b" />
      <rect x="7" y="6" width="1" height="1" fill="#ffffff" />

      {/* Eye Right */}
      <rect x="11" y="5" width="3" height="3" fill="#ffffff" />
      <rect x="12" y="6" width="2" height="2" fill="#09090b" />
      <rect x="12" y="6" width="1" height="1" fill="#ffffff" />

      {/* Beak (Yellow / Orange) */}
      <rect x="9" y="7" width="2" height="2" fill="#f59e0b" />
      <rect x="9" y="8" width="2" height="1" fill="#d97706" />

      {/* Animated Wings */}
      {/* Left Wing */}
      <g transform={`translate(0, ${wingY})`}>
        <rect x="1" y="9" width="3" height="1" fill="#2d1b09" />
        <rect x="0" y="10" width="4" height="2" fill="#d97706" />
        <rect x="1" y="12" width="3" height="1" fill="#b45309" />
        <rect x="2" y="13" width="2" height="1" fill="#78350f" />
      </g>

      {/* Right Wing */}
      <g transform={`translate(0, ${wingY})`}>
        <rect x="16" y="9" width="3" height="1" fill="#2d1b09" />
        <rect x="16" y="10" width="4" height="2" fill="#d97706" />
        <rect x="16" y="12" width="3" height="1" fill="#b45309" />
        <rect x="16" y="13" width="2" height="1" fill="#78350f" />
      </g>

      {/* Tiny Feet */}
      <rect x="7" y="16" width="2" height="1" fill="#f59e0b" />
      <rect x="11" y="16" width="2" height="1" fill="#f59e0b" />
    </svg>
  );
}
