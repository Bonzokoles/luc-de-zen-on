
<script>
  let recognition = null;
  let isRecording = false;

  function initializeVoiceRecognition() {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'pl-PL';

      recognition.onstart = () => {
        isRecording = true;
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        // Dispatch the command to the parent component
        const customEvent = new CustomEvent('voicecommand', { detail: transcript });
        window.dispatchEvent(customEvent);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        isRecording = false;
      };

      recognition.onend = () => {
        isRecording = false;
      };
    }
  }

  function toggleRecording() {
    if (!recognition) {
      initializeVoiceRecognition();
    }

    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
    }
  }
</script>

<div class="voice-control">
  <button on:click={toggleRecording} class="action-btn">
    {#if isRecording}
      <span>🔴</span>
    {:else}
      <span>🎤</span>
    {/if}
  </button>
</div>
