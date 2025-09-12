
import type { APIRoute } from 'astro';
import { createOPTIONSHandler, createSuccessResponse } from '../../utils/corsUtils';

export const GET: APIRoute = async () => {
  return createSuccessResponse({
    message: 'Data Analysis API is running',
    status: 'active',
    methods: ['GET', 'POST', 'OPTIONS'],
    description: 'Send POST request with data array for analysis'
  });
};

export const OPTIONS = createOPTIONSHandler(['GET', 'POST', 'OPTIONS']);

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    if (!Array.isArray(data) || data.length === 0) {
        return new Response(JSON.stringify({ error: 'Invalid or empty data array'}), { status: 400 });
    }

    // Simple analysis example
    const rowCount = data.length;
    const columnNames = Object.keys(data[0]);
    const columnStats = columnNames.reduce((acc, col) => {
        const values = data.map(row => row[col]);
        const numericValues = values.filter(v => typeof v === 'number');
        acc[col] = {
            type: typeof data[0][col],
            totalRecords: values.length,
            sum: numericValues.length > 0 ? numericValues.reduce((a, b) => a + b, 0) : 'N/A',
            average: numericValues.length > 0 ? (numericValues.reduce((a, b) => a + b, 0) / numericValues.length).toFixed(2) : 'N/A',
        };
        return acc;
    }, {});

    const analysis = { rowCount, columnStats };

    return new Response(JSON.stringify(analysis), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Failed to parse JSON data'}), { status: 400 });
  }
};
