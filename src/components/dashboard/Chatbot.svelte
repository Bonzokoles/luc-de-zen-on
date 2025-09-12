
<script>
    import { onMount } from 'svelte';

    let messages = [];
    let input = '';
    let isLoading = false;
    const models = ['@cf/meta/llama-3-8b-instruct', '@cf/mistral/mistral-7b-instruct-v0.1', '@gpt-4'];
    let selectedModel = models[0];

    const systemPrompt = {
        role: 'system',
        content: 'Jesteś pomocnym asystentem AI dla MyBonzo w języku polskim. Odpowiadaj zwięźle i profesjonalnie.'
    };

    onMount(() => {
        messages = [{ role: 'assistant', content: 'System gotowy. Wprowadź zapytanie.' }];
    });

    async function handleSubmit() {
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input };
        messages = [...messages, userMessage];
        isLoading = true;
        input = '';

        // Placeholder for API call to /api/chat.ts
        try {
            // const response = await fetch('/api/chat', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ messages: [systemPrompt, ...messages.slice(-10)], model: selectedModel })
            // });
            // const data = await response.json();
            // const assistantMessage = data.response;

            // Mock response for demonstration
            await new Promise(res => setTimeout(res, 1500));
            const assistantMessage = { role: 'assistant', content: `Odpowiedź z modelu ${selectedModel}: OK.` };

            messages = [...messages, assistantMessage];
        } catch (error) {
            const errorMessage = { role: 'assistant', content: 'Błąd komunikacji z API.' };
            messages = [...messages, errorMessage];
        } finally {
            isLoading = false;
        }
    }
</script>

<div class="bg-cyber-surface border border-cyber-border rounded-none h-full flex flex-col">
    <div class="p-4 border-b border-cyber-border flex justify-between items-center">
        <h3 class="font-bold text-lg text-cyber-blue">AI CHATBOT</h3>
        <select bind:value={selectedModel} class="bg-cyber-dark border border-cyber-border text-cyber-text text-sm rounded-none p-1 font-mono focus:outline-none focus:border-cyber-blue">
            {#each models as model}
                <option value={model}>{model.split('/').pop()}</option>
            {/each}
        </select>
    </div>
    <div class="flex-grow p-4 space-y-4 overflow-y-auto">
        {#each messages as message}
            <div class={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div class={`max-w-lg p-3 rounded-none ${message.role === 'user' ? 'bg-cyber-blue text-cyber-dark' : 'bg-cyber-border'}`}>
                    <p class="text-sm">{message.content}</p>
                </div>
            </div>
        {/each}
        {#if isLoading}
            <div class="justify-start flex">
                 <div class="max-w-lg p-3 rounded-none bg-cyber-border">
                    <p class="text-sm text-cyber-blue animate-pulse">ANALIZA...</p>
                </div>
            </div>
        {/if}
    </div>
    <div class="p-4 border-t border-cyber-border">
        <form on:submit|preventDefault={handleSubmit} class="flex gap-2">
            <input 
                type="text" 
                bind:value={input}
                placeholder="Wpisz polecenie..."
                class="w-full bg-cyber-dark border border-cyber-border rounded-none p-2 focus:outline-none focus:border-cyber-blue text-cyber-text"
                disabled={isLoading}
            />
            <button type="submit" class="bg-cyber-blue text-cyber-dark font-bold px-6 py-2 rounded-none hover:shadow-glow-blue transition-shadow" disabled={isLoading}>
                SEND
            </button>
        </form>
    </div>
</div>
