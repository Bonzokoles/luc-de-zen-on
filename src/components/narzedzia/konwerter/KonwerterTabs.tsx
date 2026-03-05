/**
 * KonwerterTabs — główny kontener z dwoma zakładkami:
 *   1. Konwerter Plików (Excel/PDF/XML/MD/JSON) — istniejący Konwerter.tsx
 *   2. Konwerter Feedów (XML/JSON/YAML/CSV/HTML/JSONL) — z CAY_FEED_conventer
 * 
 * Używa React.lazy() dla code-splitting (chunk Konwertera był 958kB).
 */

import { useState, Suspense, lazy } from 'react';

const KonwerterPlikow = lazy(() => import('./Konwerter'));
const KonwerterFeedow = lazy(() => import('./KonwerterFeedow'));

type TabId = 'pliki' | 'feedy';

interface Tab {
  id: TabId;
  label: string;
  icon: string;
  description: string;
}

const TABS: Tab[] = [
  {
    id: 'pliki',
    label: 'Konwerter Plików',
    icon: '📊',
    description: 'Excel ↔ PDF, XML ↔ JSON, Markdown → PDF, JSON → Excel',
  },
  {
    id: 'feedy',
    label: 'Konwerter Feedów',
    icon: '🔄',
    description: 'XML ↔ JSON ↔ YAML ↔ CSV ↔ HTML ↔ Markdown ↔ JSONL — z URL lub pliku',
  },
];

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center space-y-3">
        <div className="animate-spin inline-block w-8 h-8 border-3 border-purple-400/30 border-t-purple-400 rounded-full" />
        <p className="text-slate-400 text-sm">Ładowanie konwertera...</p>
      </div>
    </div>
  );
}

export default function KonwerterTabs() {
  const [activeTab, setActiveTab] = useState<TabId>('feedy');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🔄 Konwerter Formatów
          </h1>
          <p className="text-slate-400">
            Konwertuj między formatami danych: Excel, PDF, XML, JSON, YAML, CSV, Markdown, JSONL
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-3 mb-8">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 p-5 rounded-xl font-medium transition-all text-left border-2 ${
                activeTab === tab.id
                  ? 'bg-purple-600/20 border-purple-400 shadow-lg shadow-purple-500/20'
                  : 'bg-slate-800/50 border-slate-700 hover:border-purple-500/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-1">
                <span className="text-2xl">{tab.icon}</span>
                <span className="font-bold text-lg">{tab.label}</span>
              </div>
              <p className="text-xs text-slate-400">{tab.description}</p>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <Suspense fallback={<LoadingFallback />}>
          {activeTab === 'pliki' && <KonwerterPlikow />}
          {activeTab === 'feedy' && <KonwerterFeedow />}
        </Suspense>

      </div>
    </div>
  );
}
