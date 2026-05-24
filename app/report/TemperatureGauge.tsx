"use client";

import React, { useState } from "react";
import { TemperatureMilestone } from "../types";

export default function TemperatureGauge({
  milestones,
}: {
  milestones: TemperatureMilestone[];
}) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(
    milestones.length > 0 ? 0 : null
  );

  // Sort milestones by temperature descending
  const sortedMilestones = [...milestones].sort(
    (a, b) => b.tempCelsius - a.tempCelsius
  );

  const maxTemp = Math.max(1600, ...sortedMilestones.map((m) => m.tempCelsius));

  // Height of vertical gauge
  const height = 300;

  // Map temperature to Y coordinate on the gauge
  const getTempY = (temp: number) => {
    // Leave padding at top and bottom
    const topPadding = 20;
    const bottomPadding = 20;
    const innerHeight = height - topPadding - bottomPadding;
    // Scale: maxTemp is at the top (topPadding), 0 is at the bottom (height - bottomPadding)
    return height - bottomPadding - (temp / maxTemp) * innerHeight;
  };

  const activeMilestone =
    selectedIdx !== null ? sortedMilestones[selectedIdx] : null;

  return (
    <div className="my-10 flex flex-col md:flex-row gap-8 rounded-md border border-rule bg-paper/50 p-6 items-stretch">
      {/* Visual Temperature Scale */}
      <div className="flex flex-col items-center justify-between min-w-[80px] border-b md:border-b-0 md:border-r border-rule/50 pb-6 md:pb-0 md:pr-4 select-none">
        <span className="text-[10px] uppercase tracking-widest text-ink-faint">
          Heat Scale
        </span>
        <div className="relative w-16" style={{ height: `${height}px` }}>
          {/* Main Thermometer Column */}
          <div className="absolute left-1/2 top-4 bottom-4 w-1 -translate-x-1/2 bg-rule rounded-full" />

          {/* Active Liquid level (up to selected or highest temperature) */}
          {activeMilestone && (
            <div
              className="absolute left-1/2 bottom-4 w-1 -translate-x-1/2 bg-ink rounded-full transition-all duration-500"
              style={{
                top: `${getTempY(activeMilestone.tempCelsius)}px`,
              }}
            />
          )}

          {/* Major Grid Lines & Labels */}
          {[0, 400, 800, 1200, 1600].map((t) => {
            if (t > maxTemp + 100) return null;
            const y = getTempY(t);
            return (
              <div
                key={t}
                className="absolute w-full flex items-center justify-between"
                style={{ top: `${y}px`, transform: "translateY(-50%)" }}
              >
                <span className="text-[9px] font-mono text-ink-faint">{t}°C</span>
                <div className="w-2 h-[1px] bg-rule" />
              </div>
            );
          })}

          {/* Milestone Interactive Handles */}
          {sortedMilestones.map((m, idx) => {
            const y = getTempY(m.tempCelsius);
            const isSelected = selectedIdx === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                className="absolute right-0 flex items-center group focus:outline-none"
                style={{ top: `${y}px`, transform: "translateY(-50%)" }}
              >
                {/* Visual indicator node */}
                <div className="flex items-center gap-1.5 translate-x-2">
                  <div
                    className={[
                      "w-3 h-3 rounded-full border bg-paper transition-all duration-300",
                      isSelected
                        ? "border-ink scale-125 bg-ink"
                        : "border-rule group-hover:border-ink-soft",
                    ].join(" ")}
                  />
                  <span
                    className={[
                      "text-[10px] font-mono whitespace-nowrap transition-colors",
                      isSelected ? "text-ink font-semibold" : "text-ink-faint group-hover:text-ink-soft",
                    ].join(" ")}
                  >
                    {m.tempCelsius}°C
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        <span className="text-[10px] font-mono text-ink-faint">Ambient</span>
      </div>

      {/* Milestone Details Card */}
      <div className="flex-1 flex flex-col justify-between min-h-[220px]">
        {activeMilestone ? (
          <div className="flex-1 flex flex-col justify-center">
            <div className="border-b border-rule pb-2 mb-4">
              <span className="text-[10px] uppercase tracking-widest text-ink-faint block">
                Thermal Threshold
              </span>
              <h4 className="font-serif text-2xl font-semibold text-ink mt-1">
                {activeMilestone.tempCelsius}°C &mdash; {activeMilestone.process}
              </h4>
            </div>
            <p className="font-serif text-base text-ink-soft italic leading-relaxed">
              {activeMilestone.description}
            </p>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center py-2">
            <p className="font-serif text-sm italic text-ink-faint text-center">
              Click a temperature node to see what occurs at this threshold.
            </p>
          </div>
        )}

        <div className="text-[11px] text-ink-faint border-t border-rule/30 pt-3 mt-4 italic">
          Achieving temperatures above 1000°C requires draft construction, bellows, and refined charcoal fuel.
        </div>
      </div>
    </div>
  );
}
