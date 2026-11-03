"use client";

import React, { useState, useEffect, useRef } from "react";
import { playBoatHorn } from "./SoundEffects";

const SHIP_QUOTES = [
  "RMS TITANIC AI · Full steam ahead! 🚢",
  "21.6K+ citizen chats delivered! ⚡",
  "100+ active stores on Payge 🛒",
  "2 SaaS products acquired in 2024! 🚀",
  "₹7,531 Cr compensation tracked 🏛️",
  "Smooth sailing with RAG & CrewAI ⚓",
  "Toot toot! Unsinkable production AI 🚢",
];

// Funnel positions relative to the 106px-wide Titanic sprite when facing RIGHT (direction = 1)
// Funnels 1, 2, 3 were connected to the boiler rooms; Funnel 4 was ventilation.
const FUNNEL_OFFSETS_RIGHT = [
  { x: 34, y: 33, primary: true },
  { x: 45, y: 33, primary: true },
  { x: 56, y: 33, primary: true },
  { x: 67, y: 33, primary: false },
];

export default function PixelCompanion({
  waterHeight = 0,
  soundEnabled = true,
  isCreative = true,
}) {
  const [posX, setPosX] = useState(120);
  const [direction, setDirection] = useState(1); // 1 = right, -1 = left
  const [bubbleText, setBubbleText] = useState("");
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);

  // Refs for smooth 60fps Canvas smoke simulation & ship movement
  const smokeCanvasRef = useRef(null);
  const posRef = useRef(120);
  const dirRef = useRef(1);
  const waterHeightRef = useRef(waterHeight);
  const particlesRef = useRef([]);

  useEffect(() => {
    waterHeightRef.current = waterHeight;
  }, [waterHeight]);

  // 60FPS Ship Movement + Fluid Volumetric Smoke Simulation on HTML5 Canvas
  useEffect(() => {
    const canvas = smokeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animId;
    let frameCount = 0;
    const shipWidth = 106;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 240; // Lower 240px band above the bottom of the screen
    };
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    const spawnPuff = (funnel, isBurst = false) => {
      const offsetX =
        dirRef.current === 1 ? funnel.x : shipWidth - funnel.x;
      const currentAlt =
        waterHeightRef.current > 0
          ? Math.max(-2, waterHeightRef.current - 6)
          : -3;

      // Convert bottom-relative altitude to canvas Y coordinate
      const startX =
        posRef.current + offsetX + (Math.random() * 2.4 - 1.2);
      const startY = canvas.height - (currentAlt + funnel.y);

      particlesRef.current.push({
        x: startX,
        y: startY,
        // Initial tight jet out of the funnel top
        vx:
          -dirRef.current * (0.45 + Math.random() * 0.35) +
          (Math.random() - 0.5) * 0.2,
        vy: -(0.75 + Math.random() * 0.35 + (isBurst ? 0.45 : 0)),
        radius: funnel.primary
          ? 2.8 + Math.random() * 1.2 + (isBurst ? 1.5 : 0)
          : 1.8 + Math.random() * 0.7,
        maxRadius: funnel.primary
          ? 18 + Math.random() * 10 + (isBurst ? 6 : 0)
          : 10 + Math.random() * 5,
        age: 0,
        maxAge: funnel.primary
          ? 95 + Math.floor(Math.random() * 35)
          : 55 + Math.floor(Math.random() * 20),
        seed: Math.random() * Math.PI * 2,
        turbulenceFreq: 0.04 + Math.random() * 0.03,
        turbulenceAmp: 0.35 + Math.random() * 0.35,
        // Slight variation in coal/steam tone
        r: isBurst ? 235 : 195 + Math.floor(Math.random() * 35),
        g: isBurst ? 242 : 205 + Math.floor(Math.random() * 35),
        b: isBurst ? 250 : 220 + Math.floor(Math.random() * 30),
        peakAlpha: funnel.primary ? (isBurst ? 0.55 : 0.36) : 0.18,
      });
    };

    const render = () => {
      frameCount++;
      const winW = canvas.width;

      // 1. Smoothly advance Titanic position
      let nextX = posRef.current + dirRef.current * 0.65;
      if (nextX >= winW - shipWidth - 16) {
        dirRef.current = -1;
        nextX = winW - shipWidth - 16;
        setDirection(-1);
      } else if (nextX <= 16) {
        dirRef.current = 1;
        nextX = 16;
        setDirection(1);
      }
      posRef.current = nextX;
      if (frameCount % 2 === 0) {
        setPosX(nextX);
      }

      // 2. Emit continuous volumetric smoke from the funnels
      // Funnels 1, 2, 3 emit frequently so they form connected, billowing steamship plumes
      if (frameCount % 3 === 0) {
        spawnPuff(FUNNEL_OFFSETS_RIGHT[0]);
        spawnPuff(FUNNEL_OFFSETS_RIGHT[1]);
        spawnPuff(FUNNEL_OFFSETS_RIGHT[2]);
      }
      if (frameCount % 12 === 0) {
        spawnPuff(FUNNEL_OFFSETS_RIGHT[3]);
      }

      // 3. Clear & render volumetric smoke particles
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const alive = [];
      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        p.age++;
        if (p.age >= p.maxAge) continue;

        const t = p.age / p.maxAge; // 0 -> 1 lifecycle progress

        // Wind drag increases as smoke rises higher; upward buoyancy slows as it cools
        const windDrift = -dirRef.current * (0.35 + t * 0.85);
        // S-curve curl/distortion wave as the plume breaks up
        const curlX =
          Math.sin(p.age * p.turbulenceFreq + p.seed) *
          (p.turbulenceAmp * (0.4 + t * 2.2));
        const curlY =
          Math.cos(p.age * p.turbulenceFreq * 0.8 + p.seed) *
          (p.turbulenceAmp * 0.6 * t);

        p.x += p.vx * (1 - t * 0.4) + windDrift + curlX;
        p.y += p.vy * (1 - t * 0.55) + curlY;

        // Radius expands nonlinearly (tight near stack, wide & billowy as it dissipates)
        const currentRadius =
          p.radius + (p.maxRadius - p.radius) * Math.pow(t, 0.75);

        // Smooth fade-in at stack mouth, then gradual atmospheric dissolution
        const alpha =
          t < 0.1
            ? (t / 0.1) * p.peakAlpha
            : p.peakAlpha * Math.pow(1 - (t - 0.1) / 0.9, 1.6);

        if (alpha > 0.005) {
          ctx.save();
          ctx.translate(p.x, p.y);
          // Slight horizontal wind-shear elongation as smoke ages and distorts
          const stretchX = 1 + t * 0.65;
          const stretchY = Math.max(0.68, 1 - t * 0.22);
          ctx.scale(stretchX, stretchY);

          const grad = ctx.createRadialGradient(
            0,
            0,
            currentRadius * 0.1,
            0,
            0,
            currentRadius
          );
          grad.addColorStop(0, `rgba(${p.r}, ${p.g}, ${p.b}, ${alpha})`);
          grad.addColorStop(
            0.5,
            `rgba(${Math.max(100, p.r - 35)}, ${Math.max(
              110,
              p.g - 35
            )}, ${Math.max(130, p.b - 30)}, ${alpha * 0.55})`
          );
          grad.addColorStop(1, `rgba(100, 116, 139, 0)`);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        alive.push(p);
      }

      particlesRef.current = alive;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, []);

  // Click to play ship horn sound ONLY (no jumping/bouncing) + steam whistle burst
  const handleShipClick = (e) => {
    e.stopPropagation();
    if (soundEnabled) playBoatHorn();

    setBubbleText(SHIP_QUOTES[quoteIdx]);
    setQuoteIdx((prev) => (prev + 1) % SHIP_QUOTES.length);
    setBubbleVisible(true);

    // Trigger extra steam puffs on horn blow
    const canvas = smokeCanvasRef.current;
    if (canvas) {
      const shipWidth = 106;
      const currentAlt =
        waterHeightRef.current > 0
          ? Math.max(-2, waterHeightRef.current - 6)
          : -3;
      FUNNEL_OFFSETS_RIGHT.forEach((funnel) => {
        for (let k = 0; k < 3; k++) {
          const offsetX =
            dirRef.current === 1 ? funnel.x : shipWidth - funnel.x;
          particlesRef.current.push({
            x: posRef.current + offsetX + (Math.random() * 4 - 2),
            y: canvas.height - (currentAlt + funnel.y) - k * 2,
            vx: -dirRef.current * (0.5 + Math.random() * 0.4),
            vy: -(1.0 + Math.random() * 0.45),
            radius: 3.5 + Math.random() * 1.5,
            maxRadius: 22 + Math.random() * 8,
            age: 0,
            maxAge: 100,
            seed: Math.random() * Math.PI * 2,
            turbulenceFreq: 0.05,
            turbulenceAmp: 0.45,
            r: 241,
            g: 245,
            b: 249,
            peakAlpha: 0.5,
          });
        }
      });
    }

    setTimeout(() => {
      setBubbleVisible(false);
    }, 2800);
  };

  // Sits steadily in the bottom/water (no jumpOffset)
  const currentAltitude =
    waterHeight > 0 ? Math.max(-2, waterHeight - 6) : -3;

  return (
    <>
      {/* 60FPS Volumetric Smoke Canvas (Soft radial-gradient plumes that billow, distort & dissolve) */}
      <canvas
        ref={smokeCanvasRef}
        className="fixed bottom-0 left-0 right-0 pointer-events-none select-none z-25"
        style={{ height: "240px" }}
      />

      {/* Main Moving RMS Titanic Container */}
      <div
        className="fixed z-25 pointer-events-none select-none transition-[bottom] duration-300 ease-out"
        style={{
          left: `${posX}px`,
          bottom: `${currentAltitude}px`,
        }}
      >
        {/* Speech bubble (always upright, centered over Titanic) */}
        {bubbleVisible && (
          <div className="absolute -top-9 left-1/2 -translate-x-1/2 z-40 whitespace-nowrap bg-[#1b1d26]/95 border border-[#fe8500] text-[#fe8500] text-[10px] sm:text-[11px] font-mono px-2.5 py-1 rounded-md shadow-[0_0_14px_rgba(254,133,0,0.4)] backdrop-blur-sm pointer-events-none animate-fadeIn">
            {bubbleText}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1b1d26] border-r border-b border-[#fe8500] rotate-45 transform" />
          </div>
        )}

        {/* Clickable Pixel RMS Titanic (Plays horn sound only, no bouncing) */}
        <div
          onClick={handleShipClick}
          className="pointer-events-auto cursor-pointer group"
          style={{
            transform: `scaleX(${direction})`,
          }}
          title="Click to blow RMS Titanic steam horn! 🚢"
        >
          <div className="relative">
            {isCreative && (
              <div className="absolute inset-x-2 top-3 bottom-2 bg-[#105bff]/15 rounded-full blur-md -z-10" />
            )}

            {/* Authentic 8-Bit RMS Titanic Ocean Liner Sprite */}
            <PixelTitanicSVG />
          </div>
        </div>
      </div>
    </>
  );
}

// Authentic 96x32 Pixel Art RMS Titanic Sprite (Clean silhouette: 4 Funnels + Promenade Decks + Black Hull)
function PixelTitanicSVG() {
  return (
    <svg
      width="106"
      height="36"
      viewBox="0 0 96 32"
      style={{ shapeRendering: "crispEdges" }}
      className="pixelated drop-shadow-[0_4px_10px_rgba(0,0,0,0.65)]"
    >
      {/* ============================================================ */}
      {/* 1. FOUR ICONIC TITANIC FUNNELS (Buff/Ochre with Black Tops)  */}
      {/* ============================================================ */}
      {[29, 39, 49, 59].map((fx, i) => (
        <g key={i}>
          {/* Black soot collar top */}
          <rect x={fx} y="2" width="5" height="3" fill="#09090b" />
          <rect x={fx + 1} y="5" width="5" height="1" fill="#18181b" />
          {/* Warm Titanic Ochre / Orange lower stack */}
          <rect x={fx + 1} y="6" width="5" height="6" fill="#f59e0b" />
          {/* Highlight & shadow edge on funnel */}
          <rect x={fx + 1} y="6" width="1" height="6" fill="#fde047" />
          <rect x={fx + 5} y="6" width="1" height="6" fill="#b45309" />
        </g>
      ))}

      {/* ============================================================ */}
      {/* 2. WHITE MULTI-TIER SUPERSTRUCTURE (Boat & Promenade Decks)  */}
      {/* ============================================================ */}
      {/* Upper Boat Deck & Officer Quarters */}
      <rect x="22" y="12" width="49" height="3" fill="#f8fafc" />
      <rect x="22" y="14" width="49" height="1" fill="#cbd5e1" />

      {/* White Lifeboats along the Boat Deck */}
      <rect x="24" y="11" width="4" height="1" fill="#e2e8f0" />
      <rect x="30" y="11" width="4" height="1" fill="#e2e8f0" />
      <rect x="57" y="11" width="4" height="1" fill="#e2e8f0" />
      <rect x="63" y="11" width="4" height="1" fill="#e2e8f0" />

      {/* Navigation Bridge (Front of Superstructure) */}
      <rect x="69" y="11" width="4" height="4" fill="#ffffff" />
      <rect x="71" y="12" width="2" height="2" fill="#38bdf8" />

      {/* A-Deck & B-Deck Promenade Superstructure */}
      <rect x="18" y="15" width="56" height="4" fill="#f1f5f9" />
      <rect x="18" y="18" width="56" height="1" fill="#94a3b8" />

      {/* Illuminated First-Class Promenade Windows */}
      {Array.from({ length: 16 }).map((_, idx) => (
        <rect
          key={idx}
          x={21 + idx * 3}
          y="16"
          width="2"
          height="1"
          fill={idx % 3 === 0 ? "#fef08a" : "#fde047"}
        />
      ))}

      {/* ============================================================ */}
      {/* 3. BLACK STEEL OCEAN LINER HULL (Poop Deck, Midship, Bow)    */}
      {/* ============================================================ */}
      {/* Raised Forecastle (Bow) & Poop Deck (Stern) */}
      <rect x="6" y="17" width="11" height="2" fill="#1e293b" />
      <rect x="75" y="17" width="16" height="2" fill="#1e293b" />
      {/* White Forecastle & Poop Deck Railings */}
      <rect x="7" y="16" width="10" height="1" fill="#cbd5e1" />
      <rect x="75" y="16" width="15" height="1" fill="#cbd5e1" />

      {/* Main Black Hull Upper Strake */}
      <rect x="5" y="19" width="85" height="4" fill="#0f172a" />
      {/* Iconic White Star Line Gold/Ochre Sheer Stripe running full length */}
      <rect x="6" y="20" width="83" height="1" fill="#f59e0b" />

      {/* Main Black Hull Lower Freeboard */}
      <rect x="7" y="23" width="81" height="5" fill="#09090b" />
      <rect x="9" y="28" width="77" height="2" fill="#0f172a" />

      {/* Sharp Raked Titanic Bow Stem (Right) */}
      <rect x="90" y="18" width="2" height="3" fill="#0f172a" />
      <rect x="88" y="21" width="3" height="4" fill="#09090b" />
      <rect x="86" y="25" width="3" height="4" fill="#09090b" />
      {/* Starboard Anchor on Bow */}
      <rect x="85" y="21" width="2" height="3" fill="#94a3b8" />
      <rect x="84" y="23" width="3" height="1" fill="#cbd5e1" />

      {/* Elliptical Counter Stern (Left) */}
      <rect x="4" y="19" width="2" height="3" fill="#0f172a" />
      <rect x="5" y="22" width="3" height="4" fill="#09090b" />

      {/* Two Rows of Glowing Warm Portholes along the Black Hull */}
      {Array.from({ length: 22 }).map((_, idx) => (
        <React.Fragment key={idx}>
          {/* Upper C-Deck Portholes */}
          <rect
            x={11 + idx * 3.4}
            y="22"
            width="1.5"
            height="1.5"
            fill="#fef08a"
          />
          {/* Lower D/E-Deck Portholes */}
          {idx % 2 === 0 && (
            <rect
              x={12 + idx * 3.4}
              y="25"
              width="1.5"
              height="1"
              fill="#f59e0b"
            />
          )}
        </React.Fragment>
      ))}

      {/* Lower Hull Keel */}
      <rect x="11" y="30" width="73" height="2" fill="#09090b" />
    </svg>
  );
}
