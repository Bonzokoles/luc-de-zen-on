import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  try {
    const operation = url.searchParams.get('operation') || 'read';
    const sheetId = url.searchParams.get('sheetId') || '';

    // Google Sheets API configuration
    const GOOGLE_SHEETS_CONFIG = {
      apiKey: process.env.GOOGLE_API_KEY || '',
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
      discoveryDoc: 'https://sheets.googleapis.com/$discovery/rest?version=v4'
    };

    // For development, return mock data
    // In production, integrate with actual Google Sheets API
    const mockCatalogData = {
      products: [
        {
          id: 'PROD_001',
          name: 'AI Assistant Pro',
          category: 'Software',
          description: 'Zaawansowany asystent AI do automatyzacji zadań biznesowych',
          price: '$299',
          tags: ['ai', 'automation', 'business'],
          inStock: true,
          createdAt: '2024-09-20',
          lastModified: '2024-09-25'
        },
        {
          id: 'PROD_002',
          name: 'Cloud Storage Plus',
          category: 'Services',
          description: 'Bezpieczne przechowywanie danych w chmurze z backupem',
          price: '$19/month',
          tags: ['cloud', 'storage', 'backup'],
          inStock: true,
          createdAt: '2024-09-18',
          lastModified: '2024-09-24'
        },
        {
          id: 'PROD_003',
          name: 'Analytics Dashboard',
          category: 'Software',
          description: 'Kompleksowe narzędzie do analizy danych i raportowania',
          price: '$149',
          tags: ['analytics', 'dashboard', 'reports'],
          inStock: true,
          createdAt: '2024-09-15',
          lastModified: '2024-09-23'
        },
        {
          id: 'PROD_004',
          name: 'Web Design Suite',
          category: 'Digital',
          description: 'Komplet narzędzi do projektowania stron internetowych',
          price: '$99',
          tags: ['design', 'web', 'tools'],
          inStock: false,
          createdAt: '2024-09-10',
          lastModified: '2024-09-22'
        }
      ],
      categories: [
        { name: 'Software', count: 2, description: 'Oprogramowanie i aplikacje' },
        { name: 'Services', count: 1, description: 'Usługi i subskrypcje' },
        { name: 'Digital', count: 1, description: 'Produkty cyfrowe' },
        { name: 'Hardware', count: 0, description: 'Sprzęt komputerowy' }
      ],
      metadata: {
        totalProducts: 4,
        totalCategories: 4,
        lastSync: new Date().toISOString(),
        sheetId: sheetId || 'mock-sheet-id',
        apiVersion: 'v4'
      }
    };

    return new Response(JSON.stringify({
      success: true,
      operation: operation,
      data: mockCatalogData,
      timestamp: Date.now()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    console.error('Google Sheets API error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to connect to Google Sheets',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { action, data } = await request.json();

    // Handle different actions (add, update, delete products)
    switch (action) {
      case 'add_product':
        return new Response(JSON.stringify({
          success: true,
          message: 'Product added successfully',
          productId: 'PROD_' + Date.now(),
          data: data
        }), { status: 200 });

      case 'update_product':
        return new Response(JSON.stringify({
          success: true,
          message: 'Product updated successfully',
          data: data
        }), { status: 200 });

      case 'delete_product':
        return new Response(JSON.stringify({
          success: true,
          message: 'Product deleted successfully',
          productId: data.productId
        }), { status: 200 });

      default:
        throw new Error('Unknown action: ' + action);
    }

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to process request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), { status: 400 });
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
};