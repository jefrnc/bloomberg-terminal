import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Helper function to conditionally join class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Bloomberg terminal color scheme
export const bloombergColors = {
  dark: {
    background: "#121212",
    surface: "#1e1e1e",
    header: "#000000",
    text: "#ffffff",
    textSecondary: "#888888",
    accent: "#ff9900",
    border: "#333333",
    positive: "#4CAF50",
    negative: "#F44336",
    sparklineGray: "#666666",
  },
  light: {
    background: "#f0f0f0",
    surface: "#e0e0e0",
    header: "#d0d0d0",
    text: "#000000",
    textSecondary: "#555555",
    accent: "#ff9900",
    border: "#cccccc",
    positive: "#4CAF50",
    negative: "#F44336",
    sparklineGray: "#888888",
  },
};

// Dilution-specific color palette
export const dilutionColors = {
  extreme: "#dc2626", // red-600
  high: "#ef4444", // red-500
  moderate: "#eab308", // yellow-500
  low: "#16a34a", // green-600
  shelf: "#f97316", // orange (S-3 shelf filings)
  prospectus: "#ef4444", // red (424B prospectus)
  event8k: "#3b82f6", // blue (8-K events)
  insider: "#22c55e", // green (Form 4 insider)
};
