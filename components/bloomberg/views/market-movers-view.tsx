"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAtom } from "jotai";
import { ArrowDown, ArrowLeft, ArrowUp, Filter, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import {
  scannerModeAtom,
  selectedTickerAtom,
  showDilutionColumnAtom,
  smallCapViewAtom,
} from "../atoms/smallcaps";
import { BloombergButton } from "../core/bloomberg-button";
import { useScannerData } from "../hooks/useScannerData";
import { bloombergColors } from "../lib/theme-config";
import type { ScannerMode, ScannerResult } from "../types/smallcaps";

interface MarketMoversViewProps {
  isDarkMode: boolean;
  onBack: () => void;
  marketData: unknown;
  onRefresh: () => void;
  isLoading: boolean;
}

const MODES: { value: ScannerMode; label: string }[] = [
  { value: "gap", label: "GAP" },
  { value: "momentum", label: "MOMENTUM" },
  { value: "breakout", label: "BREAKOUT" },
];

function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(0);
}

export default function MarketMoversView({ isDarkMode, onBack }: MarketMoversViewProps) {
  const [filterType, setFilterType] = useState<"all" | "gainers" | "losers">("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [scannerMode, setScannerMode] = useAtom(scannerModeAtom);
  const [showDilution] = useAtom(showDilutionColumnAtom);
  const [, setSelectedTicker] = useAtom(selectedTickerAtom);
  const [, setView] = useAtom(smallCapViewAtom);

  const { data, isLoading: scannerLoading, refetch } = useScannerData();
  const colors = isDarkMode ? bloombergColors.dark : bloombergColors.light;

  // Filter and sort scanner data by gap_percent
  const sorted = [...data]
    .filter((item) => {
      if (filterType === "gainers" && item.gap_percent <= 0) return false;
      if (filterType === "losers" && item.gap_percent >= 0) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "desc") return Math.abs(b.gap_percent) - Math.abs(a.gap_percent);
      return Math.abs(a.gap_percent) - Math.abs(b.gap_percent);
    });

  const handleTickerClick = (ticker: string) => {
    setSelectedTicker(ticker);
    setView("dilution");
  };

  const getMovementClass = (pct: number) => {
    const abs = Math.abs(pct);
    if (abs >= 20) return "font-bold text-lg";
    if (abs >= 10) return "font-bold";
    if (abs >= 5) return "font-semibold";
    return "";
  };

  return (
    <div>
      {/* Header */}
      <div className={`flex items-center gap-2 bg-[${colors.surface}] px-2 py-1`}>
        <BloombergButton color="default" onClick={onBack}>
          <ArrowLeft className="h-3 w-3 mr-1" />
          BACK
        </BloombergButton>
        <span className="text-sm font-bold" style={{ color: colors.accent }}>
          GAP MOVERS
        </span>

        {/* Scanner mode selector */}
        <div className="flex gap-1 ml-2">
          {MODES.map((mode) => (
            <BloombergButton
              key={mode.value}
              color={scannerMode === mode.value ? "accent" : "default"}
              onClick={() => setScannerMode(mode.value)}
            >
              {mode.label}
            </BloombergButton>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <BloombergButton
            color={filterType === "all" ? "accent" : "default"}
            onClick={() => setFilterType("all")}
          >
            ALL
          </BloombergButton>
          <BloombergButton
            color={filterType === "gainers" ? "green" : "default"}
            onClick={() => setFilterType("gainers")}
          >
            GAINERS
          </BloombergButton>
          <BloombergButton
            color={filterType === "losers" ? "red" : "default"}
            onClick={() => setFilterType("losers")}
          >
            LOSERS
          </BloombergButton>
          <BloombergButton
            color="default"
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
          >
            {sortOrder === "desc" ? (
              <ArrowDown className="h-3 w-3 mr-1" />
            ) : (
              <ArrowUp className="h-3 w-3 mr-1" />
            )}
            SORT
          </BloombergButton>
          <BloombergButton color="accent" onClick={() => refetch()} disabled={scannerLoading}>
            {scannerLoading ? <RefreshCw className="h-3 w-3 animate-spin" /> : "REFR"}
          </BloombergButton>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table className="w-full border-separate border-spacing-0">
          <TableHeader>
            <TableRow style={{ backgroundColor: colors.surface }}>
              <TableHead className="px-2 py-1 text-left font-bold text-xs">Ticker</TableHead>
              <TableHead className="px-2 py-1 text-right font-bold text-xs">Price</TableHead>
              <TableHead className="px-2 py-1 text-right font-bold text-xs">Gap%</TableHead>
              <TableHead className="px-2 py-1 text-right font-bold text-xs hidden sm:table-cell">
                Vol(PM)
              </TableHead>
              <TableHead className="px-2 py-1 text-right font-bold text-xs hidden sm:table-cell">
                Float
              </TableHead>
              <TableHead className="px-2 py-1 text-right font-bold text-xs hidden md:table-cell">
                MCap
              </TableHead>
              {showDilution && (
                <TableHead
                  className="px-2 py-1 text-center font-bold text-xs"
                  style={{ color: "#ff6b6b" }}
                >
                  DIL.RISK
                </TableHead>
              )}
              <TableHead className="px-2 py-1 text-right font-bold text-xs hidden sm:table-cell">
                Time
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={showDilution ? 8 : 7}
                  className="text-center py-4 text-sm"
                  style={{ color: colors.textSecondary }}
                >
                  No movers match the current filter criteria
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((item, index) => {
                const gapColor = item.gap_percent > 0 ? colors.positive : colors.negative;
                return (
                  <TableRow
                    key={`${item.ticker}-${index}`}
                    className={`border-b border-[${colors.border}] cursor-pointer hover:bg-white/5 ${
                      item.gap_percent > 0
                        ? "bg-green-900/10"
                        : item.gap_percent < 0
                          ? "bg-red-900/10"
                          : ""
                    }`}
                    onClick={() => handleTickerClick(item.ticker)}
                  >
                    <TableCell
                      className="px-2 py-1 text-xs font-bold"
                      style={{ color: colors.accent }}
                    >
                      {item.ticker}
                    </TableCell>
                    <TableCell
                      className="px-2 py-1 text-right text-xs"
                      style={{ color: isDarkMode ? "#f5f5b8" : "#8b7500" }}
                    >
                      ${item.price.toFixed(2)}
                    </TableCell>
                    <TableCell
                      className={`px-2 py-1 text-right text-xs ${getMovementClass(item.gap_percent)}`}
                      style={{ color: gapColor }}
                    >
                      {item.gap_percent > 0 ? "+" : ""}
                      {item.gap_percent.toFixed(1)}%
                    </TableCell>
                    <TableCell
                      className="px-2 py-1 text-right text-xs hidden sm:table-cell"
                      style={{ color: colors.text }}
                    >
                      {formatNumber(item.volume_premarket)}
                    </TableCell>
                    <TableCell
                      className="px-2 py-1 text-right text-xs hidden sm:table-cell"
                      style={{ color: colors.text }}
                    >
                      {formatNumber(item.float_shares)}
                    </TableCell>
                    <TableCell
                      className="px-2 py-1 text-right text-xs hidden md:table-cell"
                      style={{ color: colors.text }}
                    >
                      {formatNumber(item.market_cap)}
                    </TableCell>
                    {showDilution && (
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
                    )}
                    <TableCell
                      className="px-2 py-1 text-right text-xs hidden sm:table-cell"
                      style={{ color: colors.textSecondary }}
                    >
                      {item.time || "—"}
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
