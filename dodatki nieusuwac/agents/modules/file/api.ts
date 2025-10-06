import type { APIRoute } from 'astro';

export interface FileOperationRequest {
  action: 'list' | 'upload' | 'download' | 'delete' | 'rename' | 'create-folder' | 'search' | 'test' | 'status';
  path?: string;
  filename?: string;
  newName?: string;
  content?: string;
  query?: string;
  recursive?: boolean;
}

export interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  modified?: Date;
  extension?: string;
}

export interface FileOperationResponse {
  success: boolean;
  message: string;
  data?: FileItem[] | FileItem | any;
  error?: string;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { action, path, filename, newName, content, query, recursive }: FileOperationRequest = await request.json();

    switch (action) {
      case 'test':
        return testFileManager();
      case 'status':
        return getFileManagerStatus();
      case 'list':
        return listFiles(path || './');
      case 'upload':
        return uploadFile(path!, filename!, content!);
      case 'download':
        return downloadFile(path!);
      case 'delete':
        return deleteFile(path!);
      case 'rename':
        return renameFile(path!, newName!);
      case 'create-folder':
        return createFolder(path!);
      case 'search':
        return searchFiles(query!, path, recursive);
      default:
        return errorResponse('Nieprawidłowa akcja');
    }
  } catch (error) {
    console.error('File Manager API Error:', error);
    return errorResponse('Błąd serwera');
  }
};

async function testFileManager(): Promise<Response> {
  return new Response(JSON.stringify({
    success: true,
    message: 'Agent File Manager - Test udany',
    data: {
      version: '1.0.0',
      capabilities: ['list', 'upload', 'download', 'delete', 'rename', 'create-folder', 'search'],
      supportedFormats: ['txt', 'json', 'js', 'ts', 'css', 'html', 'md', 'py'],
      maxFileSize: '10MB'
    }
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function getFileManagerStatus(): Promise<Response> {
  const fs = await import('fs').then(m => m.promises).catch(() => null);
  
  return new Response(JSON.stringify({
    success: true,
    message: 'File Manager - Status aktywny',
    data: {
      status: 'active',
      fsAvailable: !!fs,
      workingDirectory: process.cwd?.() || 'unknown',
      timestamp: new Date().toISOString()
    }
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function listFiles(dirPath: string): Promise<Response> {
  try {
    const fs = await import('fs').then(m => m.promises);
    const path = await import('path');
    
    const items = await fs.readdir(dirPath, { withFileTypes: true });
    const files: FileItem[] = await Promise.all(
      items.map(async (item) => {
        const fullPath = path.join(dirPath, item.name);
        const stats = await fs.stat(fullPath).catch(() => null);
        
        return {
          name: item.name,
          path: fullPath,
          type: item.isDirectory() ? 'directory' : 'file',
          size: stats?.size,
          modified: stats?.mtime,
          extension: item.isFile() ? path.extname(item.name) : undefined
        };
      })
    );

    return new Response(JSON.stringify({
      success: true,
      message: `Znaleziono ${files.length} elementów w ${dirPath}`,
      data: files
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return errorResponse(`Błąd listowania plików: ${error}`);
  }
}

async function uploadFile(dirPath: string, filename: string, content: string): Promise<Response> {
  try {
    const fs = await import('fs').then(m => m.promises);
    const path = await import('path');
    
    const fullPath = path.join(dirPath, filename);
    await fs.writeFile(fullPath, content, 'utf8');

    return new Response(JSON.stringify({
      success: true,
      message: `Plik ${filename} został zapisany pomyślnie`,
      data: { path: fullPath, size: content.length }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return errorResponse(`Błąd zapisywania pliku: ${error}`);
  }
}

async function downloadFile(filePath: string): Promise<Response> {
  try {
    const fs = await import('fs').then(m => m.promises);
    const content = await fs.readFile(filePath, 'utf8');

    return new Response(JSON.stringify({
      success: true,
      message: `Plik ${filePath} został odczytany`,
      data: { content, path: filePath }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return errorResponse(`Błąd odczytu pliku: ${error}`);
  }
}

async function deleteFile(filePath: string): Promise<Response> {
  try {
    const fs = await import('fs').then(m => m.promises);
    const stats = await fs.stat(filePath);
    
    if (stats.isDirectory()) {
      await fs.rmdir(filePath, { recursive: true });
    } else {
      await fs.unlink(filePath);
    }

    return new Response(JSON.stringify({
      success: true,
      message: `${stats.isDirectory() ? 'Folder' : 'Plik'} ${filePath} został usunięty`,
      data: { path: filePath, type: stats.isDirectory() ? 'directory' : 'file' }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return errorResponse(`Błąd usuwania: ${error}`);
  }
}

async function renameFile(oldPath: string, newName: string): Promise<Response> {
  try {
    const fs = await import('fs').then(m => m.promises);
    const path = await import('path');
    
    const newPath = path.join(path.dirname(oldPath), newName);
    await fs.rename(oldPath, newPath);

    return new Response(JSON.stringify({
      success: true,
      message: `Zmieniono nazwę z ${oldPath} na ${newPath}`,
      data: { oldPath, newPath }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return errorResponse(`Błąd zmiany nazwy: ${error}`);
  }
}

async function createFolder(folderPath: string): Promise<Response> {
  try {
    const fs = await import('fs').then(m => m.promises);
    await fs.mkdir(folderPath, { recursive: true });

    return new Response(JSON.stringify({
      success: true,
      message: `Folder ${folderPath} został utworzony`,
      data: { path: folderPath }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return errorResponse(`Błąd tworzenia folderu: ${error}`);
  }
}

async function searchFiles(searchQuery: string, searchPath: string = './', recursive: boolean = true): Promise<Response> {
  try {
    const fs = await import('fs').then(m => m.promises);
    const path = await import('path');
    
    const results: FileItem[] = [];
    const searchRecursive = async (dir: string) => {
      const items = await fs.readdir(dir, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = path.join(dir, item.name);
        
        if (item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          const stats = await fs.stat(fullPath).catch(() => null);
          results.push({
            name: item.name,
            path: fullPath,
            type: item.isDirectory() ? 'directory' : 'file',
            size: stats?.size,
            modified: stats?.mtime,
            extension: item.isFile() ? path.extname(item.name) : undefined
          });
        }
        
        if (recursive && item.isDirectory()) {
          await searchRecursive(fullPath);
        }
      }
    };

    await searchRecursive(searchPath);

    return new Response(JSON.stringify({
      success: true,
      message: `Znaleziono ${results.length} wyników dla "${searchQuery}"`,
      data: results
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return errorResponse(`Błąd wyszukiwania: ${error}`);
  }
}

function errorResponse(message: string): Response {
  return new Response(JSON.stringify({
    success: false,
    message,
    error: message
  }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' }
  });
}