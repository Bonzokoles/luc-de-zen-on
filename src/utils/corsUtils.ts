/**
 * Standard CORS OPTIONS handler for all API endpoints
 * Provides consistent CORS policy across the application
 */
export const createOPTIONSHandler = (allowedMethods: string[] = ['GET', 'POST', 'OPTIONS']) => {
  return async () => {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': allowedMethods.join(', '),
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false',
      },
    });
  };
};

/**
 * Standard CORS headers for all API responses
 */
export const getCORSHeaders = () => ({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
});

/**
 * Add CORS headers to any response
 */
export const addCORSHeaders = (response: Response): Response => {
  const corsHeaders = getCORSHeaders();
  
  // Clone response to modify headers
  const newResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      ...Object.fromEntries(response.headers.entries()),
      ...corsHeaders,
    },
  });
  
  return newResponse;
};

/**
 * Create a standardized error response with CORS headers
 */
export const createErrorResponse = (message: string, status: number = 400) => {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...getCORSHeaders(),
      },
    }
  );
};

/**
 * Create a standardized success response with CORS headers
 */
export const createSuccessResponse = (data: any, status: number = 200) => {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...getCORSHeaders(),
      },
    }
  );
};
