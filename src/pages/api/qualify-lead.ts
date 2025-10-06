import type { APIRoute } from 'astro';
import { google } from 'googleapis';

// --- Helper Functions ---
function getEnv(locals: App.Locals): Record<string, any> {
  return import.meta.env.DEV ? process.env : locals?.runtime?.env || {};
}

function getAuth(env: Record<string, any>) {
  const keyJson = env.GCP_SERVICE_ACCOUNT_KEY;
  if (!keyJson) throw new Error('GCP_SERVICE_ACCOUNT_KEY must be configured in secrets.');
  let credentials;
  try {
    credentials = JSON.parse(keyJson);
  } catch (e) {
    throw new Error('GCP_SERVICE_ACCOUNT_KEY is not a valid JSON string.');
  }
  return new google.auth.GoogleAuth({
    credentials,
    scopes: [
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  });
}

async function sendEmail(auth: any, to: string, subject: string, message: string) {
  const gmail = google.gmail({ version: 'v1', auth });
  const rawMessage = [
    `From: me`,
    `To: ${to}`,
    `Subject: =?utf-8?B?${Buffer.from(subject).toString('base64')}?=
`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    '',
    message,
  ].join('\n');

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: Buffer.from(rawMessage).toString('base64url'),
    },
  });
  console.log('Auto-response email sent successfully to', to);
}

async function saveToSheet(auth: any, sheetId: string, data: any[]) {
  const sheets = google.sheets({ version: 'v4', auth });
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: 'A1', // Appends after the last row of the first sheet
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [data],
    },
  });
  console.log('Lead data successfully saved to Google Sheet.');
}

// --- Main API Route ---
// Example lead analysis for demonstration when GCP is not configured
const EXAMPLE_LEAD_ANALYSIS = {
  high_priority: {
    leadScore: "WYSOKI",
    priority: 1,
    category: "wdrożenie AI",
    reply: "Dziękujemy za zainteresowanie naszymi rozwiązaniami AI! Nasz specjalista ds. wdrożeń skontaktuje się z Państwem w ciągu 4 godzin roboczych, aby omówić szczegóły projektu.",
    internalNotes: "Potencjalny klient enterprise - priorytet kontaktu",
    suggestedAction: "Natychmiastowy kontakt - przekazać do senior consultanta"
  },
  medium_priority: {
    leadScore: "ŚREDNI", 
    priority: 3,
    category: "konsultacja AI",
    reply: "Dziękujemy za kontakt! Otrzymaliśmy Państwa zapytanie dotyczące rozwiązań AI. Nasz konsultant skontaktuje się z Państwem w ciągu 24 godzin.",
    internalNotes: "Wymaga kwalifikacji budżetu i timeline'u",
    suggestedAction: "Kontakt w ciągu 24h - wstępna konsultacja"
  },
  low_priority: {
    leadScore: "NISKI",
    priority: 4, 
    category: "informacje ogólne",
    reply: "Dziękujemy za zainteresowanie! Wysłaliśmy na Państwa adres e-mail materiały informacyjne o naszych usługach AI.",
    internalNotes: "Lead informacyjny - dodać do newsletter",
    suggestedAction: "Wysłać materiały marketingowe, follow-up za tydzień"
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { name, email, company, phone, budget, message } = body;

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Name, email, and message are required' }), { status: 400 });
    }

    const env = getEnv(locals);

    // Check if GCP credentials are configured
    const gcpKey = env.GCP_SERVICE_ACCOUNT_KEY;
    const googleSheetId = env.GOOGLE_SHEET_ID;

    if (!gcpKey) {
      // Return example analysis when GCP is not configured
      console.log('GCP credentials not configured, returning example lead analysis');
      
      const messageLower = message.toLowerCase();
      let exampleKey = 'medium_priority';
      
      if (messageLower.includes('wdrożenie') || messageLower.includes('projekt') || messageLower.includes('enterprise')) {
        exampleKey = 'high_priority';
      } else if (messageLower.includes('info') || messageLower.includes('material') || messageLower.includes('poznać')) {
        exampleKey = 'low_priority';
      }
      
      const leadAnalysis = EXAMPLE_LEAD_ANALYSIS[exampleKey as keyof typeof EXAMPLE_LEAD_ANALYSIS];
      
      return new Response(JSON.stringify({ 
        success: true,
        ...leadAnalysis,
        timestamp: new Date().toISOString(),
        note: 'Przykładowa analiza - skonfiguruj GCP_SERVICE_ACCOUNT_KEY i GOOGLE_SHEET_ID dla pełnej automatyzacji'
      }), { status: 200 });
    }

    // Real AI analysis when GCP is configured
    const prompt = `Przeanalizuj następujące zapytanie od potencjalnego klienta i dokonaj kwalifikacji leada:

    Dane klienta:
    - Imię: ${name}
    - Email: ${email}
    - Firma: ${company || 'Nie podano'}
    - Telefon: ${phone || 'Nie podano'}  
    - Budżet: ${budget || 'Nie podano'}
    - Wiadomość: ${message}

    Zwróć odpowiedź w formacie JSON z następującymi polami:
    - leadScore: "WYSOKI" | "ŚREDNI" | "NISKI"
    - priority: numer od 1 (najwyższy) do 5 (najniższy)
    - category: kategoria zapytania (np. "konsultacja", "wdrożenie AI", "support")
    - reply: spersonalizowana odpowiedź dla klienta (2-3 zdania w języku polskim)
    - internalNotes: notatki wewnętrzne dla zespołu sprzedaży
    - suggestedAction: sugerowane działanie (np. "Kontakt w ciągu 24h", "Przeslij oferte")`;

    const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [{ role: 'user', content: prompt }]
    });

    let leadAnalysis;
    try {
      const jsonMatch = aiResponse.response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON object found in AI response.');
      leadAnalysis = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      leadAnalysis = EXAMPLE_LEAD_ANALYSIS.medium_priority;
    }

    // --- Real GCP Integrations ---
    const auth = getAuth(env);
    const operations = [];

    // 1. Send Email
    if (leadAnalysis.reply) {
        operations.push(sendEmail(auth, email, `Re: Twoje zapytanie - ${leadAnalysis.category}`, leadAnalysis.reply));
    }

    // 2. Save to CRM (Google Sheet)
    if (googleSheetId) {
        const sheetRow = [
            new Date().toISOString(),
            name, email, phone, company, budget,
            leadAnalysis.leadScore, leadAnalysis.priority, leadAnalysis.category,
            message, leadAnalysis.suggestedAction
        ];
        operations.push(saveToSheet(auth, googleSheetId, sheetRow));
    }

    // Run integrations in parallel, but don't block the user response
    Promise.allSettled(operations).then(results => {
        results.forEach(result => {
            if (result.status === 'rejected') {
                console.error('Customer Automation integration failed:', result.reason);
            }
        });
    });

    return new Response(JSON.stringify({ 
      success: true,
      ...leadAnalysis,
      timestamp: new Date().toISOString()
    }), { status: 200 });

  } catch (error) {
    console.error('Error qualifying lead:', error);
    return new Response(JSON.stringify({ error: 'Failed to process lead qualification', details: error.message }), { status: 500 });
  }
};