"use client";

import { bloombergColors } from "../lib/theme-config";
import type { DilutionRiskBreakdown } from "../types/smallcaps";

type Props = {
  breakdown: DilutionRiskBreakdown;
  totalScore: number;
  isDarkMode: boolean;
};

const CRITERIA = [
  { key: "offering_ability" as const, label: "Offering Ability", max: 40, color: "#ef4444" },
  { key: "cash_need" as const, label: "Cash Need", max: 30, color: "#f97316" },
  { key: "historical_risk" as const, label: "Historical Risk", max: 15, color: "#eab308" },
  { key: "net_cash_share" as const, label: "Net Cash/Share", max: 10, color: "#a855f7" },
  { key: "overhead_supply" as const, label: "Overhead Supply", max: 5, color: "#3b82f6" },
  { key: "small_float_bonus" as const, label: "Small Float Bonus", max: 10, color: "#ec4899" },
];

export function DilutionScoreBreakdown({ breakdown, totalScore, isDarkMode }: Props) {
  const colors = isDarkMode ? bloombergColors.dark : bloombergColors.light;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold" style={{ color: colors.accent }}>
          DILUTION RISK SCORE BREAKDOWN
        </span>
        <span
          className="text-lg font-bold"
          style={{
            color:
              totalScore >= 70
                ? "#ef4444"
                : totalScore >= 50
                  ? "#f97316"
                  : totalScore >= 30
                    ? "#eab308"
                    : "#22c55e",
          }}
        >
          {totalScore}/110
        </span>
      </div>

      {/* Stacked bar */}
      <div
        className="w-full h-6 rounded overflow-hidden flex"
        style={{ backgroundColor: colors.surface }}
      >
        {CRITERIA.map((c) => {
          const value = breakdown[c.key];
          const widthPct = (value / 110) * 100;
          return (
            <div
              key={c.key}
              style={{ width: `${widthPct}%`, backgroundColor: c.color }}
              className="h-full transition-all duration-300"
              title={`${c.label}: ${value}/${c.max}`}
            />
          );
        })}
      </div>

      {/* Individual criteria */}
      <div className="space-y-1.5">
        {CRITERIA.map((c) => {
          const value = breakdown[c.key];
          const pct = (value / c.max) * 100;
          return (
            <div key={c.key} className="flex items-center gap-2 text-xs">
              <span className="w-28 truncate" style={{ color: colors.textSecondary }}>
                {c.label}
              </span>
              <div
                className="flex-1 h-2 rounded overflow-hidden"
                style={{ backgroundColor: colors.surface }}
              >
                <div
                  className="h-full rounded transition-all duration-300"
                  style={{ width: `${pct}%`, backgroundColor: c.color }}
                />
              </div>
              <span className="w-12 text-right font-mono" style={{ color: colors.text }}>
                {value}/{c.max}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
