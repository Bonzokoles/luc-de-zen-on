// Agent Data Management Functions
let agentData = [];
let dataIdCounter = 4;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadSavedData();
    setupEventListeners();
    loadSettings();
    console.log('📊 Agent Data Management - Ready');
});

// Data Management Functions
function loadSavedData() {
    try {
        const saved = localStorage.getItem('polaczek_agent_data');
        if (saved) {
            agentData = JSON.parse(saved);
            renderDataItems();
        }
    } catch (error) {
        console.error('Error loading saved data:', error);
    }
}

function saveData() {
    try {
        localStorage.setItem('polaczek_agent_data', JSON.stringify(agentData));
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// Event Listeners Setup
function setupEventListeners() {
    // File upload drag & drop
    const uploadArea = document.querySelector('.upload-area');
    const fileInput = document.getElementById('fileInput');

    if (uploadArea && fileInput) {
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'rgba(0, 217, 255, 0.8)';
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'rgba(0, 217, 255, 0.4)';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'rgba(0, 217, 255, 0.4)';
            handleFileUpload(e.dataTransfer.files);
        });

        fileInput.addEventListener('change', (e) => {
            handleFileUpload(e.target.files);
        });
    }
}

// File Processing Functions
function handleFileUpload(files) {
    for (let file of files) {
        processFile(file);
    }
}

function processFile(file) {
    updateProcessingStatus(`📄 Przetwarzanie: ${file.name}...`);

    // Simulate file processing
    setTimeout(() => {
        const dataItem = {
            id: dataIdCounter++,
            type: getFileType(file.name),
            title: file.name,
            preview: `Plik ${file.name} został pomyślnie przesłany i przetworzony.`,
            date: new Date().toLocaleString('pl-PL'),
            size: formatFileSize(file.size),
            content: '', // In real implementation, would contain extracted text
            stats: [formatFileSize(file.size), 'Aktywne']
        };

        agentData.push(dataItem);
        saveData();
        renderDataItems();

        updateProcessingStatus(`✅ Zakończono przetwarzanie: ${file.name}`);

        setTimeout(() => {
            const statusEl = document.getElementById('processingStatus');
            if (statusEl) {
                statusEl.innerHTML = '<div class="status-placeholder">Brak aktywnych operacji przetwarzania...</div>';
            }
        }, 2000);

    }, 2000);
}

function getFileType(filename) {
    const extension = filename.toLowerCase().split('.').pop();
    switch (extension) {
        case 'pdf': case 'doc': case 'docx': return 'document';
        case 'json': case 'csv': case 'xml': case 'yaml': return 'structured';
        case 'txt': case 'md': return 'text';
        default: return 'document';
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Text Management Functions
function addCustomText() {
    const textArea = document.getElementById('customText');
    if (!textArea) return;

    const text = textArea.value.trim();

    if (!text) {
        alert('Wprowadź tekst do dodania');
        return;
    }

    updateProcessingStatus('📝 Przetwarzanie tekstu...');

    setTimeout(() => {
        const dataItem = {
            id: dataIdCounter++,
            type: 'text',
            title: `Niestandardowy tekst ${dataIdCounter - 1}`,
            preview: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
            date: new Date().toLocaleString('pl-PL'),
            content: text,
            stats: [`${text.length} znaków`, 'Aktywne']
        };

        agentData.push(dataItem);
        saveData();
        renderDataItems();
        textArea.value = '';

        updateProcessingStatus('✅ Tekst został dodany pomyślnie');

        setTimeout(() => {
            const statusEl = document.getElementById('processingStatus');
            if (statusEl) {
                statusEl.innerHTML = '<div class="status-placeholder">Brak aktywnych operacji przetwarzania...</div>';
            }
        }, 2000);

    }, 1000);
}

function clearTextArea() {
    const textArea = document.getElementById('customText');
    if (textArea) {
        textArea.value = '';
    }
}

// URL Import Functions
function importFromURL() {
    const urlInput = document.getElementById('urlInput');
    if (!urlInput) return;

    const url = urlInput.value.trim();

    if (!url) {
        alert('Wprowadź poprawny URL');
        return;
    }

    updateProcessingStatus(`🌐 Pobieranie danych z: ${url}...`);

    // Simulate URL import
    setTimeout(() => {
        const dataItem = {
            id: dataIdCounter++,
            type: 'url',
            title: `Import z ${new URL(url).hostname}`,
            preview: `Dane pobrane z ${url}`,
            date: new Date().toLocaleString('pl-PL'),
            source_url: url,
            stats: ['Import URL', 'Aktywne']
        };

        agentData.push(dataItem);
        saveData();
        renderDataItems();
        urlInput.value = '';

        updateProcessingStatus('✅ Import z URL zakończony pomyślnie');

        setTimeout(() => {
            const statusEl = document.getElementById('processingStatus');
            if (statusEl) {
                statusEl.innerHTML = '<div class="status-placeholder">Brak aktywnych operacji przetwarzania...</div>';
            }
        }, 2000);

    }, 3000);
}

function previewURL() {
    const urlInput = document.getElementById('urlInput');
    if (!urlInput) return;

    const url = urlInput.value.trim();
    if (url) {
        window.open(url, '_blank');
    } else {
        alert('Wprowadź URL do podglądu');
    }
}

// Structured Data Functions
function validateStructuredData() {
    const formatSelect = document.getElementById('dataFormat');
    const dataTextarea = document.getElementById('structuredData');

    if (!formatSelect || !dataTextarea) return;

    const format = formatSelect.value;
    const data = dataTextarea.value.trim();

    if (!data) {
        alert('Wprowadź dane do walidacji');
        return;
    }

    try {
        switch (format) {
            case 'json':
                JSON.parse(data);
                alert('✅ Poprawny format JSON');
                break;
            case 'csv':
                // Basic CSV validation
                if (data.includes(',') || data.includes('\n')) {
                    alert('✅ Format CSV wygląda poprawnie');
                } else {
                    alert('⚠️ Sprawdź format CSV');
                }
                break;
            case 'xml':
                // Basic XML validation
                if (data.includes('<') && data.includes('>')) {
                    alert('✅ Format XML wygląda poprawnie');
                } else {
                    alert('⚠️ Sprawdź format XML');
                }
                break;
            default:
                alert('✅ Dane przeszły podstawową walidację');
        }
    } catch (error) {
        alert(`❌ Błąd walidacji: ${error.message}`);
    }
}

function addStructuredData() {
    const formatSelect = document.getElementById('dataFormat');
    const dataTextarea = document.getElementById('structuredData');

    if (!formatSelect || !dataTextarea) return;

    const format = formatSelect.value;
    const data = dataTextarea.value.trim();

    if (!data) {
        alert('Wprowadź dane strukturalne');
        return;
    }

    updateProcessingStatus(`🗂️ Przetwarzanie danych ${format.toUpperCase()}...`);

    setTimeout(() => {
        const dataItem = {
            id: dataIdCounter++,
            type: 'structured',
            title: `Dane ${format.toUpperCase()} ${dataIdCounter - 1}`,
            preview: data.substring(0, 100) + (data.length > 100 ? '...' : ''),
            date: new Date().toLocaleString('pl-PL'),
            format: format,
            content: data,
            stats: [`Format ${format.toUpperCase()}`, 'Aktywne']
        };

        agentData.push(dataItem);
        saveData();
        renderDataItems();
        dataTextarea.value = '';

        updateProcessingStatus('✅ Dane strukturalne zostały dodane');

        setTimeout(() => {
            const statusEl = document.getElementById('processingStatus');
            if (statusEl) {
                statusEl.innerHTML = '<div class="status-placeholder">Brak aktywnych operacji przetwarzania...</div>';
            }
        }, 2000);

    }, 1500);
}

// Data Rendering Functions
function renderDataItems() {
    const container = document.getElementById('dataItemsContainer');
    if (!container) return;

    if (agentData.length === 0) {
        container.innerHTML = '<div class="status-placeholder">Brak dodanych danych. Użyj metod powyżej, aby dodać treści dla swoich agentów.</div>';
        return;
    }

    container.innerHTML = agentData.map(item => `
    <div class="data-item" data-type="${item.type}" data-id="${item.id}">
      <div class="item-header">
        <div class="item-type">${getTypeIcon(item.type)} ${getTypeName(item.type)}</div>
        <div class="item-date">${item.date}</div>
        <div class="item-actions">
          <button onclick="editDataItem(${item.id})" class="edit-item-btn">✏️</button>
          <button onclick="deleteDataItem(${item.id})" class="delete-item-btn">🗑️</button>
        </div>
      </div>
      <div class="item-title">${item.title}</div>
      <div class="item-preview">${item.preview}</div>
      <div class="item-stats">
        ${item.stats.map(stat => `<span class="stat">${stat}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

function getTypeIcon(type) {
    const icons = {
        'text': '📝',
        'document': '📄',
        'structured': '🗂️',
        'url': '🌐'
    };
    return icons[type] || '📄';
}

function getTypeName(type) {
    const names = {
        'text': 'Tekst',
        'document': 'Dokument',
        'structured': 'Dane strukturalne',
        'url': 'Import URL'
    };
    return names[type] || 'Dokument';
}

// Filter and Search Functions
function filterDataItems() {
    const searchTerm = document.getElementById('searchData')?.value.toLowerCase() || '';
    const filterType = document.getElementById('filterType')?.value || 'all';

    const items = document.querySelectorAll('.data-item');

    items.forEach(item => {
        const itemType = item.dataset.type;
        const itemText = item.textContent.toLowerCase();

        const matchesSearch = !searchTerm || itemText.includes(searchTerm);
        const matchesFilter = filterType === 'all' || itemType === filterType;

        item.style.display = (matchesSearch && matchesFilter) ? 'block' : 'none';
    });
}

// Data Item Management
function editDataItem(id) {
    const item = agentData.find(d => d.id === id);
    if (!item) return;

    const newTitle = prompt('Nowy tytuł:', item.title);
    if (newTitle && newTitle.trim()) {
        item.title = newTitle.trim();
        saveData();
        renderDataItems();
    }
}

function deleteDataItem(id) {
    const item = agentData.find(d => d.id === id);
    if (!item) return;

    if (confirm(`Czy na pewno chcesz usunąć "${item.title}"?`)) {
        agentData = agentData.filter(d => d.id !== id);
        saveData();
        renderDataItems();
    }
}

// Library Management Functions
function refreshLibrary() {
    updateProcessingStatus('🔄 Odświeżanie biblioteki danych...');

    setTimeout(() => {
        renderDataItems();
        updateProcessingStatus('✅ Biblioteka została odświeżona');

        setTimeout(() => {
            const statusEl = document.getElementById('processingStatus');
            if (statusEl) {
                statusEl.innerHTML = '<div class="status-placeholder">Brak aktywnych operacji przetwarzania...</div>';
            }
        }, 2000);
    }, 1000);
}

function exportLibrary() {
    if (agentData.length === 0) {
        alert('Brak danych do eksportu');
        return;
    }

    const exportData = {
        version: '1.0',
        exported_at: new Date().toLocaleString('pl-PL'),
        total_items: agentData.length,
        data: agentData
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    const today = new Date();
    const dateStr = today.getFullYear() + '-' +
        String(today.getMonth() + 1).padStart(2, '0') + '-' +
        String(today.getDate()).padStart(2, '0');
    link.download = `polaczek_agent_data_${dateStr}.json`;
    link.click();

    updateProcessingStatus('📦 Dane zostały wyeksportowane');
}

function clearLibrary() {
    if (agentData.length === 0) {
        alert('Biblioteka jest już pusta');
        return;
    }

    if (confirm('⚠️ UWAGA: To usunie WSZYSTKIE dane z biblioteki!\n\nCzy na pewno chcesz kontynuować?')) {
        agentData = [];
        saveData();
        renderDataItems();
        updateProcessingStatus('🗑️ Biblioteka została wyczyszczona');
    }
}

// Status Management
function updateProcessingStatus(message) {
    const status = document.getElementById('processingStatus');
    if (!status) return;

    const timestamp = new Date().toLocaleTimeString();
    status.innerHTML = `<div style="color: #00d9ff;">[${timestamp}] ${message}</div>`;
}

// Settings Management
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('polaczek_agent_settings') || '{}');

    Object.keys(settings).forEach(setting => {
        const checkbox = document.getElementById(setting);
        if (checkbox) {
            checkbox.checked = settings[setting];
        }
    });
}

function resetSettings() {
    if (confirm('Czy na pewno chcesz przywrócić domyślne ustawienia?')) {
        localStorage.removeItem('polaczek_agent_settings');

        // Reset all checkboxes to default values
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            const defaultChecked = ['autoProcessing', 'textExtraction', 'localBackup', 'includeMetadata', 'preserveStructure', 'validateOnImport', 'showNotifications'].includes(checkbox.id);
            checkbox.checked = defaultChecked;
        });

        alert('Ustawienia zostały przywrócone do wartości domyślnych');
    }
}

function exportSettings() {
    const settings = JSON.parse(localStorage.getItem('polaczek_agent_settings') || '{}');
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'polaczek_agent_settings.json';
    link.click();
}

function importSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const settings = JSON.parse(event.target.result);
                    localStorage.setItem('polaczek_agent_settings', JSON.stringify(settings));
                    loadSettings();
                    alert('Ustawienia zostały zaimportowane pomyślnie');
                } catch (error) {
                    alert('Błąd podczas importu ustawień: ' + error.message);
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

// Settings change handler
document.addEventListener('change', (e) => {
    if (e.target.type === 'checkbox') {
        const setting = e.target.id;
        const enabled = e.target.checked;

        console.log(`Setting ${setting}: ${enabled ? 'enabled' : 'disabled'}`);

        // Save settings to localStorage
        const settings = JSON.parse(localStorage.getItem('polaczek_agent_settings') || '{}');
        settings[setting] = enabled;
        localStorage.setItem('polaczek_agent_settings', JSON.stringify(settings));
    }
});

// Make functions globally available
window.addCustomText = addCustomText;
window.clearTextArea = clearTextArea;
window.importFromURL = importFromURL;
window.previewURL = previewURL;
window.validateStructuredData = validateStructuredData;
window.addStructuredData = addStructuredData;
window.filterDataItems = filterDataItems;
window.editDataItem = editDataItem;
window.deleteDataItem = deleteDataItem;
window.refreshLibrary = refreshLibrary;
window.exportLibrary = exportLibrary;
window.clearLibrary = clearLibrary;
window.resetSettings = resetSettings;
window.exportSettings = exportSettings;
window.importSettings = importSettings;