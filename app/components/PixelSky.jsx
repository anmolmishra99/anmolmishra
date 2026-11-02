"use client";

import React, { useState } from "react";
import { playPixelBlip, playPixelChirp } from "./SoundEffects";

export default function PixelSky({
  isCreative = false,
  soundEnabled = true,
  onCloudClick,
}) {
  const [moonClicked, setMoonClicked] = useState(false);

  const handleMoonClick = () => {
    if (soundEnabled) playPixelChirp();
    if (onCloudClick) onCloudClick();
    setMoonClicked(true);
    setTimeout(() => setMoonClicked(false), 1200);
  };

  const handleCloudClick = (e) => {
    if (soundEnabled) playPixelBlip(780, "square", 0.05);
    if (onCloudClick) onCloudClick();
  };

  return (
    <div className="relative w-48 h-32 md:w-56 md:h-36 select-none pointer-events-auto">
      {/* Background Pixel Stars */}
      <div className="absolute inset-0 overflow-visible pointer-events-none">
        {/* Star 1 */}
        <div
          className="absolute top-2 left-6 animate-pixel-twinkle"
          style={{ animationDuration: "2.4s", animationDelay: "0.2s" }}
        >
          <PixelStar color="#fde047" size={6} />
        </div>
        {/* Star 2 */}
        <div
          className="absolute top-10 left-16 animate-pixel-twinkle"
          style={{ animationDuration: "3.1s", animationDelay: "1.1s" }}
        >
          <PixelStar color="#bae6fd" size={4} />
        </div>
        {/* Star 3 */}
        <div
          className="absolute top-1 right-20 animate-pixel-twinkle"
          style={{ animationDuration: "2.8s", animationDelay: "0.6s" }}
        >
          <PixelStar color="#fef08a" size={5} />
        </div>
        {/* Star 4 */}
        <div
          className="absolute top-16 right-4 animate-pixel-twinkle"
          style={{ animationDuration: "3.6s", animationDelay: "1.8s" }}
        >
          <PixelStar color="#e0f2fe" size={4} />
        </div>
        {/* Shooting Star in Royal Blue */}
        <div
          className="absolute top-0 right-2 pointer-events-none"
          style={{ animation: "shootingStar 8s linear infinite", animationDelay: "3s" }}
        >
          <div className="flex items-center">
            <div className="w-1.5 h-1.5 bg-[#105bff] shadow-[0_0_10px_#105bff]" />
            <div className="w-5 h-[1.5px] bg-gradient-to-l from-transparent to-[#105bff]" />
          </div>
        </div>

        {/* Ambient Stars (Only Royal Blue and Ice-Blue) */}
        <div
          className="absolute top-2 left-6 animate-pixel-twinkle"
          style={{ animationDuration: "2.4s", animationDelay: "0.2s" }}
        >
          <PixelStar color="#105bff" size={6} />
        </div>
        <div
          className="absolute top-10 left-16 animate-pixel-twinkle"
          style={{ animationDuration: "3.1s", animationDelay: "1.1s" }}
        >
          <PixelStar color="#8bb4ff" size={5} />
        </div>
        <div
          className="absolute top-1 right-20 animate-pixel-twinkle"
          style={{ animationDuration: "2.8s", animationDelay: "0.6s" }}
        >
          <PixelStar color="#105bff" size={5} />
        </div>
        <div
          className="absolute top-16 right-4 animate-pixel-twinkle"
          style={{ animationDuration: "3.6s", animationDelay: "1.8s" }}
        >
          <PixelStar color="#bae6fd" size={4} />
        </div>
        <div
          className="absolute top-20 left-2 animate-pixel-twinkle"
          style={{ animationDuration: "2.1s", animationDelay: "0.4s" }}
        >
          <PixelStar color="#105bff" size={5} />
        </div>
        <div
          className="absolute -top-2 right-8 animate-pixel-twinkle"
          style={{ animationDuration: "1.9s", animationDelay: "0.9s" }}
        >
          <PixelStar color="#8bb4ff" size={6} />
        </div>
      </div>

      {/* Pixel Moon with Royal Blue glow */}
      <div
        onClick={handleMoonClick}
        className={`absolute top-2 right-12 cursor-pointer transition-transform duration-300 ${
          moonClicked ? "scale-110 rotate-6" : "hover:scale-105"
        }`}
        style={{
          animation: "pixelFloatMoon 4.5s ease-in-out infinite",
          filter: "drop-shadow(0 0 20px rgba(16, 91, 255, 0.45))",
        }}
        title="Click the pixel moon!"
      >
        <PixelMoon size={48} wink={moonClicked} />
      </div>

      {/* Cloud 1 (Large Main Cloud) */}
      <div
        id="pixel-cloud-main"
        onClick={handleCloudClick}
        className="absolute top-8 right-2 cursor-pointer hover:brightness-110 active:scale-95 transition-all"
        style={{
          animation: "pixelDriftMain 6s ease-in-out infinite alternate",
          filter: "drop-shadow(0 4px 14px rgba(16, 91, 255, 0.35))",
        }}
        title="Click the cloud to make it rain!"
      >
        <PixelBigCloud width={118} height={52} />
      </div>

      {/* Cloud 2 (Small Left Cloud) */}
      <div
        id="pixel-cloud-small"
        onClick={handleCloudClick}
        className="absolute top-14 left-4 cursor-pointer hover:brightness-110 active:scale-95 transition-all"
        style={{
          animation: "pixelDriftSmall 5s ease-in-out infinite alternate",
          filter: "drop-shadow(0 3px 10px rgba(16, 91, 255, 0.3))",
        }}
        title="Click the cloud to make it rain!"
      >
        <PixelSmallCloud width={68} height={34} />
      </div>
    </div>
  );
}

// Crisp Pixel Star
function PixelStar({ color = "#fde047", size = 5 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 5 5"
      fill="none"
      style={{ shapeRendering: "crispEdges" }}
    >
      <rect x="2" y="0" width="1" height="5" fill={color} />
      <rect x="0" y="2" width="5" height="1" fill={color} />
      <rect x="1" y="1" width="3" height="3" fill="#ffffff" fillOpacity="0.8" />
    </svg>
  );
}

// Crisp Pixel Moon (20x20 grid)
function PixelMoon({ size = 48, wink = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      style={{ shapeRendering: "crispEdges" }}
      className="pixelated"
    >
      {/* Dark Outer Outline */}
      <rect x="6" y="1" width="8" height="1" fill="#18181b" />
      <rect x="4" y="2" width="2" height="1" fill="#18181b" />
      <rect x="14" y="2" width="2" height="1" fill="#18181b" />
      <rect x="2" y="4" width="2" height="2" fill="#18181b" />
      <rect x="16" y="4" width="2" height="2" fill="#18181b" />
      <rect x="1" y="6" width="1" height="8" fill="#18181b" />
      <rect x="18" y="6" width="1" height="8" fill="#18181b" />
      <rect x="2" y="14" width="2" height="2" fill="#18181b" />
      <rect x="16" y="14" width="2" height="2" fill="#18181b" />
      <rect x="4" y="17" width="2" height="1" fill="#18181b" />
      <rect x="14" y="17" width="2" height="1" fill="#18181b" />
      <rect x="6" y="18" width="8" height="1" fill="#18181b" />

      {/* Moon Base Surface (Bright Pale Ivory) */}
      <rect x="6" y="2" width="8" height="2" fill="#fef9c3" />
      <rect x="4" y="4" width="12" height="2" fill="#fef9c3" />
      <rect x="2" y="6" width="16" height="8" fill="#fef9c3" />
      <rect x="4" y="14" width="12" height="3" fill="#fef08a" />
      <rect x="6" y="17" width="8" height="1" fill="#fde047" />

      {/* Subtle Lunar Craters / Shading */}
      <rect x="5" y="7" width="3" height="3" fill="#eab308" />
      <rect x="6" y="8" width="1" height="1" fill="#ca8a04" />

      <rect x="12" y="6" width="2" height="2" fill="#facc15" />
      <rect x="10" y="11" width="4" height="3" fill="#eab308" />
      <rect x="11" y="12" width="2" height="1" fill="#ca8a04" />

      <rect x="5" y="13" width="2" height="2" fill="#facc15" />

      {/* Wink or Sparkle when clicked */}
      {wink ? (
        <>
          <rect x="5" y="8" width="3" height="1" fill="#09090b" />
          <rect x="12" y="8" width="3" height="1" fill="#09090b" />
          <rect x="8" y="12" width="4" height="2" fill="#e11d48" />
        </>
      ) : null}
    </svg>
  );
}

// Crisp Pixel Big Cloud (46x22 grid)
function PixelBigCloud({ width = 118, height = 52 }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 46 22"
      style={{ shapeRendering: "crispEdges" }}
      className="pixelated"
    >
      {/* Outer Outline */}
      {/* Top lobes */}
      <rect x="16" y="1" width="12" height="1" fill="#0f172a" />
      <rect x="13" y="2" width="3" height="2" fill="#0f172a" />
      <rect x="28" y="2" width="4" height="2" fill="#0f172a" />
      
      <rect x="6" y="5" width="8" height="1" fill="#0f172a" />
      <rect x="3" y="6" width="3" height="2" fill="#0f172a" />
      <rect x="32" y="4" width="8" height="1" fill="#0f172a" />
      <rect x="40" y="5" width="3" height="2" fill="#0f172a" />

      {/* Side edges */}
      <rect x="1" y="8" width="2" height="10" fill="#0f172a" />
      <rect x="43" y="7" width="2" height="11" fill="#0f172a" />

      {/* Bottom flat base */}
      <rect x="3" y="18" width="3" height="2" fill="#0f172a" />
      <rect x="40" y="18" width="3" height="2" fill="#0f172a" />
      <rect x="6" y="20" width="34" height="2" fill="#0f172a" />

      {/* Cloud Main Body (Puffy White / Crisp Cyan Highlights) */}
      <rect x="16" y="2" width="12" height="3" fill="#ffffff" />
      <rect x="13" y="4" width="18" height="3" fill="#ffffff" />
      <rect x="6" y="6" width="34" height="4" fill="#ffffff" />
      <rect x="3" y="8" width="40" height="4" fill="#ffffff" />

      {/* Mid Tone (Light Sky Blue: #e0f2fe) */}
      <rect x="3" y="12" width="40" height="4" fill="#e0f2fe" />
      <rect x="5" y="16" width="36" height="2" fill="#bae6fd" />

      {/* Bottom Pixel Shading (Shadow Sky Blue: #7dd3fc and #38bdf8) */}
      <rect x="5" y="18" width="36" height="2" fill="#7dd3fc" />
      <rect x="10" y="18" width="16" height="1" fill="#38bdf8" />
      <rect x="30" y="18" width="8" height="1" fill="#38bdf8" />

      {/* Soft Cloud Highlights */}
      <rect x="8" y="7" width="5" height="1" fill="#ffffff" />
      <rect x="18" y="3" width="7" height="1" fill="#ffffff" />
      <rect x="34" y="5" width="5" height="1" fill="#ffffff" />
    </svg>
  );
}

// Crisp Pixel Small Cloud (30x16 grid)
function PixelSmallCloud({ width = 68, height = 34 }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 30 16"
      style={{ shapeRendering: "crispEdges" }}
      className="pixelated"
    >
      {/* Outer Outline */}
      <rect x="10" y="1" width="8" height="1" fill="#0f172a" />
      <rect x="8" y="2" width="2" height="1" fill="#0f172a" />
      <rect x="18" y="2" width="2" height="1" fill="#0f172a" />

      <rect x="4" y="3" width="4" height="1" fill="#0f172a" />
      <rect x="2" y="4" width="2" height="2" fill="#0f172a" />
      <rect x="20" y="3" width="5" height="1" fill="#0f172a" />
      <rect x="25" y="4" width="2" height="2" fill="#0f172a" />

      <rect x="1" y="6" width="1" height="7" fill="#0f172a" />
      <rect x="27" y="6" width="1" height="7" fill="#0f172a" />

      <rect x="2" y="13" width="2" height="1" fill="#0f172a" />
      <rect x="25" y="13" width="2" height="1" fill="#0f172a" />
      <rect x="4" y="14" width="21" height="2" fill="#0f172a" />

      {/* Main Body */}
      <rect x="10" y="2" width="8" height="2" fill="#ffffff" />
      <rect x="8" y="3" width="12" height="3" fill="#ffffff" />
      <rect x="4" y="4" width="21" height="4" fill="#ffffff" />
      <rect x="2" y="6" width="25" height="4" fill="#ffffff" />
      
      {/* Shading */}
      <rect x="2" y="10" width="25" height="2" fill="#e0f2fe" />
      <rect x="3" y="12" width="23" height="2" fill="#7dd3fc" />
    </svg>
  );
}
