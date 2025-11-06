import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Target, Calendar, Download, RefreshCw } from 'lucide-react';

interface BusinessMetric {
  label: string;
  value: number;
  previousValue: number;
  unit: string;
  icon: any;
  color: string;
}

interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
  customers: number;
}

const AnalitikaRaporty = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [metrics, setMetrics] = useState<BusinessMetric[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

  // Initialize data
  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = () => {
    // Demo data - w prawdziwej aplikacji pobieramy z API/localStorage
    const demoMetrics: BusinessMetric[] = [
      {
        label: 'Przychód',
        value: 125000,
        previousValue: 98000,
        unit: 'PLN',
        icon: DollarSign,
        color: 'text-green-400'
      },
      {
        label: 'Klienci',
        value: 247,
        previousValue: 189,
        unit: '',
        icon: Users,
        color: 'text-blue-400'
      },
      {
        label: 'Sprzedaż',
        value: 156,
        previousValue: 134,
        unit: 'transakcji',
        icon: ShoppingCart,
        color: 'text-purple-400'
      },
      {
        label: 'Konwersja',
        value: 3.8,
        previousValue: 2.9,
        unit: '%',
        icon: Target,
        color: 'text-orange-400'
      }
    ];

    const demoMonthlyData: MonthlyData[] = [
      { month: 'Sty', revenue: 95000, expenses: 62000, profit: 33000, customers: 42 },
      { month: 'Lut', revenue: 103000, expenses: 67000, profit: 36000, customers: 48 },
      { month: 'Mar', revenue: 118000, expenses: 71000, profit: 47000, customers: 55 },
      { month: 'Kwi', revenue: 112000, expenses: 68000, profit: 44000, customers: 51 },
      { month: 'Maj', revenue: 125000, expenses: 73000, profit: 52000, customers: 58 },
      { month: 'Cze', revenue: 138000, expenses: 79000, profit: 59000, customers: 64 },
    ];

    setMetrics(demoMetrics);
    setMonthlyData(demoMonthlyData);
  };

  const calculateChange = (current: number, previous: number): number => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const exportReport = () => {
    const csv = [
      ['Raport Biznesowy', new Date().toLocaleDateString('pl-PL')],
      [''],
      ['Metryki'],
      ['Wskaźnik', 'Wartość', 'Poprzednia', 'Zmiana %'],
      ...metrics.map(m => [
        m.label,
        `${m.value} ${m.unit}`,
        `${m.previousValue} ${m.unit}`,
        `${calculateChange(m.value, m.previousValue).toFixed(1)}%`
      ]),
      [''],
      ['Dane miesięczne'],
      ['Miesiąc', 'Przychód', 'Koszty', 'Zysk', 'Klienci'],
      ...monthlyData.map(d => [
        d.month,
        d.revenue.toString(),
        d.expenses.toString(),
        d.profit.toString(),
        d.customers.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `raport-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Calculate max values for chart scaling
  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));
  const maxExpenses = Math.max(...monthlyData.map(d => d.expenses));
  const maxProfit = Math.max(...monthlyData.map(d => d.profit));
  const chartMax = Math.max(maxRevenue, maxExpenses);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <BarChart3 className="w-8 h-8 text-primary-400" />
          Analityka & Raporty
        </h1>
        <p className="text-gray-300">
          Przegląd Twojego biznesu - KPI, trendy, wykresy finansowe
        </p>
      </div>

      {/* Controls */}
      <div className="card">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                timeRange === 'week'
                  ? 'bg-primary-600 text-white'
                  : 'bg-surface-dark text-gray-300 hover:bg-surface-darker'
              }`}
            >
              Tydzień
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                timeRange === 'month'
                  ? 'bg-primary-600 text-white'
                  : 'bg-surface-dark text-gray-300 hover:bg-surface-darker'
              }`}
            >
              Miesiąc
            </button>
            <button
              onClick={() => setTimeRange('quarter')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                timeRange === 'quarter'
                  ? 'bg-primary-600 text-white'
                  : 'bg-surface-dark text-gray-300 hover:bg-surface-darker'
              }`}
            >
              Kwartał
            </button>
            <button
              onClick={() => setTimeRange('year')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                timeRange === 'year'
                  ? 'bg-primary-600 text-white'
                  : 'bg-surface-dark text-gray-300 hover:bg-surface-darker'
              }`}
            >
              Rok
            </button>
          </div>

          <div className="flex gap-2">
            <button onClick={loadData} className="btn-secondary flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Odśwież
            </button>
            <button onClick={exportReport} className="btn-primary flex items-center gap-2">
              <Download className="w-4 h-4" />
              Eksportuj CSV
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const change = calculateChange(metric.value, metric.previousValue);
          const isPositive = change >= 0;
          const Icon = metric.icon;

          return (
            <div key={index} className="card hover:border-primary-500 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg bg-surface-darker ${metric.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {Math.abs(change).toFixed(1)}%
                </div>
              </div>

              <div className="text-sm text-gray-400 mb-1">{metric.label}</div>
              <div className="text-2xl font-bold text-white">
                {metric.value.toLocaleString('pl-PL')} {metric.unit}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Poprzednio: {metric.previousValue.toLocaleString('pl-PL')} {metric.unit}
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-green-400" />
          Przychody, Koszty i Zysk
        </h2>

        <div className="space-y-4">
          {monthlyData.map((data, index) => {
            const revenuePercent = (data.revenue / chartMax) * 100;
            const expensesPercent = (data.expenses / chartMax) * 100;
            const profitPercent = (data.profit / maxProfit) * 100;

            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 font-semibold w-12">{data.month}</span>
                  <div className="flex-1 flex gap-4 items-center">
                    <div className="flex-1">
                      {/* Revenue bar */}
                      <div className="relative h-8 bg-surface-darker rounded overflow-hidden">
                        <div
                          className="absolute h-full bg-gradient-to-r from-green-600 to-green-500 transition-all duration-500 flex items-center justify-end pr-2"
                          style={{ width: `${revenuePercent}%` }}
                        >
                          {revenuePercent > 20 && (
                            <span className="text-xs font-bold text-white">
                              {data.revenue.toLocaleString('pl-PL')} PLN
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Expenses bar */}
                      <div className="relative h-6 bg-surface-darker rounded overflow-hidden mt-1">
                        <div
                          className="absolute h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500 flex items-center justify-end pr-2"
                          style={{ width: `${expensesPercent}%` }}
                        >
                          {expensesPercent > 20 && (
                            <span className="text-xs font-bold text-white">
                              {data.expenses.toLocaleString('pl-PL')} PLN
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right min-w-[100px]">
                      <div className="text-lg font-bold text-primary-400">
                        +{data.profit.toLocaleString('pl-PL')} PLN
                      </div>
                      <div className="text-xs text-gray-500">
                        {data.customers} klientów
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-6 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-green-600 to-green-500 rounded"></div>
            <span className="text-gray-300">Przychód</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-red-600 to-red-500 rounded"></div>
            <span className="text-gray-300">Koszty</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary-500 rounded"></div>
            <span className="text-gray-300">Zysk</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Total Revenue */}
        <div className="card bg-green-900/20 border-green-500/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-lg bg-green-500/20">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Łączny Przychód</div>
              <div className="text-2xl font-bold text-white">
                {monthlyData.reduce((sum, d) => sum + d.revenue, 0).toLocaleString('pl-PL')} PLN
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            Średnio: {(monthlyData.reduce((sum, d) => sum + d.revenue, 0) / monthlyData.length).toLocaleString('pl-PL')} PLN/mc
          </div>
        </div>

        {/* Total Expenses */}
        <div className="card bg-red-900/20 border-red-500/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-lg bg-red-500/20">
              <TrendingDown className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Łączne Koszty</div>
              <div className="text-2xl font-bold text-white">
                {monthlyData.reduce((sum, d) => sum + d.expenses, 0).toLocaleString('pl-PL')} PLN
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            Średnio: {(monthlyData.reduce((sum, d) => sum + d.expenses, 0) / monthlyData.length).toLocaleString('pl-PL')} PLN/mc
          </div>
        </div>

        {/* Net Profit */}
        <div className="card bg-primary-900/20 border-primary-500/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-lg bg-primary-500/20">
              <DollarSign className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Zysk Netto</div>
              <div className="text-2xl font-bold text-white">
                {monthlyData.reduce((sum, d) => sum + d.profit, 0).toLocaleString('pl-PL')} PLN
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            Marża: {((monthlyData.reduce((sum, d) => sum + d.profit, 0) / monthlyData.reduce((sum, d) => sum + d.revenue, 0)) * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Customer Growth */}
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-400" />
          Wzrost Liczby Klientów
        </h2>

        <div className="relative h-64 flex items-end gap-2">
          {monthlyData.map((data, index) => {
            const height = (data.customers / Math.max(...monthlyData.map(d => d.customers))) * 100;
            const growth = index > 0 ? data.customers - monthlyData[index - 1].customers : 0;

            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all duration-500 hover:from-blue-500 hover:to-blue-300 cursor-pointer relative group"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-surface-dark px-2 py-1 rounded text-xs text-white whitespace-nowrap">
                      {data.customers} klientów
                      {growth !== 0 && (
                        <span className={growth > 0 ? 'text-green-400' : 'text-red-400'}>
                          {' '}({growth > 0 ? '+' : ''}{growth})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 font-semibold">{data.month}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Insights */}
      <div className="card bg-purple-900/20 border-purple-500/30">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 text-purple-400" />
          Szybkie Wnioski
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-green-400 text-xl">✅</span>
              <div>
                <p className="text-white font-semibold">Wzrost przychodów</p>
                <p className="text-sm text-gray-400">
                  Przychody wzrosły o {calculateChange(
                    monthlyData[monthlyData.length - 1].revenue,
                    monthlyData[0].revenue
                  ).toFixed(0)}% w analizowanym okresie
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400 text-xl">📈</span>
              <div>
                <p className="text-white font-semibold">Pozyskiwanie klientów</p>
                <p className="text-sm text-gray-400">
                  Średnio {(monthlyData.reduce((sum, d) => sum + d.customers, 0) / monthlyData.length).toFixed(0)} nowych klientów miesięcznie
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-yellow-400 text-xl">⚠️</span>
              <div>
                <p className="text-white font-semibold">Kontrola kosztów</p>
                <p className="text-sm text-gray-400">
                  Koszty stanowią {((monthlyData.reduce((sum, d) => sum + d.expenses, 0) / monthlyData.reduce((sum, d) => sum + d.revenue, 0)) * 100).toFixed(0)}% przychodów
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-400 text-xl">💡</span>
              <div>
                <p className="text-white font-semibold">Rentowność</p>
                <p className="text-sm text-gray-400">
                  Marża zysku: {((monthlyData.reduce((sum, d) => sum + d.profit, 0) / monthlyData.reduce((sum, d) => sum + d.revenue, 0)) * 100).toFixed(1)}% - {
                    ((monthlyData.reduce((sum, d) => sum + d.profit, 0) / monthlyData.reduce((sum, d) => sum + d.revenue, 0)) * 100) > 35 ? 'Bardzo dobra!' : 'Do poprawy'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="card bg-blue-900/20 border-blue-500/30">
        <div className="flex items-start gap-3">
          <BarChart3 className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
          <div className="text-sm text-gray-300">
            <p className="font-bold text-white mb-2">Funkcje Analityki</p>
            <ul className="space-y-1 ml-4 list-disc">
              <li>Przegląd KPI w czasie rzeczywistym</li>
              <li>Wykresy przychodów, kosztów i zysków</li>
              <li>Analiza wzrostu liczby klientów</li>
              <li>Eksport danych do CSV dla księgowości</li>
              <li>Automatyczne wnioski biznesowe</li>
            </ul>
            <p className="mt-3 text-yellow-400">
              💡 <strong>Wskazówka:</strong> To są dane demonstracyjne. W pełnej wersji dane będą pobierane z Twoich faktur i transakcji.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalitikaRaporty;
