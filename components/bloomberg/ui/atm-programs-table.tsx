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
import type { ATMFiling } from "../types/smallcaps";

type Props = {
  programs: ATMFiling[];
  isDarkMode: boolean;
};

export function AtmProgramsTable({ programs, isDarkMode }: Props) {
  const colors = isDarkMode ? bloombergColors.dark : bloombergColors.light;

  return (
    <div className="space-y-2">
      <span className="text-xs font-bold" style={{ color: colors.accent }}>
        ATM PROGRAMS
      </span>
      {programs.length === 0 ? (
        <div className="text-xs py-2 text-center" style={{ color: colors.textSecondary }}>
          No active ATM programs
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table className="w-full border-separate border-spacing-0">
            <TableHeader>
              <TableRow style={{ backgroundColor: colors.surface }}>
                <TableHead className="px-2 py-1 text-left text-[10px] font-bold">Name</TableHead>
                <TableHead className="px-2 py-1 text-right text-[10px] font-bold">Start</TableHead>
                <TableHead className="px-2 py-1 text-right text-[10px] font-bold">
                  Capacity
                </TableHead>
                <TableHead className="px-2 py-1 text-right text-[10px] font-bold">
                  Remaining
                </TableHead>
                <TableHead className="px-2 py-1 text-center text-[10px] font-bold">%Used</TableHead>
                <TableHead className="px-2 py-1 text-left text-[10px] font-bold">Agent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {programs.map((p, i) => (
                <TableRow key={`${p.name}-${i}`} className={`border-b border-[${colors.border}]`}>
                  <TableCell className="px-2 py-1 text-[11px]" style={{ color: colors.text }}>
                    {p.name}
                  </TableCell>
                  <TableCell
                    className="px-2 py-1 text-[11px] text-right"
                    style={{ color: colors.textSecondary }}
                  >
                    {p.start_date}
                  </TableCell>
                  <TableCell
                    className="px-2 py-1 text-[11px] text-right"
                    style={{ color: colors.text }}
                  >
                    ${(p.total_capacity / 1e6).toFixed(1)}M
                  </TableCell>
                  <TableCell
                    className="px-2 py-1 text-[11px] text-right"
                    style={{ color: colors.text }}
                  >
                    ${(p.remaining / 1e6).toFixed(1)}M
                  </TableCell>
                  <TableCell className="px-2 py-1 text-center">
                    <div className="flex items-center gap-1">
                      <div
                        className="flex-1 h-1.5 rounded overflow-hidden"
                        style={{ backgroundColor: colors.surface }}
                      >
                        <div
                          className="h-full rounded"
                          style={{
                            width: `${p.percent_used}%`,
                            backgroundColor:
                              p.percent_used > 80
                                ? "#ef4444"
                                : p.percent_used > 50
                                  ? "#eab308"
                                  : "#22c55e",
                          }}
                        />
                      </div>
                      <span
                        className="text-[10px] w-8 text-right"
                        style={{ color: colors.textSecondary }}
                      >
                        {p.percent_used}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell
                    className="px-2 py-1 text-[11px]"
                    style={{ color: colors.textSecondary }}
                  >
                    {p.placement_agent}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
