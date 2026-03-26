"use client";

import { useQueries } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { fetchDilutionRisk, fetchDueDiligence } from "../api/smallcaps-api";
import { selectedTickerAtom } from "../atoms/smallcaps";

export function useDilutionData() {
  const [selectedTicker] = useAtom(selectedTickerAtom);

  const results = useQueries({
    queries: [
      {
        queryKey: ["dueDiligence", selectedTicker],
        queryFn: () => fetchDueDiligence(selectedTicker as string),
        enabled: !!selectedTicker,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ["dilutionRisk", selectedTicker],
        queryFn: () => fetchDilutionRisk(selectedTicker as string),
        enabled: !!selectedTicker,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
      },
    ],
  });

  const [ddQuery, riskQuery] = results;

  return {
    dueDiligence: ddQuery.data ?? null,
    dilutionRisk: riskQuery.data ?? null,
    isLoading: ddQuery.isLoading || riskQuery.isLoading,
    error: ddQuery.error || riskQuery.error,
    selectedTicker,
  };
}
