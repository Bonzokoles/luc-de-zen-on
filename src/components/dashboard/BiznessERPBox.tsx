import { useState } from 'react';
import { Building, FileText, DollarSign, Package, ChevronDown, ChevronUp } from 'lucide-react';

const BiznessERPBox = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const tiles = [
    { icon: FileText, label: 'Kreator dokumentów', href: '/narzedzia/kreator-dokumentow', color: 'cyan' },
    { icon: DollarSign, label: 'Faktury VAT', href: '/narzedzia/generator-faktur', color: 'emerald' },
    { icon: Package, label: 'Magazyn', href: '/magazyn', color: 'blue' },
    { icon: FileText, label: 'Treści', href: '/narzedzia/generator-tresci', color: 'purple' },
  ];

  const buttons = [
    { label: 'Biuro', href: '/ai-biznes-erp' },
    { label: 'Magazyn', href: '/magazyn' },
    { label: 'Finanse', href: '/finanse' },
  ];

  return (
    <div className="relative z-30">
      <div
        className={`bg-gradient-to-br from-emerald-900/50 to-teal-900/50 border-2 border-emerald-500/30 rounded-lg overflow-hidden transition-all duration-500 ease-out ${
          isExpanded ? 'max-h-[600px]' : 'max-h-[80px]'
        }`}
      >
        {/* Header - Always Visible */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-emerald-500/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Building className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-bold text-emerald-300">
              ZENON_Biznes / Magazyn / Finanse
            </h2>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-6 h-6 text-emerald-400" />
          ) : (
            <ChevronDown className="w-6 h-6 text-emerald-400" />
          )}
        </button>

        {/* Expandable Content - Expands DOWN */}
        <div
          className={`px-6 pb-6 transition-all duration-500 ease-out ${
            isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          {/* Tiles Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {tiles.map((tile, idx) => (
              <a
                key={idx}
                href={tile.href}
                className={`p-4 bg-${tile.color}-900/30 border border-${tile.color}-500/30 rounded-lg hover:border-${tile.color}-400 hover:scale-105 transition-all flex flex-col items-center gap-2 text-center`}
              >
                <tile.icon className={`w-8 h-8 text-${tile.color}-400`} />
                <span className="text-sm text-gray-300">{tile.label}</span>
              </a>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {buttons.map((btn, idx) => (
              <a
                key={idx}
                href={btn.href}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-colors"
              >
                {btn.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiznessERPBox;
