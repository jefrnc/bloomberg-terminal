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
import { showDilutionColumnAtom, showShortColumnAtom } from "../atoms/smallcaps";
import { bloombergColors } from "../lib/theme-config";
import type { ScannerResult } from "../types/smallcaps";
import { ScannerRow } from "./scanner-row";

type ScannerTableProps = {
  data: ScannerResult[];
  isDarkMode: boolean;
};

export function ScannerTable({ data, isDarkMode }: ScannerTableProps) {
  const colors = isDarkMode ? bloombergColors.dark : bloombergColors.light;
  const [showDilution] = useAtom(showDilutionColumnAtom);
  const [showShort] = useAtom(showShortColumnAtom);

  return (
    <div className="overflow-x-auto">
      <Table className="w-full border-separate border-spacing-0">
        <TableHeader>
          <TableRow style={{ backgroundColor: colors.surface }}>
            <TableHead className="px-2 py-1 text-center font-bold text-xs">#</TableHead>
            <TableHead
              className="px-2 py-1 text-left font-bold text-xs sticky left-0"
              style={{ backgroundColor: colors.surface }}
            >
              TICKER
            </TableHead>
            <TableHead className="px-2 py-1 text-right font-bold text-xs">PRICE</TableHead>
            <TableHead className="px-2 py-1 text-right font-bold text-xs">GAP%</TableHead>
            <TableHead className="px-2 py-1 text-right font-bold text-xs hidden sm:table-cell">
              VOL(PM)
            </TableHead>
            <TableHead className="px-2 py-1 text-right font-bold text-xs hidden sm:table-cell">
              FLOAT
            </TableHead>
            <TableHead className="px-2 py-1 text-right font-bold text-xs hidden md:table-cell">
              MCAP
            </TableHead>
            {showShort && (
              <TableHead className="px-2 py-1 text-right font-bold text-xs hidden md:table-cell">
                SHORT%
              </TableHead>
            )}
            {showDilution && (
              <TableHead
                className="px-2 py-1 text-center font-bold text-xs"
                style={{ color: "#ff6b6b" }}
              >
                DIL.RISK
              </TableHead>
            )}
            <TableHead className="px-2 py-1 text-right font-bold text-xs hidden sm:table-cell">
              TIME
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={showDilution && showShort ? 10 : showDilution || showShort ? 9 : 8}
                className="text-center py-8 text-sm"
                style={{ color: colors.textSecondary }}
              >
                No scanner results match current filters
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, i) => (
              <ScannerRow key={item.ticker} item={item} index={i} isDarkMode={isDarkMode} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
