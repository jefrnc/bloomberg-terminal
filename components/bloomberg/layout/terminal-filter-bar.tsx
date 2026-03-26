"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAtom } from "jotai";
import { ChevronDown } from "lucide-react";
import {
  dilutionRiskFilterAtom,
  floatRangeAtom,
  marketCapRangeAtom,
  minGapPercentAtom,
  minVolumeAtom,
  scannerModeAtom,
  showDilutionColumnAtom,
  showSSROnlyAtom,
  showShortColumnAtom,
} from "../atoms/smallcaps";
import { BloombergButton } from "../core/bloomberg-button";
import { bloombergColors } from "../lib/theme-config";
import type { DilutionRiskLevel, ScannerMode } from "../types/smallcaps";

type TerminalFilterBarProps = {
  isDarkMode: boolean;
};

const FLOAT_OPTIONS = ["ALL", "<1M", "1-5M", "5-10M", "10-20M", ">20M"];
const MCAP_OPTIONS = ["ALL", "<50M", "50-100M", "100-300M", "300M-1B"];
const RISK_OPTIONS: Array<DilutionRiskLevel | "ALL"> = [
  "ALL",
  "EXTREME",
  "HIGH",
  "MODERATE",
  "LOW",
];
const GAP_OPTIONS = [0, 2, 5, 10, 20];
const VOLUME_OPTIONS = [0, 10000, 50000, 100000, 500000, 1000000];

function formatVolume(v: number): string {
  if (v === 0) return "0";
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(0)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
  return v.toString();
}

export function TerminalFilterBar({ isDarkMode }: TerminalFilterBarProps) {
  const colors = isDarkMode ? bloombergColors.dark : bloombergColors.light;

  const [scannerMode, setScannerMode] = useAtom(scannerModeAtom);
  const [floatRange, setFloatRange] = useAtom(floatRangeAtom);
  const [marketCapRange, setMarketCapRange] = useAtom(marketCapRangeAtom);
  const [showSSROnly, setShowSSROnly] = useAtom(showSSROnlyAtom);
  const [dilutionRiskFilter, setDilutionRiskFilter] = useAtom(dilutionRiskFilterAtom);
  const [minGapPercent, setMinGapPercent] = useAtom(minGapPercentAtom);
  const [minVolume, setMinVolume] = useAtom(minVolumeAtom);
  const [showDilution, setShowDilution] = useAtom(showDilutionColumnAtom);
  const [showShort, setShowShort] = useAtom(showShortColumnAtom);

  return (
    <div
      className={`flex flex-wrap items-center gap-2 bg-[${colors.surface}] px-2 py-1 text-[${colors.accent}] text-xs sm:text-sm`}
    >
      {/* Scanner Mode */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <BloombergButton color="accent" className="flex items-center gap-1">
            <span>{scannerMode.toUpperCase()}</span>
            <ChevronDown className="h-3 w-3" />
          </BloombergButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="font-mono text-xs">
          <DropdownMenuItem onClick={() => setScannerMode("gap")}>GAP</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setScannerMode("momentum")}>MOMENTUM</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setScannerMode("breakout")}>BREAKOUT</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Float Range */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <BloombergButton
            color={floatRange !== "ALL" ? "green" : "default"}
            className="flex items-center gap-1"
          >
            <span>Float: {floatRange}</span>
            <ChevronDown className="h-3 w-3" />
          </BloombergButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="font-mono text-xs">
          {FLOAT_OPTIONS.map((opt) => (
            <DropdownMenuItem key={opt} onClick={() => setFloatRange(opt)}>
              {opt}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* MCap Range */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <BloombergButton
            color={marketCapRange !== "ALL" ? "green" : "default"}
            className="flex items-center gap-1"
          >
            <span>MCap: {marketCapRange}</span>
            <ChevronDown className="h-3 w-3" />
          </BloombergButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="font-mono text-xs">
          {MCAP_OPTIONS.map((opt) => (
            <DropdownMenuItem key={opt} onClick={() => setMarketCapRange(opt)}>
              {opt}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* SSR Checkbox */}
      <div className="flex items-center gap-1">
        <Checkbox
          id="ssr"
          checked={showSSROnly}
          onCheckedChange={(checked) => setShowSSROnly(!!checked)}
          className="h-3 w-3 rounded-none border-gray-500 data-[state=checked]:bg-gray-500"
        />
        <label htmlFor="ssr">SSR</label>
      </div>

      {/* Dilution Risk Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <BloombergButton
            color={dilutionRiskFilter !== "ALL" ? "red" : "default"}
            className="flex items-center gap-1"
          >
            <span>Risk: {dilutionRiskFilter}</span>
            <ChevronDown className="h-3 w-3" />
          </BloombergButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="font-mono text-xs">
          {RISK_OPTIONS.map((opt) => (
            <DropdownMenuItem key={opt} onClick={() => setDilutionRiskFilter(opt)}>
              {opt}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Min Gap% */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <BloombergButton
            color={minGapPercent > 0 ? "green" : "default"}
            className="flex items-center gap-1"
          >
            <span>Gap≥{minGapPercent}%</span>
            <ChevronDown className="h-3 w-3" />
          </BloombergButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="font-mono text-xs">
          {GAP_OPTIONS.map((opt) => (
            <DropdownMenuItem key={opt} onClick={() => setMinGapPercent(opt)}>
              {opt}%
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Min Volume */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <BloombergButton
            color={minVolume > 0 ? "green" : "default"}
            className="flex items-center gap-1"
          >
            <span>Vol≥{formatVolume(minVolume)}</span>
            <ChevronDown className="h-3 w-3" />
          </BloombergButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="font-mono text-xs">
          {VOLUME_OPTIONS.map((opt) => (
            <DropdownMenuItem key={opt} onClick={() => setMinVolume(opt)}>
              {formatVolume(opt)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Column toggles */}
      <div className="flex items-center gap-1">
        <Checkbox
          id="dil-col"
          checked={showDilution}
          onCheckedChange={(checked) => setShowDilution(!!checked)}
          className="h-3 w-3 rounded-none border-gray-500 data-[state=checked]:bg-gray-500"
        />
        <label htmlFor="dil-col">DIL</label>
      </div>
      <div className="flex items-center gap-1">
        <Checkbox
          id="short-col"
          checked={showShort}
          onCheckedChange={(checked) => setShowShort(!!checked)}
          className="h-3 w-3 rounded-none border-gray-500 data-[state=checked]:bg-gray-500"
        />
        <label htmlFor="short-col">SHORT</label>
      </div>
    </div>
  );
}
