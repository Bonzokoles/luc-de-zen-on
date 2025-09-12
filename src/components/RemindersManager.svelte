<script lang="ts">
  import { onMount } from 'svelte';
  
  interface Reminder {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
    userId?: string;
    completed: boolean;
    createdAt: number;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    recurrence?: 'daily' | 'weekly' | 'monthly';
  }
  
  interface ReminderStats {
    total: number;
    completed: number;
    overdue: number;
    today: number;
    high: number;
    medium: number;
    low: number;
  }
  
  let reminders: Reminder[] = [];
  let stats: ReminderStats = {
    total: 0,
    completed: 0,
    overdue: 0,
    today: 0,
    high: 0,
    medium: 0,
    low: 0
  };
  let loading = true;
  let error = '';
  let showCreateForm = false;
  let editingReminder: Reminder | null = null;
  
  // Form data
  let formData = {
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    notifications: {
      email: true,
      push: false,
      sms: false
    },
    recurrence: undefined as 'daily' | 'weekly' | 'monthly' | undefined
  };
  
  const priorityColors = {
    low: 'text-green-400 border-green-500',
    medium: 'text-yellow-400 border-yellow-500',
    high: 'text-red-400 border-red-500'
  };
  
  const priorityIcons = {
    low: '🟢',
    medium: '🟡',
    high: '🔴'
  };
  
  async function fetchReminders() {
    try {
      loading = true;
      const response = await fetch('/api/reminders');
      const data = await response.json();
      
      if (data.success) {
        reminders = data.reminders;
        stats = data.stats;
      } else {
        error = data.message || 'Failed to fetch reminders';
      }
    } catch (err) {
      error = 'Network error occurred';
      console.error('Error fetching reminders:', err);
    } finally {
      loading = false;
    }
  }
  
  async function createReminder() {
    if (!formData.title.trim() || !formData.dueDate) {
      error = 'Tytuł i data są wymagane';
      return;
    }
    
    try {
      const response = await fetch('/api/reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          userId: `user${Math.floor(Math.random() * 1000)}`
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        resetForm();
        showCreateForm = false;
        await fetchReminders();
      } else {
        error = data.message || 'Failed to create reminder';
      }
    } catch (err) {
      error = 'Failed to create reminder';
      console.error('Error creating reminder:', err);
    }
  }
  
  async function updateReminder(id: string, updates: Partial<Reminder>) {
    try {
      const response = await fetch('/api/reminders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, ...updates })
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchReminders();
        editingReminder = null;
      } else {
        error = data.message || 'Failed to update reminder';
      }
    } catch (err) {
      error = 'Failed to update reminder';
      console.error('Error updating reminder:', err);
    }
  }
  
  async function deleteReminder(id: string) {
    if (!confirm('Czy na pewno chcesz usunąć to przypomnienie?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/reminders?id=${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchReminders();
      } else {
        error = data.message || 'Failed to delete reminder';
      }
    } catch (err) {
      error = 'Failed to delete reminder';
      console.error('Error deleting reminder:', err);
    }
  }
  
  function resetForm() {
    formData = {
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      notifications: {
        email: true,
        push: false,
        sms: false
      },
      recurrence: undefined
    };
  }
  
  function formatDateTime(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  function isOverdue(dateString: string) {
    return new Date(dateString).getTime() < Date.now();
  }
  
  function isToday(dateString: string) {
    const today = new Date();
    const reminderDate = new Date(dateString);
    return reminderDate.toDateString() === today.toDateString();
  }
  
  function getMinDateTime() {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5); // At least 5 minutes from now
    return now.toISOString().slice(0, 16);
  }
  
  onMount(() => {
    fetchReminders();
    
    // Set default due date to 1 hour from now
    const defaultDate = new Date();
    defaultDate.setHours(defaultDate.getHours() + 1);
    formData.dueDate = defaultDate.toISOString().slice(0, 16);
  });
</script>

<div class="bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6 text-cyan-300 max-h-[800px] overflow-hidden">
  <div class="flex items-center justify-between mb-6">
    <div class="flex items-center space-x-3">
      <div class="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
      <h2 class="text-2xl font-bold text-cyan-400">HARMONOGRAM I PRZYPOMNIENIA</h2>
    </div>
    
    <button
      on:click={() => showCreateForm = !showCreateForm}
      class="px-4 py-2 bg-cyan-700/50 hover:bg-cyan-600/50 rounded text-sm font-semibold transition-colors"
    >
      {showCreateForm ? '❌ Anuluj' : '➕ Nowe przypomnienie'}
    </button>
  </div>
  
  <!-- Statistics Panel -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    <div class="bg-gray-900/50 border border-cyan-500/20 rounded-lg p-4 text-center">
      <div class="text-2xl font-bold text-cyan-400">{stats.total}</div>
      <div class="text-sm text-gray-400">Łącznie</div>
    </div>
    
    <div class="bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-center">
      <div class="text-2xl font-bold text-green-400">{stats.completed}</div>
      <div class="text-sm text-gray-400">Zakończone</div>
    </div>
    
    <div class="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-center">
      <div class="text-2xl font-bold text-red-400">{stats.overdue}</div>
      <div class="text-sm text-gray-400">Przeterminowane</div>
    </div>
    
    <div class="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 text-center">
      <div class="text-2xl font-bold text-yellow-400">{stats.today}</div>
      <div class="text-sm text-gray-400">Dzisiaj</div>
    </div>
  </div>
  
  {#if error}
    <div class="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
      <p class="text-red-300">❌ {error}</p>
      <button 
        on:click={() => error = ''}
        class="mt-2 text-sm text-red-400 hover:text-red-300"
      >
        Zamknij
      </button>
    </div>
  {/if}
  
  <!-- Create/Edit Form -->
  {#if showCreateForm || editingReminder}
    <div class="mb-6 p-4 bg-gray-900/50 border border-cyan-500/30 rounded-lg">
      <h3 class="text-lg font-semibold mb-4 text-cyan-400">
        {editingReminder ? 'Edytuj przypomnienie' : 'Nowe przypomnienie'}
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2">Tytuł *</label>
          <input
            type="text"
            bind:value={formData.title}
            placeholder="Wpisz tytuł przypomnienia"
            class="w-full p-3 bg-gray-800 border border-gray-600 rounded focus:border-cyan-400 focus:outline-none"
            required
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-2">Data i godzina *</label>
          <input
            type="datetime-local"
            bind:value={formData.dueDate}
            min={getMinDateTime()}
            class="w-full p-3 bg-gray-800 border border-gray-600 rounded focus:border-cyan-400 focus:outline-none"
            required
          />
        </div>
        
        <div class="md:col-span-2">
          <label class="block text-sm font-medium mb-2">Opis</label>
          <textarea
            bind:value={formData.description}
            placeholder="Opcjonalny opis przypomnienia"
            rows="3"
            class="w-full p-3 bg-gray-800 border border-gray-600 rounded focus:border-cyan-400 focus:outline-none resize-none"
          ></textarea>
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-2">Priorytet</label>
          <select 
            bind:value={formData.priority}
            class="w-full p-3 bg-gray-800 border border-gray-600 rounded focus:border-cyan-400 focus:outline-none"
          >
            <option value="low">🟢 Niski</option>
            <option value="medium">🟡 Średni</option>
            <option value="high">🔴 Wysoki</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-2">Powtarzanie</label>
          <select 
            bind:value={formData.recurrence}
            class="w-full p-3 bg-gray-800 border border-gray-600 rounded focus:border-cyan-400 focus:outline-none"
          >
            <option value={undefined}>Jednorazowe</option>
            <option value="daily">Codziennie</option>
            <option value="weekly">Co tydzień</option>
            <option value="monthly">Co miesiąc</option>
          </select>
        </div>
        
        <div class="md:col-span-2">
          <label class="block text-sm font-medium mb-2">Powiadomienia</label>
          <div class="flex space-x-6">
            <label class="flex items-center">
              <input
                type="checkbox"
                bind:checked={formData.notifications.email}
                class="mr-2 accent-cyan-500"
              />
              📧 Email
            </label>
            <label class="flex items-center">
              <input
                type="checkbox"
                bind:checked={formData.notifications.push}
                class="mr-2 accent-cyan-500"
              />
              🔔 Push
            </label>
            <label class="flex items-center">
              <input
                type="checkbox"
                bind:checked={formData.notifications.sms}
                class="mr-2 accent-cyan-500"
              />
              📱 SMS
            </label>
          </div>
        </div>
      </div>
      
      <div class="flex justify-end space-x-3 mt-4">
        <button
          on:click={() => {
            showCreateForm = false;
            editingReminder = null;
            resetForm();
          }}
          class="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded text-sm font-semibold transition-colors"
        >
          Anuluj
        </button>
        <button
          on:click={createReminder}
          class="px-4 py-2 bg-cyan-700/50 hover:bg-cyan-600/50 rounded text-sm font-semibold transition-colors"
        >
          {editingReminder ? 'Zaktualizuj' : 'Utwórz'}
        </button>
      </div>
    </div>
  {/if}
  
  <!-- Reminders List -->
  <div class="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
    {#if loading}
      <div class="text-center py-8">
        <div class="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-gray-400">Ładowanie przypomnień...</p>
      </div>
    {:else if reminders.length === 0}
      <div class="text-center py-8">
        <p class="text-gray-400">Brak przypomnień</p>
        <button
          on:click={() => showCreateForm = true}
          class="mt-4 px-4 py-2 bg-cyan-700/50 hover:bg-cyan-600/50 rounded text-sm font-semibold transition-colors"
        >
          Utwórz pierwsze przypomnienie
        </button>
      </div>
    {:else}
      {#each reminders as reminder (reminder.id)}
        <div class="bg-gray-900/30 border border-gray-700/50 rounded-lg p-4 hover:border-cyan-500/50 transition-colors
          {reminder.completed ? 'opacity-60' : ''}
          {isOverdue(reminder.dueDate) && !reminder.completed ? 'border-red-500/50 bg-red-900/10' : ''}
          {isToday(reminder.dueDate) && !reminder.completed ? 'border-yellow-500/50 bg-yellow-900/10' : ''}
        ">
          <div class="flex items-start justify-between">
            <div class="flex items-start space-x-3 flex-1">
              <button
                on:click={() => updateReminder(reminder.id, { completed: !reminder.completed })}
                class="mt-1 text-xl hover:scale-110 transition-transform"
              >
                {reminder.completed ? '✅' : '⭕'}
              </button>
              
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-1">
                  <span class="font-semibold text-cyan-300 {reminder.completed ? 'line-through' : ''}">{reminder.title}</span>
                  <span class="text-sm px-2 py-1 rounded border {priorityColors[reminder.priority]} bg-gray-800/50">
                    {priorityIcons[reminder.priority]} {reminder.priority}
                  </span>
                  {#if reminder.recurrence}
                    <span class="text-xs px-2 py-1 rounded bg-purple-900/50 text-purple-300">
                      🔄 {reminder.recurrence}
                    </span>
                  {/if}
                </div>
                
                {#if reminder.description}
                  <p class="text-sm text-gray-300 mb-2 {reminder.completed ? 'line-through' : ''}">{reminder.description}</p>
                {/if}
                
                <div class="flex items-center space-x-4 text-sm text-gray-400">
                  <div class="flex items-center space-x-1">
                    <span>📅</span>
                    <span class="{isOverdue(reminder.dueDate) && !reminder.completed ? 'text-red-400 font-semibold' : ''}
                                {isToday(reminder.dueDate) && !reminder.completed ? 'text-yellow-400 font-semibold' : ''}">
                      {formatDateTime(reminder.dueDate)}
                      {#if isOverdue(reminder.dueDate) && !reminder.completed}
                        <span class="text-red-400 ml-1">(PRZETERMINOWANE)</span>
                      {:else if isToday(reminder.dueDate) && !reminder.completed}
                        <span class="text-yellow-400 ml-1">(DZISIAJ)</span>
                      {/if}
                    </span>
                  </div>
                  
                  <div class="flex items-center space-x-2">
                    {#if reminder.notifications.email}<span>📧</span>{/if}
                    {#if reminder.notifications.push}<span>🔔</span>{/if}
                    {#if reminder.notifications.sms}<span>📱</span>{/if}
                  </div>
                </div>
              </div>
            </div>
            
            <div class="flex items-center space-x-2 ml-4">
              <button
                on:click={() => {
                  editingReminder = reminder;
                  formData = {
                    title: reminder.title,
                    description: reminder.description,
                    dueDate: new Date(reminder.dueDate).toISOString().slice(0, 16),
                    priority: reminder.priority,
                    notifications: { ...reminder.notifications },
                    recurrence: reminder.recurrence
                  };
                  showCreateForm = true;
                }}
                class="px-2 py-1 bg-yellow-700/50 hover:bg-yellow-600/50 rounded text-xs font-semibold transition-colors"
              >
                ✏️
              </button>
              <button
                on:click={() => deleteReminder(reminder.id)}
                class="px-2 py-1 bg-red-700/50 hover:bg-red-600/50 rounded text-xs font-semibold transition-colors"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #0891b2 #1f2937;
  }
  
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #1f2937;
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #0891b2;
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #0e7490;
  }
</style>
