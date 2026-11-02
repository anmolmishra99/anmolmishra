"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { playWaterPlop } from "./SoundEffects";

export default function AquariumRain({
  soundEnabled = true,
  rainBurstTrigger = 0,
  onWaterHeightChange,
}) {
  const canvasRef = useRef(null);

  // Water level starts strictly at 0 ("keep only what dropped")
  const [waterHeight, setWaterHeight] = useState(0);
  const [displayPercent, setDisplayPercent] = useState(0);
  const [isDraining, setIsDraining] = useState(false);
  const [hasEverDropped, setHasEverDropped] = useState(false);

  // Physics refs
  const waterHeightRef = useRef(0);
  const dropsRef = useRef([]);
  const splashesRef = useRef([]);
  const bubblesRef = useRef([]);
  const lastSoundTimeRef = useRef(0);
  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  // Fish state (smooth continuous infinite wrap across screen)
  const fish1Ref = useRef({ x: 80, yOffset: 0, vx: 1.1, dir: 1, tailFrame: 0 });
  const fish2Ref = useRef({ x: 500, yOffset: 6, vx: -0.85, dir: -1, tailFrame: 0 });
  const fish3Ref = useRef({ x: -70, yOffset: -4, vx: 1.35, dir: 1, tailFrame: 0 });
  const [fishRenderState, setFishRenderState] = useState({
    f1: { x: 80, dir: 1, frame: 0, yOffset: 0 },
    f2: { x: 500, dir: -1, frame: 0, yOffset: 6 },
    f3: { x: -70, dir: 1, frame: 0, yOffset: -4 },
  });

  const MAX_WATER_HEIGHT = 140; // max floor aquarium fill height (~18% of typical screen)

  const onWaterHeightChangeRef = useRef(onWaterHeightChange);
  onWaterHeightChangeRef.current = onWaterHeightChange;

  // Sync ref & percent
  useEffect(() => {
    waterHeightRef.current = waterHeight;
    setDisplayPercent(Math.min(100, Math.round((waterHeight / MAX_WATER_HEIGHT) * 100)));
    if (onWaterHeightChangeRef.current) {
      onWaterHeightChangeRef.current(waterHeight);
    }
  }, [waterHeight]);

  // Find onscreen bounds of PixelSky clouds
  const getCloudRects = useCallback(() => {
    if (typeof window === "undefined") return [];
    const mainCloud = document.getElementById("pixel-cloud-main");
    const smallCloud = document.getElementById("pixel-cloud-small");
    const rects = [];

    if (mainCloud) {
      const r = mainCloud.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) rects.push(r);
    }
    if (smallCloud) {
      const r = smallCloud.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) rects.push(r);
    }

    // Fallback if cloud elements not yet rendered
    if (rects.length === 0) {
      rects.push({
        left: window.innerWidth - 180,
        right: window.innerWidth - 50,
        top: 25,
        bottom: 70,
        width: 130,
        height: 45,
      });
    }

    return rects;
  }, []);

  // Spawn gentle, reduced-speed raindrops directly from the clouds
  const spawnDrops = useCallback(
    (count = 2) => {
      const rects = getCloudRects();
      if (rects.length === 0) return;

      const newDrops = [];
      for (let i = 0; i < count; i++) {
        // Pick one of the clouds
        const cloud = rects[Math.floor(Math.random() * rects.length)];
        const spawnX = cloud.left + 8 + Math.random() * Math.max(10, cloud.width - 16);
        const spawnY = cloud.bottom - 4 + (Math.random() * 6 - 3);

        newDrops.push({
          x: spawnX,
          y: spawnY,
          vx: (Math.random() - 0.5) * 0.2, // very subtle horizontal drift
          vy: 2.4 + Math.random() * 0.8, // REDUCED SPEED: gentle, leisurely fall
          len: 10 + Math.random() * 4, // clean pixel streak
          alpha: 0.85 + Math.random() * 0.15,
        });
      }

      dropsRef.current.push(...newDrops);
      setHasEverDropped(true);
    },
    [getCloudRects]
  );

  // ONLY DROP WHEN USER CLICKS (NO auto-drop timer, else stop)
  useEffect(() => {
    if (rainBurstTrigger > 0) {
      // Spawn 3 gentle drops staggered over 240ms on each click
      spawnDrops(1);
      const t1 = setTimeout(() => spawnDrops(1), 100);
      const t2 = setTimeout(() => spawnDrops(1), 220);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [rainBurstTrigger, spawnDrops]);

  // Main Canvas Animation Loop (Raindrops & Splashes)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Frame update loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const currentWaterTop = height - waterHeightRef.current;
      let addedWater = 0;
      const now = Date.now();

      // 1. Update and draw falling raindrops
      const activeDrops = [];
      for (let i = 0; i < dropsRef.current.length; i++) {
        const drop = dropsRef.current[i];
        drop.x += drop.vx;
        drop.y += drop.vy;

        // REDUCED SPEED: Gentle gravity acceleration, capped at slow speed
        drop.vy = Math.min(5.2, drop.vy + 0.08);

        // Check collision with water floor or bottom of viewport
        if (drop.y + drop.len >= currentWaterTop) {
          // HIT THE WATER SURFACE OR FLOOR!
          // Add water strictly from what dropped
          addedWater += 1.4;

          // Sound effect (throttled)
          if (soundEnabledRef.current && now - lastSoundTimeRef.current > 120) {
            playWaterPlop();
            lastSoundTimeRef.current = now;
          }

          // Spawn gentle splash particles (little pixel water droplets popping up)
          for (let s = 0; s < 3; s++) {
            splashesRef.current.push({
              x: drop.x + (Math.random() - 0.5) * 4,
              y: currentWaterTop,
              vx: (Math.random() - 0.5) * 2.6,
              vy: -(1.6 + Math.random() * 1.8),
              size: 2,
              alpha: 0.9,
              life: 12 + Math.floor(Math.random() * 6),
            });
          }
        } else {
          activeDrops.push(drop);

          // Draw raindrop streak with Royal Blue + Ice Blue glow
          const grad = ctx.createLinearGradient(drop.x, drop.y, drop.x, drop.y + drop.len);
          grad.addColorStop(0, "rgba(56, 189, 248, 0.2)");
          grad.addColorStop(0.6, "rgba(16, 91, 255, 0.85)");
          grad.addColorStop(1, "rgba(147, 197, 253, 1)");

          ctx.strokeStyle = grad;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x, drop.y + drop.len);
          ctx.stroke();

          // Crisp pixel droplet head
          ctx.fillStyle = "#93c5fd";
          ctx.fillRect(Math.round(drop.x) - 1, Math.round(drop.y + drop.len) - 2, 2, 2);
        }
      }
      dropsRef.current = activeDrops;

      // 2. Update and draw splash particles
      const activeSplashes = [];
      for (let i = 0; i < splashesRef.current.length; i++) {
        const p = splashesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.18; // gentle gravity on splash
        p.life--;
        p.alpha = Math.max(0, p.life / 18);

        if (p.life > 0 && p.y <= currentWaterTop + 4) {
          activeSplashes.push(p);

          // Draw crisp pixel splash drop
          ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha})`;
          ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
        }
      }
      splashesRef.current = activeSplashes;

      // 3. Accumulate water on floor: KEEP ONLY WHAT DROPPED!
      if (addedWater > 0 && !isDraining) {
        setWaterHeight((prev) => {
          const next = Math.min(MAX_WATER_HEIGHT, prev + addedWater);
          waterHeightRef.current = next;
          return next;
        });
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isDraining]);

  // Gentle fish physics & continuous infinite swimming loop
  useEffect(() => {
    const fishTimer = setInterval(() => {
      const winW = typeof window !== "undefined" ? window.innerWidth : 1200;

      // Fish 1 (Primary - continuous swim Left -> Right, head forward)
      const f1 = fish1Ref.current;
      f1.x += f1.vx;
      f1.tailFrame = (f1.tailFrame + 1) % 4;
      if (f1.x > winW + 45) {
        // Exited right side -> smoothly enter from left side
        f1.x = -45;
        f1.yOffset = (Math.random() - 0.5) * 12;
      }

      // Fish 2 (Companion - continuous swim Right -> Left, head forward)
      const f2 = fish2Ref.current;
      f2.x += f2.vx;
      f2.tailFrame = (f2.tailFrame + 1) % 4;
      if (f2.x < -45) {
        // Exited left side -> smoothly enter from right side
        f2.x = winW + 45;
        f2.yOffset = (Math.random() - 0.5) * 14;
      }

      // Fish 3 (Small companion - continuous swim Left -> Right, head forward)
      const f3 = fish3Ref.current;
      f3.x += f3.vx;
      f3.tailFrame = (f3.tailFrame + 1) % 4;
      if (f3.x > winW + 45) {
        // Exited right side -> smoothly enter from left side
        f3.x = -65;
        f3.yOffset = (Math.random() - 0.5) * 10;
      }

      setFishRenderState({
        f1: { x: f1.x, dir: f1.dir, frame: f1.tailFrame, yOffset: f1.yOffset },
        f2: { x: f2.x, dir: f2.dir, frame: f2.tailFrame, yOffset: f2.yOffset },
        f3: { x: f3.x, dir: f3.dir, frame: f3.tailFrame, yOffset: f3.yOffset },
      });
    }, 60);

    return () => clearInterval(fishTimer);
  }, []);

  // Rising pixel bubbles inside the aquarium floor (only when water has accumulated)
  useEffect(() => {
    const bubbleSpawnInterval = setInterval(() => {
      if (waterHeightRef.current > 22) {
        const winW = typeof window !== "undefined" ? window.innerWidth : 1200;
        bubblesRef.current.push({
          id: Math.random(),
          x: 20 + Math.random() * (winW - 40),
          y: waterHeightRef.current - 4, // bottom of water container
          speed: 0.6 + Math.random() * 0.6,
          wobble: Math.random() * Math.PI * 2,
          size: Math.random() > 0.4 ? 3 : 2,
        });
      }
    }, 800);

    const bubbleMoveInterval = setInterval(() => {
      const activeBubbles = [];
      for (const b of bubblesRef.current) {
        b.y -= b.speed;
        b.wobble += 0.12;
        b.x += Math.sin(b.wobble) * 0.3;
        if (b.y > 4) {
          activeBubbles.push(b);
        }
      }
      bubblesRef.current = activeBubbles.slice(-15);
    }, 60);

    return () => {
      clearInterval(bubbleSpawnInterval);
      clearInterval(bubbleMoveInterval);
    };
  }, []);

  // Handle draining the water floor back to 0
  const handleDrain = (e) => {
    e.stopPropagation();
    setIsDraining(true);
    const drainInterval = setInterval(() => {
      setWaterHeight((prev) => {
        if (prev <= 1) {
          clearInterval(drainInterval);
          setIsDraining(false);
          waterHeightRef.current = 0;
          return 0;
        }
        const next = Math.max(0, prev - 3);
        waterHeightRef.current = next;
        return next;
      });
    }, 30);
  };

  // Manual click trigger from HUD
  const handleManualDropClick = (e) => {
    e.stopPropagation();
    spawnDrops(2);
  };

  return (
    <>
      {/* 1. Full-screen HTML5 Canvas for falling raindrops & splashes */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-30 overflow-hidden"
      />

      {/* 2. THE AQUARIUM WATER FLOOR (ONLY WHAT DROPPED, STARTS AT 0) */}
      {waterHeight > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 z-20 pointer-events-none transition-[height] duration-200 ease-out"
          style={{
            height: `${waterHeight}px`,
          }}
        >
          {/* Animated Pixel Surface Wave / Waterline */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#105bff] via-[#38bdf8] to-[#105bff] shadow-[0_0_12px_#38bdf8] opacity-95">
            {/* Wave shimmer pulse */}
            <div className="w-full h-full bg-white/40 animate-pulse" />
          </div>

          {/* Pixel wave stepping crest */}
          <div className="absolute -top-[2px] left-0 right-0 h-[2px] flex overflow-hidden opacity-60">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-[2px] bg-[#38bdf8]"
                style={{
                  transform: `translateY(${Math.sin(i * 0.4) * 1.5}px)`,
                  transition: "transform 0.4s ease",
                }}
              />
            ))}
          </div>

          {/* Water Liquid Body (Translucent royal blue depth, subtle glass refraction) */}
          <div
            className="relative w-full h-full backdrop-blur-[1.5px]"
            style={{
              background:
                "linear-gradient(to top, rgba(16, 91, 255, 0.45) 0%, rgba(16, 91, 255, 0.28) 60%, rgba(56, 189, 248, 0.22) 100%)",
              boxShadow:
                "inset 0 4px 16px rgba(16, 91, 255, 0.4), inset 0 -2px 8px rgba(0, 0, 0, 0.5)",
            }}
          >
            {/* Rising Pixel Bubbles */}
            {bubblesRef.current.map((b) => (
              <div
                key={b.id}
                className="absolute bg-white/90 rounded-sm shadow-[0_0_4px_#38bdf8] pointer-events-none"
                style={{
                  left: `${b.x}px`,
                  top: `${b.y}px`,
                  width: `${b.size}px`,
                  height: `${b.size}px`,
                }}
              />
            ))}

            {/* Primary Pixel Fish (Swims Left -> Right infinitely) */}
            {waterHeight > 18 && fishRenderState?.f1 && (
              <div
                className="absolute pointer-events-none transition-transform duration-75 select-none"
                style={{
                  left: `${fishRenderState.f1.x ?? 80}px`,
                  bottom: `${Math.max(6, Math.min(waterHeight - 16, 12 + (fishRenderState.f1.yOffset || 0)))}px`,
                  transform: `scaleX(${fishRenderState.f1.dir ?? 1})`,
                }}
              >
                <PixelFishSprite frame={fishRenderState.f1.frame ?? 0} />
              </div>
            )}

            {/* Companion Fish (Swims Right -> Left infinitely) */}
            {waterHeight > 26 && fishRenderState?.f2 && (
              <div
                className="absolute pointer-events-none transition-transform duration-75 select-none"
                style={{
                  left: `${fishRenderState.f2.x ?? 500}px`,
                  bottom: `${Math.max(8, Math.min(waterHeight - 16, 22 + (fishRenderState.f2.yOffset || 0)))}px`,
                  transform: `scaleX(${fishRenderState.f2.dir ?? -1}) scale(0.85)`,
                }}
              >
                <PixelFishSprite frame={fishRenderState.f2.frame ?? 0} isSmall={true} />
              </div>
            )}

            {/* Third Golden Mini Fish (Swims Left -> Right infinitely when water is deeper) */}
            {waterHeight > 42 && fishRenderState?.f3 && (
              <div
                className="absolute pointer-events-none transition-transform duration-75 select-none"
                style={{
                  left: `${fishRenderState.f3.x ?? -70}px`,
                  bottom: `${Math.max(10, Math.min(waterHeight - 16, 32 + (fishRenderState.f3.yOffset || 0)))}px`,
                  transform: `scaleX(${fishRenderState.f3.dir ?? 1}) scale(0.7)`,
                }}
              >
                <PixelFishSprite frame={fishRenderState.f3.frame ?? 0} isSmall={true} variant="orange" />
              </div>
            )}

            {/* Bottom Aquarium Floor Substrate Line */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#151720] border-t border-[#105bff]/40" />
          </div>

          {/* Discreet Aquarium HUD Controls (Drain & Click-to-Drop) */}
          <div className="absolute bottom-2.5 right-4 pointer-events-auto flex items-center gap-2 select-none">
            <div className="flex items-center gap-1.5 bg-[#171923]/90 border border-[#2e3242] rounded-lg px-2.5 py-1 text-xs font-mono shadow-lg backdrop-blur-md">
              <span className="text-[#38bdf8]">💧</span>
              {/* <span className="text-zinc-300 text-[11px]">
                {Math.round(waterHeight)}px ({displayPercent}%)
              </span> */}

              {/* Click to drop button */}
              {/* <button
                onClick={handleManualDropClick}
                className="ml-1 text-[10px] text-[#fe8500] hover:text-white transition-colors px-1"
                title="Click to drop rain"
              >
                + Drop
              </button> */}

              <span className="text-zinc-600">|</span>

              {/* Drain button */}
              <button
                onClick={handleDrain}
                disabled={isDraining}
                className="text-[10px] cursor-pointer text-zinc-400 hover:text-rose-400 transition-colors px-1"
                title="Drain water back to dry floor"
              >
                {isDraining ? "Draining..." : "Drain water 🕳️"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subtle Hint badge when floor is completely dry */}
      {waterHeight === 0 && !hasEverDropped && (
        <div className="fixed bottom-3 right-4 z-20 pointer-events-none select-none opacity-60 hover:opacity-100 transition-opacity">
          <div className="text-[11px] font-mono text-zinc-400 bg-[#171923]/80 border border-[#2e3242] rounded-md px-2 py-0.5 flex items-center gap-1.5 shadow-sm">
            <span className="text-[#38bdf8]">☁️</span>
            <span>Click clouds to drop rain</span>
          </div>
        </div>
      )}
    </>
  );
}

// 8-bit Crisp Pixel Fish Sprite (18x10 px) naturally facing RIGHT with 2-frame tail wag
function PixelFishSprite({ frame = 0, isSmall = false, variant = "blue" }) {
  const tailOffset = frame % 2 === 0 ? 0 : 1;
  const isOrange = variant === "orange";

  const primaryColor = isOrange ? "#fe8500" : "#105bff";
  const secondaryColor = isOrange ? "#fde047" : "#38bdf8";
  const accentColor = isOrange ? "#ffffff" : "#fe8500";

  return (
    <svg
      width={isSmall ? "18" : "24"}
      height={isSmall ? "10" : "14"}
      viewBox="0 0 18 10"
      style={{ shapeRendering: "crispEdges" }}
      className="pixelated drop-shadow-[0_2px_6px_rgba(16,91,255,0.7)]"
    >
      {/* Outer dark outline */}
      <rect x="6" y="1" width="8" height="1" fill="#0f172a" />
      <rect x="14" y="2" width="2" height="1" fill="#0f172a" />
      <rect x="16" y="3" width="1" height="4" fill="#0f172a" />
      <rect x="14" y="7" width="2" height="1" fill="#0f172a" />
      <rect x="6" y="8" width="8" height="1" fill="#0f172a" />
      <rect x="4" y="4" width="2" height="2" fill="#0f172a" />

      {/* Main Body */}
      <rect x="6" y="2" width="9" height="6" fill={primaryColor} />
      <rect x="7" y="3" width="6" height="4" fill={secondaryColor} />

      {/* Dorsal Fin on Top (Orange accent) */}
      <rect x="9" y="0" width="3" height="1" fill={accentColor} />
      <rect x="8" y="1" width="5" height="1" fill={accentColor} />

      {/* Eye at Front (Facing Right / Swimming Forward) */}
      <rect x="13" y="3" width="2" height="2" fill="#ffffff" />
      <rect x="14" y="3" width="1" height="1" fill="#09090b" />

      {/* Animated Wagging Tail at Back (Left) */}
      <rect x="3" y={2 + tailOffset} width="2" height="6" fill={primaryColor} />
      <rect x="1" y={1 + tailOffset} width="2" height="8" fill={secondaryColor} />
      <rect x="0" y={3 + tailOffset} width="2" height="4" fill={accentColor} />
    </svg>
  );
}
