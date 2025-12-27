// Cloudflare Pages Function for Gemini Chat
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function onRequestPost(context) {
    try {
        const { messages } = await context.request.json();

        if (!messages || messages.length === 0) {
            return new Response(JSON.stringify({ error: 'Brak wiadomości' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const apiKey = context.env.GOOGLE_API_KEY;
        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'Brak klucza API Gemini' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-exp",
            generationConfig: {
                temperature: 0.7,
                topP: 0.9,
                topK: 40,
                maxOutputTokens: 4000,
            },
            systemInstruction: `Jesteś profesjonalnym asystentem biznesowym dla polskich przedsiębiorców.

Odpowiadasz ZAWSZE po polsku, używasz prostego języka, jesteś przyjazny i profesjonalny.

Obszary ekspertyzy: Strategia biznesowa, Marketing, Finanse, Prawo gospodarcze, Zarządzanie, CRM, E-commerce, Produktywność`,
        });

        const chatHistory = messages.slice(0, -1).map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
        }));

        const lastMessage = messages[messages.length - 1];
        const chat = model.startChat({ history: chatHistory });
        const result = await chat.sendMessageStream(lastMessage.content);

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of result.stream) {
                        const text = chunk.text();
                        const data = `data: ${JSON.stringify({ content: text })}\n\n`;
                        controller.enqueue(encoder.encode(data));
                    }
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                    controller.close();
                } catch (error) {
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
        return new Response(JSON.stringify({ error: 'Wystąpił błąd', message: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
