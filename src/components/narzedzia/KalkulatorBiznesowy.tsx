import { useState } from 'react';

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

  return (
    <div className="max-w-6xl mx-auto">

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
    </div>
  );
};

export default KalkulatorBiznesowy;
