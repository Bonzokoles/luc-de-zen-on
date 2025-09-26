<script lang="ts">
  import { onMount } from "svelte";
  import type { FileItem } from "./api";

  interface FileManagerState {
    currentPath: string;
    files: FileItem[];
    selectedFiles: string[];
    viewMode: "list" | "grid";
    sortBy: "name" | "size" | "modified";
    sortOrder: "asc" | "desc";
    loading: boolean;
    error: string;
    success: string;
  }

  let state: FileManagerState = {
    currentPath: "./src",
    files: [],
    selectedFiles: [],
    viewMode: "list",
    sortBy: "name",
    sortOrder: "asc",
    loading: false,
    error: "",
    success: "",
  };

  let searchQuery = "";
  let showUploadModal = false;
  let uploadContent = "";
  let uploadFilename = "";
  let newFolderName = "";
  let showNewFolderModal = false;

  onMount(() => {
    loadFiles();
  });

  async function callAPI(action: string, data: any = {}) {
    try {
      state.loading = true;
      state.error = "";

      const response = await fetch("/api/agents/file-manager", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...data }),
      });

      const result = await response.json();

      if (result.success) {
        state.success = result.message;
        setTimeout(() => (state.success = ""), 3000);
        return result.data;
      } else {
        state.error = result.message || "Błąd operacji";
        return null;
      }
    } catch (error) {
      state.error = "Błąd połączenia z serwerem";
      console.error("File Manager API Error:", error);
      return null;
    } finally {
      state.loading = false;
    }
  }

  async function loadFiles() {
    const data = await callAPI("list", { path: state.currentPath });
    if (data) {
      state.files = data.sort((a: FileItem, b: FileItem) => {
        if (a.type !== b.type) {
          return a.type === "directory" ? -1 : 1;
        }
        const aValue = a[state.sortBy] || "";
        const bValue = b[state.sortBy] || "";
        const result = aValue.toString().localeCompare(bValue.toString());
        return state.sortOrder === "asc" ? result : -result;
      });
    }
  }

  async function navigateToPath(newPath: string) {
    state.currentPath = newPath;
    await loadFiles();
  }

  async function goUp() {
    const pathParts = state.currentPath.split("/");
    if (pathParts.length > 1) {
      pathParts.pop();
      await navigateToPath(pathParts.join("/") || "/");
    }
  }

  async function deleteFile(filePath: string) {
    if (confirm("Czy na pewno chcesz usunąć ten plik?")) {
      const result = await callAPI("delete", { path: filePath });
      if (result) {
        await loadFiles();
      }
    }
  }

  async function uploadFile() {
    if (!uploadFilename || !uploadContent) {
      state.error = "Podaj nazwę pliku i zawartość";
      return;
    }

    const result = await callAPI("upload", {
      path: state.currentPath,
      filename: uploadFilename,
      content: uploadContent,
    });

    if (result) {
      showUploadModal = false;
      uploadFilename = "";
      uploadContent = "";
      await loadFiles();
    }
  }

  async function createFolder() {
    if (!newFolderName) {
      state.error = "Podaj nazwę folderu";
      return;
    }

    const folderPath = `${state.currentPath}/${newFolderName}`;
    const result = await callAPI("create-folder", { path: folderPath });

    if (result) {
      showNewFolderModal = false;
      newFolderName = "";
      await loadFiles();
    }
  }

  async function searchFiles() {
    if (!searchQuery.trim()) {
      await loadFiles();
      return;
    }

    const data = await callAPI("search", {
      query: searchQuery,
      path: state.currentPath,
      recursive: true,
    });

    if (data) {
      state.files = data;
    }
  }

  function formatFileSize(bytes: number | undefined): string {
    if (!bytes) return "";
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  function formatDate(date: Date | undefined): string {
    if (!date) return "";
    return new Date(date).toLocaleString("pl-PL");
  }

  function getFileIcon(file: FileItem): string {
    if (file.type === "directory") return "📁";

    const ext = file.extension?.toLowerCase();
    const iconMap: Record<string, string> = {
      ".js": "🟨",
      ".ts": "🔷",
      ".json": "📋",
      ".html": "🌐",
      ".css": "🎨",
      ".scss": "💜",
      ".md": "📝",
      ".txt": "📄",
      ".py": "🐍",
      ".jpg": "🖼️",
      ".jpeg": "🖼️",
      ".png": "🖼️",
      ".gif": "🖼️",
      ".mp4": "🎬",
      ".mp3": "🎵",
      ".wav": "🎵",
      ".pdf": "📕",
      ".zip": "📦",
      ".rar": "📦",
    };

    return iconMap[ext || ""] || "📄";
  }
</script>

<div class="file-manager no-radius">
  <!-- Header with breadcrumb and controls -->
  <div class="file-manager-header glass-panel p-4">
    <div class="flex items-center justify-between mb-4">
      <h2 class="polish-title text-xl">📁 Menedżer Plików</h2>
      <div class="flex gap-2">
        <button class="btn" on:click={() => (showUploadModal = true)}>
          📤 Prześlij plik
        </button>
        <button class="btn" on:click={() => (showNewFolderModal = true)}>
          📁 Nowy folder
        </button>
        <button class="btn" on:click={loadFiles}> 🔄 Odśwież </button>
      </div>
    </div>

    <!-- Breadcrumb -->
    <div class="breadcrumb flex items-center gap-2 mb-4">
      <button class="btn" on:click={goUp}>⬆️ Wyżej</button>
      <span class="text-cyan-400">📍 {state.currentPath}</span>
    </div>

    <!-- Search and filters -->
    <div class="filters flex gap-4 items-center">
      <div class="search-box flex-1">
        <input
          type="text"
          class="input w-full"
          placeholder="🔍 Szukaj plików..."
          bind:value={searchQuery}
          on:input={searchFiles}
        />
      </div>

      <select class="input" bind:value={state.viewMode}>
        <option value="list">📋 Lista</option>
        <option value="grid">📊 Siatka</option>
      </select>

      <select class="input" bind:value={state.sortBy} on:change={loadFiles}>
        <option value="name">📝 Nazwa</option>
        <option value="size">📏 Rozmiar</option>
        <option value="modified">📅 Data</option>
      </select>
    </div>
  </div>

  <!-- Status messages -->
  {#if state.error}
    <div class="alert alert-error glass-panel p-3 mx-4 mb-4">
      ❌ {state.error}
    </div>
  {/if}

  {#if state.success}
    <div class="alert alert-success glass-panel p-3 mx-4 mb-4">
      ✅ {state.success}
    </div>
  {/if}

  <!-- File list -->
  <div class="file-list-container">
    {#if state.loading}
      <div class="loading-spinner p-8 text-center">
        <div class="pulse-cyber">⚡ Ładowanie plików...</div>
      </div>
    {:else if state.files.length === 0}
      <div class="empty-state glass-panel p-8 text-center mx-4">
        📭 Brak plików w tym folderze
      </div>
    {:else}
      <div
        class="file-grid {state.viewMode === 'grid'
          ? 'grid grid-cols-4 gap-4'
          : 'flex flex-col'} p-4"
      >
        {#each state.files as file}
          <div
            class="file-item card hover:neon-border transition-all cursor-pointer"
          >
            <div class="file-info flex items-center gap-3">
              <span class="file-icon text-2xl">{getFileIcon(file)}</span>
              <div class="file-details flex-1">
                <div class="file-name font-semibold polish-text">
                  {#if file.type === "directory"}
                    <button
                      class="text-cyan-400 hover:text-cyan-300"
                      on:click={() => navigateToPath(file.path)}
                    >
                      {file.name}
                    </button>
                  {:else}
                    {file.name}
                  {/if}
                </div>
                <div class="file-meta text-sm text-gray-400">
                  {formatFileSize(file.size)} • {formatDate(file.modified)}
                </div>
              </div>

              <div class="file-actions flex gap-2">
                {#if file.type !== "directory"}
                  <button
                    class="btn-small"
                    title="Pobierz"
                    on:click={() => callAPI("download", { path: file.path })}
                  >
                    💾
                  </button>
                {/if}
                <button
                  class="btn-small text-red-400 hover:bg-red-400 hover:text-black"
                  title="Usuń"
                  on:click={() => deleteFile(file.path)}
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<!-- Upload Modal -->
{#if showUploadModal}
  <div class="modal" on:click|self={() => (showUploadModal = false)}>
    <div class="modal-content">
      <h3 class="polish-title mb-4">📤 Prześlij plik</h3>

      <div class="form-group mb-4">
        <label class="block mb-2 polish-text">Nazwa pliku:</label>
        <input
          type="text"
          class="input"
          bind:value={uploadFilename}
          placeholder="nazwa-pliku.txt"
        />
      </div>

      <div class="form-group mb-4">
        <label class="block mb-2 polish-text">Zawartość:</label>
        <textarea
          class="input h-32"
          bind:value={uploadContent}
          placeholder="Wpisz zawartość pliku..."
        ></textarea>
      </div>

      <div class="modal-actions flex gap-2 justify-end">
        <button class="btn" on:click={() => (showUploadModal = false)}
          >❌ Anuluj</button
        >
        <button class="btn neon-border" on:click={uploadFile}
          >📤 Prześlij</button
        >
      </div>
    </div>
  </div>
{/if}

<!-- New Folder Modal -->
{#if showNewFolderModal}
  <div class="modal" on:click|self={() => (showNewFolderModal = false)}>
    <div class="modal-content">
      <h3 class="polish-title mb-4">📁 Nowy folder</h3>

      <div class="form-group mb-4">
        <label class="block mb-2 polish-text">Nazwa folderu:</label>
        <input
          type="text"
          class="input"
          bind:value={newFolderName}
          placeholder="nowy-folder"
        />
      </div>

      <div class="modal-actions flex gap-2 justify-end">
        <button class="btn" on:click={() => (showNewFolderModal = false)}
          >❌ Anuluj</button
        >
        <button class="btn neon-border" on:click={createFolder}
          >📁 Utwórz</button
        >
      </div>
    </div>
  </div>
{/if}

<style>
  .file-manager {
    background: var(--cyber-dark);
    border: 1px solid var(--cyber-border);
    min-height: 600px;
  }

  .file-item {
    transition: all 0.2s;
  }

  .file-item:hover {
    border-color: var(--color-primary);
    box-shadow: 0 0 10px var(--color-primary);
  }

  .btn-small {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    color: var(--cyber-text);
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-small:hover {
    background: var(--color-primary);
    color: var(--cyber-dark);
  }

  .alert {
    border-radius: 0 !important;
  }

  .alert-error {
    border-left: 4px solid #ff3333;
    background: rgba(255, 51, 51, 0.1);
  }

  .alert-success {
    border-left: 4px solid #00ff00;
    background: rgba(0, 255, 0, 0.1);
  }

  .loading-spinner {
    color: var(--color-primary);
    font-size: 1.2rem;
  }

  textarea.input {
    resize: vertical;
    min-height: 8rem;
  }
</style>
