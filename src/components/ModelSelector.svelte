<script>
  import { onMount } from 'svelte';

  let models = {};
  let selectedModel = '';
  let loading = false;
  let message = '';
  let systemPrompt = '';
  let uploadedFiles = [];
  let showAdvanced = false;
  let saving = false;

  // Pobierz dostępne modele i ustawienia
  async function loadModels() {
    try {
      const response = await fetch('/api/models');
      const data = await response.json();

      models = data.models || {};
      selectedModel = data.selected_model || data.default_model;
      systemPrompt = data.system_prompt || 'Jesteś pomocnym asystentem AI dla MyBonzo - firmy specjalizującej się w projektowaniu graficznym i rozwiązaniach AI. Odpowiadaj po polsku.';
      uploadedFiles = data.uploaded_files || [];
    } catch (error) {
      console.error('Error loading models:', error);
      message = 'Błąd podczas ładowania modeli';
    }
  }

  // Zmień model
  async function selectModel(modelKey) {
    loading = true;
    message = '';

    try {
      const response = await fetch('/api/models/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model: modelKey })
      });

      const data = await response.json();

      if (data.success) {
        selectedModel = modelKey;
        message = `Model zmieniony na ${models[modelKey]?.name}`;
        setTimeout(() => message = '', 3000);
      } else {
        message = data.error || 'Błąd podczas zmiany modelu';
      }
    } catch (error) {
      console.error('Error selecting model:', error);
      message = 'Błąd podczas zmiany modelu';
    } finally {
      loading = false;
    }
  }

  // Zapisz prompt systemowy
  async function saveSystemPrompt() {
    saving = true;
    message = '';

    try {
      const response = await fetch('/api/models/system-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ system_prompt: systemPrompt })
      });

      const data = await response.json();

      if (data.success) {
        message = 'Prompt systemowy zapisany';
        setTimeout(() => message = '', 3000);
      } else {
        message = data.error || 'Błąd podczas zapisywania promptu';
      }
    } catch (error) {
      console.error('Error saving system prompt:', error);
      message = 'Błąd podczas zapisywania promptu';
    } finally {
      saving = false;
    }
  }

  // Upload pliku
  async function handleFileUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for (let file of files) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        loading = true;
        const response = await fetch('/api/models/upload', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          uploadedFiles = [...uploadedFiles, {
            name: file.name,
            size: file.size,
            type: file.type,
            id: data.file_id,
            uploaded_at: new Date().toISOString()
          }];
          message = `Plik ${file.name} został przesłany`;
        } else {
          message = data.error || 'Błąd podczas przesyłania pliku';
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        message = 'Błąd podczas przesyłania pliku';
      } finally {
        loading = false;
      }
    }
    
    // Reset input
    event.target.value = '';
  }

  // Usuń plik
  async function removeFile(fileId, fileName) {
    try {
      loading = true;
      const response = await fetch(`/api/models/upload/${fileId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        uploadedFiles = uploadedFiles.filter(f => f.id !== fileId);
        message = `Plik ${fileName} został usunięty`;
        setTimeout(() => message = '', 3000);
      } else {
        message = data.error || 'Błąd podczas usuwania pliku';
      }
    } catch (error) {
      console.error('Error removing file:', error);
      message = 'Błąd podczas usuwania pliku';
    } finally {
      loading = false;
    }
  }

  // Formatuj rozmiar pliku
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  onMount(() => {
    loadModels();
  });
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
  <!-- Header -->
  <div class="flex items-center justify-between mb-6">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
      Konfiguracja AI
    </h2>
    <button
      on:click={() => showAdvanced = !showAdvanced}
      class="px-4 py-2 text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-lg transition-colors"
    >
      {showAdvanced ? 'Ukryj zaawansowane' : 'Pokaż zaawansowane'}
    </button>
  </div>

  <!-- Status Message -->
  {#if message}
    <div class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <p class="text-sm text-blue-800 dark:text-blue-200">{message}</p>
    </div>
  {/if}

  <!-- Model Selection -->
  <div class="mb-6">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Wybór modelu AI</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {#each Object.entries(models) as [key, model]}
        <button
          on:click={() => selectModel(key)}
          disabled={loading}
          class="p-4 border-2 rounded-lg transition-all duration-200 {
            selectedModel === key 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md' 
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          } {loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}"
        >
          <div class="text-left">
            <h4 class="font-semibold text-gray-900 dark:text-white text-sm">{model.name}</h4>
            <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">{key}</p>
            {#if selectedModel === key}
              <div class="mt-2">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                  Aktywny
                </span>
              </div>
            {/if}
          </div>
        </button>
      {/each}
    </div>
  </div>

  <!-- Advanced Settings -->
  {#if showAdvanced}
    <div class="space-y-6">
      <!-- System Prompt -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Prompt systemowy</h3>
        <div class="space-y-3">
          <textarea
            bind:value={systemPrompt}
            placeholder="Wprowadź własny prompt systemowy..."
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          ></textarea>
          <button
            on:click={saveSystemPrompt}
            disabled={saving || !systemPrompt.trim()}
            class="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            {saving ? 'Zapisywanie...' : 'Zapisz prompt'}
          </button>
        </div>
      </div>

      <!-- File Upload -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Pliki kontekstowe</h3>
        <div class="space-y-4">
          <!-- Upload Area -->
          <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
            <input
              type="file"
              multiple
              on:change={handleFileUpload}
              accept=".txt,.pdf,.doc,.docx,.md,.json,.csv,.xlsx,.png,.jpg,.jpeg,.gif,.webp"
              class="hidden"
              id="file-upload"
            />
            <label for="file-upload" class="cursor-pointer">
              <div class="space-y-2">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <div class="text-gray-600 dark:text-gray-400">
                  <span class="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">Kliknij aby wybrać pliki</span>
                  <p class="text-sm">lub przeciągnij i upuść tutaj</p>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  PDF, DOC, TXT, MD, JSON, CSV, Excel, obrazy (max 10MB każdy)
                </p>
              </div>
            </label>
          </div>

          <!-- Uploaded Files List -->
          {#if uploadedFiles.length > 0}
            <div class="space-y-2">
              <h4 class="font-medium text-gray-900 dark:text-white">Przesłane pliki ({uploadedFiles.length})</h4>
              <div class="max-h-60 overflow-y-auto space-y-2">
                {#each uploadedFiles as file}
                  <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0">
                        {#if file.type.startsWith('image/')}
                          <svg class="h-6 w-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                          </svg>
                        {:else if file.type.includes('pdf')}
                          <svg class="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
                          </svg>
                        {:else}
                          <svg class="h-6 w-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                          </svg>
                        {/if}
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      on:click={() => removeFile(file.id, file.name)}
                      class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      title="Usuń plik"
                    >
                      <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clip-rule="evenodd" />
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}

  <!-- Loading Indicator -->
  {#if loading}
    <div class="flex items-center justify-center py-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span class="ml-2 text-gray-600 dark:text-gray-400">Przetwarzanie...</span>
    </div>
  {/if}
</div>
