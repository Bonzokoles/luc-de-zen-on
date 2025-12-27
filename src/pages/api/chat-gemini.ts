import type { APIRoute } from 'astro';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { messages } = await request.json();

    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Brak wiadomości' }),
        { status: 400 }
      );
    }

    const env = locals.runtime?.env || {};
    const apiKey = env['GOOGLE_API_KEY'] || env[' GOOGLE_API_KEY'] ||
      Object.entries(env).find(([k]) => k.trim() === 'GOOGLE_API_KEY')?.[1];

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Brak klucza API' }),
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 8192,
      },
      systemInstruction: `Jesteś profesjonalnym asystentem biznesowym dla polskich przedsiębiorców.

Twoja rola:
- Pomagasz w prowadzeniu biznesu - od strategii po codzienne zadania
- Odpowiadasz ZAWSZE po polsku
- Używasz prostego, zrozumiałego języka (bez zbędnego żargonu)
- Jesteś przyjazny, ale profesjonalny
- Dajesz konkretne, praktyczne rady
- Gdy to możliwe, podajesz przykłady i kroki działania

Obszary Twojej ekspertyzy:
- Strategia biznesowa i rozwój firmy
- Marketing i sprzedaż (online i offline)
- Finanse, budżetowanie, księgowość
- Prawo gospodarcze, ZUS, podatki (podstawy)
- Zarządzanie projektami i zespołem
- Obsługa klienta i CRM
- Social media i content marketing
- E-commerce
- Produktywność i organizacja pracy

Styl komunikacji:
- Konkretne odpowiedzi z przykładami
- Punktowanie (bullet points) dla czytelności
- Podział na kroki dla złożonych zadań
- Emoji dla lepszej czytelności (ale z umiarem)
- Zawsze zachęcaj do działania

Jeśli nie masz pewności co do odpowiedzi (szczególnie prawnej lub finansowej), zawsze sugeruj konsultację z ekspertem (prawnik, księgowy).`,
    });

    // Konwertuj wiadomości do formatu Gemini
    const chatHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const lastMessage = messages[messages.length - 1];

    // Rozpocznij chat z historią
    const chat = model.startChat({
      history: chatHistory,
    });

    // Wysyłaj odpowiedź strumieniowo
    const result = await chat.sendMessageStream(lastMessage.content);

    // Utwórz stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            const data = `data: ${JSON.stringify({ content: text })}\n\n`;
            controller.enqueue(encoder.encode(data));
          }

          // Zakończ stream
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error('Chat error:', error);
    return new Response(
      JSON.stringify({
        error: 'Błąd podczas komunikacji z AI',
        details: error.message
      }),
      { status: 500 }
    );
  }
};
