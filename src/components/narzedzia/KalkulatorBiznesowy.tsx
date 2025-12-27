import { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedPieChart, AnimatedBarChart, AnimatedLineChart } from '../shared/ChartComponents';
import { DataTable, ComparisonTable } from '../shared/TableComponents';

const KalkulatorBiznesowy = () => {
  const [activeCalc, setActiveCalc] = useState<'margin' | 'vat' | 'roi' | 'profit'>('margin');

  // Kalkulator Marży
  const [costPrice, setCostPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [marginResult, setMarginResult] = useState<any>(null);

  // Kalkulator VAT
  const [netAmount, setNetAmount] = useState('');
  const [vatRate, setVatRate] = useState('23');
  const [vatResult, setVatResult] = useState<any>(null);

  // Kalkulator ROI
  const [investment, setInvestment] = useState('');
  const [profit, setProfit] = useState('');
  const [roiResult, setRoiResult] = useState<any>(null);

  // Kalkulator Zysku
  const [revenue, setRevenue] = useState('');
  const [costs, setCosts] = useState('');
  const [profitResult, setProfitResult] = useState<any>(null);

  const calculateMargin = () => {
    const cost = parseFloat(costPrice);
    const sell = parseFloat(sellPrice);

    if (isNaN(cost) || isNaN(sell) || cost === 0) {
      alert('Podaj poprawne wartości');
      return;
    }

    const profitAmount = sell - cost;
    const marginPercent = ((profitAmount / sell) * 100).toFixed(2);
    const markupPercent = ((profitAmount / cost) * 100).toFixed(2);

    setMarginResult({
      profitAmount: profitAmount.toFixed(2),
      marginPercent,
      markupPercent
    });
  };

  const calculateVAT = () => {
    const net = parseFloat(netAmount);
    const vat = parseFloat(vatRate);

    if (isNaN(net) || net === 0) {
      alert('Podaj kwotę netto');
      return;
    }

    const vatAmount = (net * vat) / 100;
    const gross = net + vatAmount;

    setVatResult({
      net: net.toFixed(2),
      vatAmount: vatAmount.toFixed(2),
      gross: gross.toFixed(2),
      vatRate: vat
    });
  };

  const calculateROI = () => {
    const inv = parseFloat(investment);
    const prof = parseFloat(profit);

    if (isNaN(inv) || isNaN(prof) || inv === 0) {
      alert('Podaj poprawne wartości');
      return;
    }

    const roiPercent = ((prof / inv) * 100).toFixed(2);
    const paybackMonths = prof > 0 ? (inv / (prof / 12)).toFixed(1) : 'N/A';

    setRoiResult({
      roiPercent,
      paybackMonths,
      isPositive: parseFloat(roiPercent) > 0
    });
  };

  const calculateProfit = () => {
    const rev = parseFloat(revenue);
    const cost = parseFloat(costs);

    if (isNaN(rev) || isNaN(cost)) {
      alert('Podaj poprawne wartości');
      return;
    }

    const netProfit = rev - cost;
    const profitMargin = rev > 0 ? ((netProfit / rev) * 100).toFixed(2) : '0';

    setProfitResult({
      netProfit: netProfit.toFixed(2),
      profitMargin,
      isProfit: netProfit > 0
    });
  };

  const resetAll = () => {
    setCostPrice('');
    setSellPrice('');
    setNetAmount('');
    setInvestment('');
    setProfit('');
    setRevenue('');
    setCosts('');
    setMarginResult(null);
    setVatResult(null);
    setRoiResult(null);
    setProfitResult(null);
  };

  // Example data for charts and comparisons
  const marginComparisonData = [
    { name: 'Koszty', value: parseFloat(costPrice) || 0 },
    { name: 'Zysk', value: marginResult ? parseFloat(marginResult.profitAmount) : 0 }
  ];

  const vatBreakdownData = [
    { name: 'Netto', value: vatResult ? parseFloat(vatResult.net) : 0 },
    { name: 'VAT', value: vatResult ? parseFloat(vatResult.vatAmount) : 0 }
  ];

  const profitTrendData = [
    { month: 'Sty', zysk: 12000, koszty: 8000 },
    { month: 'Lut', zysk: 15000, koszty: 9000 },
    { month: 'Mar', zysk: 18000, koszty: 10000 },
    { month: 'Kwi', zysk: 16000, koszty: 11000 },
    { month: 'Maj', zysk: 20000, koszty: 12000 },
    { month: 'Cze', zysk: parseFloat(revenue) || 22000, koszty: parseFloat(costs) || 13000 }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto"
    >

      {/* Przyciski wyboru kalkulatora */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <button
          onClick={() => { setActiveCalc('margin'); resetAll(); }}
          className={`p-4 rounded-lg font-medium transition-all ${
            activeCalc === 'margin'
              ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-glow'
              : 'bg-business-surface border border-business-border hover:border-business-accent'
          }`}
        >
          📊 Marża
        </button>
        <button
          onClick={() => { setActiveCalc('vat'); resetAll(); }}
          className={`p-4 rounded-lg font-medium transition-all ${
            activeCalc === 'vat'
              ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-glow'
              : 'bg-business-surface border border-business-border hover:border-business-accent'
          }`}
        >
          🧾 VAT
        </button>
        <button
          onClick={() => { setActiveCalc('roi'); resetAll(); }}
          className={`p-4 rounded-lg font-medium transition-all ${
            activeCalc === 'roi'
              ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-glow'
              : 'bg-business-surface border border-business-border hover:border-business-accent'
          }`}
        >
          💰 ROI
        </button>
        <button
          onClick={() => { setActiveCalc('profit'); resetAll(); }}
          className={`p-4 rounded-lg font-medium transition-all ${
            activeCalc === 'profit'
              ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-glow'
              : 'bg-business-surface border border-business-border hover:border-business-accent'
          }`}
        >
          📈 Zysk
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Panel Input */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">
            {activeCalc === 'margin' && '📊 Kalkulator Marży'}
            {activeCalc === 'vat' && '🧾 Kalkulator VAT'}
            {activeCalc === 'roi' && '💰 Kalkulator ROI'}
            {activeCalc === 'profit' && '📈 Kalkulator Zysku'}
          </h2>

          {/* Kalkulator Marży */}
          {activeCalc === 'margin' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Cena zakupu (netto) PLN
                </label>
                <input
                  type="number"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  className="input-field"
                  placeholder="100.00"
                  step="0.01"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Cena sprzedaży (netto) PLN
                </label>
                <input
                  type="number"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(e.target.value)}
                  className="input-field"
                  placeholder="150.00"
                  step="0.01"
                />
              </div>
              <button onClick={calculateMargin} className="btn-primary w-full">
                Oblicz Marżę
              </button>
            </>
          )}

          {/* Kalkulator VAT */}
          {activeCalc === 'vat' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Kwota netto PLN
                </label>
                <input
                  type="number"
                  value={netAmount}
                  onChange={(e) => setNetAmount(e.target.value)}
                  className="input-field"
                  placeholder="1000.00"
                  step="0.01"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Stawka VAT %
                </label>
                <select
                  value={vatRate}
                  onChange={(e) => setVatRate(e.target.value)}
                  className="input-field"
                >
                  <option value="23">23% (standardowa)</option>
                  <option value="8">8% (obniżona)</option>
                  <option value="5">5% (preferencyjna)</option>
                  <option value="0">0% (zwolniona)</option>
                </select>
              </div>
              <button onClick={calculateVAT} className="btn-primary w-full">
                Oblicz VAT
              </button>
            </>
          )}

          {/* Kalkulator ROI */}
          {activeCalc === 'roi' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Inwestycja początkowa PLN
                </label>
                <input
                  type="number"
                  value={investment}
                  onChange={(e) => setInvestment(e.target.value)}
                  className="input-field"
                  placeholder="10000.00"
                  step="0.01"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Zysk roczny PLN
                </label>
                <input
                  type="number"
                  value={profit}
                  onChange={(e) => setProfit(e.target.value)}
                  className="input-field"
                  placeholder="3000.00"
                  step="0.01"
                />
              </div>
              <button onClick={calculateROI} className="btn-primary w-full">
                Oblicz ROI
              </button>
            </>
          )}

          {/* Kalkulator Zysku */}
          {activeCalc === 'profit' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Przychód (sprzedaż) PLN
                </label>
                <input
                  type="number"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                  className="input-field"
                  placeholder="50000.00"
                  step="0.01"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Koszty całkowite PLN
                </label>
                <input
                  type="number"
                  value={costs}
                  onChange={(e) => setCosts(e.target.value)}
                  className="input-field"
                  placeholder="35000.00"
                  step="0.01"
                />
              </div>
              <button onClick={calculateProfit} className="btn-primary w-full">
                Oblicz Zysk
              </button>
            </>
          )}

          <div className="mt-6 p-4 bg-business-dark border border-business-border rounded-lg">
            <p className="text-xs text-business-text-dim">
              💡 Wszystkie obliczenia są orientacyjne. W razie wątpliwości skonsultuj się z księgowym.
            </p>
          </div>
        </div>

        {/* Panel Wyników */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">
            📊 Wyniki
          </h2>

          {/* Wyniki Marży */}
          {activeCalc === 'margin' && marginResult && (
            <div className="space-y-4">
              <div className="bg-business-dark border border-business-border rounded-lg p-4">
                <div className="text-sm text-business-text-dim mb-1">Zysk (kwota)</div>
                <div className="text-3xl font-bold text-business-accent">
                  {marginResult.profitAmount} PLN
                </div>
              </div>
              <div className="bg-business-dark border border-business-border rounded-lg p-4">
                <div className="text-sm text-business-text-dim mb-1">Marża (%)</div>
                <div className="text-3xl font-bold text-business-accent-soft">
                  {marginResult.marginPercent}%
                </div>
              </div>
              <div className="bg-business-dark border border-business-border rounded-lg p-4">
                <div className="text-sm text-business-text-dim mb-1">Narzut (%)</div>
                <div className="text-3xl font-bold text-primary-500">
                  {marginResult.markupPercent}%
                </div>
              </div>
            </div>
          )}

          {/* Wyniki VAT */}
          {activeCalc === 'vat' && vatResult && (
            <div className="space-y-4">
              <div className="bg-business-dark border border-business-border rounded-lg p-4">
                <div className="text-sm text-business-text-dim mb-1">Netto</div>
                <div className="text-2xl font-bold">{vatResult.net} PLN</div>
              </div>
              <div className="bg-business-dark border border-business-border rounded-lg p-4">
                <div className="text-sm text-business-text-dim mb-1">VAT ({vatResult.vatRate}%)</div>
                <div className="text-2xl font-bold text-business-warning">{vatResult.vatAmount} PLN</div>
              </div>
              <div className="bg-gradient-to-r from-primary-900/30 to-business-surface border border-primary-700 rounded-lg p-4">
                <div className="text-sm text-business-text-dim mb-1">Brutto (do zapłaty)</div>
                <div className="text-3xl font-bold text-business-accent">{vatResult.gross} PLN</div>
              </div>
            </div>
          )}

          {/* Wyniki ROI */}
          {activeCalc === 'roi' && roiResult && (
            <div className="space-y-4">
              <div className={`border rounded-lg p-6 ${
                roiResult.isPositive
                  ? 'bg-business-accent-soft/10 border-business-accent-soft'
                  : 'bg-red-500/10 border-red-500/30'
              }`}>
                <div className="text-sm text-business-text-dim mb-2">Zwrot z Inwestycji (ROI)</div>
                <div className="text-4xl font-bold">
                  {roiResult.roiPercent}%
                </div>
                <div className="mt-2 text-sm">
                  {roiResult.isPositive ? '✅ Inwestycja opłacalna' : '⚠️ Strata'}
                </div>
              </div>
              <div className="bg-business-dark border border-business-border rounded-lg p-4">
                <div className="text-sm text-business-text-dim mb-1">Zwrot inwestycji po</div>
                <div className="text-2xl font-bold text-business-accent">
                  {roiResult.paybackMonths} miesiącach
                </div>
              </div>
            </div>
          )}

          {/* Wyniki Zysku */}
          {activeCalc === 'profit' && profitResult && (
            <div className="space-y-4">
              <div className={`border rounded-lg p-6 ${
                profitResult.isProfit
                  ? 'bg-business-accent-soft/10 border-business-accent-soft'
                  : 'bg-red-500/10 border-red-500/30'
              }`}>
                <div className="text-sm text-business-text-dim mb-2">Zysk Netto</div>
                <div className="text-4xl font-bold">
                  {profitResult.netProfit} PLN
                </div>
                <div className="mt-2 text-sm">
                  {profitResult.isProfit ? '✅ Zysk' : '⚠️ Strata'}
                </div>
              </div>
              <div className="bg-business-dark border border-business-border rounded-lg p-4">
                <div className="text-sm text-business-text-dim mb-1">Marża Zysku</div>
                <div className="text-3xl font-bold text-business-accent">
                  {profitResult.profitMargin}%
                </div>
              </div>
            </div>
          )}

          {!marginResult && !vatResult && !roiResult && !profitResult && (
            <div className="text-center py-12 text-business-text-dim">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
              <p>Wypełnij pola i kliknij "Oblicz"</p>
            </div>
          )}
        </div>
      </div>

      {/* Charts and Analysis Section */}
      {(marginResult || vatResult || roiResult || profitResult) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 space-y-6"
        >
          
          {/* Margin Charts */}
          {activeCalc === 'margin' && marginResult && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnimatedPieChart
                  data={marginComparisonData}
                  title="📊 Podział: Koszty vs Zysk"
                  height={300}
                />
                <AnimatedBarChart
                  data={[
                    { kategoria: 'Cena zakupu', wartość: parseFloat(costPrice) || 0 },
                    { kategoria: 'Cena sprzedaży', wartość: parseFloat(sellPrice) || 0 },
                    { kategoria: 'Zysk', wartość: parseFloat(marginResult.profitAmount) || 0 }
                  ]}
                  dataKeys={[{ key: 'wartość', name: 'PLN', color: '#0ea5e9' }]}
                  xKey="kategoria"
                  title="💰 Porównanie wartości"
                  height={300}
                />
              </div>
              
              <ComparisonTable
                title="📋 Porównanie marży dla różnych scenariuszy"
                categories={['Cena zakupu', 'Cena sprzedaży', 'Zysk', 'Marża %', 'Narzut %']}
                items={[
                  {
                    name: 'Pesymistyczny',
                    values: [
                      `${parseFloat(costPrice) || 100} PLN`,
                      `${(parseFloat(costPrice) || 100) * 1.15} PLN`,
                      `${((parseFloat(costPrice) || 100) * 0.15).toFixed(2)} PLN`,
                      '13.04%',
                      '15%'
                    ]
                  },
                  {
                    name: 'Obecny',
                    values: [
                      `${costPrice} PLN`,
                      `${sellPrice} PLN`,
                      `${marginResult.profitAmount} PLN`,
                      `${marginResult.marginPercent}%`,
                      `${marginResult.markupPercent}%`
                    ],
                    highlight: true
                  },
                  {
                    name: 'Optymistyczny',
                    values: [
                      `${parseFloat(costPrice) || 100} PLN`,
                      `${(parseFloat(costPrice) || 100) * 1.50} PLN`,
                      `${((parseFloat(costPrice) || 100) * 0.50).toFixed(2)} PLN`,
                      '33.33%',
                      '50%'
                    ]
                  }
                ]}
              />
            </>
          )}

          {/* VAT Charts */}
          {activeCalc === 'vat' && vatResult && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnimatedPieChart
                  data={vatBreakdownData}
                  title="🧾 Struktura kwoty brutto"
                  height={300}
                />
                <DataTable
                  title="📊 Zestawienie stawek VAT"
                  columns={[
                    { key: 'stawka', label: 'Stawka VAT', align: 'left' },
                    { key: 'vat', label: 'Kwota VAT', align: 'right' },
                    { key: 'brutto', label: 'Kwota brutto', align: 'right' }
                  ]}
                  data={[
                    { stawka: '23% (standardowa)', vat: `${((parseFloat(netAmount) || 0) * 0.23).toFixed(2)} PLN`, brutto: `${((parseFloat(netAmount) || 0) * 1.23).toFixed(2)} PLN` },
                    { stawka: '8% (obniżona)', vat: `${((parseFloat(netAmount) || 0) * 0.08).toFixed(2)} PLN`, brutto: `${((parseFloat(netAmount) || 0) * 1.08).toFixed(2)} PLN` },
                    { stawka: '5% (preferencyjna)', vat: `${((parseFloat(netAmount) || 0) * 0.05).toFixed(2)} PLN`, brutto: `${((parseFloat(netAmount) || 0) * 1.05).toFixed(2)} PLN` },
                    { stawka: '0% (zwolniona)', vat: '0.00 PLN', brutto: `${(parseFloat(netAmount) || 0).toFixed(2)} PLN` }
                  ]}
                />
              </div>
            </>
          )}

          {/* ROI Charts */}
          {activeCalc === 'roi' && roiResult && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnimatedBarChart
                  data={[
                    { kategoria: 'Inwestycja', wartość: parseFloat(investment) || 0 },
                    { kategoria: 'Zysk roczny', wartość: parseFloat(profit) || 0 }
                  ]}
                  dataKeys={[{ key: 'wartość', name: 'PLN', color: roiResult.isPositive ? '#10b981' : '#ef4444' }]}
                  xKey="kategoria"
                  title="💰 Inwestycja vs Zysk"
                  height={300}
                />
                <ComparisonTable
                  title="📊 Projekcja zwrotu inwestycji"
                  categories={['Rok', 'Skumulowany zysk', 'Procent zwrotu', 'Status']}
                  items={[
                    {
                      name: 'Rok 1',
                      values: [
                        '1',
                        `${profit} PLN`,
                        `${roiResult.roiPercent}%`,
                        roiResult.isPositive ? '✅ Zysk' : '⚠️ Strata'
                      ]
                    },
                    {
                      name: 'Rok 2',
                      values: [
                        '2',
                        `${((parseFloat(profit) || 0) * 2).toFixed(2)} PLN`,
                        `${(parseFloat(roiResult.roiPercent) * 2).toFixed(2)}%`,
                        parseFloat(profit) * 2 > parseFloat(investment) ? '✅ Zwrot' : '🔄 W trakcie'
                      ],
                      highlight: true
                    },
                    {
                      name: 'Rok 3',
                      values: [
                        '3',
                        `${((parseFloat(profit) || 0) * 3).toFixed(2)} PLN`,
                        `${(parseFloat(roiResult.roiPercent) * 3).toFixed(2)}%`,
                        '✅ Pełny zwrot + zysk'
                      ]
                    }
                  ]}
                />
              </div>
            </>
          )}

          {/* Profit Charts */}
          {activeCalc === 'profit' && profitResult && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnimatedLineChart
                  data={profitTrendData}
                  dataKeys={[
                    { key: 'zysk', name: 'Przychód', color: '#10b981' },
                    { key: 'koszty', name: 'Koszty', color: '#ef4444' }
                  ]}
                  xKey="month"
                  title="📈 Trend przychodów i kosztów (6 miesięcy)"
                  height={300}
                />
                <AnimatedPieChart
                  data={[
                    { name: 'Przychód', value: parseFloat(revenue) || 0 },
                    { name: 'Koszty', value: parseFloat(costs) || 0 }
                  ]}
                  title="💼 Struktura finansowa"
                  height={300}
                />
              </div>
              
              <DataTable
                title="📊 Analiza rentowności"
                columns={[
                  { key: 'metryka', label: 'Metryka', align: 'left' },
                  { key: 'wartość', label: 'Wartość', align: 'right' },
                  { key: 'ocena', label: 'Ocena', align: 'center' }
                ]}
                data={[
                  { metryka: 'Przychód całkowity', wartość: `${revenue} PLN`, ocena: '📊' },
                  { metryka: 'Koszty całkowite', wartość: `${costs} PLN`, ocena: '💸' },
                  { metryka: 'Zysk netto', wartość: `${profitResult.netProfit} PLN`, ocena: profitResult.isProfit ? '✅' : '⚠️' },
                  { metryka: 'Marża zysku', wartość: `${profitResult.profitMargin}%`, ocena: parseFloat(profitResult.profitMargin) > 20 ? '🌟 Wysoka' : parseFloat(profitResult.profitMargin) > 10 ? '👍 Dobra' : '📉 Niska' }
                ]}
              />
            </>
          )}

        </motion.div>
      )}

    </motion.div>
  );
};

export default KalkulatorBiznesowy;
