"use client";

import React, { useState } from "react";
import { ArrowUpRight, ChevronDown, Sparkles, ExternalLink } from "lucide-react";
import PixelCompanion from "./PixelCompanion";
import { playPixelBlip } from "./SoundEffects";

export default function ProjectCard({
  metric,
  metricSub,
  title,
  tagline,
  description,
  bullets = [],
  tags = [],
  link,
  linkText = "Case study →",
  hasCompanion = false,
  soundEnabled = true,
  isCreative = false,
}) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    if (soundEnabled) playPixelBlip(expanded ? 400 : 600, "square", 0.04);
    setExpanded(!expanded);
  };

  return (
    <div className="group relative grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 md:gap-8 items-start py-6 border-b border-[#2e3242]/70 transition-colors">
      {/* Left Column: Metric + Companion */}
      <div className="flex md:flex-col items-baseline md:items-start justify-between md:justify-start gap-1">
        <div className="flex flex-col">
          <span className="text-xl md:text-2xl font-semibold tracking-tight text-[#fe8500] font-mono group-hover:text-[#105bff] transition-colors">
            {metric}
          </span>
          <span className="text-xs text-zinc-400 font-mono tracking-wide">
            {metricSub}
          </span>
        </div>

        {/* Pixel companion positioned right beside metric as in reference */}
        {hasCompanion && (
          <div className="mt-2 md:mt-3">
            <PixelCompanion soundEnabled={soundEnabled} isCreative={isCreative} />
          </div>
        )}
      </div>

      {/* Right Column: Project Details */}
      <div className="space-y-3">
        {/* Title */}
        <div>
          {link ? (
            <a
              href={link}
              target={link.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group/title inline-flex items-center gap-1.5 text-base md:text-lg font-medium text-[#f1f3f9] hover:text-[#fe8500] transition-colors"
            >
              <span>{title}</span>
              <span className="text-[#105bff] group-hover/title:translate-x-1 group-hover/title:-translate-y-0.5 group-hover/title:text-[#fe8500] transition-all text-sm font-bold">
                →
              </span>
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-base md:text-lg font-medium text-[#f1f3f9]">
              {title}
            </span>
          )}
          {tagline && (
            <p className="text-xs text-zinc-400 font-mono mt-0.5">{tagline}</p>
          )}
        </div>

        {/* Narrative Description */}
        <p className="text-[13px] sm:text-sm text-zinc-300 leading-relaxed font-normal">
          {description}
        </p>

        {/* Expandable details / bullet points */}
        {bullets.length > 0 && (
          <div className="pt-1">
            <button
              onClick={toggleExpand}
              className="text-xs text-zinc-400 hover:text-[#fe8500] flex items-center gap-1 transition-colors py-1"
            >
              <span>{expanded ? "Hide details" : "Key engineering highlights"}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  expanded ? "rotate-180 text-[#fe8500]" : ""
                }`}
              />
            </button>

            {expanded && (
              <ul className="mt-2.5 space-y-2 border-l border-[#2e3242] pl-3.5 text-[12px] sm:text-xs text-zinc-300">
                {bullets.map((bullet, idx) => (
                  <li key={idx} className="leading-relaxed">
                    <span className="text-[#fe8500] mr-1.5 font-bold">▪</span>
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Tech Badges */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded bg-[#1b1d26] border border-[#2e3242] text-zinc-300 hover:border-[#105bff] hover:text-white transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Link / CTA */}
        {link && (
          <div className="pt-1">
            <a
              href={link}
              target={link.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#105bff] hover:text-[#fe8500] transition-colors group/link"
            >
              <span>{linkText}</span>
              <span className="group-hover/link:translate-x-0.5 transition-transform">
                →
              </span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
