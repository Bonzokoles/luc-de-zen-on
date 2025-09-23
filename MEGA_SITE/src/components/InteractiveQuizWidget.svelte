<script lang="ts">
  interface Question {
    id: number;
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  }

  const quizQuestions: Question[] = [
    {
      id: 1,
      question: "Co to jest POLACZEK Agent?",
      options: [
        "System operacyjny dla AI",
        "Zaawansowany agent AI dostosowany do języka polskiego",
        "Biblioteka do tworzenia chatbotów",
        "Narzędzie do tłumaczeń"
      ],
      correct: 1,
      explanation: "POLACZEK Agent to specjalny agent AI dostosowany do polskiej kultury i języka z zaawansowanymi możliwościami konwersacyjnymi."
    },
    {
      id: 2,
      question: "Które z poniższych to funkcje MEGA SITE?",
      options: [
        "Tylko generowanie obrazów",
        "Voice AI, Admin Dashboard, POLACZEK Agent i Stable Diffusion",
        "Tylko czat z AI",
        "Tylko panel administracyjny"
      ],
      correct: 1,
      explanation: "MEGA SITE oferuje kompletny pakiet funkcji AI: Voice Assistant, Admin Dashboard, POLACZEK Agent, Stable Diffusion i Multi AI Chat."
    },
    {
      id: 3,
      question: "Jaka jest główna zaleta Voice AI Assistant?",
      options: [
        "Działa tylko po angielsku",
        "Pełna obsługa języka polskiego z rozpoznawaniem mowy",
        "Tylko synteza głosu",
        "Brak zaawansowanych funkcji"
      ],
      correct: 1,
      explanation: "Voice AI Assistant oferuje pełną obsługę języka polskiego z zaawansowanym rozpoznawaniem mowy i syntezą głosu."
    }
  ];

  let currentQuestion = 0;
  let selectedAnswer: number | null = null;
  let showExplanation = false;
  let score = 0;
  let quizCompleted = false;
  let answers: boolean[] = [];

  function selectAnswer(optionIndex: number) {
    selectedAnswer = optionIndex;
  }

  function submitAnswer() {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === quizQuestions[currentQuestion].correct;
    answers[currentQuestion] = isCorrect;
    
    if (isCorrect) {
      score++;
    }
    
    showExplanation = true;
  }

  function nextQuestion() {
    if (currentQuestion < quizQuestions.length - 1) {
      currentQuestion++;
      selectedAnswer = null;
      showExplanation = false;
    } else {
      quizCompleted = true;
    }
  }

  function restartQuiz() {
    currentQuestion = 0;
    selectedAnswer = null;
    showExplanation = false;
    score = 0;
    quizCompleted = false;
    answers = [];
  }

  $: progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
</script>

<div class="quiz-widget bg-gray-800/50 rounded-lg p-6">
  <h4 class="text-lg font-bold text-cyan-400 mb-4">Quiz AI - Test swojej wiedzy</h4>
  
  {#if !quizCompleted}
    <!-- Progress bar -->
    <div class="mb-6">
      <div class="flex justify-between text-sm text-gray-400 mb-2">
        <span>Pytanie {currentQuestion + 1} z {quizQuestions.length}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div class="w-full bg-gray-700 rounded-full h-2">
        <div 
          class="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
          style="width: {progress}%"
        ></div>
      </div>
    </div>

    <!-- Question -->
    <div class="mb-6">
      <h5 class="text-white text-lg mb-4">{quizQuestions[currentQuestion].question}</h5>
      
      <!-- Options -->
      <div class="space-y-3">
        {#each quizQuestions[currentQuestion].options as option, index}
          <button
            class="w-full text-left p-3 rounded-lg border transition-all duration-200 
                   {selectedAnswer === index 
                     ? 'bg-cyan-600 border-cyan-500 text-white' 
                     : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-gray-500'
                   }
                   {showExplanation && index === quizQuestions[currentQuestion].correct
                     ? 'ring-2 ring-green-500'
                     : ''
                   }
                   {showExplanation && selectedAnswer === index && index !== quizQuestions[currentQuestion].correct
                     ? 'ring-2 ring-red-500'
                     : ''
                   }"
            on:click={() => selectAnswer(index)}
            disabled={showExplanation}
          >
            <div class="flex items-center">
              <span class="w-6 h-6 rounded-full border-2 mr-3 flex-shrink-0 flex items-center justify-center
                           {selectedAnswer === index ? 'border-white bg-white' : 'border-gray-400'}">
                {#if selectedAnswer === index}
                  <div class="w-2 h-2 rounded-full bg-cyan-600"></div>
                {/if}
              </span>
              <span>{option}</span>
            </div>
          </button>
        {/each}
      </div>
    </div>

    <!-- Explanation -->
    {#if showExplanation}
      <div class="mb-6 p-4 bg-blue-900/30 border border-blue-500/30 rounded-lg">
        <h6 class="text-blue-400 font-semibold mb-2">Wyjaśnienie:</h6>
        <p class="text-gray-300">{quizQuestions[currentQuestion].explanation}</p>
      </div>
    {/if}

    <!-- Action buttons -->
    <div class="flex justify-between">
      <button
        class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors duration-200"
        on:click={restartQuiz}
      >
        Restart
      </button>
      
      {#if !showExplanation}
        <button
          class="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          on:click={submitAnswer}
          disabled={selectedAnswer === null}
        >
          Sprawdź odpowiedź
        </button>
      {:else}
        <button
          class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200"
          on:click={nextQuestion}
        >
          {currentQuestion < quizQuestions.length - 1 ? 'Następne pytanie' : 'Zakończ quiz'}
        </button>
      {/if}
    </div>
  {:else}
    <!-- Quiz results -->
    <div class="text-center">
      <div class="mb-6">
        <div class="text-4xl mb-4">
          {#if score === quizQuestions.length}
            🏆
          {:else if score >= quizQuestions.length * 0.7}
            🎉
          {:else}
            📚
          {/if}
        </div>
        <h5 class="text-2xl text-white mb-2">Quiz zakończony!</h5>
        <div class="text-xl text-cyan-400 mb-4">
          Twój wynik: {score}/{quizQuestions.length}
          ({Math.round((score/quizQuestions.length) * 100)}%)
        </div>
        
        <div class="text-gray-300 mb-6">
          {#if score === quizQuestions.length}
            Doskonale! Znasz MEGA SITE na wylot! 🎯
          {:else if score >= quizQuestions.length * 0.7}
            Świetnie! Masz dobrą wiedzę o naszej platformie! 👍
          {:else}
            Nie martw się! Poznaj nasze funkcje i spróbuj ponownie! 💪
          {/if}
        </div>
      </div>

      <!-- Results breakdown -->
      <div class="mb-6 p-4 bg-gray-700/50 rounded-lg">
        <h6 class="text-gray-300 font-semibold mb-3">Szczegóły odpowiedzi:</h6>
        <div class="space-y-2">
          {#each answers as correct, index}
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-400">Pytanie {index + 1}</span>
              <span class="{correct ? 'text-green-400' : 'text-red-400'}">
                {correct ? '✓ Poprawne' : '✗ Niepoprawne'}
              </span>
            </div>
          {/each}
        </div>
      </div>

      <button
        class="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md transition-colors duration-200"
        on:click={restartQuiz}
      >
        Spróbuj ponownie
      </button>
    </div>
  {/if}
</div>

<style>
  .quiz-widget {
    min-height: 400px;
    border: 1px solid rgba(34, 211, 238, 0.3);
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .quiz-widget h5 {
    line-height: 1.4;
  }
</style>
