"use client";

import React, { useState, useEffect, useRef } from "react";
import { playBoatHorn } from "./SoundEffects";
import {
  Painter,
  createFrame,
  clearFrame,
  composite,
  Rng,
  fit,
  mix,
  hex,
} from "../lib/pixelfx/core/index.js";
import { Smoke, cloud, spark } from "../lib/pixelfx/fx/projectiles/_lib.js";
import { WATER, billow, ring } from "../lib/pixelfx/fx/water/_lib.js";

const SHIP_QUOTES = [
  "RMS TITANIC AI · Full steam ahead! 🚢",
  "21.6K+ citizen chats delivered! ⚡",
  "100+ active stores on Payge 🛒",
  "2 SaaS products acquired in 2024! 🚀",
  "₹7,531 Cr compensation tracked 🏛️",
  "Smooth sailing with RAG & CrewAI ⚓",
  "Toot toot! Unsinkable production AI 🚢",
];

// Pixel resolution scale (2 CSS px = 1 pixelfx pixel for authentic crisp pixel art)
const PIXEL_SCALE = 2;
const CANVAS_CSS_H = 260;

// Funnel positions relative to the 106px-wide Titanic sprite when facing RIGHT (direction = 1)
// Funnels 1, 2, 3 were connected to the boiler rooms; Funnel 4 was ventilation.
const FUNNEL_OFFSETS_RIGHT = [
  { x: 34, y: 34, primary: true },
  { x: 45, y: 34, primary: true },
  { x: 56, y: 34, primary: true },
  { x: 67, y: 34, primary: false },
];

// pixelfx ramps for Titanic coal/steam smoke, furnace glow, and sparks
const SMOKE_HEX = [
  "#232533",
  "#34384b",
  "#4c5268",
  "#6c748c",
  "#949db4",
  "#c2c9d8",
  "#eef2f8",
];
const FIRE_HEX = [
  "#4a1712",
  "#8a1f17",
  "#c9281f",
  "#f2561d",
  "#ff8a2a",
  "#ffc23d",
  "#ffe26b",
  "#fff3a6",
  "#ffffff",
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

  // Refs for pixelfx dual-buffer canvas & simulation
  const smokeCanvasRef = useRef(null);
  const posRef = useRef(120);
  const dirRef = useRef(1);
  const waterHeightRef = useRef(waterHeight);
  const smokeSimRef = useRef(null);
  const embersRef = useRef([]);

  useEffect(() => {
    waterHeightRef.current = waterHeight;
  }, [waterHeight]);

  // 60FPS Ship Movement + pixelfx Volumetric Pixel Smoke, Embers & Wake VFX
  useEffect(() => {
    const canvas = smokeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const rng = new Rng(7);
    const smokeSim = new Smoke(rng);
    smokeSimRef.current = smokeSim;

    // Pre-fit pixelfx color ramps
    const SM = fit(SMOKE_HEX, 7);
    const F = fit(FIRE_HEX, 9);
    const WR = [
      mix(F[0], SM[0], 0.5),
      mix(F[1], SM[1], 0.45),
      mix(F[2], SM[2], 0.35),
      F[3],
      F[4],
      F[6],
      F[7],
    ];
    const SP = [F[7], F[6], F[4], F[3]];
    const W_RAMP = fit(WATER, 8);

    let frame = null;
    let painter = null;
    let imgData = null;
    let pw = 0;
    let ph = 0;

    const updateCanvasSize = () => {
      pw = Math.max(160, Math.ceil(window.innerWidth / PIXEL_SCALE));
      ph = Math.ceil(CANVAS_CSS_H / PIXEL_SCALE);
      canvas.width = pw;
      canvas.height = ph;
      frame = createFrame(pw, ph, 0, 0);
      painter = new Painter(frame);
      imgData = ctx.createImageData(pw, ph);
    };
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    let animId;
    let lastTime = performance.now();
    let emitAcc = 0;
    let ventAcc = 0;
    let emberAcc = 0;
    let wakeTime = 0;
    let frameCount = 0;
    const shipWidth = 106;

    const spawnFunnelPuff = (funnel, isWhistle = false) => {
      const offsetX =
        dirRef.current === 1 ? funnel.x : shipWidth - funnel.x;
      const currentAlt =
        waterHeightRef.current > 0
          ? Math.max(-2, waterHeightRef.current - 6)
          : -3;

      // Convert CSS coordinates to pixelfx low-res pixel coordinates
      const fx = (posRef.current + offsetX) / PIXEL_SCALE;
      const fy = ph - (currentAlt + funnel.y) / PIXEL_SCALE;

      smokeSim.add({
        x: fx + rng.range(-0.6, 0.6),
        y: fy,
        // Stream back opposite to the Titanic's heading + upward boiler draft
        vx: -dirRef.current * rng.range(18, 30) + rng.range(-4, 4),
        vy: -rng.range(isWhistle ? 22 : 13, isWhistle ? 32 : 20),
        r0: funnel.primary ? rng.range(1.6, 2.3) : rng.range(1.1, 1.5),
        r1: funnel.primary
          ? rng.range(isWhistle ? 9.5 : 6.8, isWhistle ? 13 : 10.2)
          : rng.range(3.8, 5.5),
        life: funnel.primary
          ? rng.range(1.5, 2.2)
          : rng.range(0.9, 1.3),
        drag: rng.range(1.3, 1.9),
        rise: rng.range(5, 11),
        grow: rng.range(1.5, 2.3),
        curl: rng.range(-1.1, 1.1),
        a: funnel.primary ? (isWhistle ? 0.85 : 0.68) : 0.4,
        b: isWhistle ? 0.98 : rng.range(0.78, 0.94),
        warm: funnel.primary ? (isWhistle ? 0.25 : 0.65) : 0.15,
      });
    };

    const render = (now) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      wakeTime += dt;
      frameCount++;

      const winW = window.innerWidth;

      // 1. Advance Titanic position smoothly across the bottom
      let nextX = posRef.current + dirRef.current * 39 * dt;
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

      // 2. Emit continuous pixelfx Smoke puffs from the 4 funnels
      emitAcc += dt * 24;
      while (emitAcc >= 1) {
        emitAcc -= 1;
        spawnFunnelPuff(FUNNEL_OFFSETS_RIGHT[0]);
        spawnFunnelPuff(FUNNEL_OFFSETS_RIGHT[1]);
        spawnFunnelPuff(FUNNEL_OFFSETS_RIGHT[2]);
      }

      ventAcc += dt * 6;
      while (ventAcc >= 1) {
        ventAcc -= 1;
        spawnFunnelPuff(FUNNEL_OFFSETS_RIGHT[3]);
      }

      // Spawn occasional hot coal embers/sparks from the primary boiler funnels
      emberAcc += dt * 7;
      while (emberAcc >= 1) {
        emberAcc -= 1;
        const fIdx = rng.int(0, 2);
        const funnel = FUNNEL_OFFSETS_RIGHT[fIdx];
        const offsetX =
          dirRef.current === 1 ? funnel.x : shipWidth - funnel.x;
        const currentAlt =
          waterHeightRef.current > 0
            ? Math.max(-2, waterHeightRef.current - 6)
            : -3;
        const fx = (posRef.current + offsetX) / PIXEL_SCALE;
        const fy = ph - (currentAlt + funnel.y) / PIXEL_SCALE;

        embersRef.current.push({
          x: fx + rng.range(-1, 1),
          y: fy,
          vx: -dirRef.current * rng.range(16, 42) + rng.range(-8, 8),
          vy: -rng.range(14, 30),
          age: 0,
          life: rng.range(0.45, 0.9),
          isStreak: rng.chance(0.45),
        });
      }

      // 3. Update pixelfx simulations
      smokeSim.update(dt);

      for (let i = embersRef.current.length - 1; i >= 0; i--) {
        const e = embersRef.current[i];
        e.age += dt;
        if (e.age >= e.life) {
          embersRef.current.splice(i, 1);
          continue;
        }
        e.vx -= e.vx * 1.8 * dt;
        e.vy += 18 * dt; // slight gravity after upward draft
        e.x += e.vx * dt;
        e.y += e.vy * dt;
      }

      // 4. Draw into pixelfx dual buffers (color + additive light)
      if (frame && painter && imgData) {
        clearFrame(frame);

        // 4a. Draw merged volumetric pixel smoke cloud (lit crowns + shaded undersides + warm stack glow)
        const puffs = smokeSim.puffs();
        if (puffs.length > 0) {
          cloud(painter, puffs, SM, WR, {
            dens: 1.38,
            max: 0.82,
            lit: 1.45,
          });
        }

        // Warm internal furnace glow at the mouths of Funnels 1-3
        const currentAlt =
          waterHeightRef.current > 0
            ? Math.max(-2, waterHeightRef.current - 6)
            : -3;
        for (let i = 0; i < 3; i++) {
          const funnel = FUNNEL_OFFSETS_RIGHT[i];
          const offsetX =
            dirRef.current === 1 ? funnel.x : shipWidth - funnel.x;
          const fx = (posRef.current + offsetX) / PIXEL_SCALE;
          const fy = ph - (currentAlt + funnel.y) / PIXEL_SCALE;
          painter.glow(fx, fy - 1, 7, F[4], 0.22);
        }

        // 4c. Draw hot coal embers & speed-stretched pixel sparks in the smoke trail
        for (const e of embersRef.current) {
          const k = 1 - e.age / e.life;
          if (e.isStreak) {
            spark(painter, e.x, e.y, e.vx, e.vy, k, SP, 0.35, 0.02, 5);
          } else {
            const c = k > 0.6 ? F[6] : k > 0.3 ? F[4] : F[2];
            painter.px(e.x, e.y, c);
            painter.glow(e.x, e.y, 3, c, 0.35 * k);
          }
        }

        // 4d. Draw pixel bow wave & stern wake ripples along the hull waterline
        const hullY = ph - (currentAlt + 3) / PIXEL_SCALE;
        const bowX =
          (posRef.current + (dirRef.current === 1 ? 94 : 12)) / PIXEL_SCALE;
        const sternX =
          (posRef.current + (dirRef.current === 1 ? 8 : 98)) / PIXEL_SCALE;

        // Churning pixel foam billow at the raked Titanic bow
        const bowPulse = 1.4 + 0.35 * Math.sin(wakeTime * 7);
        billow(painter, bowX, hullY, bowPulse, W_RAMP, 0.9);
        painter.glow(bowX, hullY, 5, W_RAMP[5], 0.22);

        // Trailing stern wake foam & spreading surface ripple rings
        for (let w = 0; w < 4; w++) {
          const phase = ((wakeTime * 1.4 + w * 0.25) % 1);
          const wx = sternX - dirRef.current * (3 + phase * 18);
          const wy = hullY + Math.sin(wakeTime * 5 + w) * 0.4;
          const fade = 1 - phase;
          if (phase < 0.45) {
            billow(painter, wx, wy, 1.3 * fade, W_RAMP, fade * 0.85);
          }
          ring(painter, wx, wy, 1.5 + phase * 7, 0.25, fade * 0.65, W_RAMP, {
            n: 1,
            half: 1,
            hot: phase < 0.15,
            seed: w + 1,
          });
        }

        // Warm golden porthole glow cast onto the water alongside the hull
        const midHullX = (posRef.current + shipWidth * 0.5) / PIXEL_SCALE;
        painter.glowLine(
          midHullX - 16,
          hullY,
          midHullX + 16,
          hullY,
          5,
          hex("#f59e0b"),
          0.16
        );

        // Composite color + additive light buffers into ImageData and paint to canvas
        composite(frame, imgData.data, null, 0.85);
        ctx.putImageData(imgData, 0, 0);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, []);

  // Click to play ship horn sound ONLY (no jumping/bouncing) + pixelfx steam whistle puffs
  const handleShipClick = (e) => {
    e.stopPropagation();
    if (soundEnabled) playBoatHorn();

    setBubbleText(SHIP_QUOTES[quoteIdx]);
    setQuoteIdx((prev) => (prev + 1) % SHIP_QUOTES.length);
    setBubbleVisible(true);

    const smokeSim = smokeSimRef.current;
    const shipWidth = 106;
    const currentAlt =
      waterHeightRef.current > 0
        ? Math.max(-2, waterHeightRef.current - 6)
        : -3;
    const ph = Math.ceil(CANVAS_CSS_H / PIXEL_SCALE);

    // Trigger extra pixelfx white steam whistle puffs from the funnels
    if (smokeSim) {
      FUNNEL_OFFSETS_RIGHT.forEach((funnel) => {
        const offsetX =
          dirRef.current === 1 ? funnel.x : shipWidth - funnel.x;
        const fx = (posRef.current + offsetX) / PIXEL_SCALE;
        const fy = ph - (currentAlt + funnel.y) / PIXEL_SCALE;

        for (let k = 0; k < 4; k++) {
          smokeSim.add({
            x: fx + (Math.random() - 0.5) * 2,
            y: fy - k * 1.2,
            vx: -dirRef.current * (15 + Math.random() * 18),
            vy: -(24 + Math.random() * 16),
            r0: 2.0,
            r1: 10 + Math.random() * 4,
            life: 1.6 + Math.random() * 0.5,
            drag: 1.6,
            rise: 9,
            grow: 2.2,
            curl: (Math.random() - 0.5) * 1.6,
            a: 0.85,
            b: 0.98,
            warm: 0.35,
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
      {/* pixelfx Dual-Buffer (Color + Light) Pixel Art VFX Canvas */}
      <canvas
        ref={smokeCanvasRef}
        className="fixed bottom-0 left-0 right-0 w-full pointer-events-none select-none z-25 pixelated"
        style={{
          height: `${CANVAS_CSS_H}px`,
          imageRendering: "pixelated",
        }}
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
