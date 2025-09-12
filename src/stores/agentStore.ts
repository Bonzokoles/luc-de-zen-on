
import { writable } from 'svelte/store';

export const agents = writable([
    {
        id: 'ai_chatbot',
        name: 'AI Chatbot',
        status: 'active',
        type: 'chat',
        description: 'Wszechstronny asystent AI do rozmów i zadań.'
    },
    {
        id: 'wildcard_prompt_ai',
        name: 'WildcardPrompt AI',
        status: 'active',
        type: 'wildcards',
        description: 'Generuje unikalne prompty na podstawie wybranych kategorii wildcards. Obsługa własnych list YAML.'
    },
    {
        id: 'image_generator',
        name: 'Image Generator',
        status: 'active',
        type: 'image',
        description: 'Tworzy obrazy z tekstu przy użyciu modeli Stability AI i Flux.'
    },
    {
        id: 'polaczek_agent_sys_23',
        name: 'POLACZEK_AGENT_SYS_23',
        status: 'standby',
        type: 'worker',
        description: 'Specjalizowany worker systemowy do zadań w tle.'
    },
]);

export const activeFilter = writable('all');
