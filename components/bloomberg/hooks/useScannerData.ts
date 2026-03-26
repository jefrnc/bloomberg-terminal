"use client";

import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { fetchScannerData } from "../api/smallcaps-api";
import { isRealTimeEnabledAtom } from "../atoms";
import {
  dilutionRiskFilterAtom,
  floatRangeAtom,
  marketCapRangeAtom,
  minGapPercentAtom,
  minVolumeAtom,
  scannerModeAtom,
  showSSROnlyAtom,
} from "../atoms/smallcaps";
import type { ScannerMode, ScannerResult } from "../types/smallcaps";

const FLOAT_RANGES: Record<string, [number, number]> = {
  "<1M": [0, 1_000_000],
  "1-5M": [1_000_000, 5_000_000],
  "5-10M": [5_000_000, 10_000_000],
  "10-20M": [10_000_000, 20_000_000],
  ">20M": [20_000_000, Number.POSITIVE_INFINITY],
};

const MCAP_RANGES: Record<string, [number, number]> = {
  "<50M": [0, 50_000_000],
  "50-100M": [50_000_000, 100_000_000],
  "100-300M": [100_000_000, 300_000_000],
  "300M-1B": [300_000_000, 1_000_000_000],
};

function filterResults(
  results: ScannerResult[],
  floatRange: string,
  marketCapRange: string,
  dilutionRiskFilter: string,
  minGapPercent: number,
  minVolume: number,
  showSSROnly: boolean
): ScannerResult[] {
  return results.filter((r) => {
    if (floatRange !== "ALL") {
      const range = FLOAT_RANGES[floatRange];
      if (range && (r.float_shares < range[0] || r.float_shares >= range[1])) return false;
    }
    if (marketCapRange !== "ALL") {
      const range = MCAP_RANGES[marketCapRange];
      if (range && (r.market_cap < range[0] || r.market_cap >= range[1])) return false;
    }
    if (dilutionRiskFilter !== "ALL" && r.dilution_risk_level !== dilutionRiskFilter) return false;
    if (Math.abs(r.gap_percent) < minGapPercent) return false;
    if (r.volume_premarket < minVolume) return false;
    if (showSSROnly && r.short_interest <= 0) return false;
    return true;
  });
}

export function useScannerData() {
  const [scannerMode] = useAtom(scannerModeAtom);
  const [isRealTime] = useAtom(isRealTimeEnabledAtom);
  const [floatRange] = useAtom(floatRangeAtom);
  const [marketCapRange] = useAtom(marketCapRangeAtom);
  const [dilutionRiskFilter] = useAtom(dilutionRiskFilterAtom);
  const [minGapPercent] = useAtom(minGapPercentAtom);
  const [minVolume] = useAtom(minVolumeAtom);
  const [showSSROnly] = useAtom(showSSROnlyAtom);

  const query = useQuery({
    queryKey: ["scanner", scannerMode],
    queryFn: () => fetchScannerData(scannerMode),
    refetchInterval: isRealTime ? 10_000 : 60_000,
    staleTime: 5_000,
    refetchOnWindowFocus: false,
  });

  const filteredData = query.data
    ? filterResults(
        query.data,
        floatRange,
        marketCapRange,
        dilutionRiskFilter,
        minGapPercent,
        minVolume,
        showSSROnly
      )
    : [];

  return {
    data: filteredData,
    rawData: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    scannerMode,
  };
}
