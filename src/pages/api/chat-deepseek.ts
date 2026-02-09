import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
    try {
        const { messages, model = 'deepseek-chat' } = await request.json();

        if (!messages || messages.length === 0) {
            return new Response(
                JSON.stringify({ error: 'Brak wiadomości' }),
                { status: 400 }
            );
        }

        const env = (locals.runtime?.env || {}) as Record<string, string | undefined>;
        const apiKey = env['DEEPSEEK_API_KEY'] || env[' DEEPSEEK_API_KEY'] ||
            Object.entries(env).find(([k]) => k.trim() === 'DEEPSEEK_API_KEY')?.[1];

        if (!apiKey) {
            return new Response(
                JSON.stringify({ error: 'Brak klucza API DeepSeek' }),
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
- Programowanie i technologie (szczególnie w kontekście biznesowym)

Styl komunikacji:
- Konkretne odpowiedzi z przykładami
- Punktowanie (bullet points) dla czytelności
- Podział na kroki dla złożonych zadań
- Emoji dla lepszej czytelności (ale z umiarem)
- Zawsze zachęcaj do działania

Jeśli nie masz pewności co do odpowiedzi (szczególnie prawnej lub finansowej), zawsze sugeruj konsultację z ekspertem (prawnik, księgowy).`
        };

        const allMessages = [systemMessage, ...messages];

        // Wywołanie DeepSeek API
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model,
                messages: allMessages,
                temperature: 0.7,
                max_tokens: 8000,
                stream: true,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('DeepSeek API error:', errorData);
            return new Response(
                JSON.stringify({
                    error: 'Błąd DeepSeek API',
                    details: errorData.error?.message || 'Unknown error'
                }),
                { status: response.status }
            );
        }

        // Stream response z poprawnym dekodowaniem UTF-8
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    const reader = response.body?.getReader();
                    if (!reader) throw new Error('No reader available');

                    const decoder = new TextDecoder('utf-8');
                    let buffer = '';

                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        // Dekoduj z obsługą znaków wielobajtowych
                        const text = decoder.decode(value, { stream: true });
                        buffer += text;
                        const lines = buffer.split('\n');
                        buffer = lines.pop() || ''; // Zachowaj niepełną linię

                        for (const line of lines) {
                            if (line.startsWith('data: ')) {
                                const data = line.slice(6);
                                if (data === '[DONE]') {
                                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                                    continue;
                                }

                                try {
                                    const parsed = JSON.parse(data);
                                    const content = parsed.choices?.[0]?.delta?.content || '';
                                    if (content) {
                                        const chunk = `data: ${JSON.stringify({ content })}\n\n`;
                                        controller.enqueue(encoder.encode(chunk));
                                    }
                                } catch (e) {
                                    console.error('Error parsing chunk:', e);
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

    } catch (error) {
        console.error('DeepSeek chat error:', error);
        return new Response(
            JSON.stringify({ error: 'Wystąpił błąd podczas komunikacji z DeepSeek' }),
            { status: 500 }
        );
    }
};
