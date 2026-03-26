"use client";

import { useAtom } from "jotai";
import { ArrowLeft } from "lucide-react";
import { selectedTickerAtom, smallCapViewAtom } from "../atoms/smallcaps";
import { BloombergButton } from "../core/bloomberg-button";
import { useGapHeatmap } from "../hooks/useGapHeatmap";
import { bloombergColors } from "../lib/theme-config";

type Props = {
  isDarkMode: boolean;
};

function getGapColor(gapPct: number): string {
  if (gapPct >= 10) return "#16a34a";
  if (gapPct >= 5) return "#22c55e";
  if (gapPct >= 2) return "#4ade80";
  if (gapPct > 0) return "#86efac";
  if (gapPct === 0) return "#374151";
  if (gapPct >= -2) return "#fca5a5";
  if (gapPct >= -5) return "#f87171";
  if (gapPct >= -10) return "#ef4444";
  return "#dc2626";
}

export function GapHeatmapView({ isDarkMode }: Props) {
  const colors = isDarkMode ? bloombergColors.dark : bloombergColors.light;
  const [selectedTicker] = useAtom(selectedTickerAtom);
  const [, setView] = useAtom(smallCapViewAtom);
  const { data, isLoading, error } = useGapHeatmap();

  const handleBack = () => setView("scanner");

  if (!selectedTicker) {
    return (
      <div className="p-4 text-center" style={{ color: colors.textSecondary }}>
        <p className="text-sm">Select a ticker from the scanner to view gap heatmap.</p>
        <BloombergButton color="accent" onClick={handleBack} className="mt-2">
          BACK TO SCANNER
        </BloombergButton>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 text-center" style={{ color: colors.textSecondary }}>
        <div className="animate-pulse text-sm">Loading heatmap for {selectedTicker}...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-4 text-center" style={{ color: colors.negative }}>
        <p className="text-sm">Failed to load heatmap for {selectedTicker}</p>
        <BloombergButton color="accent" onClick={handleBack} className="mt-2">
          BACK TO SCANNER
        </BloombergButton>
      </div>
    );
  }

  return (
    <div>
      <div
        className="flex items-center gap-2 px-2 py-1"
        style={{ backgroundColor: colors.surface }}
      >
        <BloombergButton color="default" onClick={handleBack}>
          <ArrowLeft className="h-3 w-3 mr-1" />
          BACK
        </BloombergButton>
        <span className="text-sm font-bold" style={{ color: colors.accent }}>
          GAP HEATMAP
        </span>
        <span className="text-sm font-bold" style={{ color: colors.text }}>
          {selectedTicker}
        </span>
      </div>

      <div className="p-3">
        {/* Heatmap grid */}
        <div className="flex flex-wrap gap-[2px] max-w-[600px]">
          {data.days.map((day) => (
            <div
              key={day.date}
              className="w-[14px] h-[14px] rounded-[2px] cursor-pointer"
              style={{ backgroundColor: getGapColor(day.gap_percent) }}
              title={`${day.date}: ${day.gap_percent > 0 ? "+" : ""}${day.gap_percent.toFixed(1)}% | Vol: ${day.volume.toLocaleString()}`}
            />
          ))}
        </div>

        {/* Legend */}
        <div
          className="flex items-center gap-2 mt-3 text-[10px]"
          style={{ color: colors.textSecondary }}
        >
          <span>-10%</span>
          <div className="flex gap-[1px]">
            {[-10, -5, -2, 0, 2, 5, 10].map((v) => (
              <div
                key={v}
                className="w-3 h-3 rounded-[1px]"
                style={{ backgroundColor: getGapColor(v) }}
              />
            ))}
          </div>
          <span>+10%</span>
        </div>

        {/* Stats panel */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-2 rounded" style={{ backgroundColor: colors.surface }}>
            <div className="text-[10px]" style={{ color: colors.textSecondary }}>
              Avg Gap
            </div>
            <div
              className="text-sm font-bold font-mono"
              style={{ color: data.avg_gap >= 0 ? colors.positive : colors.negative }}
            >
              {data.avg_gap > 0 ? "+" : ""}
              {data.avg_gap.toFixed(2)}%
            </div>
          </div>
          <div className="p-2 rounded" style={{ backgroundColor: colors.surface }}>
            <div className="text-[10px]" style={{ color: colors.textSecondary }}>
              Win Rate
            </div>
            <div className="text-sm font-bold font-mono" style={{ color: colors.text }}>
              {(data.win_rate * 100).toFixed(1)}%
            </div>
          </div>
          <div className="p-2 rounded" style={{ backgroundColor: colors.surface }}>
            <div className="text-[10px]" style={{ color: colors.textSecondary }}>
              Best Day
            </div>
            <div className="text-sm font-bold font-mono" style={{ color: colors.positive }}>
              {data.best_day ? `+${data.best_day.gap_percent.toFixed(1)}%` : "N/A"}
            </div>
            <div className="text-[10px]" style={{ color: colors.textSecondary }}>
              {data.best_day?.date ?? ""}
            </div>
          </div>
          <div className="p-2 rounded" style={{ backgroundColor: colors.surface }}>
            <div className="text-[10px]" style={{ color: colors.textSecondary }}>
              Worst Day
            </div>
            <div className="text-sm font-bold font-mono" style={{ color: colors.negative }}>
              {data.worst_day ? `${data.worst_day.gap_percent.toFixed(1)}%` : "N/A"}
            </div>
            <div className="text-[10px]" style={{ color: colors.textSecondary }}>
              {data.worst_day?.date ?? ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
