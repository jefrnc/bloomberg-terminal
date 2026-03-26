"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAtom } from "jotai";
import { RefreshCw } from "lucide-react";
import { scannerModeAtom, selectedTickerAtom, smallCapViewAtom } from "../atoms/smallcaps";
import { BloombergButton } from "../core/bloomberg-button";
import { useScannerData } from "../hooks/useScannerData";
import { bloombergColors } from "../lib/theme-config";

type Props = {
  isDarkMode: boolean;
};

function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(0);
}

export function StrategySignalsView({ isDarkMode }: Props) {
  const colors = isDarkMode ? bloombergColors.dark : bloombergColors.light;
  const [, setScannerMode] = useAtom(scannerModeAtom);
  const [, setSelectedTicker] = useAtom(selectedTickerAtom);
  const [, setView] = useAtom(smallCapViewAtom);

  // Force breakout mode for signals
  const { data, isLoading, refetch } = useScannerData();

  const handleTickerClick = (ticker: string) => {
    setSelectedTicker(ticker);
    setView("dilution");
  };

  return (
    <div>
      <div
        className="flex items-center gap-2 px-2 py-1"
        style={{ backgroundColor: colors.surface }}
      >
        <span className="text-sm font-bold" style={{ color: colors.accent }}>
          STRATEGY SIGNALS
        </span>
        <span className="text-[10px]" style={{ color: colors.textSecondary }}>
          {data.length} signals
        </span>
        <div className="ml-auto">
          <BloombergButton color="accent" onClick={() => refetch()} disabled={isLoading}>
            {isLoading ? <RefreshCw className="h-3 w-3 animate-spin" /> : "REFR"}
          </BloombergButton>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table className="w-full border-separate border-spacing-0">
          <TableHeader>
            <TableRow style={{ backgroundColor: colors.surface }}>
              <TableHead className="px-2 py-1 text-left text-xs font-bold">TICKER</TableHead>
              <TableHead className="px-2 py-1 text-right text-xs font-bold">PRICE</TableHead>
              <TableHead className="px-2 py-1 text-right text-xs font-bold">GAP%</TableHead>
              <TableHead className="px-2 py-1 text-right text-xs font-bold hidden sm:table-cell">
                VOL
              </TableHead>
              <TableHead className="px-2 py-1 text-right text-xs font-bold hidden sm:table-cell">
                FLOAT
              </TableHead>
              <TableHead
                className="px-2 py-1 text-center text-xs font-bold"
                style={{ color: "#ff6b6b" }}
              >
                DIL.RISK
              </TableHead>
              <TableHead className="px-2 py-1 text-left text-xs font-bold">SIGNAL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-sm"
                  style={{ color: colors.textSecondary }}
                >
                  No breakout signals detected
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => {
                const highDilution = item.dilution_risk_score >= 70;
                const gapColor = item.gap_percent > 0 ? colors.positive : colors.negative;

                return (
                  <TableRow
                    key={item.ticker}
                    className={`border-b border-[${colors.border}] cursor-pointer hover:bg-white/5`}
                    onClick={() => handleTickerClick(item.ticker)}
                  >
                    <TableCell
                      className="px-2 py-1 text-xs font-bold"
                      style={{ color: colors.accent }}
                    >
                      {item.ticker}
                    </TableCell>
                    <TableCell
                      className="px-2 py-1 text-xs text-right font-mono"
                      style={{ color: isDarkMode ? "#f5f5b8" : "#8b7500" }}
                    >
                      ${item.price.toFixed(2)}
                    </TableCell>
                    <TableCell
                      className="px-2 py-1 text-xs text-right font-bold"
                      style={{ color: gapColor }}
                    >
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
                    <TableCell className="px-2 py-1 text-center">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          item.dilution_risk_score >= 70
                            ? "bg-red-600 text-white animate-pulse"
                            : item.dilution_risk_score >= 50
                              ? "bg-red-500 text-white"
                              : item.dilution_risk_score >= 30
                                ? "bg-yellow-500 text-black"
                                : "bg-green-600 text-white"
                        }`}
                      >
                        {item.dilution_risk_level} {item.dilution_risk_score}
                      </span>
                    </TableCell>
                    <TableCell className="px-2 py-1 text-xs">
                      {highDilution ? (
                        <span className="text-red-400 font-bold">
                          CAUTION: High dilution risk may fade breakout
                        </span>
                      ) : (
                        <span style={{ color: colors.positive }}>BREAKOUT SIGNAL</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
