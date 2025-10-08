// Global Sales Data Import API
// /api/admin/sales-data-import.ts

interface SalesRecord {
  country: string;
  region: string;
  category: string;
  revenue: number;
  units: number;
  currency?: string;
  date: string;
  source?: string;
}

interface ImportRequest {
  sales: SalesRecord[];
  adminToken?: string;
}

export async function POST({
  request,
  locals,
}: {
  request: Request;
  locals: any;
}) {
  try {
    const data: ImportRequest = await request.json();

    // Basic admin token validation
    const adminToken =
      request.headers.get("Authorization")?.replace("Bearer ", "") ||
      data.adminToken;
    if (!adminToken || adminToken !== "mybonzo_admin_2025") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Unauthorized - Invalid admin token",
        }),
        { status: 401 }
      );
    }

    const db = (locals as any)?.runtime?.env?.DB;
    if (!db) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Database not available",
        }),
        { status: 500 }
      );
    }

    // Create tables if they don't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS global_sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        country TEXT NOT NULL,
        region TEXT,
        product_category TEXT,
        revenue REAL,
        units_sold INTEGER,
        currency TEXT DEFAULT 'USD',
        date_recorded DATE,
        source TEXT DEFAULT 'api_import',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_country ON global_sales(country);
      CREATE INDEX IF NOT EXISTS idx_date ON global_sales(date_recorded);
      CREATE INDEX IF NOT EXISTS idx_category ON global_sales(product_category);
      CREATE INDEX IF NOT EXISTS idx_revenue ON global_sales(revenue);
      
      CREATE TABLE IF NOT EXISTS import_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        import_source TEXT,
        records_count INTEGER,
        success_count INTEGER,
        error_count INTEGER,
        import_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'completed'
      );
    `);

    if (!data.sales || !Array.isArray(data.sales)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid data format - expected sales array",
        }),
        { status: 400 }
      );
    }

    const stmt = db.prepare(`
      INSERT INTO global_sales 
      (country, region, product_category, revenue, units_sold, currency, date_recorded, source)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const record of data.sales) {
      try {
        await stmt
          .bind(
            record.country || "Unknown",
            record.region || null,
            record.category || "General",
            record.revenue || 0,
            record.units || 0,
            record.currency || "USD",
            record.date || new Date().toISOString().split("T")[0],
            record.source || "gemini_import"
          )
          .run();
        successCount++;
      } catch (error) {
        errorCount++;
        errors.push(`Record ${successCount + errorCount}: ${error}`);
      }
    }

    // Log the import
    await db
      .prepare(
        `
      INSERT INTO import_logs (import_source, records_count, success_count, error_count)
      VALUES (?, ?, ?, ?)
    `
      )
      .bind("api_import", data.sales.length, successCount, errorCount)
      .run();

    return new Response(
      JSON.stringify({
        success: true,
        imported: successCount,
        errors: errorCount,
        total: data.sales.length,
        message: `Successfully imported ${successCount} of ${data.sales.length} sales records`,
        errorDetails: errors.length > 0 ? errors.slice(0, 5) : undefined,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Sales import error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: `Import failed: ${error}`,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// GET method to check import status
export async function GET({ locals }: { locals: any }) {
  try {
    const db = (locals as any)?.runtime?.env?.DB;
    if (!db) {
      return new Response(JSON.stringify({ error: "Database not available" }), {
        status: 500,
      });
    }

    const stats = await db
      .prepare(
        `
      SELECT 
        COUNT(*) as total_records,
        COUNT(DISTINCT country) as countries_count,
        COUNT(DISTINCT product_category) as categories_count,
        SUM(revenue) as total_revenue,
        SUM(units_sold) as total_units,
        MAX(created_at) as last_import
      FROM global_sales
    `
      )
      .first();

    const recentImports = await db
      .prepare(
        `
      SELECT * FROM import_logs 
      ORDER BY import_date DESC 
      LIMIT 5
    `
      )
      .all();

    return new Response(
      JSON.stringify({
        success: true,
        stats: stats,
        recentImports: recentImports.results,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: `Stats fetch failed: ${error}`,
      }),
      { status: 500 }
    );
  }
}
