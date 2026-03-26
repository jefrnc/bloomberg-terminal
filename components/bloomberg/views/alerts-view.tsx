"use client";

import { useAlerts } from "../hooks/useAlerts";
import { bloombergColors } from "../lib/theme-config";
import type { AlertType } from "../types/smallcaps";

type Props = {
  isDarkMode: boolean;
};

const ALERT_COLORS: Record<AlertType, string> = {
  NHOD: "#22c55e",
  NLOD: "#ef4444",
  HALT: "#eab308",
  NEWS: "#3b82f6",
};

export function AlertsView({ isDarkMode }: Props) {
  const colors = isDarkMode ? bloombergColors.dark : bloombergColors.light;
  const { alerts } = useAlerts();

  return (
    <div>
      <div
        className="flex items-center gap-2 px-2 py-1"
        style={{ backgroundColor: colors.surface }}
      >
        <span className="text-sm font-bold" style={{ color: colors.accent }}>
          REAL-TIME ALERTS
        </span>
        <span className="text-[10px]" style={{ color: colors.textSecondary }}>
          {alerts.length} alerts
        </span>
        {/* Legend */}
        <div className="ml-auto flex gap-2 text-[10px]">
          {(Object.entries(ALERT_COLORS) as [AlertType, string][]).map(([type, color]) => (
            <span key={type} style={{ color }}>
              {type}
            </span>
          ))}
        </div>
      </div>

      <div className="p-2 font-mono text-xs space-y-0.5 max-h-[calc(100vh-120px)] overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="text-center py-8" style={{ color: colors.textSecondary }}>
            Waiting for alerts...
            <br />
            <span className="text-[10px]">Connect to codesmall gateway for real-time feed</span>
          </div>
        ) : (
          alerts.map((alert, i) => {
            const ts = new Date(alert.timestamp);
            const timeStr = ts.toLocaleTimeString("en-US", { hour12: false });
            const alertColor = ALERT_COLORS[alert.type] || colors.text;

            return (
              <div key={`${alert.timestamp}-${alert.ticker}-${i}`} className="flex gap-2">
                <span style={{ color: colors.textSecondary }}>[{timeStr}]</span>
                <span className="font-bold" style={{ color: alertColor }}>
                  {alert.type}
                </span>
                <span style={{ color: colors.accent }}>{alert.ticker}</span>
                <span style={{ color: isDarkMode ? "#f5f5b8" : "#8b7500" }}>
                  ${alert.price.toFixed(2)}
                </span>
                <span style={{ color: colors.text }}>{alert.message}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
