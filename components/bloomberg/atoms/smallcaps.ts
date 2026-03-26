import { atom } from "jotai";
import type {
  DilutionRiskLevel,
  RealtimeAlert,
  ScannerMode,
  SmallCapView,
} from "../types/smallcaps";

// View state
export const smallCapViewAtom = atom<SmallCapView>("scanner");

// Scanner mode
export const scannerModeAtom = atom<ScannerMode>("gap");

// Selected ticker for dilution deep-dive
export const selectedTickerAtom = atom<string | null>(null);

// Filter atoms
export const floatRangeAtom = atom<string>("ALL");
export const marketCapRangeAtom = atom<string>("ALL");
export const showSSROnlyAtom = atom(false);
export const dilutionRiskFilterAtom = atom<DilutionRiskLevel | "ALL">("ALL");
export const minGapPercentAtom = atom(0);
export const minVolumeAtom = atom(0);
export const showDilutionColumnAtom = atom(true);
export const showShortColumnAtom = atom(true);

// Alerts
export const alertsAtom = atom<RealtimeAlert[]>([]);
export const addAlertAtom = atom(null, (get, set, alert: RealtimeAlert) => {
  const current = get(alertsAtom);
  set(alertsAtom, [alert, ...current].slice(0, 500)); // keep max 500
});
