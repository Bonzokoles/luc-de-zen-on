import { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  priority: 'wysoki' | 'średni' | 'niski';
  completed: boolean;
  dueDate?: string;
}

const OrganizerZadan = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'wysoki' | 'średni' | 'niski'>('średni');
  const [newTaskDate, setNewTaskDate] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Wczytaj zadania z localStorage
  useEffect(() => {
    const saved = localStorage.getItem('biznes-tasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  // Zapisz zadania do localStorage
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('biznes-tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = () => {
    if (!newTaskTitle.trim()) {
      alert('Wpisz nazwę zadania');
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      priority: newTaskPriority,
      completed: false,
      dueDate: newTaskDate || undefined
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setNewTaskDate('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    if (confirm('Usunąć to zadanie?')) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'wysoki': return 'text-red-400 border-red-400/30 bg-red-500/10';
      case 'średni': return 'text-yellow-400 border-yellow-400/30 bg-yellow-500/10';
      case 'niski': return 'text-green-400 border-green-400/30 bg-green-500/10';
      default: return 'text-business-text-dim';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'wysoki': return '🔴';
      case 'średni': return '🟡';
      case 'niski': return '🟢';
      default: return '⚪';
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Priorytet
    const priorityOrder = { 'wysoki': 0, 'średni': 1, 'niski': 2 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;

    // Data
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;

    return 0;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    active: tasks.filter(t => !t.completed).length,
    highPriority: tasks.filter(t => !t.completed && t.priority === 'wysoki').length
  };

  return (
    <div className="max-w-5xl mx-auto">

      {/* Statystyki */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card text-center">
          <div className="text-3xl font-bold text-business-accent">{stats.total}</div>
          <div className="text-sm text-business-text-dim mt-1">Wszystkie</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-yellow-400">{stats.active}</div>
          <div className="text-sm text-business-text-dim mt-1">Do zrobienia</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-business-accent-soft">{stats.completed}</div>
          <div className="text-sm text-business-text-dim mt-1">Ukończone</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-red-400">{stats.highPriority}</div>
          <div className="text-sm text-business-text-dim mt-1">Pilne</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Panel Dodawania */}
        <div className="card lg:col-span-1">
          <h2 className="text-2xl font-bold mb-6">
            ➕ Nowe Zadanie
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Co do zrobienia?
              </label>
              <textarea
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="textarea-field"
                rows={3}
                placeholder="Np. Zadzwonić do klienta w sprawie faktury"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    addTask();
                  }
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Priorytet
              </label>
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as any)}
                className="input-field"
              >
                <option value="niski">🟢 Niski</option>
                <option value="średni">🟡 Średni</option>
                <option value="wysoki">🔴 Wysoki</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Termin (opcjonalnie)
              </label>
              <input
                type="date"
                value={newTaskDate}
                onChange={(e) => setNewTaskDate(e.target.value)}
                className="input-field"
              />
            </div>

            <button
              onClick={addTask}
              className="btn-primary w-full"
            >
              ✅ Dodaj Zadanie
            </button>

            <p className="text-xs text-business-text-dim">
              Wskazówka: Ctrl + Enter = szybkie dodanie
            </p>
          </div>
        </div>

        {/* Lista Zadań */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              📋 Twoje Zadania
            </h2>

            {/* Filtry */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded text-sm ${
                  filter === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-business-surface border border-business-border'
                }`}
              >
                Wszystkie
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-3 py-1 rounded text-sm ${
                  filter === 'active'
                    ? 'bg-primary-600 text-white'
                    : 'bg-business-surface border border-business-border'
                }`}
              >
                Aktywne
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-3 py-1 rounded text-sm ${
                  filter === 'completed'
                    ? 'bg-primary-600 text-white'
                    : 'bg-business-surface border border-business-border'
                }`}
              >
                Ukończone
              </button>
            </div>
          </div>

          {sortedTasks.length === 0 ? (
            <div className="text-center py-12 text-business-text-dim">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              <p>Brak zadań do wyświetlenia</p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="mt-2 text-business-accent hover:underline text-sm"
                >
                  Pokaż wszystkie →
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {sortedTasks.map(task => (
                <div
                  key={task.id}
                  className={`p-4 bg-business-dark border rounded-lg transition-all ${
                    task.completed
                      ? 'border-business-border opacity-60'
                      : 'border-business-border hover:border-business-accent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 transition-all ${
                        task.completed
                          ? 'bg-business-accent-soft border-business-accent-soft'
                          : 'border-business-border hover:border-business-accent'
                      }`}
                    >
                      {task.completed && (
                        <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                      )}
                    </button>

                    {/* Content */}
                    <div className="flex-grow">
                      <div className={`font-medium ${task.completed ? 'line-through text-business-text-dim' : ''}`}>
                        {task.title}
                      </div>

                      <div className="flex items-center gap-3 mt-2 text-xs">
                        {/* Priorytet */}
                        <span className={`badge ${getPriorityColor(task.priority)}`}>
                          {getPriorityIcon(task.priority)} {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>

                        {/* Data */}
                        {task.dueDate && (
                          <span className="text-business-text-dim">
                            📅 {new Date(task.dueDate).toLocaleDateString('pl-PL')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="flex-shrink-0 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Podpowiedzi */}
      <div className="mt-8 card bg-gradient-to-r from-primary-900/20 to-business-surface border-primary-700/50">
        <h3 className="font-bold mb-3">💡 Porady produktywności</h3>
        <ul className="text-sm text-business-text-dim space-y-2">
          <li>• Zacznij dzień od najważniejszego zadania (priorytet wysoki 🔴)</li>
          <li>• Ustal realistyczne terminy - lepiej skończyć wcześniej niż się spóźnić</li>
          <li>• Dziel duże zadania na mniejsze kroki</li>
          <li>• Sprawdzaj listę rano i wieczorem</li>
          <li>• Nie bój się delegować - nie musisz wszystkiego robić sam!</li>
        </ul>
      </div>
    </div>
  );
};

export default OrganizerZadan;
