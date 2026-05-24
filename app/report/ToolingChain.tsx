"use client";

import React from "react";
import { PrerequisiteTool } from "../types";

export default function ToolingChain({
  tools,
}: {
  tools: PrerequisiteTool[];
}) {
  return (
    <div className="my-10 flex flex-col gap-6 rounded-md border border-rule bg-paper/50 p-6">
      <div className="text-center text-xs italic text-ink-faint">
        The tooling stack: Each tool represents a prerequisite you must craft before the next.
      </div>

      <div className="relative pl-8 border-l border-rule space-y-8 py-2 ml-4">
        {tools.map((t, idx) => (
          <div key={idx} className="relative group">
            {/* Step marker node */}
            <div className="absolute -left-[41px] top-1.5 w-6 h-6 rounded-full border border-rule bg-paper flex items-center justify-center transition-all group-hover:border-ink-soft select-none">
              <span className="text-[10px] font-semibold text-ink-soft group-hover:text-ink">
                {idx + 1}
              </span>
            </div>

            {/* Content card */}
            <div className="flex flex-col gap-1.5 pl-2 transition-all duration-300">
              <h4 className="font-serif text-lg font-semibold text-ink group-hover:text-ink-soft">
                {t.name}
              </h4>
              <p className="font-serif text-sm text-ink-soft">
                <strong className="font-semibold">Purpose:</strong> {t.purpose}
              </p>
              <p className="font-serif text-sm text-ink-faint italic leading-relaxed">
                <strong className="font-semibold not-italic">Difficulty:</strong> {t.difficulty}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
