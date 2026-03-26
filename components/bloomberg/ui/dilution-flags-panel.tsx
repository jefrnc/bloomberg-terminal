"use client";

import { bloombergColors } from "../lib/theme-config";
import type { DueDiligenceData } from "../types/smallcaps";

type Props = {
  data: DueDiligenceData;
  isDarkMode: boolean;
};

const FLAGS: Array<{ key: keyof DueDiligenceData; label: string }> = [
  { key: "active_dilution", label: "ACTIVE DILUTION" },
  { key: "high_dilution_risk", label: "HIGH RISK" },
  { key: "has_offering_capacity", label: "OFFERING CAPACITY" },
  { key: "needs_cash", label: "NEEDS CASH" },
  { key: "historical_diluter", label: "HISTORICAL DILUTER" },
  { key: "near_offering_threshold", label: "NEAR THRESHOLD" },
  { key: "recent_dilution", label: "RECENT DILUTION" },
];

export function DilutionFlagsPanel({ data, isDarkMode }: Props) {
  const colors = isDarkMode ? bloombergColors.dark : bloombergColors.light;

  return (
    <div className="space-y-2">
      <span className="text-xs font-bold" style={{ color: colors.accent }}>
        DILUTION FLAGS
      </span>
      <div className="flex flex-wrap gap-1.5">
        {FLAGS.map((flag) => {
          const isActive = !!data[flag.key];
          return (
            <span
              key={flag.key}
              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                isActive ? "bg-red-600 text-white" : "bg-green-700 text-white"
              }`}
            >
              {flag.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
