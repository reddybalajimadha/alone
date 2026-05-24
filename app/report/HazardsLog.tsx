"use client";

import React from "react";
import { HazardItem } from "../types";

export default function HazardsLog({
  hazards,
}: {
  hazards: HazardItem[];
}) {
  return (
    <div className="my-10 flex flex-col gap-6 rounded-md border border-rule bg-paper/50 p-6">
      <div className="text-center text-xs italic text-ink-faint">
        The Hazards Log: Sourcing and refining alone is a sequence of high-risk experiments.
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {hazards.map((h, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-4 rounded-sm border border-rule/70 bg-paper p-4 transition-all duration-300 hover:border-rule"
          >
            {/* Header with Probability */}
            <div className="flex items-center justify-between border-b border-rule/50 pb-2">
              <h4 className="font-serif text-base font-semibold text-ink">
                {h.name}
              </h4>
              <span className="text-[10px] font-mono text-ink-soft uppercase bg-ink/[0.04] px-1.5 py-0.5 rounded-sm">
                Risk: {h.probabilityPercent}%
              </span>
            </div>

            {/* Probability Progress Bar */}
            <div className="w-full h-1 bg-rule/35 rounded-full overflow-hidden">
              <div
                className="h-full bg-ink-soft transition-all duration-500"
                style={{ width: `${h.probabilityPercent}%` }}
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2.5">
              <p className="font-serif text-sm text-ink-soft leading-relaxed">
                <span className="font-semibold block text-[11px] uppercase tracking-wide text-ink-faint mb-0.5">
                  Consequence
                </span>
                {h.consequence}
              </p>
              <p className="font-serif text-sm text-ink-faint italic leading-relaxed border-t border-rule/30 pt-2">
                <span className="font-semibold block text-[11px] uppercase tracking-wide text-ink-faint not-italic mb-0.5">
                  Mitigation
                </span>
                {h.mitigation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
