<script>
  let userProfile = {
    currentLevel: '',
    interests: '',
    careerGoals: '',
    availableTime: '',
    learningStyle: '',
    budget: ''
  };
  let recommendations = '';
  let loading = false;
  let error = '';

  async function getRecommendations() {
    // Basic validation
    if (!userProfile.currentLevel || !userProfile.interests) {
      error = 'Proszę wypełnić przynajmniej poziom umiejętności i zainteresowania';
      return;
    }

    loading = true;
    error = '';
    
    try {
      const response = await fetch('/api/education-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userProfile }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Błąd podczas generowania rekomendacji');
      }
      
      recommendations = data.recommendations;
    } catch (err) {
      error = err.message;
      console.error('Education recommendations error:', err);
    } finally {
      loading = false;
    }
  }

  function clearAll() {
    userProfile = {
      currentLevel: '',
      interests: '',
      careerGoals: '',
      availableTime: '',
      learningStyle: '',
      budget: ''
    };
    recommendations = '';
    error = '';
  }
</script>

<div class="education-widget-container">
  <h2 class="widget-title">🎓 System rekomendacji edukacyjnych</h2>
  
  <div class="space-y-4">
    <!-- User Profile Form -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium mb-2">Obecny poziom umiejętności *</label>
        <select 
          bind:value={userProfile.currentLevel}
        class="widget-select"
        >
          <option value="">Wybierz poziom</option>
          <option value="początkujący">Początkujący</option>
          <option value="średnio-zaawansowany">Średnio-zaawansowany</option>
          <option value="zaawansowany">Zaawansowany</option>
          <option value="ekspert">Ekspert</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Dostępny czas na naukę</label>
        <select 
          bind:value={userProfile.availableTime}
          class="widget-select"
        >
          <option value="">Wybierz czas</option>
          <option value="1-2 godziny dziennie">1-2 godziny dziennie</option>
          <option value="3-5 godzin dziennie">3-5 godzin dziennie</option>
          <option value="weekend tylko">Tylko weekendy</option>
          <option value="intensywny kurs">Kurs intensywny (pełen etat)</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Preferowany styl nauki</label>
        <select 
          bind:value={userProfile.learningStyle}
          class="widget-select"
        >
          <option value="">Wybierz styl</option>
          <option value="wideo i interaktywne">Wideo i kursy interaktywne</option>
          <option value="książki i dokumentacja">Książki i dokumentacja</option>
          <option value="praktyczne projekty">Praktyczne projekty</option>
          <option value="mentoring i grupy">Mentoring i grupy studyjne</option>
          <option value="mieszany">Podejście mieszane</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Budżet</label>
        <select 
          bind:value={userProfile.budget}
          class="widget-select"
        >
          <option value="">Wybierz budżet</option>
          <option value="darmowe">Tylko darmowe</option>
          <option value="do 500 zł">Do 500 zł</option>
          <option value="do 1500 zł">Do 1500 zł</option>
          <option value="do 5000 zł">Do 5000 zł</option>
          <option value="bez ograniczeń">Bez ograniczeń</option>
        </select>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium mb-2">Zainteresowania i dziedziny *</label>
      <input
        type="text"
        bind:value={userProfile.interests}
        placeholder="np. programowanie, data science, marketing, design..."
        class="widget-input"
      />
    </div>

    <div>
      <label class="block text-sm font-medium mb-2">Cele zawodowe</label>
      <textarea
        bind:value={userProfile.careerGoals}
        rows="3"
        placeholder="Opisz swoje cele zawodowe, wymarzone stanowisko, projekty..."
        class="widget-textarea"
      ></textarea>
    </div>

    <div class="flex gap-3">
      <button
        on:click={getRecommendations}
        disabled={loading || !userProfile.currentLevel || !userProfile.interests}
        class="action-btn primary"
      >
        {#if loading}
          <div class="animate-spin rounded-full h-4 w-4 border-2 border-cyan-300 border-t-transparent"></div>
          Generuję rekomendacje...
        {:else}
          🎯 Pobierz rekomendacje
        {/if}
      </button>

      <button
        on:click={clearAll}
        class="action-btn secondary"
      >
        🗑️ Wyczyść
      </button>
    </div>

    {#if error}
      <div class="error-container">
        <p class="error-text">❌ {error}</p>
      </div>
    {/if}

    {#if recommendations}
      <div class="result-container">
        <div class="result-header">
          <h3 class="result-title">🎓 Spersonalizowane rekomendacje:</h3>
        </div>
        <div class="result-content">
          <pre class="result-text">{recommendations}</pre>
        </div>
        <div class="result-footer">
          <button
            on:click={() => navigator.clipboard.writeText(recommendations)}
            class="copy-btn"
          >
            📋 Skopiuj rekomendacje
          </button>
        </div>
      </div>
    {/if}

    <div class="tip-text">
      💡 Tip: Im więcej szczegółów podasz, tym bardziej spersonalizowane będą rekomendacje
    </div>
  </div>
</div>

<style>
  .education-widget-container {
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(0, 217, 255, 0.3);
    border-radius: 0px !important;
    box-shadow: 0 1px 26px rgba(20, 215, 230, 0.2);
    padding: 24px;
    transition: all 0.3s ease;
    color: #94aec4;
  }

  .education-widget-container:hover {
    border-color: #00d7ef;
    box-shadow: 0 4px 30px rgba(0, 217, 255, 0.4);
    transform: translateY(-2px);
  }

  .widget-title {
    color: #00d7ef;
    font-weight: 700;
    font-size: 1.5rem;
    margin-bottom: 1rem;
    text-align: center;
    text-shadow: 0 0 10px rgba(0, 217, 255, 0.3);
  }

  .widget-input {
    width: 100%;
    padding: 12px;
    background: #131e28;
    border: 2px solid rgba(0, 217, 255, 0.4);
    border-radius: 0px !important;
    color: #00d7ef;
    font-size: 1rem;
    transition: all 0.2s ease;
  }

  .widget-input:focus {
    outline: none;
    border-color: #00d7ef;
    box-shadow: 0 0 12px rgba(0, 217, 255, 0.4);
  }

  .widget-input::placeholder {
    color: rgba(0, 217, 255, 0.5);
  }

  .widget-select {
    width: 100%;
    padding: 12px;
    background: #131e28;
    border: 2px solid rgba(0, 217, 255, 0.4);
    border-radius: 0px !important;
    color: #00d7ef;
    font-size: 1rem;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .widget-select:focus {
    outline: none;
    border-color: #00d7ef;
    box-shadow: 0 0 12px rgba(0, 217, 255, 0.4);
  }

  .widget-select option {
    background: #131e28;
    color: #00d7ef;
  }

  .widget-textarea {
    width: 100%;
    padding: 12px;
    background: #131e28;
    border: 2px solid rgba(0, 217, 255, 0.4);
    border-radius: 0px !important;
    color: #00d7ef;
    font-size: 1rem;
    transition: all 0.2s ease;
    resize: vertical;
    min-height: 80px;
  }

  .widget-textarea:focus {
    outline: none;
    border-color: #00d7ef;
    box-shadow: 0 0 12px rgba(0, 217, 255, 0.4);
  }

  .widget-textarea::placeholder {
    color: rgba(0, 217, 255, 0.5);
  }

  .action-btn {
    padding: 12px 24px;
    border: none;
    border-radius: 0px !important;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .action-btn.primary {
    background-color: #164e63;
    color: white;
    box-shadow: 0 2px 12px rgba(0, 217, 255, 0.2);
  }

  .action-btn.primary:hover:not(:disabled) {
    background-color: #1be1ff;
    color: #000;
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(0, 217, 255, 0.4);
  }

  .action-btn.primary:disabled {
    background-color: #0f2027;
    color: #566973;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .action-btn.secondary {
    background-color: rgba(0, 0, 0, 0.3);
    color: #00d7ef;
    border: 1px solid rgba(0, 217, 255, 0.4);
  }

  .action-btn.secondary:hover {
    background-color: rgba(0, 217, 255, 0.1);
    border-color: #00d7ef;
    transform: translateY(-1px);
  }

  .error-container {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 0px !important;
    padding: 16px;
  }

  .error-text {
    color: #fca5a5;
    margin: 0;
  }

  .result-container {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(0, 217, 255, 0.3);
    border-radius: 0px !important;
    overflow: hidden;
  }

  .result-header {
    background: rgba(0, 217, 255, 0.1);
    padding: 12px 16px;
    border-bottom: 1px solid rgba(0, 217, 255, 0.3);
  }

  .result-title {
    color: #00d7ef;
    font-weight: 600;
    margin: 0;
  }

  .result-content {
    padding: 16px;
    max-height: 400px;
    overflow-y: auto;
  }

  .result-text {
    color: #94aec4;
    font-family: monospace;
    font-size: 0.9rem;
    line-height: 1.6;
    margin: 0;
    white-space: pre-wrap;
  }

  .result-footer {
    background: rgba(0, 217, 255, 0.05);
    padding: 12px 16px;
    border-top: 1px solid rgba(0, 217, 255, 0.3);
    text-align: right;
  }

  .copy-btn {
    background: none;
    border: none;
    color: #00d7ef;
    font-size: 0.8rem;
    cursor: pointer;
    padding: 4px 8px;
    transition: all 0.2s ease;
    border-radius: 0px !important;
  }

  .copy-btn:hover {
    color: #1be1ff;
    transform: scale(1.05);
  }

  .tip-text {
    color: rgba(0, 217, 255, 0.6);
    font-size: 0.8rem;
    font-style: italic;
    text-align: center;
    margin-top: 16px;
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .education-widget-container {
      padding: 16px;
    }
    
    .widget-title {
      font-size: 1.25rem;
    }
    
    .action-btn {
      padding: 10px 20px;
      font-size: 0.9rem;
    }
  }
</style>
