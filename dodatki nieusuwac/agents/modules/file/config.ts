export interface FileManagerConfig {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  version: string;
  capabilities: string[];
  maxFileSize: number;
  supportedExtensions: string[];
  defaultPath: string;
  allowedPaths: string[];
  restrictions: {
    readOnly: boolean;
    allowDelete: boolean;
    allowUpload: boolean;
    allowRename: boolean;
  };
}

export const fileManagerConfig: FileManagerConfig = {
  id: 'agent-05-file-manager',
  name: 'file-manager',
  displayName: 'Menedżer Plików',
  description: 'Zaawansowany agent do zarządzania plikami z obsługą operacji CRUD, wyszukiwania i organizacji',
  category: 'System Utilities',
  version: '1.0.0',
  capabilities: [
    'list-files',
    'upload-files', 
    'download-files',
    'delete-files',
    'rename-files',
    'create-folders',
    'search-files',
    'file-preview',
    'bulk-operations'
  ],
  maxFileSize: 10 * 1024 * 1024, // 10MB
  supportedExtensions: [
    '.txt', '.json', '.js', '.ts', '.jsx', '.tsx',
    '.css', '.scss', '.html', '.htm', '.md', '.xml',
    '.py', '.java', '.c', '.cpp', '.h', '.hpp',
    '.php', '.rb', '.go', '.rs', '.swift', '.kt',
    '.yaml', '.yml', '.toml', '.ini', '.cfg', '.conf'
  ],
  defaultPath: './src',
  allowedPaths: [
    './src',
    './public', 
    './docs',
    './scripts',
    './config'
  ],
  restrictions: {
    readOnly: false,
    allowDelete: true,
    allowUpload: true,
    allowRename: true
  }
};

export const ERROR_MESSAGES = {
  invalidAction: 'Nieprawidłowa akcja',
  unauthorized: 'Brak autoryzacji',
  fileNotFound: 'Plik nie został znaleziony',
  pathNotAllowed: 'Ścieżka niedozwolona',
  fileTooLarge: 'Plik zbyt duży',
  unsupportedFormat: 'Nieobsługiwany format pliku',
  operationFailed: 'Operacja nie powiodła się',
  serverError: 'Błąd serwera'
};

export const SUCCESS_MESSAGES = {
  fileUploaded: 'Plik został przesłany pomyślnie',
  fileDeleted: 'Plik został usunięty',
  fileRenamed: 'Plik został przemianowany',
  folderCreated: 'Folder został utworzony',
  operationCompleted: 'Operacja zakończona pomyślnie'
};