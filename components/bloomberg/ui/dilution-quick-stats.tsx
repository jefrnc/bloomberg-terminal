"use client";

import { bloombergColors } from "../lib/theme-config";
import type { DueDiligenceData } from "../types/smallcaps";

type Props = {
  data: DueDiligenceData;
  isDarkMode: boolean;
};

function formatMoney(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

export function DilutionQuickStats({ data, isDarkMode }: Props) {
  const colors = isDarkMode ? bloombergColors.dark : bloombergColors.light;

  const stats = [
    { label: "Shelf Capacity", value: formatMoney(data.shelf_capacity) },
    { label: "Warrants Outstanding", value: data.warrants_outstanding.toLocaleString() },
    { label: "Offerings (12m)", value: data.offerings_12m.toString() },
    { label: "Dilution (12m)", value: `${data.dilution_12m_pct.toFixed(1)}%` },
    { label: "Shares Added (30d)", value: data.shares_added_30d.toLocaleString() },
    { label: "Short Vol Ratio", value: data.short_volume_ratio.toFixed(2) },
    { label: "Days to Cover", value: data.days_to_cover.toFixed(1) },
    { label: "Last Banker", value: data.last_banker || "N/A" },
  ];

  return (
    <div className="space-y-2">
      <span className="text-xs font-bold" style={{ color: colors.accent }}>
        QUICK STATS
      </span>
      <div className="space-y-0.5">
        {stats.map((s) => (
          <div key={s.label} className="flex justify-between text-[11px] font-mono py-0.5">
            <span style={{ color: colors.textSecondary }}>{s.label}</span>
            <span style={{ color: colors.text }}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
