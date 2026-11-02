"use client";

import React, { useState, useEffect } from "react";
import { playBoatHorn } from "./SoundEffects";

const SHIP_QUOTES = [
  "Ahoy! Sailing on production AI ⛵",
  "21.6K+ citizen chats delivered! ⚡",
  "100+ active stores on Payge 🛒",
  "2 SaaS products acquired in 2024! 🚀",
  "₹7,531 Cr compensation tracked 🏛️",
  "Smooth sailing with RAG & CrewAI ⚓",
  "Toot toot! Full steam ahead 🚢",
];

export default function PixelCompanion({
  waterHeight = 0,
  soundEnabled = true,
  isCreative = true,
}) {
  const [posX, setPosX] = useState(100);
  const [direction, setDirection] = useState(1); // 1 = right, -1 = left
  const [flagFrame, setFlagFrame] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [jumpOffset, setJumpOffset] = useState(0);
  const [bubbleText, setBubbleText] = useState("");
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);

  // Horizontal sailing across the bottom of the screen
  useEffect(() => {
    const sailTimer = setInterval(() => {
      const winW = typeof window !== "undefined" ? window.innerWidth : 1200;
      setPosX((prevX) => {
        let nextX = prevX + direction * 1.3;
        if (nextX >= winW - 65) {
          setDirection(-1);
          return winW - 65;
        } else if (nextX <= 15) {
          setDirection(1);
          return 15;
        }
        return nextX;
      });
    }, 30);

    return () => clearInterval(sailTimer);
  }, [direction]);

  // Flag flutter animation cycle
  useEffect(() => {
    const flagTimer = setInterval(() => {
      setFlagFrame((prev) => (prev + 1) % 4);
    }, 180);
    return () => clearInterval(flagTimer);
  }, []);

  // Click to jump / leap over waves
  const handleJump = (e) => {
    e.stopPropagation();
    if (soundEnabled) playBoatHorn();

    setIsJumping(true);
    setJumpOffset(50); // Leaps 50px up over the waves
    setBubbleText(SHIP_QUOTES[quoteIdx]);
    setQuoteIdx((prev) => (prev + 1) % SHIP_QUOTES.length);
    setBubbleVisible(true);

    // Smooth gravity drop back to water surface
    setTimeout(() => {
      setJumpOffset(0);
    }, 320);

    setTimeout(() => {
      setIsJumping(false);
    }, 600);

    setTimeout(() => {
      setBubbleVisible(false);
    }, 2800);
  };

  // FLOATING LOGIC:
  // When no water (waterHeight === 0): floats along the floor (at 10px).
  // When water fills up (waterHeight > 0): floats right on top of the water surface (waterHeight - 6px)!
  const currentAltitude = Math.max(10, waterHeight - 6) + jumpOffset;

  return (
    <div
      className="fixed z-30 pointer-events-none select-none transition-[bottom] duration-300 ease-out"
      style={{
        left: `${posX}px`,
        bottom: `${currentAltitude}px`,
      }}
    >
      {/* Speech bubble (always upright, centered over ship) */}
      {bubbleVisible && (
        <div className="absolute -top-11 left-1/2 -translate-x-1/2 z-40 whitespace-nowrap bg-[#1b1d26]/95 border border-[#fe8500] text-[#fe8500] text-[10px] sm:text-[11px] font-mono px-2 sm:px-2.5 py-1 rounded-md shadow-[0_0_12px_rgba(254,133,0,0.35)] backdrop-blur-sm pointer-events-none animate-fadeIn">
          {bubbleText}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1b1d26] border-r border-b border-[#fe8500] rotate-45 transform" />
        </div>
      )}

      {/* Clickable Pixel Ship (Flips horizontally when turning around) */}
      <div
        onClick={handleJump}
        className="pointer-events-auto cursor-pointer group transition-transform duration-150 active:scale-95"
        style={{
          transform: `scaleX(${direction})`,
        }}
        title="Click to blow ship horn & jump! ⛵"
      >
        <div
          className="relative"
          style={{
            animation: isJumping ? "none" : "pixelShipRock 2.8s ease-in-out infinite alternate",
          }}
        >
          {/* Subtle Royal Blue / Orange atmospheric glow in creative mode */}
          {isCreative && (
            <div className="absolute inset-0 bg-[#105bff]/25 rounded-full blur-md -z-10 animate-pulse shadow-[0_0_16px_#fe8500]" />
          )}

          {/* Authentic 8-bit Pixel Ship Sprite */}
          <PixelShipSVG flagFrame={flagFrame} />

          {/* Water ripple / foam beneath hull */}
          <div className="flex items-center justify-center gap-1 -mt-1 opacity-80">
            <span className="w-1.5 h-0.5 bg-white/70 rounded-full animate-pulse" />
            <span className="w-6 h-0.5 bg-[#38bdf8]/70 rounded-full shadow-[0_0_4px_#38bdf8]" />
            <span className="w-2 h-0.5 bg-white/60 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Authentic 38x32 Pixel Art Ship / Sailboat Sprite
function PixelShipSVG({ flagFrame = 0 }) {
  const flagWave = flagFrame % 2 === 0 ? 0 : 1;

  return (
    <svg
      width="42"
      height="34"
      viewBox="0 0 38 32"
      style={{ shapeRendering: "crispEdges" }}
      className="pixelated drop-shadow-md"
    >
      {/* 1. MAST TOP & FLUTTERING FLAG */}
      <rect x="17" y="1" width="2" height="3" fill="#0f172a" />
      {/* Royal blue & warm orange pennant fluttering */}
      <rect x={19 + flagWave} y="1" width="5" height="2" fill="#fe8500" />
      <rect x={19 + flagWave} y="3" width="3" height="1" fill="#105bff" />

      {/* 2. CENTER MAST (Wood brown) */}
      <rect x="17" y="4" width="2" height="18" fill="#78350f" />

      {/* 3. MAIN SAIL (Left, billowing in white & soft sky shading) */}
      {/* Sail Outline */}
      <rect x="7" y="6" width="9" height="1" fill="#0f172a" />
      <rect x="5" y="7" width="2" height="1" fill="#0f172a" />
      <rect x="4" y="8" width="1" height="9" fill="#0f172a" />
      <rect x="5" y="17" width="11" height="1" fill="#0f172a" />
      {/* Main Sail Fill */}
      <rect x="6" y="7" width="10" height="1" fill="#ffffff" />
      <rect x="5" y="8" width="11" height="9" fill="#ffffff" />
      {/* Shading folds */}
      <rect x="5" y="10" width="3" height="7" fill="#e0f2fe" />
      <rect x="8" y="13" width="3" height="4" fill="#bae6fd" />

      {/* 4. FORESAIL / JIB (Right, triangular sail) */}
      <rect x="20" y="8" width="1" height="9" fill="#0f172a" />
      <rect x="21" y="9" width="3" height="8" fill="#ffffff" />
      <rect x="24" y="11" width="3" height="6" fill="#ffffff" />
      <rect x="27" y="13" width="2" height="4" fill="#e0f2fe" />
      <rect x="29" y="15" width="2" height="2" fill="#bae6fd" />
      <rect x="20" y="17" width="12" height="1" fill="#0f172a" />

      {/* 5. DECK & CABIN */}
      <rect x="12" y="18" width="14" height="2" fill="#b45309" />
      <rect x="13" y="19" width="12" height="1" fill="#f59e0b" />
      {/* Cabin Roof & Window */}
      <rect x="14" y="16" width="3" height="2" fill="#78350f" />
      <rect x="15" y="17" width="1" height="1" fill="#fef08a" />

      {/* 6. HULL (Royal Blue with warm orange trim) */}
      {/* Upper Gunwale (Warm Orange) */}
      <rect x="4" y="20" width="30" height="2" fill="#fe8500" />
      <rect x="3" y="21" width="1" height="1" fill="#fe8500" />
      <rect x="34" y="21" width="1" height="1" fill="#fe8500" />

      {/* Main Hull Body (Royal Blue #105bff) */}
      <rect x="4" y="22" width="30" height="4" fill="#105bff" />
      <rect x="6" y="26" width="26" height="2" fill="#0c3cb0" />
      <rect x="9" y="28" width="20" height="1" fill="#0c3cb0" />
      <rect x="12" y="29" width="14" height="1" fill="#0f172a" />

      {/* Hull Bow (Right point) & Stern (Left rise) */}
      <rect x="34" y="22" width="2" height="2" fill="#105bff" />
      <rect x="36" y="22" width="1" height="1" fill="#fe8500" />
      <rect x="2" y="22" width="2" height="2" fill="#105bff" />
      <rect x="1" y="22" width="1" height="1" fill="#fe8500" />

      {/* 7. GLOWING PORTHOLES */}
      <rect x="8" y="23" width="2" height="2" fill="#fef08a" />
      <rect x="9" y="24" width="1" height="1" fill="#f59e0b" />

      <rect x="15" y="23" width="2" height="2" fill="#fef08a" />
      <rect x="16" y="24" width="1" height="1" fill="#f59e0b" />

      <rect x="22" y="23" width="2" height="2" fill="#fef08a" />
      <rect x="23" y="24" width="1" height="1" fill="#f59e0b" />

      <rect x="29" y="23" width="2" height="2" fill="#fef08a" />
      <rect x="30" y="24" width="1" height="1" fill="#f59e0b" />

      {/* Anchor icon on bow */}
      <rect x="32" y="23" width="1" height="2" fill="#93c5fd" />
    </svg>
  );
}
