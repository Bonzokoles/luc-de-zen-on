import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
    try {
        const { messages, model = 'anthropic/claude-3.7-sonnet' } = await request.json();

        if (!messages || messages.length === 0) {
            return new Response(
                JSON.stringify({ error: 'Brak wiadomości' }),
                { status: 400 }
            );
        }

        const apiKey = locals.runtime?.env?.OPENROUTER_API_KEY ||
            locals.runtime?.env[' OPENROUTER_API_KEY'] ||
            locals.runtime?.env['OPENROUTER_API_KEY'];

        if (!apiKey) {
            return new Response(
                JSON.stringify({ error: 'Brak klucza API OpenRouter' }),
                { status: 500 }
            );
        }

        // System prompt dla polskiego asystenta biznesowego
        const systemMessage = {
            role: 'system',
            content: `Jesteś profesjonalnym asystentem biznesowym dla polskich przedsiębiorców - ZENON_Biznes_HUB AI.

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

Jeśli nie masz pewności co do odpowiedzi (szczególnie prawnej lub finansowej), zawsze sugeruj konsultację z ekspertem (prawnik, księgowy).`
        };

        const allMessages = [systemMessage, ...messages];

        // Wywołanie OpenRouter API
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://mybonzo.com',
                'X-Title': 'ZENON Biznes HUB'
            },
            body: JSON.stringify({
                model: model,
                messages: allMessages,
                temperature: 0.7,
                max_tokens: 4000,
                stream: true,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('OpenRouter API error:', errorData);
            return new Response(
                JSON.stringify({
                    error: 'Błąd OpenRouter API',
                    details: errorData.error?.message || 'Unknown error'
                }),
                { status: response.status }
            );
        }

        // Stream response
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    const reader = response.body?.getReader();
                    if (!reader) throw new Error('No reader available');

                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        // Dekoduj chunk
                        const chunk = new TextDecoder().decode(value);
                        const lines = chunk.split('\n').filter(line => line.trim() !== '');

                        for (const line of lines) {
                            if (line.startsWith('data: ')) {
                                const data = line.slice(6);
                                if (data === '[DONE]') {
                                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                                    continue;
                                }

                                try {
                                    const parsed = JSON.parse(data);
                                    const content = parsed.choices?.[0]?.delta?.content;

                                    if (content) {
                                        const streamData = `data: ${JSON.stringify({ content })}\n\n`;
                                        controller.enqueue(encoder.encode(streamData));
                                    }
                                } catch (e) {
                                    // Skip invalid JSON
                                }
                            }
                        }
                    }

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
