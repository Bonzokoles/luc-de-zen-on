/**
 * PRZYKŁAD INTEGRACJI PRAWDZIWYCH DANYCH
 * 
 * Ten plik pokazuje jak zintegrować komponenty z prawdziwymi danymi.
 * Skopiuj i dostosuj kod do swoich potrzeb.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AnimatedLineChart,
  AnimatedBarChart,
  AnimatedPieChart,
} from '../components/shared/ChartComponents';
import {
  DataTable,
  ComparisonTable,
} from '../components/shared/TableComponents';
import {
  marginToChartData,
  vatToChartData,
  roiToChartData,
  profitToChartData,
  saveLocalCalculation,
  getLocalCalculations,
  exportToCSV,
  formatCurrency,
  formatPercent,
  type CalculationResult
} from '../utils/dataIntegration';

// ========================================
// PRZYKŁAD 1: Kalkulator z Zapisem do localStorage
// ========================================

export const MarginCalculatorWithStorage = () => {
  const [cost, setCost] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [history, setHistory] = useState<CalculationResult[]>([]);

  // Załaduj historię przy montowaniu
  useEffect(() => {
    const stored = getLocalCalculations('margin');
    setHistory(stored);
  }, []);

  const calculate = () => {
    const margin = price - cost;
    const marginPercent = (margin / price) * 100;

    // Zapisz w localStorage
    const success = saveLocalCalculation({
      type: 'margin',
      inputs: { cost, price },
      results: { margin, marginPercent }
    });

    if (success) {
      // Odśwież historię
      setHistory(getLocalCalculations('margin'));
    }

    return { margin, marginPercent };
  };

  const { margin, marginPercent } = calculate();
  const chartData = marginToChartData(cost, price, margin, marginPercent);

  return (
    <div className="space-y-6">
      {/* Formularz obliczeniowy */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Kalkulator Marży</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Koszt:</label>
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
              className="input-field"
            />
          </div>
          <div>
            <label className="block mb-2">Cena:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Wykresy */}
      {price > 0 && cost > 0 && (
        <>
          <AnimatedPieChart
            data={chartData.pieData as { name: string; value: number }[]}
            title="💰 Struktura Ceny"
            height={300}
          />

          <ComparisonTable
            title="📊 Scenariusze"
            categories={['Koszt', 'Cena', 'Zysk', 'Marża']}
            items={chartData.comparisonData}
          />
        </>
      )}

      {/* Historia obliczeń */}
      {history.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4">📜 Historia</h3>
          <div className="space-y-2">
            {history.slice(0, 5).map((calc, i) => (
              <div key={i} className="p-3 bg-business-dark rounded border border-business-border">
                <div className="flex justify-between">
                  <span>
                    Koszt: {formatCurrency(calc.inputs.cost as number)} →
                    Cena: {formatCurrency(calc.inputs.price as number)}
                  </span>
                  <span className="text-business-accent">
                    {formatPercent(calc.results.marginPercent)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ========================================
// PRZYKŁAD 2: Integracja z API
// ========================================

export const ProfitCalculatorWithAPI = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Pobierz dane z API
  const fetchData = async () => {
    setLoading(true);
    try {
      // ZAMIEŃ NA SWÓJ ENDPOINT
      const response = await fetch('/api/financial-data');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Błąd:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Ładowanie danych...</div>;
  }

  if (!data) {
    return <div className="text-center py-12">Brak danych</div>;
  }

  const chartData = profitToChartData(
    data.revenue,
    data.costs,
    data.profit,
    data.profitMargin
  );

  return (
    <div className="space-y-6">
      <AnimatedLineChart
        data={chartData.lineData}
        dataKeys={[
          { key: 'przychody', name: 'Przychody', color: '#10b981' },
          { key: 'koszty', name: 'Koszty', color: '#ef4444' },
          { key: 'zysk', name: 'Zysk', color: '#0ea5e9' }
        ]}
        xKey="name"
        title="📈 Trend Finansowy"
        height={400}
      />

      <AnimatedPieChart
        data={chartData.pieData as { name: string; value: number }[]}
        title="💼 Struktura Przychodów"
        height={300}
      />

      <DataTable
        title="📊 Analiza Rentowności"
        columns={[
          { key: 'metric', label: 'Metryka', align: 'left' },
          { key: 'value', label: 'Wartość', align: 'right' }
        ]}
        data={chartData.analysisData}
      />
    </div>
  );
};

// ========================================
// PRZYKŁAD 3: Eksport Danych
// ========================================

export const DataExportExample = () => {
  const [calculations, setCalculations] = useState<CalculationResult[]>([]);

  useEffect(() => {
    setCalculations(getLocalCalculations());
  }, []);

  const handleExport = () => {
    const exportData = calculations.map(calc => ({
      typ: calc.type,
      data: new Date(calc.timestamp).toLocaleDateString('pl-PL'),
      ...calc.inputs,
      ...calc.results
    }));

    exportToCSV(exportData, `obliczenia-${Date.now()}.csv`);
  };

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-4">📤 Eksport Danych</h3>
      <p className="text-business-text-dim mb-4">
        Masz {calculations.length} zapisanych obliczeń
      </p>
      <button
        onClick={handleExport}
        className="btn-primary"
        disabled={calculations.length === 0}
      >
        📥 Eksportuj do CSV
      </button>
    </div>
  );
};

// ========================================
// PRZYKŁAD 4: Live Updates (WebSocket)
// ========================================

export const LiveDashboard = () => {
  const [liveData, setLiveData] = useState<any[]>([]);

  useEffect(() => {
    // ZAMIEŃ NA SWÓJ WEBSOCKET
    const ws = new WebSocket('wss://your-api.com/live');

    ws.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setLiveData(prev => [...prev.slice(-20), newData]); // Ostatnie 20 punktów
    };

    return () => ws.close();
  }, []);

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">📡 Dane na żywo</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-business-text-dim">Połączono</span>
        </div>
      </div>

      {liveData.length > 0 && (
        <AnimatedLineChart
          data={liveData}
          dataKeys={[
            { key: 'value', name: 'Wartość', color: '#0ea5e9' }
          ]}
          xKey="timestamp"
          title=""
          height={300}
        />
      )}
    </div>
  );
};

// ========================================
// PRZYKŁAD 5: Integracja z Formularza
// ========================================

export const FormIntegrationExample = () => {
  const [formData, setFormData] = useState({
    revenue: '',
    costs: '',
    investment: ''
  });
  const [results, setResults] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const revenue = Number(formData.revenue);
    const costs = Number(formData.costs);
    const profit = revenue - costs;
    const profitMargin = (profit / revenue) * 100;

    const chartData = profitToChartData(revenue, costs, profit, profitMargin);
    setResults(chartData);

    // Opcjonalnie: zapisz do API lub localStorage
    saveLocalCalculation({
      type: 'profit',
      inputs: { revenue, costs },
      results: { profit, profitMargin }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <form onSubmit={handleSubmit} className="card">
        <h3 className="text-xl font-bold mb-4">💰 Analiza Zysku</h3>

        <div className="space-y-4">
          <div>
            <label className="block mb-2">Przychody (PLN):</label>
            <input
              type="number"
              value={formData.revenue}
              onChange={(e) => setFormData(prev => ({ ...prev, revenue: e.target.value }))}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Koszty (PLN):</label>
            <input
              type="number"
              value={formData.costs}
              onChange={(e) => setFormData(prev => ({ ...prev, costs: e.target.value }))}
              className="input-field"
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            📊 Wygeneruj Analizę
          </button>
        </div>
      </form>

      {results && (
        <>
          <AnimatedLineChart
            data={results.lineData}
            dataKeys={[
              { key: 'przychody', name: 'Przychody', color: '#10b981' },
              { key: 'koszty', name: 'Koszty', color: '#ef4444' },
              { key: 'zysk', name: 'Zysk', color: '#0ea5e9' }
            ]}
            xKey="name"
            title="📈 Projekcja 6-miesięczna"
            height={400}
          />

          <DataTable
            title="📊 Wskaźniki"
            columns={[
              { key: 'metric', label: 'Metryka', align: 'left' },
              { key: 'value', label: 'Wartość', align: 'right' }
            ]}
            data={results.analysisData}
          />
        </>
      )}
    </motion.div>
  );
};

export default {
  MarginCalculatorWithStorage,
  ProfitCalculatorWithAPI,
  DataExportExample,
  LiveDashboard,
  FormIntegrationExample
};
