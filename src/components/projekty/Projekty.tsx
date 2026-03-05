import { useState, useEffect, useRef } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// ========== INTERFACES ==========

type ProjectStatus = 'planowanie' | 'w_toku' | 'testy' | 'zakonczone' | 'zamrozone';
type ProjectPriority = 'niski' | 'normalny' | 'wysoki' | 'pilny';
type TaskStatus = 'do_zrobienia' | 'w_toku' | 'do_przegladu' | 'zrobione';

interface Project {
  id: string;
  name: string;
  client: string;
  klientId?: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: string;
  endDate?: string;
  progress: number;
  budget: { planned: number; actual: number; };
  costs: ProjectCosts;
  revenue: number;
  description: string;
  team: string[];
}

interface Task {
  id: string;
  projectId: string;
  name: string;
  description: string;
  status: TaskStatus;
  priority: number; // 1-5
  assignedTo: string;
  plannedHours: number;
  actualHours: number;
  deadline?: string;
  createdAt: string;
}

interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  minutes?: number;
  description: string;
}

interface ProjectCosts {
  rent: CostItem[];
  fuel: CostItem[];
  employees: EmployeeCost[];
  materials: CostItem[];
  other: CostItem[];
}

interface CostItem {
  id: string;
  name: string;
  amount: number;
  vat: number;
  date: string;
  category: string;
  description?: string;
}

interface EmployeeCost {
  id: string;
  employeeName: string;
  hours: number;
  hourlyRate: number;
  grossCost: number;
  date: string;
}

// ========== DEMO DATA ==========

const demoProjects: Project[] = [];

const COLORS = {
  rent: '#3b82f6',
  fuel: '#f59e0b',
  employees: '#10b981',
  materials: '#8b5cf6',
  other: '#ec4899'
};

const STATUS_LABELS: Record<ProjectStatus, string> = {
  planowanie: 'Planowanie',
  w_toku: 'W toku',
  testy: 'Testy',
  zakonczone: 'Zakończone',
  zamrozone: 'Zamrożone'
};

const STATUS_COLORS: Record<ProjectStatus, string> = {
  planowanie: 'bg-slate-600',
  w_toku: 'bg-blue-600',
  testy: 'bg-yellow-600',
  zakonczone: 'bg-emerald-600',
  zamrozone: 'bg-cyan-800'
};

const PRIORITY_LABELS: Record<ProjectPriority, string> = {
  niski: 'Niski',
  normalny: 'Normalny',
  wysoki: 'Wysoki',
  pilny: 'Pilny'
};

const PRIORITY_COLORS: Record<ProjectPriority, string> = {
  niski: 'text-slate-400',
  normalny: 'text-blue-400',
  wysoki: 'text-orange-400',
  pilny: 'text-red-400'
};

const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  do_zrobienia: 'Do zrobienia',
  w_toku: 'W toku',
  do_przegladu: 'Do przeglądu',
  zrobione: 'Zrobione'
};

const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  do_zrobienia: 'border-slate-500',
  w_toku: 'border-blue-500',
  do_przegladu: 'border-yellow-500',
  zrobione: 'border-emerald-500'
};

// ========== COMPONENT ==========

export default function Projekty() {
  const [activeView, setActiveView] = useState<'list' | 'add' | 'details' | 'kanban'>('list');
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Task management
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskForm, setTaskForm] = useState({ name: '', description: '', priority: 3, assignedTo: '', plannedHours: 0, deadline: '' });

  // Timer
  const [activeTimer, setActiveTimer] = useState<TimeEntry | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Add project form
  const [projForm, setProjForm] = useState({
    name: '', client: '', description: '', status: 'planowanie' as ProjectStatus,
    priority: 'normalny' as ProjectPriority, startDate: '', endDate: '', budgetPlanned: 0,
    revenue: 0, team: '', klientId: ''
  });

  // AI agent
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem('erp-projekty-v2');
    if (saved) { setProjects(JSON.parse(saved)); }
    const savedTasks = localStorage.getItem('erp-projekty-tasks');
    if (savedTasks) { setTasks(JSON.parse(savedTasks)); }
    const savedTime = localStorage.getItem('erp-projekty-time');
    if (savedTime) { setTimeEntries(JSON.parse(savedTime)); }
    const savedTimer = localStorage.getItem('erp-projekty-timer');
    if (savedTimer) { setActiveTimer(JSON.parse(savedTimer)); }
  }, []);

  // Save data
  useEffect(() => { localStorage.setItem('erp-projekty-v2', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('erp-projekty-tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('erp-projekty-time', JSON.stringify(timeEntries)); }, [timeEntries]);

  // Timer tick
  useEffect(() => {
    if (activeTimer && !activeTimer.endTime) {
      const start = new Date(activeTimer.startTime).getTime();
      timerRef.current = setInterval(() => {
        setTimerSeconds(Math.floor((Date.now() - start) / 1000));
      }, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    } else {
      setTimerSeconds(0);
    }
  }, [activeTimer]);

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
    const tc = calculateTotalCosts(project.costs);
    return tc > 0 ? ((project.revenue - tc) / tc) * 100 : 0;
  };
  const calculateProfit = (project: Project): number => project.revenue - calculateTotalCosts(project.costs);

  // Filter projects
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'w_toku').length;
  const completedProjects = projects.filter(p => p.status === 'zakonczone').length;
  const openTasks = tasks.filter(t => t.status !== 'zrobione').length;
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const weekAgo = new Date(Date.now() - weekMs).toISOString();
  const weekTimeMin = timeEntries
    .filter(te => te.endTime && te.startTime >= weekAgo)
    .reduce((s, te) => s + (te.minutes || 0), 0);
  const totalBudgetPlanned = projects.reduce((s, p) => s + p.budget.planned, 0);
  const totalSpent = projects.reduce((s, p) => s + calculateTotalCosts(p.costs), 0);
  const budgetPct = totalBudgetPlanned > 0 ? Math.round((totalSpent / totalBudgetPlanned) * 100) : 0;
  const totalRevenue = projects.reduce((sum, p) => sum + p.revenue, 0);
  const totalProfit = totalRevenue - totalSpent;

  // Charts data
  const projectsStatusData = [
    { name: 'Planowanie', value: projects.filter(p => p.status === 'planowanie').length, color: '#94a3b8' },
    { name: 'W toku', value: projects.filter(p => p.status === 'w_toku').length, color: '#3b82f6' },
    { name: 'Testy', value: projects.filter(p => p.status === 'testy').length, color: '#eab308' },
    { name: 'Zakończone', value: projects.filter(p => p.status === 'zakonczone').length, color: '#10b981' },
    { name: 'Zamrożone', value: projects.filter(p => p.status === 'zamrozone').length, color: '#06b6d4' }
  ];
  const profitByProjectData = projects.map(p => ({
    name: p.name.substring(0, 20),
    zysk: calculateProfit(p),
    roi: calculateROI(p)
  }));

  // Task CRUD
  const addTask = () => {
    if (!selectedProject || !taskForm.name.trim()) return;
    const newTask: Task = {
      id: `zad_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      projectId: selectedProject.id,
      name: taskForm.name,
      description: taskForm.description,
      status: 'do_zrobienia',
      priority: taskForm.priority,
      assignedTo: taskForm.assignedTo,
      plannedHours: taskForm.plannedHours,
      actualHours: 0,
      deadline: taskForm.deadline || undefined,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
    setTaskForm({ name: '', description: '', priority: 3, assignedTo: '', plannedHours: 0, deadline: '' });
    setShowTaskModal(false);
  };

  const updateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setTimeEntries(prev => prev.filter(te => te.taskId !== taskId));
  };

  // Timer
  const startTimer = (taskId: string) => {
    if (activeTimer && !activeTimer.endTime) return;
    const entry: TimeEntry = {
      id: `tt_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      taskId,
      userId: 'user_1',
      startTime: new Date().toISOString(),
      description: ''
    };
    setActiveTimer(entry);
    localStorage.setItem('erp-projekty-timer', JSON.stringify(entry));
  };

  const stopTimer = (description: string = '') => {
    if (!activeTimer) return;
    const now = new Date();
    const start = new Date(activeTimer.startTime);
    const minutes = Math.round((now.getTime() - start.getTime()) / 60000);
    const completed: TimeEntry = { ...activeTimer, endTime: now.toISOString(), minutes, description };
    setTimeEntries(prev => [...prev, completed]);
    // Update task actual hours
    setTasks(prev => prev.map(t =>
      t.id === activeTimer.taskId ? { ...t, actualHours: t.actualHours + Math.round(minutes / 60 * 10) / 10 } : t
    ));
    setActiveTimer(null);
    localStorage.removeItem('erp-projekty-timer');
  };

  const formatTimer = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Add project
  const addProject = () => {
    if (!projForm.name.trim()) return;
    const newProj: Project = {
      id: `proj_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      name: projForm.name,
      client: projForm.client,
      klientId: projForm.klientId || undefined,
      status: projForm.status,
      priority: projForm.priority,
      startDate: projForm.startDate || new Date().toISOString().slice(0, 10),
      endDate: projForm.endDate || undefined,
      progress: 0,
      budget: { planned: projForm.budgetPlanned, actual: 0 },
      costs: { rent: [], fuel: [], employees: [], materials: [], other: [] },
      revenue: projForm.revenue,
      description: projForm.description,
      team: projForm.team ? projForm.team.split(',').map(s => s.trim()) : []
    };
    setProjects(prev => [...prev, newProj]);
    setProjForm({ name: '', client: '', description: '', status: 'planowanie', priority: 'normalny', startDate: '', endDate: '', budgetPlanned: 0, revenue: 0, team: '', klientId: '' });
    setActiveView('list');
  };

  // AI Agent the_ANT_05
  const handleAIReport = async () => {
    setAiLoading(true);
    setAiReport(null);
    try {
      // Local AI analysis (no backend needed)
      const projectTasks = selectedProject ? tasks.filter(t => t.projectId === selectedProject.id) : tasks;
      const projectTime = selectedProject
        ? timeEntries.filter(te => projectTasks.some(t => t.id === te.taskId))
        : timeEntries;

      const totalTaskCount = projectTasks.length;
      const doneCount = projectTasks.filter(t => t.status === 'zrobione').length;
      const inProgressCount = projectTasks.filter(t => t.status === 'w_toku').length;
      const totalMinutes = projectTime.reduce((s, te) => s + (te.minutes || 0), 0);
      const totalHours = Math.round(totalMinutes / 60 * 10) / 10;
      const overdueTasks = projectTasks.filter(t => t.deadline && t.status !== 'zrobione' && new Date(t.deadline) < new Date());
      const highPriorityOpen = projectTasks.filter(t => t.priority >= 4 && t.status !== 'zrobione');

      let report = `## Raport AI (the_ANT_05)\n\n`;
      report += `**Zadania:** ${totalTaskCount} total, ${doneCount} ukończone, ${inProgressCount} w toku\n`;
      report += `**Czas pracy:** ${totalHours}h zarejestrowane\n`;
      report += `**Velocity:** ${doneCount > 0 ? Math.round(totalMinutes / doneCount) : 0} min/zadanie\n\n`;

      if (overdueTasks.length > 0) {
        report += `### ⚠️ Przeterminowane (${overdueTasks.length}):\n`;
        overdueTasks.forEach(t => { report += `- **${t.name}** (priorytet: ${t.priority}/5)\n`; });
        report += '\n';
      }
      if (highPriorityOpen.length > 0) {
        report += `### 🔴 Pilne otwarte (priorytet 4-5):\n`;
        highPriorityOpen.forEach(t => { report += `- ${t.name} [${TASK_STATUS_LABELS[t.status]}]\n`; });
        report += '\n';
      }
      report += `### Rekomendacje:\n`;
      if (totalTaskCount === 0) report += `- Dodaj zadania do projektu\n`;
      if (inProgressCount > 3) report += `- Za dużo zadań w toku (${inProgressCount}) — ogranicz WIP\n`;
      if (overdueTasks.length > 0) report += `- Przepriorytetyzuj przeterminowane zadania\n`;
      if (totalHours === 0) report += `- Rozpocznij śledzenie czasu dla lepszej analizy\n`;
      if (doneCount > 0 && totalTaskCount > 0) {
        const pct = Math.round((doneCount / totalTaskCount) * 100);
        report += `- Postęp: ${pct}% zadań ukończonych\n`;
      }

      setAiReport(report);
    } catch {
      setAiReport('Błąd generowania raportu AI.');
    } finally {
      setAiLoading(false);
    }
  };

  // Project tasks for selected project
  const projectTasks = selectedProject ? tasks.filter(t => t.projectId === selectedProject.id) : [];
  const projectTimeEntries = timeEntries.filter(te => projectTasks.some(t => t.id === te.taskId));

  // ========== RENDER ==========

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Projekty i czas pracy
            </h1>
            <p className="text-slate-400">Zarządzanie projektami, zadaniami, time tracking i ROI</p>
          </div>
          <button
            onClick={handleAIReport}
            disabled={aiLoading}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold rounded-lg flex items-center gap-2"
          >
            {aiLoading ? '...' : '🤖'} the_ANT_05
          </button>
        </div>

        {/* Active Timer Banner */}
        {activeTimer && !activeTimer.endTime && (
          <div className="mb-4 bg-green-900/30 border border-green-500/50 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-400 font-bold">Timer aktywny:</span>
              <span className="text-white font-mono text-xl">{formatTimer(timerSeconds)}</span>
              <span className="text-slate-400 text-sm">
                (Zadanie: {tasks.find(t => t.id === activeTimer.taskId)?.name || '—'})
              </span>
            </div>
            <button onClick={() => stopTimer()} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold">
              Stop
            </button>
          </div>
        )}

        {/* AI Report */}
        {aiReport && (
          <div className="mb-6 bg-purple-900/20 border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-purple-400">Raport AI (the_ANT_05)</h3>
              <button onClick={() => setAiReport(null)} className="text-slate-400 hover:text-white">&times;</button>
            </div>
            <div className="text-sm text-slate-300 whitespace-pre-line">{aiReport}</div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {([
            { id: 'list', label: 'Lista projektow' },
            { id: 'add', label: '+ Nowy projekt' },
            { id: 'kanban', label: 'Kanban' }
          ] as { id: typeof activeView; label: string }[]).map(view => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${activeView === view.id
                  ? 'bg-cyan-600 text-white shadow-lg'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700'}`}
            >
              {view.label}
            </button>
          ))}
        </div>

        {/* ==================== LIST VIEW ==================== */}
        {activeView === 'list' && (
          <div className="space-y-6">

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4">
                <div className="text-2xl font-bold text-cyan-400">{activeProjects}</div>
                <div className="text-xs text-slate-400 mt-1">Aktywne projekty</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4">
                <div className="text-2xl font-bold text-orange-400">{openTasks}</div>
                <div className="text-xs text-slate-400 mt-1">Otwarte zadania</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-400">{Math.round(weekTimeMin / 60 * 10) / 10}h</div>
                <div className="text-xs text-slate-400 mt-1">Czas tyg.</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4">
                <div className={`text-2xl font-bold ${budgetPct > 100 ? 'text-red-400' : 'text-emerald-400'}`}>{budgetPct}%</div>
                <div className="text-xs text-slate-400 mt-1">Budzet wyk.</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4">
                <div className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {totalProfit.toLocaleString('pl-PL')} zl
                </div>
                <div className="text-xs text-slate-400 mt-1">Zysk</div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Status projektow</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={projectsStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {projectsStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Zysk wg projektow</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={profitByProjectData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" angle={-15} textAnchor="end" height={80} />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} labelStyle={{ color: '#f1f5f9' }} />
                    <Bar dataKey="zysk" fill="#10b981" name="Zysk (zl)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <input type="text" placeholder="Szukaj projektu..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">Wszystkie statusy</option>
                {(Object.keys(STATUS_LABELS) as ProjectStatus[]).map(s => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => {
                const totalCosts = calculateTotalCosts(project.costs);
                const profit = calculateProfit(project);
                const roi = calculateROI(project);
                const projTasks = tasks.filter(t => t.projectId === project.id);
                const projOpenTasks = projTasks.filter(t => t.status !== 'zrobione').length;

                return (
                  <div key={project.id} onClick={() => { setSelectedProject(project); setActiveView('details'); }}
                    className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1 group-hover:text-cyan-400 transition-colors">{project.name}</h3>
                        <p className="text-sm text-slate-400">{project.client}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`px-3 py-1 ${STATUS_COLORS[project.status]} text-white text-xs font-bold rounded-full`}>
                          {STATUS_LABELS[project.status]}
                        </span>
                        <span className={`text-xs font-bold ${PRIORITY_COLORS[project.priority]}`}>
                          {PRIORITY_LABELS[project.priority]}
                        </span>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-400">Postep</span>
                        <span className="text-xs font-bold text-cyan-400">{project.progress}%</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all" style={{ width: `${project.progress}%` }} />
                      </div>
                    </div>

                    {/* Quick stats */}
                    <div className="space-y-1 text-sm mb-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Budzet:</span>
                        <span className="font-mono">{project.budget.planned.toLocaleString('pl-PL')} zl</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Zysk:</span>
                        <span className={`font-mono font-bold ${profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {profit.toLocaleString('pl-PL')} zl
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Zadania:</span>
                        <span className="font-mono">{projOpenTasks} otwarte / {projTasks.length}</span>
                      </div>
                    </div>

                    {/* Team */}
                    {project.team && project.team.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {project.team.map((m, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-700 text-xs rounded-full text-slate-300">{m}</span>
                        ))}
                      </div>
                    )}

                    <div className="text-xs text-slate-500">
                      Start: {project.startDate ? new Date(project.startDate).toLocaleDateString('pl-PL') : '—'}
                      {project.endDate && ` | Koniec: ${new Date(project.endDate).toLocaleDateString('pl-PL')}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== KANBAN VIEW ==================== */}
        {activeView === 'kanban' && (
          <div className="space-y-6">
            {/* Project selector */}
            <div className="flex items-center gap-4">
              <select
                value={selectedProject?.id || ''}
                onChange={(e) => setSelectedProject(projects.find(p => p.id === e.target.value) || null)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">-- Wybierz projekt --</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              {selectedProject && (
                <button onClick={() => setShowTaskModal(true)}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium">
                  + Zadanie
                </button>
              )}
            </div>

            {selectedProject ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {(['do_zrobienia', 'w_toku', 'do_przegladu', 'zrobione'] as TaskStatus[]).map(status => {
                  const colTasks = projectTasks.filter(t => t.status === status);
                  return (
                    <div key={status} className={`bg-slate-900/50 border-t-4 ${TASK_STATUS_COLORS[status]} rounded-xl p-4`}>
                      <h3 className="font-bold mb-3 text-sm flex items-center justify-between">
                        {TASK_STATUS_LABELS[status]}
                        <span className="bg-slate-700 px-2 py-0.5 rounded-full text-xs">{colTasks.length}</span>
                      </h3>
                      <div className="space-y-3">
                        {colTasks.map(task => (
                          <div key={task.id} className="bg-slate-800 border border-slate-700 rounded-lg p-3 hover:border-cyan-500/50 transition-all">
                            <div className="flex items-start justify-between mb-2">
                              <span className="font-medium text-sm">{task.name}</span>
                              <span className={`text-xs font-bold ${task.priority >= 4 ? 'text-red-400' : task.priority >= 3 ? 'text-orange-400' : 'text-slate-400'}`}>
                                P{task.priority}
                              </span>
                            </div>
                            {task.assignedTo && <div className="text-xs text-slate-400 mb-2">{task.assignedTo}</div>}
                            {task.deadline && (
                              <div className={`text-xs mb-2 ${new Date(task.deadline) < new Date() && task.status !== 'zrobione' ? 'text-red-400' : 'text-slate-500'}`}>
                                Termin: {new Date(task.deadline).toLocaleDateString('pl-PL')}
                              </div>
                            )}
                            <div className="text-xs text-slate-500 mb-2">
                              {task.actualHours}h / {task.plannedHours}h
                            </div>
                            <div className="flex gap-1 flex-wrap">
                              {status !== 'do_zrobienia' && (
                                <button onClick={() => updateTaskStatus(task.id, status === 'w_toku' ? 'do_zrobienia' : status === 'do_przegladu' ? 'w_toku' : 'do_przegladu')}
                                  className="px-2 py-0.5 bg-slate-700 hover:bg-slate-600 text-xs rounded">
                                  ←
                                </button>
                              )}
                              {status !== 'zrobione' && (
                                <button onClick={() => updateTaskStatus(task.id, status === 'do_zrobienia' ? 'w_toku' : status === 'w_toku' ? 'do_przegladu' : 'zrobione')}
                                  className="px-2 py-0.5 bg-slate-700 hover:bg-slate-600 text-xs rounded">
                                  →
                                </button>
                              )}
                              {status !== 'zrobione' && !activeTimer && (
                                <button onClick={() => startTimer(task.id)}
                                  className="px-2 py-0.5 bg-green-700 hover:bg-green-600 text-xs rounded">
                                  ▶
                                </button>
                              )}
                              <button onClick={() => deleteTask(task.id)}
                                className="px-2 py-0.5 bg-red-700/50 hover:bg-red-600 text-xs rounded">
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-slate-400 py-12">Wybierz projekt aby zobaczyc tablice Kanban</div>
            )}
          </div>
        )}

        {/* ==================== DETAILS VIEW ==================== */}
        {activeView === 'details' && selectedProject && (
          <div className="space-y-6">
            <button onClick={() => setActiveView('list')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg">
              ← Powrot do listy
            </button>

            {/* Project Header */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{selectedProject.name}</h2>
                  <p className="text-slate-400 mb-1">Klient: {selectedProject.client}</p>
                  {selectedProject.klientId && <p className="text-slate-500 text-xs">CRM ID: {selectedProject.klientId}</p>}
                  <p className="text-slate-500 text-sm">{selectedProject.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-4 py-2 ${STATUS_COLORS[selectedProject.status]} text-white font-bold rounded-lg`}>
                    {STATUS_LABELS[selectedProject.status]}
                  </span>
                  <span className={`text-sm font-bold ${PRIORITY_COLORS[selectedProject.priority]}`}>
                    Priorytet: {PRIORITY_LABELS[selectedProject.priority]}
                  </span>
                </div>
              </div>

              {/* Team */}
              {selectedProject.team && selectedProject.team.length > 0 && (
                <div className="mb-4">
                  <span className="text-sm text-slate-400 mr-2">Zespol:</span>
                  {selectedProject.team.map((m, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-700 text-xs rounded-full text-slate-300 mr-1">{m}</span>
                  ))}
                </div>
              )}

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Postep projektu</span>
                  <span className="text-sm font-bold text-cyan-400">{selectedProject.progress}%</span>
                </div>
                <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: `${selectedProject.progress}%` }} />
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-slate-400 mb-1">Budzet planowany</div>
                  <div className="text-2xl font-bold">{selectedProject.budget.planned.toLocaleString('pl-PL')} zl</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400 mb-1">Koszty rzeczywiste</div>
                  <div className="text-2xl font-bold text-orange-400">
                    {calculateTotalCosts(selectedProject.costs).toLocaleString('pl-PL')} zl
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-400 mb-1">Zysk</div>
                  <div className={`text-2xl font-bold ${calculateProfit(selectedProject) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {calculateProfit(selectedProject).toLocaleString('pl-PL')} zl
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

            {/* Tasks Section */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">Zadania ({projectTasks.length})</h3>
                <button onClick={() => setShowTaskModal(true)}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium">
                  + Dodaj zadanie
                </button>
              </div>

              {/* Mini Kanban */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {(['do_zrobienia', 'w_toku', 'do_przegladu', 'zrobione'] as TaskStatus[]).map(status => {
                  const colTasks = projectTasks.filter(t => t.status === status);
                  return (
                    <div key={status} className={`border-t-2 ${TASK_STATUS_COLORS[status]} bg-slate-900/30 rounded-lg p-3`}>
                      <div className="text-xs font-bold text-slate-400 mb-2 flex items-center justify-between">
                        {TASK_STATUS_LABELS[status]} <span className="bg-slate-700 px-1.5 rounded-full">{colTasks.length}</span>
                      </div>
                      <div className="space-y-2">
                        {colTasks.map(task => (
                          <div key={task.id} className="bg-slate-800 rounded p-2 text-sm border border-slate-700">
                            <div className="flex items-center justify-between">
                              <span className="font-medium truncate">{task.name}</span>
                              <span className={`text-xs ${task.priority >= 4 ? 'text-red-400' : 'text-slate-500'}`}>P{task.priority}</span>
                            </div>
                            <div className="text-xs text-slate-500 mt-1">{task.actualHours}h / {task.plannedHours}h</div>
                            <div className="flex gap-1 mt-1">
                              {status !== 'zrobione' && (
                                <button onClick={() => updateTaskStatus(task.id, status === 'do_zrobienia' ? 'w_toku' : status === 'w_toku' ? 'do_przegladu' : 'zrobione')}
                                  className="text-xs px-1.5 py-0.5 bg-slate-700 hover:bg-slate-600 rounded">→</button>
                              )}
                              {status !== 'zrobione' && !activeTimer && (
                                <button onClick={() => startTimer(task.id)}
                                  className="text-xs px-1.5 py-0.5 bg-green-700/50 hover:bg-green-600 rounded">▶</button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Time Tracking History */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-4">Historia czasu pracy</h3>
              {projectTimeEntries.length === 0 ? (
                <p className="text-slate-400 text-sm">Brak wpisow — uruchom timer na zadaniu</p>
              ) : (
                <div className="space-y-2">
                  {projectTimeEntries.slice().reverse().slice(0, 20).map(te => {
                    const task = tasks.find(t => t.id === te.taskId);
                    return (
                      <div key={te.id} className="flex items-center justify-between bg-slate-900/50 rounded-lg p-3 text-sm">
                        <div>
                          <div className="font-medium">{task?.name || '—'}</div>
                          <div className="text-xs text-slate-500">
                            {new Date(te.startTime).toLocaleString('pl-PL')}
                            {te.description && ` — ${te.description}`}
                          </div>
                        </div>
                        <div className="font-mono text-cyan-400">{te.minutes || 0} min</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Costs Breakdown */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-6">Podzial kosztow</h3>
              {(['rent', 'fuel', 'employees', 'materials', 'other'] as const).map(cat => {
                const labels: Record<string, string> = { rent: 'Czynsz', fuel: 'Paliwo', employees: 'Pracownicy', materials: 'Materialy', other: 'Inne' };
                const items = cat === 'employees' ? selectedProject.costs.employees : selectedProject.costs[cat];
                if (!items || items.length === 0) return null;
                return (
                  <div key={cat} className="mb-4">
                    <h4 className="text-lg font-bold mb-2 flex items-center gap-2">
                      <span className="w-3 h-3 rounded" style={{ backgroundColor: COLORS[cat] }}></span>
                      {labels[cat]}
                    </h4>
                    <div className="space-y-1">
                      {cat === 'employees'
                        ? (selectedProject.costs.employees as EmployeeCost[]).map(emp => (
                            <div key={emp.id} className="flex justify-between bg-slate-900/50 rounded-lg p-2 text-sm">
                              <div>{emp.employeeName} — {emp.hours}h x {emp.hourlyRate} zl/h</div>
                              <div className="font-mono">{emp.grossCost.toFixed(2)} zl</div>
                            </div>
                          ))
                        : (selectedProject.costs[cat] as CostItem[]).map(item => (
                            <div key={item.id} className="flex justify-between bg-slate-900/50 rounded-lg p-2 text-sm">
                              <div>{item.name} <span className="text-xs text-slate-500">VAT {item.vat}%</span></div>
                              <div className="font-mono">{(item.amount * (1 + item.vat / 100)).toFixed(2)} zl</div>
                            </div>
                          ))
                      }
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ==================== ADD VIEW ==================== */}
        {activeView === 'add' && (
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Nowy projekt</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Nazwa projektu *</label>
                <input type="text" value={projForm.name} onChange={e => setProjForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  placeholder="Nazwa projektu" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Klient</label>
                  <input type="text" value={projForm.client} onChange={e => setProjForm(p => ({ ...p, client: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg" placeholder="Nazwa klienta" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">CRM klient ID</label>
                  <input type="text" value={projForm.klientId} onChange={e => setProjForm(p => ({ ...p, klientId: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg" placeholder="(opcjonalnie)" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Opis</label>
                <textarea value={projForm.description} onChange={e => setProjForm(p => ({ ...p, description: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg" rows={3} placeholder="Opis projektu" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Status</label>
                  <select value={projForm.status} onChange={e => setProjForm(p => ({ ...p, status: e.target.value as ProjectStatus }))}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg">
                    {(Object.keys(STATUS_LABELS) as ProjectStatus[]).map(s => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Priorytet</label>
                  <select value={projForm.priority} onChange={e => setProjForm(p => ({ ...p, priority: e.target.value as ProjectPriority }))}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg">
                    {(Object.keys(PRIORITY_LABELS) as ProjectPriority[]).map(pr => (
                      <option key={pr} value={pr}>{PRIORITY_LABELS[pr]}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Data startu</label>
                  <input type="date" value={projForm.startDate} onChange={e => setProjForm(p => ({ ...p, startDate: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Data konca</label>
                  <input type="date" value={projForm.endDate} onChange={e => setProjForm(p => ({ ...p, endDate: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Budzet planowany (zl)</label>
                  <input type="number" value={projForm.budgetPlanned} onChange={e => setProjForm(p => ({ ...p, budgetPlanned: +e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Przychod (zl)</label>
                  <input type="number" value={projForm.revenue} onChange={e => setProjForm(p => ({ ...p, revenue: +e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Zespol (oddzielony przecinkami)</label>
                <input type="text" value={projForm.team} onChange={e => setProjForm(p => ({ ...p, team: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg" placeholder="Jan, Anna, Piotr" />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={addProject} className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg">
                  Dodaj projekt
                </button>
                <button onClick={() => setActiveView('list')} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg">
                  Anuluj
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TASK MODAL ==================== */}
        {showTaskModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowTaskModal(false)}>
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-bold mb-4">Nowe zadanie</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Nazwa *</label>
                  <input type="text" value={taskForm.name} onChange={e => setTaskForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg" placeholder="Nazwa zadania" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Opis</label>
                  <textarea value={taskForm.description} onChange={e => setTaskForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg" rows={2} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Priorytet (1-5)</label>
                    <input type="number" min={1} max={5} value={taskForm.priority}
                      onChange={e => setTaskForm(f => ({ ...f, priority: Math.min(5, Math.max(1, +e.target.value)) }))}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Plan. godziny</label>
                    <input type="number" min={0} value={taskForm.plannedHours}
                      onChange={e => setTaskForm(f => ({ ...f, plannedHours: +e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Przypisany do</label>
                  <input type="text" value={taskForm.assignedTo} onChange={e => setTaskForm(f => ({ ...f, assignedTo: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg" placeholder="Imie" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Termin</label>
                  <input type="date" value={taskForm.deadline} onChange={e => setTaskForm(f => ({ ...f, deadline: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={addTask} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg">
                    Dodaj
                  </button>
                  <button onClick={() => setShowTaskModal(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg">
                    Anuluj
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
