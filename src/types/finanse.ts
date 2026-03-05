/// <reference types="@cloudflare/workers-types" />
// ================================================================
// MYBONZO FINANSE — Typy TypeScript
// Źródło: step_07 + step_03 + step_12
// ================================================================

// ----------------------------------------------------------------
// TRANSAKCJE
// ----------------------------------------------------------------

export type KierunekTransakcji = 'PRZYCHÓD' | 'KOSZT' | 'PRZENIESIENIE';
export type StatusTransakcji = 'Planowane' | 'Oczekujące' | 'Zaksięgowano' | 'Anulowane';

export interface TransakcjaFinansowa {
  id: string;
  tenant_id: string;
  data: string; // ISO date YYYY-MM-DD
  kwota: number;
  waluta: string;
  kierunek: KierunekTransakcji;
  kategoria: string;
  podkategoria?: string | null;
  kontrahent?: string | null;
  kontrahent_id?: string | null;
  projekt_id?: string | null;
  dokument_id?: string | null;
  status: StatusTransakcji;
  sposob_platnosci?: string | null;
  zrodlo_systemu?: string;
  opis?: string | null;
  meta?: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ----------------------------------------------------------------
// DOKUMENTY FINANSOWE
// ----------------------------------------------------------------

export type TypDokumentu = 'Faktura' | 'Proforma' | 'Umowa' | 'Oferta' | 'Zwrot' | 'Nota' | 'Inny';
export type StatusDokumentu = 'Szkic' | 'Wysłana' | 'Zapłacona' | 'Przeterminowana' | 'Anulowana';
export type PoziomRyzyka = 'Niskie' | 'Średnie' | 'Wysokie';

export interface DokumentFinansowy {
  id: string;
  tenant_id: string;
  numer: string;
  typ: TypDokumentu;
  data_wystawienia: string; // YYYY-MM-DD
  termin_platnosci?: string | null;
  waluta: string;
  kwota_netto?: number | null;
  kwota_brutto?: number | null;
  stawka_vat?: number | null;
  kontrahent: string;
  kontrahent_id?: string | null;
  projekt_id?: string | null;
  status: StatusDokumentu;
  plik_url?: string | null;
  zrodlo?: string;
  // Analiza ryzyka
  ryzyko_punktowe?: number | null;       // 0-100
  poziom_ryzyka?: PoziomRyzyka | null;
  tagi_ryzyka?: string[] | null;
  podsumowanie_ryzyka?: string | null;
  model_ai?: string;
  data_analizy?: string | null;
  uwagi?: string | null;
  created_at: string;
  updated_at: string;
  // Pole pomocnicze z widoku
  dni_przeterminowania?: number;
}

// ----------------------------------------------------------------
// KOSZTY
// ----------------------------------------------------------------

export type KategoriaKosztu = 'Marketing' | 'Logistyka' | 'Pracownicy' | 'Dostawcy' | 'Administracja';
export type StatusKosztu = 'Planowane' | 'Zapłacone' | 'Oczekujące';

export interface Koszt {
  id: string;
  tenant_id: string;
  data: string;
  kwota: number;
  waluta: string;
  typ: 'Stałe' | 'Zmienne';
  kategoria: KategoriaKosztu;
  podkategoria?: string | null;
  kontrahent?: string | null;
  kontrahent_id?: string | null;
  projekt_id?: string | null;
  opis?: string | null;
  zrodlo_systemu?: string;
  status: StatusKosztu;
  stawka_vat?: number | null;
  kwota_netto?: number | null;
  meta?: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ----------------------------------------------------------------
// DASHBOARD FINANSOWY (step_08)
// ----------------------------------------------------------------

export interface FinanceDashboardResponse {
  kpi_cards: {
    total_orders: number;
    total_revenue: number;
    total_costs: number;
    net_profit: number;
    avg_order_value: number;
    gross_margin_pct: number;
  };
  cashflow_chart: {
    data: Array<{
      date: string;
      orders: number;
      revenue: number;
      profit: number;
    }>;
  };
  category_pie: Array<{
    category: string;
    revenue: number;
    pct: string;
    color: string;
  }>;
  recent_transactions: TransakcjaFinansowa[];
  ai_insight: {
    summary: string;
    action_items: string[];
  };
}

// ----------------------------------------------------------------
// RENTOWNOŚĆ (step_10)
// ----------------------------------------------------------------

export interface RentownoscResponse {
  overall: {
    total_revenue: number;
    total_costs: number;
    gross_profit: number;
    gross_margin_pct: number;
  };
  by_category: Array<{
    category: string;
    revenue: number;
    costs: number;
    profit: number;
    margin_pct: number;
    orders_count?: number;
  }>;
  top_margin: {
    category: string;
    margin_pct: number;
    profit: number;
  };
  low_margin_alerts: Array<{
    category: string;
    margin_pct: number;
    revenue: number;
    costs: number;
  }>;
  trending?: {
    improving: string[];
    declining: string[];
  };
}

// ----------------------------------------------------------------
// PODSUMOWANIE AI (step_13)
// ----------------------------------------------------------------

export interface PodsumowanieRequest {
  tenant_id: string;
  zakres: { od: string; do: string };
  pytanie: string;
  kontekst?: Record<string, unknown>;
}

export interface PodsumowanieResponse {
  raport: string;
  zrodlo_modelu: string;
  czas_obliczen: string;
  tokeny: { input: number; output: number };
  zrodla: string[];
  error?: string;
}

// ----------------------------------------------------------------
// Cloudflare runtime ENV — typ bindingy
// ----------------------------------------------------------------

export interface CloudflareEnv {
  D1: D1Database;
  R2_FINANSE: R2Bucket;
  GOOGLE_API_KEY: string;
  OPENAI_API_KEY: string;
  DEEPSEEK_API_KEY?: string;
  TENANT_ID?: string;
}
