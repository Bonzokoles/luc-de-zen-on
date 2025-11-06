/**
 * Data Integration Utilities
 * Pomocnicze funkcje do integracji prawdziwych danych z komponentami
 */

// ========================================
// TYPY DANYCH
// ========================================

export interface CalculationResult {
  type: 'margin' | 'vat' | 'roi' | 'profit';
  timestamp: Date;
  inputs: Record<string, number | string>;
  results: Record<string, number>;
}

export interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}

export interface TableRow {
  [key: string]: string | number | boolean;
}

// ========================================
// KONWERSJA DANYCH DO WYKRESÓW
// ========================================

/**
 * Konwertuje dane z kalkulatora marży na dane dla wykresów
 */
export function marginToChartData(
  cost: number,
  price: number,
  margin: number,
  marginPercent: number
): {
  pieData: ChartDataPoint[];
  barData: ChartDataPoint[];
  comparisonData: any[];
} {
  return {
    // Dane dla wykresu kołowego
    pieData: [
      { name: 'Koszt', value: cost, fill: '#64748b' },
      { name: 'Zysk', value: margin, fill: '#10b981' }
    ],
    
    // Dane dla wykresu słupkowego
    barData: [
      { name: 'Cena', koszt: cost, zysk: margin, cena: price }
    ],
    
    // Dane dla tabeli porównawczej
    comparisonData: [
      {
        name: 'Pesymistyczny (-20%)',
        values: [
          `${(cost * 1.2).toFixed(2)} PLN`,
          `${(price * 0.8).toFixed(2)} PLN`,
          `${((price * 0.8) - (cost * 1.2)).toFixed(2)} PLN`,
          `${(((price * 0.8) - (cost * 1.2)) / (price * 0.8) * 100).toFixed(1)}%`
        ]
      },
      {
        name: 'Obecny',
        values: [
          `${cost.toFixed(2)} PLN`,
          `${price.toFixed(2)} PLN`,
          `${margin.toFixed(2)} PLN`,
          `${marginPercent.toFixed(1)}%`
        ],
        highlight: true
      },
      {
        name: 'Optymistyczny (+20%)',
        values: [
          `${(cost * 0.8).toFixed(2)} PLN`,
          `${(price * 1.2).toFixed(2)} PLN`,
          `${((price * 1.2) - (cost * 0.8)).toFixed(2)} PLN`,
          `${(((price * 1.2) - (cost * 0.8)) / (price * 1.2) * 100).toFixed(1)}%`
        ]
      }
    ]
  };
}

/**
 * Konwertuje dane VAT na dane dla wykresów
 */
export function vatToChartData(
  netAmount: number,
  vatRate: number,
  vatAmount: number,
  grossAmount: number
): {
  pieData: ChartDataPoint[];
  tableData: TableRow[];
} {
  const allRates = [23, 8, 5, 0];
  
  return {
    // Dane dla wykresu kołowego
    pieData: [
      { name: 'Netto', value: netAmount, fill: '#64748b' },
      { name: 'VAT', value: vatAmount, fill: '#0ea5e9' }
    ],
    
    // Dane dla tabeli wszystkich stawek
    tableData: allRates.map(rate => ({
      stawka: `${rate}%`,
      netto: `${netAmount.toFixed(2)} PLN`,
      vat: `${(netAmount * rate / 100).toFixed(2)} PLN`,
      brutto: `${(netAmount * (1 + rate / 100)).toFixed(2)} PLN`,
      highlight: rate === vatRate
    }))
  };
}

/**
 * Konwertuje dane ROI na dane dla wykresów
 */
export function roiToChartData(
  investment: number,
  annualProfit: number,
  roiPercent: number,
  paybackYears: number
): {
  barData: ChartDataPoint[];
  projectionData: any[];
} {
  return {
    // Dane dla wykresu słupkowego
    barData: [
      {
        name: 'Finansowanie',
        inwestycja: investment,
        zysk_roczny: annualProfit
      }
    ],
    
    // Dane dla projekcji 3-letniej
    projectionData: [
      {
        name: 'Rok 1',
        values: [
          `${annualProfit.toFixed(2)} PLN`,
          `${((annualProfit / investment) * 100).toFixed(1)}%`,
          `${(investment - annualProfit).toFixed(2)} PLN`
        ]
      },
      {
        name: 'Rok 2',
        values: [
          `${(annualProfit * 2).toFixed(2)} PLN`,
          `${((annualProfit * 2 / investment) * 100).toFixed(1)}%`,
          `${Math.max(0, investment - annualProfit * 2).toFixed(2)} PLN`
        ],
        highlight: paybackYears >= 1 && paybackYears < 2
      },
      {
        name: 'Rok 3',
        values: [
          `${(annualProfit * 3).toFixed(2)} PLN`,
          `${((annualProfit * 3 / investment) * 100).toFixed(1)}%`,
          `${Math.max(0, investment - annualProfit * 3).toFixed(2)} PLN`
        ],
        highlight: paybackYears >= 2 && paybackYears < 3
      }
    ]
  };
}

/**
 * Konwertuje dane o zyskach na dane dla wykresów
 */
export function profitToChartData(
  revenue: number,
  costs: number,
  profit: number,
  profitMargin: number
): {
  lineData: ChartDataPoint[];
  pieData: ChartDataPoint[];
  analysisData: TableRow[];
} {
  // Generuj dane dla 6 miesięcy z trendami
  const months = ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze'];
  const lineData = months.map((month, i) => {
    const trend = 1 + (i * 0.05); // 5% wzrost miesięcznie
    return {
      name: month,
      przychody: Math.round(revenue * trend),
      koszty: Math.round(costs * trend),
      zysk: Math.round(profit * trend)
    };
  });

  return {
    lineData,
    
    // Dane dla struktury przychodów
    pieData: [
      { name: 'Koszty', value: costs, fill: '#ef4444' },
      { name: 'Zysk', value: profit, fill: '#10b981' }
    ],
    
    // Analiza rentowności
    analysisData: [
      { metric: 'Przychody', value: `${revenue.toFixed(2)} PLN` },
      { metric: 'Koszty', value: `${costs.toFixed(2)} PLN` },
      { metric: 'Zysk netto', value: `${profit.toFixed(2)} PLN` },
      { metric: 'Marża zysku', value: `${profitMargin.toFixed(1)}%` },
      { metric: 'Próg rentowności', value: `${costs.toFixed(2)} PLN` }
    ]
  };
}

// ========================================
// INTEGRACJA Z API
// ========================================

/**
 * Przykład: Pobierz dane z własnego API
 */
export async function fetchCalculationHistory(
  type?: CalculationResult['type']
): Promise<CalculationResult[]> {
  try {
    const params = type ? `?type=${type}` : '';
    const response = await fetch(`/api/calculations${params}`);
    
    if (!response.ok) {
      throw new Error('Błąd pobierania danych');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Błąd API:', error);
    return [];
  }
}

/**
 * Przykład: Zapisz obliczenie do historii
 */
export async function saveCalculation(
  calculation: Omit<CalculationResult, 'timestamp'>
): Promise<boolean> {
  try {
    const response = await fetch('/api/calculations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...calculation,
        timestamp: new Date().toISOString()
      }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Błąd zapisu:', error);
    return false;
  }
}

/**
 * Pobierz dane z localStorage (offline)
 */
export function getLocalCalculations(
  type?: CalculationResult['type']
): CalculationResult[] {
  try {
    const stored = localStorage.getItem('calculations');
    if (!stored) return [];
    
    const all: CalculationResult[] = JSON.parse(stored);
    
    return type 
      ? all.filter(calc => calc.type === type)
      : all;
  } catch (error) {
    console.error('Błąd odczytu localStorage:', error);
    return [];
  }
}

/**
 * Zapisz dane w localStorage (offline)
 */
export function saveLocalCalculation(
  calculation: Omit<CalculationResult, 'timestamp'>
): boolean {
  try {
    const stored = getLocalCalculations();
    const newCalc: CalculationResult = {
      ...calculation,
      timestamp: new Date()
    };
    
    stored.unshift(newCalc);
    
    // Zachowaj tylko ostatnie 100 obliczeń
    const limited = stored.slice(0, 100);
    
    localStorage.setItem('calculations', JSON.stringify(limited));
    return true;
  } catch (error) {
    console.error('Błąd zapisu localStorage:', error);
    return false;
  }
}

// ========================================
// EKSPORT DANYCH
// ========================================

/**
 * Eksportuj dane do CSV
 */
export function exportToCSV(
  data: TableRow[],
  filename: string = 'export.csv'
): void {
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"`
          : value;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

/**
 * Eksportuj dane do JSON
 */
export function exportToJSON(
  data: any,
  filename: string = 'export.json'
): void {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

// ========================================
// FORMATOWANIE DANYCH
// ========================================

/**
 * Formatuj liczbę jako walutę PLN
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN'
  }).format(value);
}

/**
 * Formatuj procent
 */
export function formatPercent(value: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
}

/**
 * Formatuj datę
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
}
