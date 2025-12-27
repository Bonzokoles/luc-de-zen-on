import { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { format, startOfMonth, endOfMonth, subMonths, addDays } from 'date-fns';
import { pl } from 'date-fns/locale';

// ========== INTERFACES ==========

interface Transaction {
  id: string;
  date: Date;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'cancelled';
  paymentMethod: 'transfer' | 'cash' | 'card' | 'other';
  invoice?: string;
}

interface CashFlowData {
  date: string;
  income: number;
  expense: number;
  balance: number;
}

interface CategorySummary {
  category: string;
  amount: number;
  count: number;
  percentage: number;
}

// ========== DEMO DATA ==========
// ⚠️ DANE DEMONSTRACYJNE - wyzerowane. Rozpocznij pracę z narzędziami aby zobaczyć prawdziwe dane.

const demoTransactions: Transaction[] = [];

const CATEGORY_COLORS: Record<string, string> = {
  'Sprzedaż usług': '#10b981',
  'Subskrypcje': '#3b82f6',
  'Wynagrodzenia': '#ef4444',
  'Czynsz': '#f59e0b',
  'Licencje': '#8b5cf6',
  'Marketing': '#ec4899',
  'Infrastruktura': '#06b6d4',
  'Księgowość': '#6366f1',
  'Paliwo': '#f97316'
};

// ========== COMPONENT ==========

export default function FinansePro() {
  const [activeView, setActiveView] = useState<'dashboard' | 'transactions' | 'cashflow' | 'reports'>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dateRange, setDateRange] = useState<'month' | 'quarter' | 'year'>('month');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem('erp-finanse');
    if (saved) {
      setTransactions(JSON.parse(saved));
    } else {
      setTransactions(demoTransactions);
    }
  }, []);

  // Save data
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem('erp-finanse', JSON.stringify(transactions));
    }
  }, [transactions]);

  // Calculations
  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const currentMonthEnd = endOfMonth(now);

  const currentMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date >= currentMonthStart && date <= currentMonthEnd && t.status === 'completed';
  });

  const totalIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const pendingIncome = transactions
    .filter(t => t.type === 'income' && t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  // Cash flow chart data (last 6 months)
  const cashFlowData: CashFlowData[] = [];
  let runningBalance = 0;

  for (let i = 5; i >= 0; i--) {
    const monthStart = startOfMonth(subMonths(now, i));
    const monthEnd = endOfMonth(subMonths(now, i));

    const monthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date >= monthStart && date <= monthEnd && t.status === 'completed';
    });

    const monthIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthExpense = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    runningBalance += monthIncome - monthExpense;

    cashFlowData.push({
      date: format(monthStart, 'MMM yyyy', { locale: pl }),
      income: monthIncome,
      expense: monthExpense,
      balance: runningBalance
    });
  }

  // Category summaries
  const incomeSummary: CategorySummary[] = [];
  const expenseSummary: CategorySummary[] = [];

  const incomeByCategory = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  Object.entries(incomeByCategory).forEach(([category, amount]) => {
    incomeSummary.push({
      category,
      amount,
      count: currentMonthTransactions.filter(t => t.type === 'income' && t.category === category).length,
      percentage: (amount / totalIncome) * 100
    });
  });

  const expenseByCategory = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  Object.entries(expenseByCategory).forEach(([category, amount]) => {
    expenseSummary.push({
      category,
      amount,
      count: currentMonthTransactions.filter(t => t.type === 'expense' && t.category === category).length,
      percentage: (amount / totalExpense) * 100
    });
  });

  // Filter transactions
  const filteredTransactions = transactions.filter(t => {
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // ========== RENDER ==========

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
            💰 Finanse Pro
          </h1>
          <p className="text-slate-400">Przepływy finansowe, cash flow i zarządzanie płatnościami</p>
        </div>

        {/* Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'dashboard', label: '📊 Dashboard' },
            { id: 'transactions', label: '💳 Transakcje' },
            { id: 'cashflow', label: '📈 Cash Flow' },
            { id: 'reports', label: '📄 Raporty' }
          ].map(view => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${activeView === view.id
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700'
                }`}
            >
              {view.label}
            </button>
          ))}
        </div>

        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <div className="space-y-6">

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
                <div className="text-sm text-slate-400 mb-2">Przychody (miesiąc)</div>
                <div className="text-3xl font-bold text-emerald-400">{totalIncome.toLocaleString('pl-PL')} zł</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
                <div className="text-sm text-slate-400 mb-2">Koszty (miesiąc)</div>
                <div className="text-3xl font-bold text-red-400">{totalExpense.toLocaleString('pl-PL')} zł</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
                <div className="text-sm text-slate-400 mb-2">Saldo</div>
                <div className={`text-3xl font-bold ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {balance.toLocaleString('pl-PL')} zł
                </div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
                <div className="text-sm text-slate-400 mb-2">Oczekujące wpłaty</div>
                <div className="text-3xl font-bold text-yellow-400">{pendingIncome.toLocaleString('pl-PL')} zł</div>
              </div>
            </div>

            {/* Cash Flow Chart */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">📈 Cash Flow (ostatnie 6 miesięcy)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                    labelStyle={{ color: '#f1f5f9' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Przychody" />
                  <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} name="Koszty" />
                  <Line type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={3} name="Saldo" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Income vs Expense */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Income Categories */}
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-emerald-400">💰 Przychody wg kategorii</h3>
                <div className="space-y-3">
                  {incomeSummary.sort((a, b) => b.amount - a.amount).map(cat => (
                    <div key={cat.category}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{cat.category}</span>
                        <span className="text-sm font-mono font-bold">{cat.amount.toLocaleString('pl-PL')} zł</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500"
                          style={{ width: `${cat.percentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {cat.count} transakcji • {cat.percentage.toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expense Categories */}
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-red-400">💸 Koszty wg kategorii</h3>
                <div className="space-y-3">
                  {expenseSummary.sort((a, b) => b.amount - a.amount).map(cat => (
                    <div key={cat.category}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{cat.category}</span>
                        <span className="text-sm font-mono font-bold">{cat.amount.toLocaleString('pl-PL')} zł</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500"
                          style={{ width: `${cat.percentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {cat.count} transakcji • {cat.percentage.toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Recent Transactions */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">📋 Ostatnie transakcje</h3>
              <div className="space-y-2">
                {filteredTransactions.slice(0, 10).map(t => (
                  <div key={t.id} className="flex items-center justify-between bg-slate-900/50 rounded-lg p-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-lg ${t.type === 'income' ? 'bg-emerald-900/30' : 'bg-red-900/30'} flex items-center justify-center text-2xl`}>
                        {t.type === 'income' ? '💰' : '💸'}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{t.description}</div>
                        <div className="text-xs text-slate-400">
                          {t.category} • {format(new Date(t.date), 'dd MMM yyyy', { locale: pl })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-mono font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString('pl-PL')} zł
                      </div>
                      <div className="text-xs text-slate-400">
                        {t.status === 'pending' ? '⏳ Oczekująca' : '✓ Zrealizowana'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Transactions View */}
        {activeView === 'transactions' && (
          <div className="space-y-6">

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="🔍 Szukaj transakcji..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">Wszystkie</option>
                <option value="income">Przychody</option>
                <option value="expense">Koszty</option>
              </select>
              <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium whitespace-nowrap">
                + Nowa transakcja
              </button>
            </div>

            {/* Transactions List */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Data</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Typ</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Kategoria</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Opis</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Kwota</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {filteredTransactions.map(t => (
                      <tr key={t.id} className="hover:bg-slate-900/30">
                        <td className="px-6 py-4 text-sm">
                          {format(new Date(t.date), 'dd MMM yyyy', { locale: pl })}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${t.type === 'income'
                              ? 'bg-emerald-900/30 text-emerald-400'
                              : 'bg-red-900/30 text-red-400'
                            }`}>
                            {t.type === 'income' ? '💰 Przychód' : '💸 Koszt'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">{t.category}</td>
                        <td className="px-6 py-4 text-sm">{t.description}</td>
                        <td className="px-6 py-4 text-right">
                          <span className={`font-mono font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                            }`}>
                            {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString('pl-PL')} zł
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-1 rounded text-xs ${t.status === 'completed'
                              ? 'bg-green-900/30 text-green-400'
                              : t.status === 'pending'
                                ? 'bg-yellow-900/30 text-yellow-400'
                                : 'bg-red-900/30 text-red-400'
                            }`}>
                            {t.status === 'completed' ? '✓ Zrealizowana' :
                              t.status === 'pending' ? '⏳ Oczekująca' : '✗ Anulowana'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Cash Flow View */}
        {activeView === 'cashflow' && (
          <div className="space-y-6">

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-6">📈 Analiza Cash Flow</h3>

              {/* Area Chart */}
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={cashFlowData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                    labelStyle={{ color: '#f1f5f9' }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                    name="Przychody"
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    stroke="#ef4444"
                    fillOpacity={1}
                    fill="url(#colorExpense)"
                    name="Koszty"
                  />
                </AreaChart>
              </ResponsiveContainer>

              {/* Monthly Breakdown */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {cashFlowData.slice(-3).map((month, idx) => (
                  <div key={idx} className="bg-slate-900/50 rounded-lg p-4">
                    <div className="text-sm text-slate-400 mb-3">{month.date}</div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Przychody:</span>
                        <span className="font-mono text-emerald-400">{month.income.toLocaleString('pl-PL')} zł</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Koszty:</span>
                        <span className="font-mono text-red-400">{month.expense.toLocaleString('pl-PL')} zł</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-slate-700">
                        <span className="text-sm font-bold">Saldo:</span>
                        <span className={`font-mono font-bold ${(month.income - month.expense) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {(month.income - month.expense).toLocaleString('pl-PL')} zł
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

        {/* Reports View */}
        {activeView === 'reports' && (
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">📄 Raporty</h2>
            <p className="text-slate-400 mb-6">Eksport raportów finansowych - w przygotowaniu</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="p-6 bg-gradient-to-br from-emerald-600/20 to-green-600/20 border border-emerald-500/30 rounded-xl hover:border-emerald-500/50 transition-all text-left">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-bold mb-1">Raport miesięczny</h3>
                <p className="text-sm text-slate-400">Podsumowanie przychodów i kosztów</p>
              </button>

              <button className="p-6 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-xl hover:border-blue-500/50 transition-all text-left">
                <div className="text-3xl mb-3">📈</div>
                <h3 className="font-bold mb-1">Analiza Cash Flow</h3>
                <p className="text-sm text-slate-400">Przepływy finansowe w czasie</p>
              </button>

              <button className="p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl hover:border-purple-500/50 transition-all text-left">
                <div className="text-3xl mb-3">📄</div>
                <h3 className="font-bold mb-1">Eksport PDF</h3>
                <p className="text-sm text-slate-400">Wygeneruj raport w PDF</p>
              </button>

              <button className="p-6 bg-gradient-to-br from-orange-600/20 to-yellow-600/20 border border-orange-500/30 rounded-xl hover:border-orange-500/50 transition-all text-left">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-bold mb-1">Eksport Excel</h3>
                <p className="text-sm text-slate-400">Pobierz dane w XLSX</p>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
