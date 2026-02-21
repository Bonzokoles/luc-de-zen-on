import { useState } from 'react';
import { Calendar, CheckSquare, ChevronDown, ChevronUp } from 'lucide-react';

const OrganizerBox = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'business' | 'personal'>('business');

  const businessTasks = [
    { title: 'Przygotować ofertę dla klienta X', deadline: '2026-02-20', priority: 'high' },
    { title: 'Spotkanie zespołu - Q1 review', deadline: '2026-02-18', priority: 'medium' },
    { title: 'Aktualizacja dokumentacji produktu', deadline: '2026-02-25', priority: 'low' },
  ];

  const personalTasks = [
    { title: 'Kupić prezent na urodziny', deadline: '2026-02-16', priority: 'high' },
    { title: 'Umówić wizytę u dentysty', deadline: '2026-02-22', priority: 'medium' },
  ];

  const tasks = activeTab === 'business' ? businessTasks : personalTasks;

  return (
    <div className="relative z-10">
      <div
        className={`bg-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-lg overflow-hidden transition-all duration-500 ease-out ${isExpanded ? 'max-h-[600px] ring-1 ring-green-500/30' : 'max-h-[80px] hover:bg-gray-800/60'
          }`}
      >
        {/* Header - Always Visible */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-green-500/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-green-400" />
            <h2 className="text-xl font-bold text-green-300">
              Organizer / Kalendarz / Sprawy
            </h2>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-6 h-6 text-green-400" />
          ) : (
            <ChevronDown className="w-6 h-6 text-green-400" />
          )}
        </button>

        {/* Expandable Content - Expands UP (-translateY) */}
        <div
          className={`px-6 pb-6 transition-all duration-500 ease-out ${isExpanded ? 'opacity-100 -translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
        >
          {/* Tabs */}
          <div className="flex gap-2 mb-4 border-b border-green-500/30 pb-2">
            <button
              onClick={() => setActiveTab('business')}
              className={`px-4 py-2 rounded-t-lg font-semibold transition-colors ${activeTab === 'business'
                  ? 'bg-green-600 text-white'
                  : 'bg-green-900/30 text-green-300 hover:bg-green-800/40'
                }`}
            >
              Firmowe
            </button>
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-4 py-2 rounded-t-lg font-semibold transition-colors ${activeTab === 'personal'
                  ? 'bg-green-600 text-white'
                  : 'bg-green-900/30 text-green-300 hover:bg-green-800/40'
                }`}
            >
              Osobiste
            </button>
          </div>

          {/* Tasks List */}
          <div className="space-y-3 mb-4">
            {tasks.map((task, idx) => (
              <div
                key={idx}
                className="p-3 bg-green-900/30 border border-green-500/30 rounded-lg hover:border-green-400 transition-all"
              >
                <div className="flex items-start gap-3">
                  <CheckSquare className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-gray-200 font-medium">{task.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-400">{task.deadline}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold ${task.priority === 'high'
                            ? 'bg-red-500/20 text-red-300'
                            : task.priority === 'medium'
                              ? 'bg-yellow-500/20 text-yellow-300'
                              : 'bg-gray-500/20 text-gray-300'
                          }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <a
            href="/narzedzia/organizer-zadan"
            className="block w-full px-6 py-3 bg-green-600 hover:bg-green-500 text-white text-center rounded-lg font-semibold transition-colors"
          >
            Otwórz Organizer
          </a>
        </div>
      </div>
    </div>
  );
};

export default OrganizerBox;
