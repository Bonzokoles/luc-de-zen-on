import { useState } from 'react';
import { Building, FileText, DollarSign, Package, ChevronDown, ChevronUp } from 'lucide-react';

const BiznessERPBox = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const tiles = [
    {
      icon: FileText,
      label: 'Kreator dokumentów',
      href: '/narzedzia/kreator-dokumentow',
      bgClass: 'bg-cyan-900/30',
      borderClass: 'border-cyan-500/30 hover:border-cyan-400',
      iconClass: 'text-cyan-400'
    },
    {
      icon: DollarSign,
      label: 'Faktury VAT',
      href: '/narzedzia/generator-faktur',
      bgClass: 'bg-emerald-900/30',
      borderClass: 'border-emerald-500/30 hover:border-emerald-400',
      iconClass: 'text-emerald-400'
    },
    {
      icon: Package,
      label: 'Magazyn',
      href: '/magazyn',
      bgClass: 'bg-blue-900/30',
      borderClass: 'border-blue-500/30 hover:border-blue-400',
      iconClass: 'text-blue-400'
    },
    {
      icon: FileText,
      label: 'Treści',
      href: '/narzedzia/generator-tresci',
      bgClass: 'bg-purple-900/30',
      borderClass: 'border-purple-500/30 hover:border-purple-400',
      iconClass: 'text-purple-400'
    },
  ];

  const buttons = [
    { label: 'Biuro', href: '/ai-biznes-erp' },
    { label: 'Magazyn', href: '/magazyn' },
    { label: 'Finanse', href: '/finanse' },
  ];

  return (
    <div className="relative z-30">
      <div
        className={`bg-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-lg overflow-hidden transition-all duration-500 ease-out ${isExpanded ? 'max-h-[600px] ring-1 ring-emerald-500/30' : 'max-h-[80px] hover:bg-gray-800/60'
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
          className={`px-6 pb-6 transition-all duration-500 ease-out ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
            }`}
        >
          {/* Tiles Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {tiles.map((tile, idx) => (
              <a
                key={idx}
                href={tile.href}
                className={`p-4 ${tile.bgClass} border ${tile.borderClass} rounded-lg hover:scale-105 transition-all flex flex-col items-center gap-2 text-center`}
              >
                <tile.icon className={`w-8 h-8 ${tile.iconClass}`} />
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
