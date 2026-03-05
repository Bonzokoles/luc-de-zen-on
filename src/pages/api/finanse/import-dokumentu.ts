/**
 * POST /api/finanse/import-dokumentu
 * Przyjmuje multipart/form-data z plikiem PDF + metadanymi faktury.
 * 1. Zapisuje PDF do R2 (binding: R2_FINANSE)
 * 2. Wstawia rekord do dokumenty_finansowe (D1)
 * 3. Uruchamia analizę ryzyka Gemini i aktualizuje rekord
 *
 * step_11 + step_12 (Cloudflare-native)
 */
import type { APIRoute } from 'astro';
import type { CloudflareEnv } from '../../../types/finanse';

interface GeminiRiskResult {
  ryzyko_punktowe: number;
  poziom_ryzyka: 'Niskie' | 'Średnie' | 'Wysokie';
  tagi_ryzyka: string[];
  podsumowanie_ryzyka: string;
}

async function analyzeWithGemini(params: {
  numer: string;
  kwota_brutto: number;
  kontrahent: string;
  data_wystawienia: string;
  termin_platnosci?: string | null;
  opis?: string | null;
}, apiKey: string): Promise<GeminiRiskResult> {
  const prompt = `Jesteś analitykiem ryzyka finansowego. Oceń ryzyko dla dokumentu:

Numer: ${params.numer}
Kontrahent: ${params.kontrahent}
Kwota brutto: ${params.kwota_brutto} PLN
Data wystawienia: ${params.data_wystawienia}
Termin płatności: ${params.termin_platnosci ?? 'brak'}
Opis: ${params.opis ?? 'brak'}

Zwróć TYLKO poprawny JSON (bez markdown, bez \`\`\`):
{
  "ryzyko_punktowe": <liczba 0-100>,
  "poziom_ryzyka": "<Niskie|Średnie|Wysokie>",
  "tagi_ryzyka": ["<tag1>", "<tag2>"],
  "podsumowanie_ryzyka": "<krótki opis po polsku>"
}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2 },
      }),
    }
  );

  if (!res.ok) throw new Error(`Gemini error: ${res.status}`);

  const data = await res.json() as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
  const cleaned = raw.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(cleaned) as GeminiRiskResult;
  } catch {
    return {
      ryzyko_punktowe: 50,
      poziom_ryzyka: 'Średnie',
      tagi_ryzyka: ['analiza_niedostepna'],
      podsumowanie_ryzyka: 'Automatyczna analiza ryzyka niedostępna — sprawdź ręcznie.',
    };
  }
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as { runtime?: { env: CloudflareEnv } }).runtime?.env;
  const tenantId = env?.TENANT_ID ?? 'meblepumo';

  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('multipart/form-data')) {
    return Response.json({ error: 'Wymagany multipart/form-data' }, { status: 400 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: 'Błąd parsowania formData' }, { status: 400 });
  }

  const numer        = (formData.get('numer') as string | null)?.trim();
  const kontrahent   = (formData.get('kontrahent') as string | null)?.trim();
  const data_wyst    = (formData.get('data_wystawienia') as string | null)?.trim();
  const kwotaStr     = (formData.get('kwota_brutto') as string | null)?.trim();
  const termin       = (formData.get('termin_platnosci') as string | null)?.trim() || null;
  const typ          = (formData.get('typ') as string | null)?.trim() || 'Faktura';
  const opis         = (formData.get('opis') as string | null)?.trim() || null;
  const plik         = formData.get('plik') as File | null;

  if (!numer || !kontrahent || !data_wyst || !kwotaStr) {
    return Response.json(
      { error: 'Wymagane pola: numer, kontrahent, data_wystawienia, kwota_brutto' },
      { status: 400 }
    );
  }

  const kwota_brutto = parseFloat(kwotaStr.replace(',', '.'));
  if (isNaN(kwota_brutto)) {
    return Response.json({ error: `Nieprawidłowa kwota: "${kwotaStr}"` }, { status: 400 });
  }

  const docId = `doc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  let plik_url: string | null = null;

  // 1. Zapisz PDF do R2 (jeśli dostępne)
  if (plik && plik.size > 0) {
    const pdfKey = `dokumenty/${Date.now()}-${plik.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    try {
      if (env?.R2_FINANSE) {
        await (env.R2_FINANSE as R2Bucket).put(pdfKey, plik.stream(), {
          httpMetadata: { contentType: 'application/pdf' },
        });
        plik_url = pdfKey;
      }
    } catch (r2err) {
      console.error('[import-dokumentu] R2 error:', r2err);
      // Kontynuuj bez pliku
    }
  }

  // 2. Wstaw szkielet rekordu do D1
  if (env?.D1) {
    try {
      await env.D1.prepare(`
        INSERT INTO dokumenty_finansowe
          (id, tenant_id, numer, typ, data_wystawienia, termin_platnosci,
           waluta, kwota_brutto, kontrahent, status, plik_url, zrodlo, uwagi)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
      `).bind(
        docId, tenantId, numer, typ, data_wyst, termin,
        'PLN', kwota_brutto, kontrahent,
        'Wysłana', plik_url, 'Upload', opis
      ).run();
    } catch (dbErr) {
      console.error('[import-dokumentu] D1 insert error:', dbErr);
      return Response.json({ error: 'Błąd zapisu do bazy danych' }, { status: 500 });
    }

    // 3. Analiza ryzyka Gemini
    const apiKey = env?.GOOGLE_API_KEY ?? (import.meta.env.GOOGLE_API_KEY as string | undefined);
    let analiza: GeminiRiskResult | null = null;

    if (apiKey) {
      try {
        analiza = await analyzeWithGemini(
          { numer, kwota_brutto, kontrahent, data_wystawienia: data_wyst, termin_platnosci: termin, opis },
          apiKey
        );

        await env.D1.prepare(`
          UPDATE dokumenty_finansowe
          SET ryzyko_punktowe = ?, poziom_ryzyka = ?, tagi_ryzyka = ?,
              podsumowanie_ryzyka = ?, model_ai = ?, data_analizy = ?,
              status = 'Wysłana'
          WHERE id = ?
        `).bind(
          analiza.ryzyko_punktowe,
          analiza.poziom_ryzyka,
          JSON.stringify(analiza.tagi_ryzyka),
          analiza.podsumowanie_ryzyka,
          'gemini-2.5-flash',
          new Date().toISOString(),
          docId
        ).run();
      } catch (aiErr) {
        console.error('[import-dokumentu] Gemini error:', aiErr);
        // Nie przerywaj — dokument już w bazie
      }
    }

    return Response.json({
      id: docId,
      success: true,
      plik_url,
      analiza,
      message: analiza
        ? `Dokument zaimportowany i przeanalizowany (ryzyko: ${analiza.poziom_ryzyka})`
        : 'Dokument zaimportowany bez analizy AI (brak klucza API)',
    }, { status: 201 });
  }

  // Fallback — brak D1 (demo mode)
  return Response.json({
    id: docId,
    success: true,
    plik_url,
    analiza: null,
    message: 'Dokument przyjęty (tryb demo — brak D1)',
  }, { status: 201 });
};
