// Small Caps Dilution Intelligence Platform Types
// Matches codesmall API responses

export type DilutionRiskLevel = "EXTREME" | "HIGH" | "MODERATE" | "LOW";

export type ScannerSource = "gap" | "momentum" | "breakout";

export type ScannerMode = "gap" | "momentum" | "breakout";

export interface ScannerResult {
  ticker: string;
  price: number;
  gap_percent: number;
  volume_premarket: number;
  float_shares: number;
  market_cap: number;
  short_interest: number;
  dilution_risk_score: number; // 0-100
  dilution_risk_level: DilutionRiskLevel;
  has_active_dilution: boolean;
  scanner_source: ScannerSource;
  time?: string;
}

export interface ATMFiling {
  name: string;
  start_date: string;
  total_capacity: number;
  remaining: number;
  percent_used: number;
  placement_agent: string;
}

export interface WarrantFiling {
  type: string;
  exercise_price: number;
  expiration: string;
  total_issued: number;
  price_protection: boolean;
}

export interface ShelfRegistration {
  filing_date: string;
  effective_date: string;
  capacity: number;
  remaining: number;
  type: string;
}

export interface RecentOffering {
  date: string;
  type: string;
  size: number;
  price: number;
  discount_percent: number;
  placement_agent: string;
}

export interface DilutionRiskBreakdown {
  offering_ability: number; // max 40
  cash_need: number; // max 30
  historical_risk: number; // max 15
  net_cash_share: number; // max 10
  overhead_supply: number; // max 5
  small_float_bonus: number; // max 10
}

export interface DueDiligenceData {
  ticker: string;
  company_name: string;
  price: number;
  market_cap: number;
  float_shares: number;
  shares_outstanding: number;
  short_interest: number;
  short_volume_ratio: number;
  days_to_cover: number;

  // Dilution risk
  dilution_risk_score: number;
  dilution_risk_level: DilutionRiskLevel;
  dilution_risk_breakdown: DilutionRiskBreakdown;

  // SEC filings
  s3_filings: ShelfRegistration[];
  prospectus_424b: Array<{ date: string; type: string; description: string }>;
  filings_8k: Array<{ date: string; description: string }>;
  form_4: Array<{ date: string; insider: string; transaction: string; shares: number }>;

  // DilutionTracker premium fields
  has_atm: boolean;
  has_s3_shelf: boolean;
  shelf_capacity: number;
  warrants_outstanding: number;
  atm_programs: ATMFiling[];
  warrant_details: WarrantFiling[];
  recent_offerings: RecentOffering[];
  offerings_12m: number;
  dilution_12m_pct: number;
  shares_added_30d: number;
  last_banker: string;

  // Flags
  active_dilution: boolean;
  high_dilution_risk: boolean;
  has_offering_capacity: boolean;
  needs_cash: boolean;
  historical_diluter: boolean;
  near_offering_threshold: boolean;
  recent_dilution: boolean;
}

export interface DilutionRiskAssessment {
  ticker: string;
  score: number;
  level: DilutionRiskLevel;
  flags: {
    active_dilution: boolean;
    high_dilution_risk: boolean;
    has_offering_capacity: boolean;
    needs_cash: boolean;
    historical_diluter: boolean;
    near_offering_threshold: boolean;
    recent_dilution: boolean;
  };
  breakdown: DilutionRiskBreakdown;
}

export interface GapHeatmapDay {
  date: string;
  gap_percent: number;
  volume: number;
  close: number;
}

export interface GapHeatmapData {
  ticker: string;
  days: GapHeatmapDay[];
  avg_gap: number;
  win_rate: number;
  best_day: GapHeatmapDay | null;
  worst_day: GapHeatmapDay | null;
}

export type AlertType = "NHOD" | "NLOD" | "HALT" | "NEWS";

export interface RealtimeAlert {
  type: AlertType;
  ticker: string;
  price: number;
  message: string;
  timestamp: string;
}

export type SmallCapView = "scanner" | "dilution" | "heatmap" | "signals" | "movers" | "alerts";

export interface SmallCapFilterState {
  scannerMode: ScannerMode;
  floatRange: string;
  marketCapRange: string;
  showSSROnly: boolean;
  dilutionRiskFilter: DilutionRiskLevel | "ALL";
  minGapPercent: number;
  minVolume: number;
  showDilutionColumn: boolean;
  showShortColumn: boolean;
}
