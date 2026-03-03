import { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// ========== INTERFACES ==========

interface Project {
  id: string;
  name: string;
  client: string;
  status: 'planning' | 'in_progress' | 'completed' | 'paused';
  startDate: Date;
  endDate?: Date;
  progress: number; // 0-100%
  budget: {
    planned: number;
    actual: number;
  };
  costs: ProjectCosts;
  revenue: number;
  description: string;
}

interface ProjectCosts {
  rent: CostItem[];          // Czynsz
  fuel: CostItem[];          // Paliwo
  employees: EmployeeCost[]; // Pracownicy
  materials: CostItem[];     // Materiały
  other: CostItem[];         // Inne
}

interface CostItem {
  id: string;
  name: string;
  amount: number;      // netto
  vat: number;         // stawka VAT (23, 8, 5, 0)
  date: Date;
  category: string;
  description?: string;
}

interface EmployeeCost {
  id: string;
  employeeName: string;
  hours: number;
  hourlyRate: number;  // netto
  grossCost: number;   // brutto (z ZUS)
  date: Date;
}

// ========== DEMO DATA ==========

// ⚠️ DANE DEMO WYZEROWANE - utwórz nowy projekt aby rozpocząć śledzenie kosztów i ROI
const demoProjects: Project[] = [];

const COLORS = {
  rent: '#3b82f6',
  fuel: '#f59e0b',
  employees: '#10b981',
  materials: '#8b5cf6',
  other: '#ec4899'
};

// ========== COMPONENT ==========

export default function Projekty() {
  const [activeView, setActiveView] = useState<'list' | 'add' | 'details'>('list');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem('erp-projekty');
    if (saved) {
      setProjects(JSON.parse(saved));
    } else {
      setProjects(demoProjects);
    }
  }, []);

  // Save data
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('erp-projekty', JSON.stringify(projects));
    }
  }, [projects]);

  // Calculations
  const calculateTotalCosts = (costs: ProjectCosts): number => {
    const rentTotal = costs.rent.reduce((sum, item) => sum + (item.amount * (1 + item.vat / 100)), 0);
    const fuelTotal = costs.fuel.reduce((sum, item) => sum + (item.amount * (1 + item.vat / 100)), 0);
    const employeesTotal = costs.employees.reduce((sum, emp) => sum + emp.grossCost, 0);
    const materialsTotal = costs.materials.reduce((sum, item) => sum + (item.amount * (1 + item.vat / 100)), 0);
    const otherTotal = costs.other.reduce((sum, item) => sum + (item.amount * (1 + item.vat / 100)), 0);

    return rentTotal + fuelTotal + employeesTotal + materialsTotal + otherTotal;
  };

  const calculateROI = (project: Project): number => {
    const totalCosts = calculateTotalCosts(project.costs);
    const profit = project.revenue - totalCosts;
    return totalCosts > 0 ? (profit / totalCosts) * 100 : 0;
  };

  const calculateProfit = (project: Project): number => {
    return project.revenue - calculateTotalCosts(project.costs);
  };

  // Filter projects
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'in_progress').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const totalRevenue = projects.reduce((sum, p) => sum + p.revenue, 0);
  const totalCosts = projects.reduce((sum, p) => sum + calculateTotalCosts(p.costs), 0);
  const totalProfit = totalRevenue - totalCosts;

  // Charts data
  const projectsStatusData = [
    { name: 'Planowanie', value: projects.filter(p => p.status === 'planning').length, color: '#94a3b8' },
    { name: 'W trakcie', value: projects.filter(p => p.status === 'in_progress').length, color: '#3b82f6' },
    { name: 'Zakończone', value: projects.filter(p => p.status === 'completed').length, color: '#10b981' },
    { name: 'Wstrzymane', value: projects.filter(p => p.status === 'paused').length, color: '#f59e0b' }
  ];

  const profitByProjectData = projects.map(p => ({
    name: p.name.substring(0, 20),
    zysk: calculateProfit(p),
    roi: calculateROI(p)
  }));

  const getStatusLabel = (status: string) => {
    const labels = {
      planning: 'Planowanie',
      in_progress: 'W trakcie',
      completed: 'Zakończone',
      paused: 'Wstrzymany'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      planning: 'bg-slate-600',
      in_progress: 'bg-blue-600',
      completed: 'bg-emerald-600',
      paused: 'bg-orange-600'
    };
    return colors[status as keyof typeof colors] || 'bg-slate-600';
  };

  // ========== RENDER ==========

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            💼 Projekty
          </h1>
          <p className="text-slate-400">Zarządzanie projektami, kosztami i ROI</p>
        </div>

        {/* Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'list', label: '📋 Lista projektów' },
            { id: 'add', label: '➕ Nowy projekt' }
          ].map(view => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${activeView === view.id
                  ? 'bg-cyan-600 text-white shadow-lg'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700'
                }`}
            >
              {view.label}
            </button>
          ))}
        </div>

        {/* List View */}
        {activeView === 'list' && (
          <div className="space-y-6">

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
                <div className="text-3xl font-bold text-cyan-400">{totalProjects}</div>
                <div className="text-sm text-slate-400 mt-1">Wszystkie projekty</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
                <div className="text-3xl font-bold text-blue-400">{activeProjects}</div>
                <div className="text-sm text-slate-400 mt-1">Aktywne</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
                <div className="text-3xl font-bold text-emerald-400">{completedProjects}</div>
                <div className="text-sm text-slate-400 mt-1">Zakończone</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
                <div className="text-3xl font-bold text-green-400">{totalRevenue.toLocaleString('pl-PL')} zł</div>
                <div className="text-sm text-slate-400 mt-1">Przychody</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
                <div className={`text-3xl font-bold ${totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {totalProfit.toLocaleString('pl-PL')} zł
                </div>
                <div className="text-sm text-slate-400 mt-1">Zysk</div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Status Pie */}
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Status projektów</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={projectsStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {projectsStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Profit Bar */}
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Zysk wg projektów</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={profitByProjectData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" angle={-15} textAnchor="end" height={80} />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                      labelStyle={{ color: '#f1f5f9' }}
                    />
                    <Bar dataKey="zysk" fill="#10b981" name="Zysk (zł)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="🔍 Szukaj projektu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">Wszystkie statusy</option>
                <option value="planning">Planowanie</option>
                <option value="in_progress">W trakcie</option>
                <option value="completed">Zakończone</option>
                <option value="paused">Wstrzymane</option>
              </select>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => {
                const totalCosts = calculateTotalCosts(project.costs);
                const profit = calculateProfit(project);
                const roi = calculateROI(project);

                return (
                  <div
                    key={project.id}
                    onClick={() => {
                      setSelectedProject(project);
                      setActiveView('details');
                    }}
                    className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all cursor-pointer group"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1 group-hover:text-cyan-400 transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-sm text-slate-400">{project.client}</p>
                      </div>
                      <span className={`px-3 py-1 ${getStatusColor(project.status)} text-white text-xs font-bold rounded-full`}>
                        {getStatusLabel(project.status)}
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">Postęp</span>
                        <span className="text-sm font-bold text-cyan-400">{project.progress}%</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Financials */}
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Budżet:</span>
                        <span className="font-mono">{project.budget.planned.toLocaleString('pl-PL')} zł</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Koszty:</span>
                        <span className="font-mono text-orange-400">{totalCosts.toLocaleString('pl-PL')} zł</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Przychód:</span>
                        <span className="font-mono text-emerald-400">{project.revenue.toLocaleString('pl-PL')} zł</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-slate-700">
                        <span className="text-slate-400 font-bold">Zysk:</span>
                        <span className={`font-mono font-bold ${profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {profit.toLocaleString('pl-PL')} zł
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-bold">ROI:</span>
                        <span className={`font-mono font-bold ${roi >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {roi.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="text-xs text-slate-500">
                      Start: {new Date(project.startDate).toLocaleDateString('pl-PL')}
                      {project.endDate && ` • Koniec: ${new Date(project.endDate).toLocaleDateString('pl-PL')}`}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* Details View */}
        {activeView === 'details' && selectedProject && (
          <div className="space-y-6">

            <button
              onClick={() => setActiveView('list')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg"
            >
              ← Powrót do listy
            </button>

            {/* Project Header */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{selectedProject.name}</h2>
                  <p className="text-slate-400 mb-1">Klient: {selectedProject.client}</p>
                  <p className="text-slate-500 text-sm">{selectedProject.description}</p>
                </div>
                <span className={`px-4 py-2 ${getStatusColor(selectedProject.status)} text-white font-bold rounded-lg`}>
                  {getStatusLabel(selectedProject.status)}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Postęp projektu</span>
                  <span className="text-sm font-bold text-cyan-400">{selectedProject.progress}%</span>
                </div>
                <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    style={{ width: `${selectedProject.progress}%` }}
                  />
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-slate-400 mb-1">Budżet planowany</div>
                  <div className="text-2xl font-bold">{selectedProject.budget.planned.toLocaleString('pl-PL')} zł</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400 mb-1">Koszty rzeczywiste</div>
                  <div className="text-2xl font-bold text-orange-400">
                    {calculateTotalCosts(selectedProject.costs).toLocaleString('pl-PL')} zł
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-400 mb-1">Zysk</div>
                  <div className={`text-2xl font-bold ${calculateProfit(selectedProject) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {calculateProfit(selectedProject).toLocaleString('pl-PL')} zł
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-400 mb-1">ROI</div>
                  <div className={`text-2xl font-bold ${calculateROI(selectedProject) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {calculateROI(selectedProject).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Costs Breakdown */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-6">Podział kosztów</h3>

              {/* Czynsz */}
              {selectedProject.costs.rent.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <span className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.rent }}></span>
                    🏢 Czynsz
                  </h4>
                  <div className="space-y-2">
                    {selectedProject.costs.rent.map(item => (
                      <div key={item.id} className="flex justify-between items-center bg-slate-900/50 rounded-lg p-3">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-slate-400">
                            {new Date(item.date).toLocaleDateString('pl-PL')} • VAT {item.vat}%
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono">{(item.amount * (1 + item.vat / 100)).toFixed(2)} zł</div>
                          <div className="text-xs text-slate-400">netto: {item.amount.toFixed(2)} zł</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Paliwo */}
              {selectedProject.costs.fuel.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <span className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.fuel }}></span>
                    ⛽ Paliwo
                  </h4>
                  <div className="space-y-2">
                    {selectedProject.costs.fuel.map(item => (
                      <div key={item.id} className="flex justify-between items-center bg-slate-900/50 rounded-lg p-3">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-slate-400">
                            {new Date(item.date).toLocaleDateString('pl-PL')} • VAT {item.vat}%
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono">{(item.amount * (1 + item.vat / 100)).toFixed(2)} zł</div>
                          <div className="text-xs text-slate-400">netto: {item.amount.toFixed(2)} zł</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pracownicy */}
              {selectedProject.costs.employees.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <span className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.employees }}></span>
                    👥 Pracownicy
                  </h4>
                  <div className="space-y-2">
                    {selectedProject.costs.employees.map(emp => (
                      <div key={emp.id} className="flex justify-between items-center bg-slate-900/50 rounded-lg p-3">
                        <div>
                          <div className="font-medium">{emp.employeeName}</div>
                          <div className="text-xs text-slate-400">
                            {emp.hours}h × {emp.hourlyRate} zł/h (netto)
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold">{emp.grossCost.toFixed(2)} zł</div>
                          <div className="text-xs text-slate-400">brutto (z ZUS)</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Materiały */}
              {selectedProject.costs.materials.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <span className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.materials }}></span>
                    📦 Materiały i usługi
                  </h4>
                  <div className="space-y-2">
                    {selectedProject.costs.materials.map(item => (
                      <div key={item.id} className="flex justify-between items-center bg-slate-900/50 rounded-lg p-3">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-slate-400">
                            {new Date(item.date).toLocaleDateString('pl-PL')} • VAT {item.vat}%
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono">{(item.amount * (1 + item.vat / 100)).toFixed(2)} zł</div>
                          <div className="text-xs text-slate-400">netto: {item.amount.toFixed(2)} zł</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inne */}
              {selectedProject.costs.other.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <span className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.other }}></span>
                    📋 Inne koszty
                  </h4>
                  <div className="space-y-2">
                    {selectedProject.costs.other.map(item => (
                      <div key={item.id} className="flex justify-between items-center bg-slate-900/50 rounded-lg p-3">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-slate-400">
                            {new Date(item.date).toLocaleDateString('pl-PL')} • VAT {item.vat}%
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono">{(item.amount * (1 + item.vat / 100)).toFixed(2)} zł</div>
                          <div className="text-xs text-slate-400">netto: {item.amount.toFixed(2)} zł</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* Add View - Placeholder */}
        {activeView === 'add' && (
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">➕ Nowy projekt</h2>
            <p className="text-slate-400">Formularz dodawania projektu - w przygotowaniu</p>
          </div>
        )}

      </div>
    </div>
  );
}
