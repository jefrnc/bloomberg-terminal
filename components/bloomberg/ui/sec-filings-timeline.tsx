"use client";

import { bloombergColors } from "../lib/theme-config";
import type { DueDiligenceData } from "../types/smallcaps";

type FilingEntry = {
  date: string;
  type: "S-3" | "424B" | "8-K" | "Form 4";
  description: string;
};

const FILING_COLORS: Record<string, string> = {
  "S-3": "#f97316", // orange
  "424B": "#ef4444", // red
  "8-K": "#3b82f6", // blue
  "Form 4": "#22c55e", // green
};

type Props = {
  data: DueDiligenceData;
  isDarkMode: boolean;
};

export function SecFilingsTimeline({ data, isDarkMode }: Props) {
  const colors = isDarkMode ? bloombergColors.dark : bloombergColors.light;

  // Merge all filing types into a unified timeline
  const entries: FilingEntry[] = [];

  for (const f of data.s3_filings) {
    entries.push({
      date: f.filing_date,
      type: "S-3",
      description: `Shelf: $${(f.capacity / 1e6).toFixed(0)}M capacity`,
    });
  }
  for (const f of data.prospectus_424b) {
    entries.push({ date: f.date, type: "424B", description: f.description });
  }
  for (const f of data.filings_8k) {
    entries.push({ date: f.date, type: "8-K", description: f.description });
  }
  for (const f of data.form_4) {
    entries.push({
      date: f.date,
      type: "Form 4",
      description: `${f.insider}: ${f.transaction} ${f.shares.toLocaleString()} shares`,
    });
  }

  entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-2">
      <span className="text-xs font-bold" style={{ color: colors.accent }}>
        SEC FILINGS TIMELINE
      </span>

      {/* Legend */}
      <div className="flex gap-3 text-[10px]">
        {Object.entries(FILING_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span style={{ color: colors.textSecondary }}>{type}</span>
          </div>
        ))}
      </div>

      {entries.length === 0 ? (
        <div className="text-xs py-4 text-center" style={{ color: colors.textSecondary }}>
          No SEC filings found
        </div>
      ) : (
        <div className="space-y-0 max-h-64 overflow-y-auto">
          {entries.map((entry, i) => {
            const dotColor = FILING_COLORS[entry.type] || colors.textSecondary;
            return (
              <div key={`${entry.date}-${entry.type}-${i}`} className="flex items-start gap-2 py-1">
                <div className="flex flex-col items-center mt-1">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: dotColor }}
                  />
                  {i < entries.length - 1 && (
                    <div
                      className="w-px flex-1 min-h-[16px]"
                      style={{ backgroundColor: colors.border }}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono" style={{ color: colors.textSecondary }}>
                      {entry.date}
                    </span>
                    <span
                      className="text-[10px] font-bold px-1 rounded"
                      style={{ color: dotColor }}
                    >
                      {entry.type}
                    </span>
                  </div>
                  <div className="text-[11px] truncate" style={{ color: colors.text }}>
                    {entry.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
