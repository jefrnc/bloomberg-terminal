"use client";

import { useAtom } from "jotai";
import { RefreshCw } from "lucide-react";
import { scannerModeAtom } from "../atoms/smallcaps";
import { BloombergButton } from "../core/bloomberg-button";
import { useScannerData } from "../hooks/useScannerData";
import { bloombergColors } from "../lib/theme-config";
import type { ScannerMode } from "../types/smallcaps";
import { ScannerTable } from "../ui/scanner-table";

type Props = {
  isDarkMode: boolean;
};

const MODES: { value: ScannerMode; label: string }[] = [
  { value: "gap", label: "GAP" },
  { value: "momentum", label: "MOMENTUM" },
  { value: "breakout", label: "BREAKOUT" },
];

export function ScannerView({ isDarkMode }: Props) {
  const colors = isDarkMode ? bloombergColors.dark : bloombergColors.light;
  const [scannerMode, setScannerMode] = useAtom(scannerModeAtom);
  const { data, isLoading, refetch } = useScannerData();

  return (
    <div>
      {/* Scanner mode header */}
      <div
        className="flex items-center gap-2 px-2 py-1"
        style={{ backgroundColor: colors.surface }}
      >
        <span className="text-xs font-bold" style={{ color: colors.accent }}>
          SCANNER
        </span>
        <div className="flex gap-1">
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
          <span className="text-[10px]" style={{ color: colors.textSecondary }}>
            {data.length} results
          </span>
          <BloombergButton color="accent" onClick={() => refetch()} disabled={isLoading}>
            {isLoading ? <RefreshCw className="h-3 w-3 animate-spin" /> : "REFR"}
          </BloombergButton>
        </div>
      </div>

      <ScannerTable data={data} isDarkMode={isDarkMode} />
    </div>
  );
}
