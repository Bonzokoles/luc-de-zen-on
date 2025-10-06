// Adapter for the Bielik agent's model, configured for OpenRouter API

// Define the expected structure of the response from OpenRouter
interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export class BielikModelAdapter {
  // IMPORTANT: Replace with your actual OpenRouter API key in your environment variables
  private apiKey = process.env.OPENROUTER_API_KEY || "YOUR_OPENROUTER_API_KEY"; 
  private modelName = 'deepseek/deepseek-coder';

  async generate(prompt: string): Promise<string> {
    console.log(`[BielikModelAdapter] Sending prompt to OpenRouter with model ${this.modelName}...`);

    if (this.apiKey === "YOUR_OPENROUTER_API_KEY") {
        console.warn("[BielikModelAdapter] API Key is a placeholder. Returning simulated response.");
        return `This is a simulated response because the OpenRouter API key is not set. The prompt was: "${prompt}"`;
    }

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": this.modelName,
          "messages": [
            { "role": "user", "content": prompt }
          ]
        })
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`[BielikModelAdapter] API request failed with status ${response.status}:`, errorBody);
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json() as OpenRouterResponse;
      const content = data.choices[0]?.message?.content;

      if (!content) {
        console.error('[BielikModelAdapter] Invalid response structure from API:', data);
        throw new Error("Invalid response structure from API.");
      }

      return content;

    } catch (error: any) {
      console.error('[BielikModelAdapter] Error during API call:', error);
      throw error; // Re-throw the error to be handled by the agent
    }
  }

  getModelInfo() {
    return {
      name: this.modelName,
      version: 'api-v1',
      type: 'instruct',
      source: 'OpenRouter'
    };
  }
}
