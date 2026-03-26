"use client";

import { useAtom } from "jotai";
import { ArrowLeft } from "lucide-react";
import { selectedTickerAtom, smallCapViewAtom } from "../atoms/smallcaps";
import { BloombergButton } from "../core/bloomberg-button";
import { useDilutionData } from "../hooks/useDilutionData";
import { bloombergColors } from "../lib/theme-config";
import { AtmProgramsTable } from "../ui/atm-programs-table";
import { DilutionFlagsPanel } from "../ui/dilution-flags-panel";
import { DilutionQuickStats } from "../ui/dilution-quick-stats";
import { DilutionScoreBreakdown } from "../ui/dilution-score-breakdown";
import { SecFilingsTimeline } from "../ui/sec-filings-timeline";
import { WarrantAnalysisTable } from "../ui/warrant-analysis-table";

type Props = {
  isDarkMode: boolean;
};

export function DilutionView({ isDarkMode }: Props) {
  const colors = isDarkMode ? bloombergColors.dark : bloombergColors.light;
  const [selectedTicker] = useAtom(selectedTickerAtom);
  const [, setView] = useAtom(smallCapViewAtom);
  const { dueDiligence, isLoading, error } = useDilutionData();

  const handleBack = () => {
    setView("scanner");
  };

  if (!selectedTicker) {
    return (
      <div className="p-4 text-center" style={{ color: colors.textSecondary }}>
        <p className="text-sm">Select a ticker from the scanner to view dilution intelligence.</p>
        <BloombergButton color="accent" onClick={handleBack} className="mt-2">
          BACK TO SCANNER
        </BloombergButton>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 text-center" style={{ color: colors.textSecondary }}>
        <div className="animate-pulse text-sm">Loading dilution data for {selectedTicker}...</div>
      </div>
    );
  }

  if (error || !dueDiligence) {
    return (
      <div className="p-4 text-center" style={{ color: colors.negative }}>
        <p className="text-sm">Failed to load dilution data for {selectedTicker}</p>
        <BloombergButton color="accent" onClick={handleBack} className="mt-2">
          BACK TO SCANNER
        </BloombergButton>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div
        className="flex items-center gap-2 px-2 py-1"
        style={{ backgroundColor: colors.surface }}
      >
        <BloombergButton color="default" onClick={handleBack}>
          <ArrowLeft className="h-3 w-3 mr-1" />
          BACK
        </BloombergButton>
        <span className="text-sm font-bold" style={{ color: colors.accent }}>
          DILUTION INTELLIGENCE
        </span>
        <span className="text-sm font-bold" style={{ color: colors.text }}>
          {dueDiligence.ticker}
        </span>
        <span className="text-xs" style={{ color: colors.textSecondary }}>
          {dueDiligence.company_name} — ${dueDiligence.price.toFixed(2)}
        </span>
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 p-2">
        {/* Left Panel (60%) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="p-2 rounded" style={{ backgroundColor: colors.surface }}>
            <DilutionScoreBreakdown
              breakdown={dueDiligence.dilution_risk_breakdown}
              totalScore={dueDiligence.dilution_risk_score}
              isDarkMode={isDarkMode}
            />
          </div>

          <div className="p-2 rounded" style={{ backgroundColor: colors.surface }}>
            <SecFilingsTimeline data={dueDiligence} isDarkMode={isDarkMode} />
          </div>

          <div className="p-2 rounded" style={{ backgroundColor: colors.surface }}>
            <AtmProgramsTable programs={dueDiligence.atm_programs} isDarkMode={isDarkMode} />
          </div>

          <div className="p-2 rounded" style={{ backgroundColor: colors.surface }}>
            <WarrantAnalysisTable
              warrants={dueDiligence.warrant_details}
              currentPrice={dueDiligence.price}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        {/* Right Panel (40%) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="p-2 rounded" style={{ backgroundColor: colors.surface }}>
            <DilutionFlagsPanel data={dueDiligence} isDarkMode={isDarkMode} />
          </div>

          <div className="p-2 rounded" style={{ backgroundColor: colors.surface }}>
            <DilutionQuickStats data={dueDiligence} isDarkMode={isDarkMode} />
          </div>
        </div>
      </div>
    </div>
  );
}
