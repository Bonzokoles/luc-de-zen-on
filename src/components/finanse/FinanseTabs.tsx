/**
 * FinanseTabs — Tabbed wrapper dla całego modułu Finanse
 * Zakładki: Dashboard | Dokumenty | Asystent AI | Import
 * Lazy-load: każda zakładka jest code-split (React.lazy + Suspense)
 */
import { useState, lazy, Suspense } from 'react';

// Lazy-loaded tab components — each tab is a separate JS chunk
const FinansePro = lazy(() => import('./FinansePro'));
const DokumentyFinansowe = lazy(() => import('./DokumentyFinansowe'));
const FinanseAsystent = lazy(() => import('./FinanseAsystent'));
const FinanseImport = lazy(() => import('./FinanseImport'));
const FinanseTransakcje = lazy(() => import('./FinanseTransakcje'));
const FinanseCosts = lazy(() => import('./FinanseCosts'));

type Tab = 'dashboard' | 'transakcje' | 'koszty' | 'dokumenty' | 'asystent' | 'import';

const TABS: { id: Tab; label: string; icon: string; desc: string }[] = [
  { id: 'dashboard',   label: 'Dashboard',   icon: '📊', desc: 'KPI, cash flow, wykresy' },
  { id: 'transakcje',  label: 'Transakcje',  icon: '💳', desc: 'Lista transakcji z filtrami' },
  { id: 'koszty',      label: 'Koszty',      icon: '💸', desc: 'Koszty operacyjne per kategoria' },
  { id: 'dokumenty',   label: 'Dokumenty',   icon: '📄', desc: 'Faktury, umowy, ryzyko AI' },
  { id: 'asystent',    label: 'Asystent AI', icon: '🤖', desc: 'GPT-4o + dane finansowe' },
  { id: 'import',      label: 'Import CSV',  icon: '📥', desc: 'Wgraj transakcje z pliku' },
];

export default function FinanseTabs() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  return (
    <div className="py-6">
      {/* Page header */}
      <div className="container mx-auto px-4 pb-6">
        <h1 className="text-4xl font-extrabold mb-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
          💰 Finanse Pro
        </h1>
        <p className="text-slate-400 text-sm">
          Moduł finansowy ERP · Cloudflare D1 · AI: Gemini 2.5 Flash + GPT-4o
        </p>
      </div>

      {/* Tab bar */}
      <div className="container mx-auto px-4 mb-6">
        <div className="flex gap-1 bg-slate-800/60 backdrop-blur border border-slate-700 rounded-xl p-1 w-fit">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              title={tab.desc}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab content — lazy loaded */}
      <div className="container mx-auto px-4">
        <Suspense fallback={
          <div className="flex items-center justify-center py-20 text-slate-400">
            <div className="animate-spin w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full mr-3" />
            Ładowanie modułu…
          </div>
        }>
          {activeTab === 'dashboard'  && <FinansePro />}
          {activeTab === 'transakcje' && <FinanseTransakcje />}
          {activeTab === 'koszty'     && <FinanseCosts />}
          {activeTab === 'dokumenty'  && <DokumentyFinansowe />}
          {activeTab === 'asystent'   && <FinanseAsystent />}
          {activeTab === 'import'     && <FinanseImport />}
        </Suspense>
      </div>
    </div>
  );
}
