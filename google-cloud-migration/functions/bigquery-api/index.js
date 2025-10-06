const functions = require('@google-cloud/functions-framework');
const { BigQuery } = require('@google-cloud/bigquery');

/**
 * Google Cloud Function - BigQuery API Proxy
 * Handles MyBonzo BigQuery requests with Google Cloud native integration
 */

const bigquery = new BigQuery({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  // Credentials będą automatycznie pobrane przez Google Cloud
});

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json; charset=utf-8'
};

// Bezpieczne pre-defined queries
const SAFE_QUERIES = {
  overview: `
    SELECT 
      DATE(timestamp) as date,
      COUNT(*) as total_interactions,
      COUNT(DISTINCT user_id) as unique_users,
      AVG(response_time_ms) as avg_response_time
    FROM \`${process.env.GOOGLE_CLOUD_PROJECT_ID}.polish_ai_interactions.conversations\`
    WHERE DATE(timestamp) >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
    GROUP BY date 
    ORDER BY date DESC 
    LIMIT 30
  `,
  
  performance: `
    SELECT 
      AVG(response_time_ms) as avg_response_time,
      COUNT(*) as total_queries,
      COUNT(CASE WHEN response_time_ms < 1000 THEN 1 END) as fast_queries,
      COUNT(CASE WHEN response_time_ms >= 5000 THEN 1 END) as slow_queries
    FROM \`${process.env.GOOGLE_CLOUD_PROJECT_ID}.polish_ai_interactions.performance\`
    WHERE DATE(timestamp) = CURRENT_DATE()
  `,
  
  users: `
    SELECT 
      COUNT(DISTINCT user_id) as active_users_7d,
      COUNT(DISTINCT CASE WHEN DATE(last_activity) = CURRENT_DATE() THEN user_id END) as active_today,
      AVG(session_duration_minutes) as avg_session_duration
    FROM \`${process.env.GOOGLE_CLOUD_PROJECT_ID}.polish_ai_interactions.users\`
    WHERE DATE(last_activity) >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
  `,
  
  feedback: `
    SELECT 
      rating,
      COUNT(*) as count,
      AVG(rating) as avg_rating
    FROM \`${process.env.GOOGLE_CLOUD_PROJECT_ID}.polish_ai_interactions.feedback\`
    WHERE DATE(timestamp) >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
    GROUP BY rating 
    ORDER BY rating DESC
  `
};

/**
 * Main Cloud Function handler
 */
functions.http('mybonzo-bigquery-api', async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.set(CORS_HEADERS);
    return res.status(200).send();
  }

  res.set(CORS_HEADERS);

  try {
    const { method, url } = req;
    const urlParts = new URL(url, `https://${req.get('host')}`);
    const queryType = urlParts.searchParams.get('type');
    const customQuery = req.body?.query;

    // Health check
    if (urlParts.pathname === '/health') {
      return res.json({
        status: 'healthy',
        service: 'MyBonzo BigQuery Cloud Function',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        project: process.env.GOOGLE_CLOUD_PROJECT_ID
      });
    }

    // Pre-defined query types
    if (queryType && SAFE_QUERIES[queryType]) {
      console.log(`Executing pre-defined query: ${queryType}`);
      
      const [job] = await bigquery.createQueryJob({
        query: SAFE_QUERIES[queryType],
        location: 'europe-west1', // Use EU region
        jobTimeoutMs: 30000, // 30 second timeout
      });

      const [rows] = await job.getQueryResults();
      
      return res.json({
        success: true,
        queryType: queryType,
        rowCount: rows.length,
        data: rows,
        executedAt: new Date().toISOString(),
        processingTime: `${Date.now() - req.startTime}ms`
      });
    }

    // Custom query (with safety checks)
    if (method === 'POST' && customQuery) {
      // Basic SQL injection protection
      const sanitizedQuery = customQuery.toString().toLowerCase();
      
      // Block dangerous operations
      const dangerousPatterns = [
        'delete', 'drop', 'truncate', 'alter', 'create', 
        'insert', 'update', 'grant', 'revoke'
      ];
      
      for (const pattern of dangerousPatterns) {
        if (sanitizedQuery.includes(pattern)) {
          return res.status(400).json({
            success: false,
            error: 'Dangerous query detected',
            message: `Query contains prohibited operation: ${pattern}`,
            allowedOperations: ['SELECT queries only']
          });
        }
      }

      // Limit query complexity
      if (customQuery.length > 2000) {
        return res.status(400).json({
          success: false,
          error: 'Query too long',
          message: 'Custom queries limited to 2000 characters',
          queryLength: customQuery.length
        });
      }

      console.log(`Executing custom query: ${customQuery.substring(0, 100)}...`);
      
      const [job] = await bigquery.createQueryJob({
        query: customQuery,
        location: 'europe-west1',
        jobTimeoutMs: 60000, // 1 minute timeout for custom queries
        maximumBytesBilled: '10000000', // Limit to ~10MB processing
      });

      const [rows] = await job.getQueryResults();
      
      return res.json({
        success: true,
        queryType: 'custom',
        rowCount: rows.length,
        data: rows.slice(0, 1000), // Limit results to 1000 rows
        executedAt: new Date().toISOString(),
        processingTime: `${Date.now() - req.startTime}ms`
      });
    }

    // List available endpoints
    return res.json({
      service: 'MyBonzo BigQuery API',
      version: '1.0.0',
      availableQueries: Object.keys(SAFE_QUERIES),
      endpoints: {
        predefined: 'GET /?type={overview|performance|users|feedback}',
        custom: 'POST / with {"query": "SELECT ..."}',
        health: 'GET /health'
      },
      limits: {
        customQueryMaxLength: 2000,
        maxResults: 1000,
        allowedOperations: ['SELECT only']
      }
    });

  } catch (error) {
    console.error('BigQuery API Error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString(),
      service: 'MyBonzo BigQuery Cloud Function'
    });
  }
});