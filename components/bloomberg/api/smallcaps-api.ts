import type {
  DilutionRiskAssessment,
  DueDiligenceData,
  GapHeatmapData,
  RealtimeAlert,
  ScannerMode,
  ScannerResult,
} from "../types/smallcaps";

const getBaseUrl = () => process.env.NEXT_PUBLIC_CODESMALL_API_URL || "http://localhost:8000";

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${getBaseUrl()}${path}`);
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

const SCANNER_ENDPOINTS: Record<ScannerMode, string> = {
  gap: "/scan",
  momentum: "/momentum",
  breakout: "/breakout",
};

export async function fetchScannerData(mode: ScannerMode): Promise<ScannerResult[]> {
  return apiFetch<ScannerResult[]>(SCANNER_ENDPOINTS[mode]);
}

export async function fetchDueDiligence(ticker: string): Promise<DueDiligenceData> {
  return apiFetch<DueDiligenceData>(`/dd/${encodeURIComponent(ticker)}`);
}

export async function fetchDilutionRisk(ticker: string): Promise<DilutionRiskAssessment> {
  return apiFetch<DilutionRiskAssessment>(`/risk/${encodeURIComponent(ticker)}`);
}

export async function fetchGapHeatmap(ticker: string): Promise<GapHeatmapData> {
  return apiFetch<GapHeatmapData>(`/gap-history/${encodeURIComponent(ticker)}/heatmap`);
}

export function connectAlertWebSocket(onAlert: (alert: RealtimeAlert) => void): () => void {
  const baseUrl = getBaseUrl().replace(/^http/, "ws");
  let ws: WebSocket | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let disposed = false;

  function connect() {
    if (disposed) return;
    ws = new WebSocket(`${baseUrl}/ws/alerts`);

    ws.onmessage = (event) => {
      try {
        const alert = JSON.parse(event.data) as RealtimeAlert;
        onAlert(alert);
      } catch {
        // ignore malformed messages
      }
    };

    ws.onclose = () => {
      if (!disposed) {
        reconnectTimer = setTimeout(connect, 5000);
      }
    };

    ws.onerror = () => {
      ws?.close();
    };
  }

  connect();

  return () => {
    disposed = true;
    if (reconnectTimer) clearTimeout(reconnectTimer);
    ws?.close();
  };
}
