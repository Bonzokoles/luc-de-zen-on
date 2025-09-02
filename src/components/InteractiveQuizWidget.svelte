<script></script>
  let selectedTopic = '';
  let difficulty = 'beginner';
  let currentQuiz = null;
  let currentQuestionIndex = 0;
  let selectedAnswer = '';
  let userAnswers = [];
  let score = 0;
  let loading = false;
  let error = '';
  let quizCompleted = false;
  let feedback = '';

  const topics = [
    { id: 'programming', name: '💻 Programowanie', description: 'JavaScript, Python, React, Node.js' },
    { id: 'design', name: '🎨 Design & UX', description: 'UI/UX design, design thinking, prototyping' },
    { id: 'data-science', name: '📊 Data Science', description: 'Machine learning, statystyka, Python, R' },
    { id: 'marketing', name: '📢 Marketing', description: 'Digital marketing, SEO, content marketing' },
    { id: 'business', name: '💼 Business', description: 'Zarządzanie, finanse, strategia biznesowa' },
    { id: 'ai', name: '🤖 Sztuczna Inteligencja', description: 'AI, machine learning, deep learning' }
  ];

  const difficultyLevels = [
    { id: 'beginner', name: '🌱 Początkujący', description: 'Podstawowe pytania wprowadzające' },
    { id: 'intermediate', name: '⚡ Średniozaawansowany', description: 'Pytania wymagające analizy' },
    { id: 'advanced', name: '🔥 Zaawansowany', description: 'Kompleksowe scenariusze' },
    { id: 'expert', name: '💎 Ekspert', description: 'Najwyższy poziom trudności' }
  ];

  async function startQuiz() {
    if (!selectedTopic) {
      error = 'Proszę wybrać temat quizu';
      return;
    }

    loading = true;
    error = '';
    currentQuiz = null;
    currentQuestionIndex = 0;
    userAnswers = [];
    score = 0;
    quizCompleted = false;
    selectedAnswer = '';
    
    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          topic: selectedTopic,
          difficulty: difficulty,
          questionCount: 5
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Błąd podczas tworzenia quizu');
      }
      
      currentQuiz = data.quiz;
    } catch (err) {
      error = err.message;
      console.error('Quiz generation error:', err);
    } finally {
      loading = false;
    }
  }

  function selectAnswer(answer) {
    selectedAnswer = answer;
  }

  async function submitAnswer() {
    if (!selectedAnswer) {
      error = 'Proszę wybrać odpowiedź';
      return;
    }

    const currentQuestion = currentQuiz.questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    userAnswers.push({
      question: currentQuestion.question,
      selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      explanation: currentQuestion.explanation
    });

    if (isCorrect) {
      score++;
    }

    // Get AI feedback for the answer
    try {
      const response = await fetch('/api/quiz-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: currentQuestion.question,
          selectedAnswer,
          correctAnswer: currentQuestion.correctAnswer,
          isCorrect,
          topic: selectedTopic,
          difficulty
        }),
      });

      const data = await response.json();
      feedback = data.feedback;
    } catch (err) {
      console.error('Feedback error:', err);
      feedback = isCorrect ? 'Poprawna odpowiedź!' : 'Niepoprawna odpowiedź.';
    }

    // Show feedback for 3 seconds, then move to next question
    setTimeout(() => {
      feedback = '';
      selectedAnswer = '';
      
      if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        currentQuestionIndex++;
      } else {
        quizCompleted = true;
      }
    }, 3000);
  }

  function resetQuiz() {
    selectedTopic = '';
    difficulty = 'beginner';
    currentQuiz = null;
    currentQuestionIndex = 0;
    selectedAnswer = '';
    userAnswers = [];
    score = 0;
    loading = false;
    error = '';
    quizCompleted = false;
    feedback = '';
  }

  function getScoreColor(percentage) {
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  }

  $: currentQuestion = currentQuiz?.questions[currentQuestionIndex];
  $: progress = currentQuiz ? ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100 : 0;
  $: scorePercentage = currentQuiz ? Math.round((score / currentQuiz.questions.length) * 100) : 0;
</script>

<div class="quiz-widget-container">
  <h2 class="widget-title">🧠 Interaktywny Quiz AI</h2>
  
  {#if !currentQuiz && !loading}
    <!-- Quiz Setup -->
    <div class="quiz-setup">
      <div class="setup-section">
        <h3 class="setup-title">📖 Wybierz temat</h3>
        <div class="topics-grid">
          {#each topics as topic}
            <button 
              class="topic-card {selectedTopic === topic.id ? 'selected' : ''}"
              on:click={() => selectedTopic = topic.id}
            >
              <div class="topic-name">{topic.name}</div>
              <div class="topic-description">{topic.description}</div>
            </button>
          {/each}
        </div>
      </div>

      <div class="setup-section">
        <h3 class="setup-title">⚡ Poziom trudności</h3>
        <div class="difficulty-grid">
          {#each difficultyLevels as level}
            <button 
              class="difficulty-card {difficulty === level.id ? 'selected' : ''}"
              on:click={() => difficulty = level.id}
            >
              <div class="difficulty-name">{level.name}</div>
              <div class="difficulty-description">{level.description}</div>
            </button>
          {/each}
        </div>
      </div>

      <button 
        class="start-quiz-btn"
        on:click={startQuiz}
        disabled={!selectedTopic}
      >
        🚀 Rozpocznij Quiz
      </button>
    </div>
  {/if}

  {#if loading}
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">Generowanie quizu AI...</p>
    </div>
  {/if}

  {#if error}
    <div class="error-container">
      <p class="error-text">❌ {error}</p>
      <button class="retry-btn" on:click={resetQuiz}>Spróbuj ponownie</button>
    </div>
  {/if}

  {#if currentQuiz && !quizCompleted && !loading}
    <!-- Quiz Progress -->
    <div class="quiz-progress">
      <div class="progress-bar">
        <div class="progress-fill" style="width: {progress}%"></div>
      </div>
      <div class="progress-text">
        Pytanie {currentQuestionIndex + 1} z {currentQuiz.questions.length}
      </div>
    </div>

    <!-- Current Question -->
    <div class="question-container">
      <h3 class="question-text">{currentQuestion.question}</h3>
      
      <div class="answers-grid">
        {#each currentQuestion.answers as answer}
          <button 
            class="answer-btn {selectedAnswer === answer ? 'selected' : ''}"
            on:click={() => selectAnswer(answer)}
            disabled={feedback !== ''}
          >
            {answer}
          </button>
        {/each}
      </div>

      {#if feedback}
        <div class="feedback-container">
          <p class="feedback-text">{feedback}</p>
        </div>
      {:else if selectedAnswer}
        <button class="submit-btn" on:click={submitAnswer}>
          Zatwierdź odpowiedź
        </button>
      {/if}
    </div>
  {/if}

  {#if quizCompleted}
    <!-- Quiz Results -->
    <div class="results-container">
      <h3 class="results-title">🎉 Quiz ukończony!</h3>
      
      <div class="score-display">
        <div class="score-circle">
          <span class="score-text {getScoreColor(scorePercentage)}">
            {scorePercentage}%
          </span>
        </div>
        <p class="score-description">
          Uzyskałeś {score} z {currentQuiz.questions.length} punktów
        </p>
      </div>

      <div class="answers-review">
        <h4 class="review-title">📝 Przegląd odpowiedzi</h4>
        {#each userAnswers as answer, index}
          <div class="answer-review">
            <div class="review-question">
              <span class="question-number">#{index + 1}</span>
              {answer.question}
            </div>
            <div class="review-answers">
              <div class="review-answer {answer.isCorrect ? 'correct' : 'incorrect'}">
                Twoja odpowiedź: {answer.selectedAnswer}
                {answer.isCorrect ? '✅' : '❌'}
              </div>
              {#if !answer.isCorrect}
                <div class="review-answer correct">
                  Poprawna odpowiedź: {answer.correctAnswer} ✅
                </div>
              {/if}
              {#if answer.explanation}
                <div class="review-explanation">
                  💡 {answer.explanation}
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>

      <div class="results-actions">
        <button class="retry-quiz-btn" on:click={resetQuiz}>
          🔄 Nowy Quiz
        </button>
        <button class="share-results-btn" on:click={() => {
          navigator.clipboard.writeText(`Ukończyłem quiz AI! Wynik: ${scorePercentage}% w kategorii ${topics.find(t => t.id === selectedTopic)?.name}`);
        }}>
          📤 Udostępnij wynik
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .quiz-widget-container {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
    border: 1px solid #00d9ff;
    border-radius: 0px !important;
    padding: 1.5rem;
    margin: 1rem 0;
    box-shadow: 0 0 20px rgba(0, 217, 255, 0.3);
  }

  .widget-title {
    color: #00d9ff;
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    text-align: center;
    text-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
  }

  .quiz-setup {
    space-y: 2rem;
  }

  .setup-section {
    margin-bottom: 2rem;
  }

  .setup-title {
    color: #ffffff;
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .topics-grid, .difficulty-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
  }

  .topic-card, .difficulty-card {
    background: #1a1a2e;
    border: 1px solid #333;
    border-radius: 0px !important;
    padding: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
  }

  .topic-card:hover, .difficulty-card:hover {
    border-color: #00d9ff;
    box-shadow: 0 0 10px rgba(0, 217, 255, 0.3);
    transform: translateY(-2px);
  }

  .topic-card.selected, .difficulty-card.selected {
    border-color: #00d9ff;
    background: rgba(0, 217, 255, 0.1);
    box-shadow: 0 0 15px rgba(0, 217, 255, 0.4);
  }

  .topic-name, .difficulty-name {
    color: #00d9ff;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .topic-description, .difficulty-description {
    color: #cccccc;
    font-size: 0.9rem;
  }

  .start-quiz-btn {
    background: linear-gradient(45deg, #00d9ff, #0099cc);
    color: #000;
    border: none;
    border-radius: 0px !important;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
    max-width: 300px;
    margin: 2rem auto 0;
    display: block;
  }

  .start-quiz-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 217, 255, 0.4);
  }

  .start-quiz-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .loading-container {
    text-align: center;
    padding: 3rem 1rem;
  }

  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 3px solid #333;
    border-top: 3px solid #00d9ff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  .loading-text {
    color: #ffffff;
    font-size: 1.1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error-container {
    text-align: center;
    padding: 2rem;
  }

  .error-text {
    color: #ff4444;
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }

  .retry-btn {
    background: #ff4444;
    color: white;
    border: none;
    border-radius: 0px !important;
    padding: 0.75rem 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .retry-btn:hover {
    background: #cc3333;
    transform: translateY(-2px);
  }

  .quiz-progress {
    margin-bottom: 2rem;
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: #333;
    border-radius: 0px !important;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #00d9ff, #0099cc);
    transition: width 0.3s ease;
  }

  .progress-text {
    color: #cccccc;
    text-align: center;
    font-size: 0.9rem;
  }

  .question-container {
    margin-bottom: 2rem;
  }

  .question-text {
    color: #ffffff;
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    line-height: 1.4;
  }

  .answers-grid {
    display: grid;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .answer-btn {
    background: #1a1a2e;
    border: 1px solid #333;
    border-radius: 0px !important;
    padding: 1rem;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
    font-size: 1rem;
  }

  .answer-btn:hover:not(:disabled) {
    border-color: #00d9ff;
    background: rgba(0, 217, 255, 0.1);
  }

  .answer-btn.selected {
    border-color: #00d9ff;
    background: rgba(0, 217, 255, 0.2);
    box-shadow: 0 0 10px rgba(0, 217, 255, 0.3);
  }

  .answer-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .submit-btn {
    background: linear-gradient(45deg, #00d9ff, #0099cc);
    color: #000;
    border: none;
    border-radius: 0px !important;
    padding: 1rem 2rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
  }

  .submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 217, 255, 0.4);
  }

  .feedback-container {
    background: rgba(0, 217, 255, 0.1);
    border: 1px solid #00d9ff;
    border-radius: 0px !important;
    padding: 1rem;
    margin-top: 1rem;
  }

  .feedback-text {
    color: #ffffff;
    font-size: 1rem;
    margin: 0;
  }

  .results-container {
    text-align: center;
  }

  .results-title {
    color: #00d9ff;
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 2rem;
  }

  .score-display {
    margin-bottom: 2rem;
  }

  .score-circle {
    width: 120px;
    height: 120px;
    border: 3px solid #00d9ff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
    background: rgba(0, 217, 255, 0.1);
  }

  .score-text {
    font-size: 2rem;
    font-weight: bold;
  }

  .score-description {
    color: #cccccc;
    font-size: 1.1rem;
  }

  .answers-review {
    text-align: left;
    margin: 2rem 0;
  }

  .review-title {
    color: #ffffff;
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }

  .answer-review {
    background: #1a1a2e;
    border: 1px solid #333;
    border-radius: 0px !important;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .review-question {
    color: #ffffff;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .question-number {
    color: #00d9ff;
    font-weight: bold;
  }

  .review-answer {
    padding: 0.5rem 0;
    font-size: 0.95rem;
  }

  .review-answer.correct {
    color: #4ade80;
  }

  .review-answer.incorrect {
    color: #f87171;
  }

  .review-explanation {
    color: #fbbf24;
    font-style: italic;
    padding: 0.5rem 0;
    font-size: 0.9rem;
  }

  .results-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 2rem;
  }

  .retry-quiz-btn, .share-results-btn {
    background: linear-gradient(45deg, #00d9ff, #0099cc);
    color: #000;
    border: none;
    border-radius: 0px !important;
    padding: 1rem 1.5rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .retry-quiz-btn:hover, .share-results-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 217, 255, 0.4);
  }

  .share-results-btn {
    background: linear-gradient(45deg, #10b981, #059669);
  }
</style>
