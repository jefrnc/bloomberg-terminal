"use client";

import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { fetchGapHeatmap } from "../api/smallcaps-api";
import { selectedTickerAtom } from "../atoms/smallcaps";

export function useGapHeatmap() {
  const [selectedTicker] = useAtom(selectedTickerAtom);

  const query = useQuery({
    queryKey: ["gapHeatmap", selectedTicker],
    queryFn: () => fetchGapHeatmap(selectedTicker as string),
    enabled: !!selectedTicker,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    data: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    selectedTicker,
  };
}
