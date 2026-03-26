"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { useAtom } from "jotai";
import {
  selectedTickerAtom,
  showDilutionColumnAtom,
  showShortColumnAtom,
  smallCapViewAtom,
} from "../atoms/smallcaps";
import { bloombergColors } from "../lib/theme-config";
import type { ScannerResult } from "../types/smallcaps";

function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(0);
}

function getDilutionRiskStyle(score: number, level: string) {
  if (score >= 70) return { bg: "bg-red-600", text: "text-white", pulse: true };
  if (score >= 50) return { bg: "bg-red-500", text: "text-white", pulse: false };
  if (score >= 30) return { bg: "bg-yellow-500", text: "text-black", pulse: false };
  return { bg: "bg-green-600", text: "text-white", pulse: false };
}

type ScannerRowProps = {
  item: ScannerResult;
  index: number;
  isDarkMode: boolean;
};

export function ScannerRow({ item, index, isDarkMode }: ScannerRowProps) {
  const colors = isDarkMode ? bloombergColors.dark : bloombergColors.light;
  const [, setSelectedTicker] = useAtom(selectedTickerAtom);
  const [, setView] = useAtom(smallCapViewAtom);
  const [showDilution] = useAtom(showDilutionColumnAtom);
  const [showShort] = useAtom(showShortColumnAtom);

  const handleClick = () => {
    setSelectedTicker(item.ticker);
    setView("dilution");
  };

  const riskStyle = getDilutionRiskStyle(item.dilution_risk_score, item.dilution_risk_level);
  const gapColor = item.gap_percent > 0 ? colors.positive : colors.negative;

  return (
    <TableRow
      className={`border-b border-[${colors.border}] cursor-pointer hover:bg-white/5`}
      onClick={handleClick}
    >
      <TableCell className="px-2 py-1 text-xs text-center" style={{ color: colors.textSecondary }}>
        {index + 1}
      </TableCell>
      <TableCell
        className="px-2 py-1 text-xs font-bold sticky left-0"
        style={{ color: colors.accent, backgroundColor: colors.background }}
      >
        {item.ticker}
        {item.has_active_dilution && <span className="ml-1 text-red-400 text-[10px]">!</span>}
      </TableCell>
      <TableCell
        className="px-2 py-1 text-xs text-right"
        style={{ color: isDarkMode ? "#f5f5b8" : "#8b7500" }}
      >
        ${item.price.toFixed(2)}
      </TableCell>
      <TableCell className="px-2 py-1 text-xs text-right font-bold" style={{ color: gapColor }}>
        {item.gap_percent > 0 ? "+" : ""}
        {item.gap_percent.toFixed(1)}%
      </TableCell>
      <TableCell
        className="px-2 py-1 text-xs text-right hidden sm:table-cell"
        style={{ color: colors.text }}
      >
        {formatNumber(item.volume_premarket)}
      </TableCell>
      <TableCell
        className="px-2 py-1 text-xs text-right hidden sm:table-cell"
        style={{ color: colors.text }}
      >
        {formatNumber(item.float_shares)}
      </TableCell>
      <TableCell
        className="px-2 py-1 text-xs text-right hidden md:table-cell"
        style={{ color: colors.text }}
      >
        {formatNumber(item.market_cap)}
      </TableCell>
      {showShort && (
        <TableCell
          className="px-2 py-1 text-xs text-right hidden md:table-cell"
          style={{ color: colors.text }}
        >
          {item.short_interest.toFixed(1)}%
        </TableCell>
      )}
      {showDilution && (
        <TableCell className="px-2 py-1 text-xs text-center">
          <span
            className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${riskStyle.bg} ${riskStyle.text} ${riskStyle.pulse ? "animate-pulse" : ""}`}
          >
            {item.dilution_risk_level} {item.dilution_risk_score}
          </span>
        </TableCell>
      )}
      <TableCell
        className="px-2 py-1 text-xs text-right hidden sm:table-cell"
        style={{ color: colors.textSecondary }}
      >
        {item.time || "—"}
      </TableCell>
    </TableRow>
  );
}
