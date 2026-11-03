"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { playWaterPlop } from "./SoundEffects";
import {
  Painter,
  createFrame,
  clearFrame,
  composite,
  fit,
  hex,
  TAU,
  WHITE,
} from "../lib/pixelfx/core/index.js";
import { WATER, bead, ring, pebble, rock } from "../lib/pixelfx/fx/water/_lib.js";
import { Grid, bubble } from "../lib/pixelfx/fx/critters/_lib.js";

const PIXEL_SCALE = 2;

// pixelfx Fish School palette (dark outline -> deep blue -> cyan -> silver -> white, plus orange fin/stripe)
const FISH_BLUE = [
  "#091224",
  "#12294e",
  "#1e4f8a",
  "#2f82c4",
  "#5eb5eb",
  "#a6e1ff",
  "#ffffff",
];
const FISH_GOLD = [
  "#1f0d05",
  "#4d1f08",
  "#8c3b0e",
  "#cc5f14",
  "#f5881f",
  "#ffc14d",
  "#ffffff",
];

// Authentic pixelfx articulated pixel fish rendered via Grid + 1px dark outline
function drawPixelfxFish(p, cx, cy, size, phase, dir, C, stripeCol, finCol) {
  const S = size;
  const g = new Grid(-18, -10, 36, 20);
  const wave = (u) =>
    Math.sin(phase * TAU - u * 2.5) * (0.3 + u * u * 1.6) * S;

  // 1. Forked tail fin (behind body)
  const tx = -4.2 * S;
  const ty = wave(1);
  const fork = 2.8 * S;
  const wag = Math.cos(phase * TAU - 2.5) * 0.65 * S;
  g.poly(
    [
      [tx + 1, ty],
      [tx - 3.6 * S, ty - fork + wag],
      [tx - 1.8 * S, ty + wag * 0.4],
      [tx - 3.6 * S, ty + fork + wag],
    ],
    (x) => (x < tx - 2.3 * S ? C[4] : C[3])
  );

  // 2. Dorsal fin on top & ventral fin below
  const dx = -0.5 * S;
  const dy = wave(0.45);
  g.poly(
    [
      [dx + 2 * S, dy - 1.5 * S],
      [dx - 1 * S, dy - 3.6 * S],
      [dx - 2.2 * S, dy - 1.3 * S],
    ],
    finCol
  );
  g.poly(
    [
      [dx, dy + 1.5 * S],
      [dx - 1.5 * S, dy + 2.8 * S],
      [dx - 2.2 * S, dy + 1.2 * S],
    ],
    C[3]
  );

  // 3. Streamlined body slice-by-slice from tail to nose
  const headX = 5.2 * S;
  const tailX = -4.2 * S;
  const len = headX - tailX;
  for (let x = Math.floor(tailX); x <= Math.ceil(headX); x++) {
    const u = 1 - (x - tailX) / len; // 0 at nose, 1 at tail
    if (u < 0 || u > 1) continue;
    const wy = wave(u);
    const half =
      Math.sin(Math.pow(u, 0.65) * Math.PI) * 2.55 * S +
      (1 - u) * 0.35;
    if (half < 0.45) continue;
    for (
      let y = Math.floor(wy - half);
      y <= Math.ceil(wy + half);
      y++
    ) {
      const ny = (y - wy) / Math.max(0.5, half);
      if (Math.abs(ny) > 1) continue;
      // Dark back, bright orange/cyan lateral stripe, silver-white belly
      const col =
        Math.abs(ny - 0.05) < 0.24 && u > 0.14 && u < 0.86
          ? stripeCol
          : ny < -0.42
            ? C[2]
            : ny < 0
              ? C[3]
              : ny < 0.5
                ? C[5]
                : C[6];
      g.set(x, y, col);
    }
  }

  // 4. Specular highlight along upper flank
  for (let x = Math.round(-1 * S); x <= Math.round(3 * S); x++) {
    const u = 1 - (x - tailX) / len;
    g.set(x, Math.round(wave(u) - 1.3 * S), C[6]);
  }

  // 5. Pectoral fin
  const px = 1.6 * S;
  const py = wave(0.25) + 0.8 * S;
  const pFlap = Math.sin(phase * TAU * 2) * 0.5;
  g.line(px, py, px - 1.8 * S, py + (1.2 + pFlap) * S, finCol);

  // 6. 1px dark pixel outline
  g.outline(C[0]);

  // 7. Crisp eye at front
  const ex = Math.round(3.2 * S);
  const ey = Math.round(wave(0.16) - 0.3 * S);
  g.set(ex, ey, C[6]);
  g.set(ex + 1, ey, C[0]);

  // Flip horizontally if swimming left (dir === -1)
  if (dir === -1) {
    const X = Math.round(cx);
    const Y = Math.round(cy);
    for (let y = 0; y < g.h; y++) {
      for (let x = 0; x < g.w; x++) {
        const c = g.c[y * g.w + x];
        if (!c) continue;
        const lx = -(g.x0 + x);
        const ly = g.y0 + y;
        p.dot(X + lx, Y + ly, c, 1);
      }
    }
  } else {
    g.draw(p, 1, cx, cy);
  }
  p.glow(cx, cy, 4 * S, C[4], 0.12);
}

export default function AquariumRain({
  soundEnabled = true,
  rainBurstTrigger = 0,
  onWaterHeightChange,
}) {
  const canvasRef = useRef(null);
  const waterPixelfxRef = useRef(null);

  // Water level starts strictly at 0 ("keep only what dropped")
  const [waterHeight, setWaterHeight] = useState(0);
  const [isDraining, setIsDraining] = useState(false);
  const hasEverDropped = rainBurstTrigger > 0 || waterHeight > 0;

  // Physics refs
  const waterHeightRef = useRef(0);
  const dropsRef = useRef([]);
  const splashesRef = useRef([]);
  const ripplesRef = useRef([]);
  const bubblesRef = useRef([]);
  const lastSoundTimeRef = useRef(0);
  const soundEnabledRef = useRef(soundEnabled);

  // Fish state (calm, leisurely continuous infinite wrap across screen)
  const fishListRef = useRef([
    { x: 90, yRatio: 0.45, vx: 11, dir: 1, size: 1.05, phase: 0, variant: "blue" },
    { x: 480, yRatio: 0.65, vx: -9, dir: -1, size: 0.88, phase: 0.35, variant: "blue" },
    { x: 240, yRatio: 0.32, vx: 13, dir: 1, size: 0.78, phase: 0.7, variant: "gold" },
  ]);

  const MAX_WATER_HEIGHT = 140; // max floor aquarium fill height (~18% of typical screen)

  const onWaterHeightChangeRef = useRef(onWaterHeightChange);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
    onWaterHeightChangeRef.current = onWaterHeightChange;
  }, [soundEnabled, onWaterHeightChange]);

  // Sync ref
  useEffect(() => {
    waterHeightRef.current = waterHeight;
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
        const cloud = rects[Math.floor(Math.random() * rects.length)];
        const spawnX =
          cloud.left + 8 + Math.random() * Math.max(10, cloud.width - 16);
        const spawnY = cloud.bottom - 4 + (Math.random() * 6 - 3);

        newDrops.push({
          x: spawnX,
          y: spawnY,
          vx: (Math.random() - 0.5) * 0.2,
          vy: 2.4 + Math.random() * 0.8,
          len: 10 + Math.random() * 4,
          alpha: 0.85 + Math.random() * 0.15,
        });
      }

      dropsRef.current.push(...newDrops);
    },
    [getCloudRects]
  );

  // ONLY DROP WHEN USER CLICKS (NO auto-drop timer)
  useEffect(() => {
    if (rainBurstTrigger > 0) {
      spawnDrops(1);
      const t1 = setTimeout(() => spawnDrops(1), 100);
      const t2 = setTimeout(() => spawnDrops(1), 220);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [rainBurstTrigger, spawnDrops]);

  // 1. Full-screen Canvas Animation Loop (Falling Raindrops)
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

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const currentWaterTop = height - waterHeightRef.current;
      let addedWater = 0;
      const now = Date.now();

      const activeDrops = [];
      for (let i = 0; i < dropsRef.current.length; i++) {
        const drop = dropsRef.current[i];
        drop.x += drop.vx;
        drop.y += drop.vy;
        drop.vy = Math.min(5.2, drop.vy + 0.08);

        if (drop.y + drop.len >= currentWaterTop) {
          addedWater += 1.4;

          if (
            soundEnabledRef.current &&
            now - lastSoundTimeRef.current > 120
          ) {
            playWaterPlop();
            lastSoundTimeRef.current = now;
          }

          // Spawn pixelfx surface ripple ring & splash beads at impact point
          ripplesRef.current.push({
            x: drop.x / PIXEL_SCALE,
            age: 0,
            life: 0.65,
            seed: Math.floor(Math.random() * 100),
          });

          for (let s = 0; s < 4; s++) {
            splashesRef.current.push({
              x: drop.x + (Math.random() - 0.5) * 4,
              y: currentWaterTop,
              vx: (Math.random() - 0.5) * 2.8,
              vy: -(1.8 + Math.random() * 2.0),
              size: 2,
              alpha: 0.95,
              life: 14 + Math.floor(Math.random() * 6),
            });
          }
        } else {
          activeDrops.push(drop);

          const grad = ctx.createLinearGradient(
            drop.x,
            drop.y,
            drop.x,
            drop.y + drop.len
          );
          grad.addColorStop(0, "rgba(56, 189, 248, 0.2)");
          grad.addColorStop(0.6, "rgba(16, 91, 255, 0.85)");
          grad.addColorStop(1, "rgba(147, 197, 253, 1)");

          ctx.strokeStyle = grad;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x, drop.y + drop.len);
          ctx.stroke();

          ctx.fillStyle = "#93c5fd";
          ctx.fillRect(
            Math.round(drop.x) - 1,
            Math.round(drop.y + drop.len) - 2,
            2,
            2
          );
        }
      }
      dropsRef.current = activeDrops;

      // Update and draw splash droplets above water line
      const activeSplashes = [];
      for (let i = 0; i < splashesRef.current.length; i++) {
        const p = splashesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.18;
        p.life--;
        p.alpha = Math.max(0, p.life / 18);

        if (p.life > 0 && p.y <= currentWaterTop + 4) {
          activeSplashes.push(p);
          ctx.fillStyle = `rgba(125, 211, 252, ${p.alpha})`;
          ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
        }
      }
      splashesRef.current = activeSplashes;

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

  // 2. pixelfx Underwater Aquarium Canvas (Bubbles, Articulated Fish, Surface Ripples, Pebbles)
  useEffect(() => {
    const canvas = waterPixelfxRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const W_RAMP = fit(WATER, 8);
    const BCOLS = [WHITE, W_RAMP[6], W_RAMP[5], W_RAMP[3]];
    const F_BLUE = fit(FISH_BLUE, 7);
    const F_GOLD = fit(FISH_GOLD, 7);
    const ST = rock();
    const STRIPE_ORANGE = hex("#fe8500");
    const FIN_CYAN = hex("#38bdf8");

    let frame = null;
    let painter = null;
    let imgData = null;
    let pw = 0;
    let ph = Math.ceil(MAX_WATER_HEIGHT / PIXEL_SCALE);

    const updateSize = () => {
      pw = Math.max(160, Math.ceil(window.innerWidth / PIXEL_SCALE));
      ph = Math.ceil(MAX_WATER_HEIGHT / PIXEL_SCALE);
      canvas.width = pw;
      canvas.height = ph;
      frame = createFrame(pw, ph, 0, 0);
      painter = new Painter(frame);
      imgData = ctx.createImageData(pw, ph);
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    let animId;
    let lastTime = performance.now();
    let simTime = 0;
    let bubbleSpawnAcc = 0;

    const renderUnderwater = (now) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      simTime += dt;

      const curH = waterHeightRef.current;
      if (curH > 2 && frame && painter && imgData) {
        clearFrame(frame);

        const waterPxH = Math.min(ph - 2, Math.max(2, curH / PIXEL_SCALE));
        const surfaceY = ph - waterPxH;

        // 1. Spawn rising pixelfx bubbles from the aquarium floor
        if (curH > 18) {
          bubbleSpawnAcc += dt * 4.5;
          while (bubbleSpawnAcc >= 1) {
            bubbleSpawnAcc -= 1;
            bubblesRef.current.push({
              x: 12 + Math.random() * Math.max(20, pw - 24),
              y: ph - 3,
              vy: 14 + Math.random() * 12,
              r: 0.9 + Math.random() * 1.6,
              wobblePhase: Math.random() * TAU,
              popAge: -1,
            });
          }
        }

        // 2. Draw subtle underwater caustic sunbeams
        if (waterPxH > 12) {
          for (let s = 0; s < 4; s++) {
            const sxBase = ((s + 0.5) * pw) / 4;
            for (let y = Math.floor(surfaceY + 2); y < ph - 2; y++) {
              const dy = y - surfaceY;
              const sx = sxBase - dy * 0.25 + Math.sin(simTime * 0.8 + s) * 4;
              const hw = 4 + dy * 0.08;
              const a = 0.14 * (1 - dy / Math.max(10, waterPxH));
              for (let x = Math.floor(sx - hw); x <= Math.ceil(sx + hw); x++) {
                painter.blend(x, y, W_RAMP[3], a * (1 - Math.abs(x - sx) / hw));
              }
            }
          }
        }

        // 3. Draw animated pixel water surface wave (from pixelfx water/bubbles)
        for (let x = 0; x < pw; x++) {
          const sy =
            surfaceY +
            Math.sin(x * 0.12 + simTime * 2.6) * 0.65 +
            Math.cos(x * 0.27 - simTime * 1.8) * 0.35;
          const iy = Math.round(sy);
          const crest = Math.sin(x * 0.18 + simTime * 3.2) > 0.35;
          painter.px(x, iy, crest ? WHITE : W_RAMP[6]);
          painter.px(x, iy + 1, W_RAMP[4]);
          if (x % 3 === 0) {
            painter.light(x, iy, W_RAMP[4], 0.25);
          }
        }

        // 4. Update & draw raindrop impact ripple rings on the surface
        for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
          const rp = ripplesRef.current[i];
          rp.age += dt;
          if (rp.age >= rp.life) {
            ripplesRef.current.splice(i, 1);
            continue;
          }
          const u = rp.age / rp.life;
          ring(
            painter,
            rp.x,
            surfaceY + 1,
            1.5 + u * 12,
            0.25,
            (1 - u) * 0.9,
            W_RAMP,
            {
              n: 2,
              gap: 2.5,
              half: 1,
              hot: rp.age < 0.1,
              seed: rp.seed,
            }
          );
        }

        // 5. Update & draw rising pixelfx bubbles (lit rim top-left, shaded bottom-right, surface pop)
        for (let i = bubblesRef.current.length - 1; i >= 0; i--) {
          const b = bubblesRef.current[i];
          if (b.popAge >= 0) {
            b.popAge += dt;
            if (b.popAge > 0.22) {
              bubblesRef.current.splice(i, 1);
              continue;
            }
            // Surface dome & tiny popping beads
            const u = b.popAge / 0.22;
            const rr = b.r * (1 + u * 1.4);
            painter.px(b.x - rr, surfaceY, W_RAMP[6]);
            painter.px(b.x + rr, surfaceY, W_RAMP[6]);
            if (b.popAge < 0.12) {
              bead(
                painter,
                b.x - u * 4,
                surfaceY - u * 5,
                -15,
                -25,
                1,
                W_RAMP,
                1 - u
              );
              bead(
                painter,
                b.x + u * 4,
                surfaceY - u * 4,
                15,
                -20,
                1,
                W_RAMP,
                1 - u
              );
            }
            continue;
          }

          b.y -= b.vy * dt;
          b.wobblePhase += dt * 5;
          const bx = b.x + Math.sin(b.wobblePhase) * 1.1;
          const wob = Math.sin(b.wobblePhase * 1.5) * 0.12;

          if (b.y <= surfaceY + b.r + 0.5) {
            b.popAge = 0;
            continue;
          }

          bubble(painter, bx, b.y, b.r, BCOLS, 0.92, wob);
        }

        // 6. Update & draw articulated pixelfx fish when water is deep enough
        const fishThresholds = [18, 28, 42];
        fishListRef.current.forEach((f, idx) => {
          if (curH < fishThresholds[idx]) return;

          f.x += f.vx * dt;
          f.phase = (f.phase + dt * 0.75) % 1;

          if (f.dir === 1 && f.x > pw + 24) {
            f.x = -24;
          } else if (f.dir === -1 && f.x < -24) {
            f.x = pw + 24;
          }

          const fy =
            surfaceY +
            Math.max(
              7,
              Math.min(waterPxH - 6, waterPxH * f.yRatio + Math.sin(simTime * 2 + idx) * 1.5)
            );
          const ramp = f.variant === "gold" ? F_GOLD : F_BLUE;
          const stripe = f.variant === "gold" ? WHITE : STRIPE_ORANGE;
          const fin = f.variant === "gold" ? STRIPE_ORANGE : FIN_CYAN;

          drawPixelfxFish(
            painter,
            f.x,
            fy,
            f.size,
            f.phase,
            f.dir,
            ramp,
            stripe,
            fin
          );
        });

        // 7. Small pebbles along the aquarium substrate floor
        for (let k = 0; k < 14; k++) {
          const px = ((k * 73 + 19) % Math.max(40, pw - 10)) + 5;
          const pr = 1.4 + (k % 3) * 0.6;
          pebble(painter, px, ph - 1, pr, ST);
        }

        composite(frame, imgData.data, null, 0.85);
        ctx.putImageData(imgData, 0, 0);
      } else if (frame && imgData) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      animId = requestAnimationFrame(renderUnderwater);
    };

    animId = requestAnimationFrame(renderUnderwater);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", updateSize);
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
          bubblesRef.current = [];
          return 0;
        }
        const next = Math.max(0, prev - 3);
        waterHeightRef.current = next;
        return next;
      });
    }, 30);
  };

  return (
    <>
      {/* 1. Full-screen HTML5 Canvas for falling raindrops & splashes */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-30 overflow-hidden"
      />

      {/* 2. THE AQUARIUM WATER FLOOR (ONLY WHAT DROPPED, STARTS AT 0) */}
      <div
        className="fixed bottom-0 left-0 right-0 z-20 pointer-events-none transition-[height] duration-200 ease-out overflow-hidden"
        style={{
          height: `${waterHeight}px`,
        }}
      >
        {/* Water Liquid Body + pixelfx Underwater Canvas */}
        <div
          className="relative w-full h-full backdrop-blur-[1.5px]"
          style={{
            background:
              "linear-gradient(to top, rgba(16, 91, 255, 0.45) 0%, rgba(16, 91, 255, 0.28) 60%, rgba(56, 189, 248, 0.22) 100%)",
            boxShadow:
              "inset 0 4px 16px rgba(16, 91, 255, 0.4), inset 0 -2px 8px rgba(0, 0, 0, 0.5)",
          }}
        >
          {/* pixelfx Dual-Buffer Underwater Canvas (Surface waves, caustic shafts, bubbles, articulated fish, pebbles) */}
          <canvas
            ref={waterPixelfxRef}
            className="absolute bottom-0 left-0 right-0 w-full pointer-events-none select-none pixelated"
            style={{
              height: `${MAX_WATER_HEIGHT}px`,
              imageRendering: "pixelated",
            }}
          />

          {/* Bottom Aquarium Floor Substrate Line */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#151720] border-t border-[#105bff]/40" />
        </div>

        {/* Discreet Aquarium HUD Controls (Drain) */}
        {waterHeight > 0 && (
          <div className="absolute bottom-2.5 right-4 pointer-events-auto flex items-center gap-2 select-none z-30">
            <div className="flex items-center gap-1.5 bg-[#171923]/90 border border-[#2e3242] rounded-lg px-2.5 py-1 text-xs font-mono shadow-lg backdrop-blur-md">
              <span className="text-[#38bdf8]">💧</span>
              <span className="text-zinc-600">|</span>
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
        )}
      </div>

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
