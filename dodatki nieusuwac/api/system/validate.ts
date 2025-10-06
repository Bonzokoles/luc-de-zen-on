// MyBonzo System Configuration Validator
// Astro API route dla walidacji konfiguracji systemu
// GET /api/system/validate - zwraca status konfiguracji

import type { APIRoute } from 'astro';
import { validateSystemConfig, runFullSystemDiagnostics, generateDiagnosticReport } from '../../../utils/systemDiagnostics';

export const GET: APIRoute = async ({ url }) => {
  try {
    const searchParams = url.searchParams;
    const fullCheck = searchParams.get('full') === 'true';
    const format = searchParams.get('format') || 'json';

    console.log('🔍 MyBonzo - API walidacji konfiguracji wywołane');

    if (fullCheck) {
      // Pełna diagnostyka systemu
      const diagnostics = await runFullSystemDiagnostics();
      
      if (format === 'markdown') {
        const report = generateDiagnosticReport(diagnostics);
        return new Response(report, {
          status: 200,
          headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            'X-MyBonzo-Status': diagnostics.summary.overallStatus,
            'X-MyBonzo-Errors': diagnostics.summary.totalErrors.toString(),
            'X-MyBonzo-Warnings': diagnostics.summary.totalWarnings.toString()
          }
        });
      }

      return new Response(JSON.stringify(diagnostics, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-MyBonzo-Status': diagnostics.summary.overallStatus,
          'X-MyBonzo-Errors': diagnostics.summary.totalErrors.toString(),
          'X-MyBonzo-Warnings': diagnostics.summary.totalWarnings.toString()
        }
      });
    } else {
      // Podstawowa walidacja konfiguracji
      const configResult = validateSystemConfig();
      
      return new Response(JSON.stringify({
        status: 'success',
        data: configResult,
        timestamp: new Date().toISOString(),
        endpoint: '/api/system/validate'
      }, null, 2), {
        status: configResult.valid ? 200 : 422,
        headers: {
          'Content-Type': 'application/json',
          'X-MyBonzo-Config-Valid': configResult.valid.toString(),
          'X-MyBonzo-Config-Errors': configResult.errors.length.toString()
        }
      });
    }

  } catch (error) {
    console.error('❌ Błąd walidacji konfiguracji:', error);
    
    return new Response(JSON.stringify({
      status: 'error',
      message: 'Błąd podczas walidacji konfiguracji systemu',
      error: error instanceof Error ? error.message : 'Nieznany błąd',
      timestamp: new Date().toISOString(),
      endpoint: '/api/system/validate'
    }, null, 2), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};