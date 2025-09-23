
<script>
  let status = 'idle'; // idle, recording, processing, finished
  let mediaRecorder;
  let audioChunks = [];
  let userAudioURL = '';
  let assistantResponseText = '';

  async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        status = 'recording';
        audioChunks = [];
        userAudioURL = '';
        assistantResponseText = '';

        mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);

        mediaRecorder.onstop = async () => {
            status = 'processing';
            const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
            userAudioURL = URL.createObjectURL(audioBlob);

            try {
                const response = await fetch("/api/voice-handler", {
                    method: "POST",
                    body: await audioBlob.arrayBuffer()
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Błąd serwera głosowego');
                }

                const responseAudioBuffer = await response.arrayBuffer();
                if (responseAudioBuffer.byteLength > 0) {
                    const ttsBlob = new Blob([responseAudioBuffer], { type: "audio/mpeg" });
                    const ttsUrl = URL.createObjectURL(ttsBlob);
                    const audio = new Audio(ttsUrl);
                    audio.play();
                    assistantResponseText = "Asystent odpowiada (głosowo)...";
                } else {
                    // Handle mock response with no real audio
                    assistantResponseText = "Odpowiedź audio (mock). Sprawdź konsolę deweloperską, aby zobaczyć przepływ.";
                }

            } catch (err) {
                assistantResponseText = `Błąd: ${err.message}`;
            } finally {
                status = 'finished';
            }
        };
    } catch (err) {
        assistantResponseText = "Nie można uzyskać dostępu do mikrofonu. Sprawdź uprawnienia.";
        status = 'idle';
    }
  }

  function stopRecording() {
    if (mediaRecorder) {
        mediaRecorder.stop();
    }
  }

  function getStatusText() {
      switch(status) {
          case 'idle': return 'Naciśnij, aby mówić';
          case 'recording': return 'Nagrywanie...';
          case 'processing': return 'Bielik analizuje...';
          case 'finished': return 'Gotowe. Naciśnij ponownie.';
          default: return 'Gotowość';
      }
  }
</script>

<div class="bg-cyber-surface border border-cyber-border rounded-none p-6 text-center flex flex-col items-center justify-center h-full">
    <h3 class="text-lg font-bold text-cyber-blue mb-4">BIELIK VOICE ASSISTANT</h3>
    
    <button 
        on:click={status === 'recording' ? stopRecording : startRecording}
        disabled={status === 'processing'}
        class="w-24 h-24 rounded-full border-2 flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-wait"
        class:border-cyber-blue={status !== 'recording'}
        class:shadow-glow-blue={status !== 'recording'}
        class:bg-red-500={status === 'recording'}
        class:border-red-500={status === 'recording'}
        class:animate-pulse={status === 'recording' || status === 'processing'}
    >
        <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.7z"/></svg>
    </button>

    <p class="font-mono text-sm text-cyber-text-dim mt-4 h-4">{getStatusText()}</p>

    <div class="w-full bg-cyber-dark mt-4 p-4 border border-cyber-border/50 min-h-[80px] text-left space-y-3 font-mono text-sm">
        {#if userAudioURL}
            <div class="flex items-center gap-2">
                <span class="text-cyber-text-dim">[USER_AUDIO]:</span>
                <audio src={userAudioURL} controls class="h-8 w-full"></audio>
            </div>
        {/if}
        <div>
            <span class="text-cyber-text-dim">[BIELIK_RESPONSE]: </span>
            <span class="text-cyber-blue">{assistantResponseText || '...'}</span>
        </div>
    </div>
</div>
