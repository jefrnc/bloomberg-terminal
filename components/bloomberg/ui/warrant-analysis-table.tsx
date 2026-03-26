"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { bloombergColors } from "../lib/theme-config";
import type { WarrantFiling } from "../types/smallcaps";

type Props = {
  warrants: WarrantFiling[];
  currentPrice: number;
  isDarkMode: boolean;
};

export function WarrantAnalysisTable({ warrants, currentPrice, isDarkMode }: Props) {
  const colors = isDarkMode ? bloombergColors.dark : bloombergColors.light;

  return (
    <div className="space-y-2">
      <span className="text-xs font-bold" style={{ color: colors.accent }}>
        WARRANT ANALYSIS
      </span>
      {warrants.length === 0 ? (
        <div className="text-xs py-2 text-center" style={{ color: colors.textSecondary }}>
          No outstanding warrants
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table className="w-full border-separate border-spacing-0">
            <TableHeader>
              <TableRow style={{ backgroundColor: colors.surface }}>
                <TableHead className="px-2 py-1 text-left text-[10px] font-bold">Type</TableHead>
                <TableHead className="px-2 py-1 text-right text-[10px] font-bold">
                  Exercise $
                </TableHead>
                <TableHead className="px-2 py-1 text-right text-[10px] font-bold">
                  Expiration
                </TableHead>
                <TableHead className="px-2 py-1 text-right text-[10px] font-bold">Issued</TableHead>
                <TableHead className="px-2 py-1 text-center text-[10px] font-bold">
                  Protection
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {warrants.map((w, i) => {
                const nearPrice = Math.abs(w.exercise_price - currentPrice) / currentPrice < 0.15;
                return (
                  <TableRow
                    key={`${w.type}-${i}`}
                    className={`border-b border-[${colors.border}]`}
                    style={nearPrice ? { backgroundColor: "rgba(239, 68, 68, 0.15)" } : undefined}
                  >
                    <TableCell className="px-2 py-1 text-[11px]" style={{ color: colors.text }}>
                      {w.type}
                    </TableCell>
                    <TableCell
                      className="px-2 py-1 text-[11px] text-right font-mono"
                      style={{ color: nearPrice ? "#ef4444" : colors.text }}
                    >
                      ${w.exercise_price.toFixed(2)}
                      {nearPrice && <span className="ml-1 text-[9px]">NEAR</span>}
                    </TableCell>
                    <TableCell
                      className="px-2 py-1 text-[11px] text-right"
                      style={{ color: colors.textSecondary }}
                    >
                      {w.expiration}
                    </TableCell>
                    <TableCell
                      className="px-2 py-1 text-[11px] text-right"
                      style={{ color: colors.text }}
                    >
                      {w.total_issued.toLocaleString()}
                    </TableCell>
                    <TableCell className="px-2 py-1 text-center">
                      <span
                        className={`text-[10px] px-1 rounded ${w.price_protection ? "bg-red-600 text-white" : "bg-green-700 text-white"}`}
                      >
                        {w.price_protection ? "YES" : "NO"}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
