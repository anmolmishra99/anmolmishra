"use client";

import React, { useState, useEffect, useRef } from "react";
import { playPixelChirp, playPixelBlip } from "./SoundEffects";

const QUOTES = [
  "Flapping high above the water! 🌊",
  "21.6K+ citizen chats delivered! ⚡",
  "100+ active stores on Payge 🛒",
  "2 SaaS products acquired in 2024! 🚀",
  "₹7,531 Cr compensation tracked 🏛️",
  "Hop hop! Anmol's pixel companion 🦉",
  "Wheee! 🪽",
];

export default function PixelCompanion({
  waterHeight = 0,
  soundEnabled = true,
  isCreative = true,
}) {
  const [posX, setPosX] = useState(120);
  const [direction, setDirection] = useState(1); // 1 = right, -1 = left
  const [frame, setFrame] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [jumpOffset, setJumpOffset] = useState(0);
  const [bubbleText, setBubbleText] = useState("");
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);

  // Horizontal flying across the bottom of the screen
  useEffect(() => {
    const flightTimer = setInterval(() => {
      const winW = typeof window !== "undefined" ? window.innerWidth : 1200;
      setPosX((prevX) => {
        let nextX = prevX + direction * 1.4;
        if (nextX >= winW - 55) {
          setDirection(-1);
          return winW - 55;
        } else if (nextX <= 15) {
          setDirection(1);
          return 15;
        }
        return nextX;
      });
    }, 30);

    return () => clearInterval(flightTimer);
  }, [direction]);

  // Wing flapping animation (faster during jump)
  useEffect(() => {
    const flapSpeed = isJumping ? 75 : 150;
    const flapTimer = setInterval(() => {
      setFrame((prev) => (prev + 1) % 4);
    }, flapSpeed);

    return () => clearInterval(flapTimer);
  }, [isJumping]);

  // Click to jump high into the air
  const handleJump = (e) => {
    e.stopPropagation();
    if (soundEnabled) playPixelChirp();

    setIsJumping(true);
    setJumpOffset(54); // Jump hop upwards!
    setBubbleText(QUOTES[quoteIdx]);
    setQuoteIdx((prev) => (prev + 1) % QUOTES.length);
    setBubbleVisible(true);

    // Gravity glide down
    setTimeout(() => {
      setJumpOffset(0);
    }, 280);

    setTimeout(() => {
      setIsJumping(false);
    }, 550);

    setTimeout(() => {
      setBubbleVisible(false);
    }, 2400);
  };

  // Base altitude: always floats safely a step above the water level
  const altitudeFromBottom = waterHeight + 24 + jumpOffset;

  return (
    <div
      className="fixed z-30 pointer-events-none select-none transition-[bottom] duration-300 ease-out"
      style={{
        left: `${posX}px`,
        bottom: `${altitudeFromBottom}px`,
      }}
    >
      {/* Speech bubble (always upright, not mirrored) */}
      {bubbleVisible && (
        <div className="absolute -top-11 -left-10 z-40 whitespace-nowrap bg-[#1b1d26]/95 border border-[#fe8500] text-[#fe8500] text-[11px] font-mono px-2.5 py-1 rounded-md shadow-[0_0_12px_rgba(254,133,0,0.35)] backdrop-blur-sm pointer-events-none animate-fadeIn">
          {bubbleText}
          <div className="absolute -bottom-1.5 left-12 w-2 h-2 bg-[#1b1d26] border-r border-b border-[#fe8500] rotate-45 transform" />
        </div>
      )}

      {/* Clickable Bird Sprite (flips facing direction) */}
      <div
        onClick={handleJump}
        className="pointer-events-auto cursor-pointer group transition-transform duration-150 active:scale-90"
        style={{
          transform: `scaleX(${direction}) ${isJumping ? "scale(1.15)" : ""}`,
        }}
        title="Click me to jump! 🪽"
      >
        <div
          className="relative"
          style={{
            animation: isJumping ? "none" : "pixelCompanionHover 2s ease-in-out infinite",
          }}
        >
          {/* Subtle Royal Blue / Orange glow */}
          {isCreative && (
            <div className="absolute inset-0 bg-[#105bff]/30 rounded-full blur-md -z-10 animate-pulse shadow-[0_0_14px_#fe8500]" />
          )}

          {/* Authentic Pixel Bird Sprite */}
          <PixelBirdSVG frame={frame} />

          {/* Shadow beneath bird (visible when near floor/water surface) */}
          <div
            className="mx-auto w-6 h-1 bg-black/40 rounded-full blur-[1px] mt-0.5 opacity-60"
            style={{
              transform: `scale(${Math.max(0.4, 1 - jumpOffset / 80)})`,
              transition: "transform 0.2s ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Authentic 20x18 Pixel Art Bird / Owl Sprite
function PixelBirdSVG({ frame }) {
  // Wing positions based on frame:
  // frame 0: neutral, 1: wing up, 2: wing high, 3: wing down
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
