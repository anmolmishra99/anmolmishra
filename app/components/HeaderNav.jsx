"use client";

import React from "react";
import { Volume2, VolumeX, Sparkles } from "lucide-react";
import { playToggleSound, playPixelBlip } from "./SoundEffects";

export default function HeaderNav({
  mode,
  setMode,
  soundEnabled,
  setSoundEnabled,
  onOpenAiModal,
}) {
  const handleToggle = (newMode) => {
    if (newMode !== mode) {
      if (soundEnabled) playToggleSound(newMode === "creative");
      setMode(newMode);
    }
  };

  const handleSoundToggle = () => {
    if (!soundEnabled) playPixelBlip(640, "sine", 0.08);
    setSoundEnabled(!soundEnabled);
  };

  return (
    <header className="sticky top-0 z-40 w-full py-4 px-4 backdrop-blur-md bg-[#21232e]/90 border-b border-[#2e3242]">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        {/* Left: Quick AI / Status Pill */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (soundEnabled) playPixelBlip(880, "sine", 0.06);
              onOpenAiModal();
            }}
            className="group flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1b1d26] border border-[#2e3242] text-xs text-zinc-200 hover:text-[#fe8500] hover:border-[#fe8500]/50 transition-all shadow-sm"
            title="Chat with Anmol's resume AI agent"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#fe8500] group-hover:rotate-12 transition-transform" />
            <span className="font-mono text-[11px]">Ask AI</span>
          </button>
        </div>

        {/* Center: Minimal / Creative Toggle (matching reference image) */}
        <div className="flex items-center p-1 rounded-full bg-[#1b1d26] border border-[#2e3242] shadow-inner">
          <button
            onClick={() => handleToggle("minimal")}
            className={`px-3.5 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
              mode === "minimal"
                ? "bg-[#2e3242] text-white shadow-sm font-semibold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Minimal
          </button>
          <button
            onClick={() => handleToggle("creative")}
            className={`px-3.5 py-1 text-xs font-medium rounded-full transition-all duration-200 flex items-center gap-1.5 ${
              mode === "creative"
                ? "bg-[#105bff] text-white shadow-[0_0_14px_rgba(16,91,255,0.5)] font-semibold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <span>Creative</span>
            {mode === "creative" && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#fe8500] animate-pulse shadow-[0_0_8px_#fe8500]" />
            )}
          </button>
        </div>

        {/* Right: Sound effects toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSoundToggle}
            className={`p-1.5 rounded-full border transition-colors ${
              soundEnabled
                ? "bg-[#1b1d26] border-[#2e3242] text-[#fe8500] hover:text-[#fe8500]/80 shadow-[0_0_8px_rgba(254,133,0,0.25)]"
                : "bg-[#1b1d26]/50 border-[#2e3242]/50 text-zinc-600 hover:text-zinc-400"
            }`}
            title={soundEnabled ? "Mute 8-bit sounds" : "Enable 8-bit sounds"}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
