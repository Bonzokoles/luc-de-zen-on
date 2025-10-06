interface WorkerResponse {
  success: boolean;
  data?: any;
  error?: string;
}

// Adapter do komunikacji z Cloudflare Workers
export class CloudflareWorkerAdapter {
  private workerUrl: string;

  constructor(workerUrl: string) {
    this.workerUrl = workerUrl;
  }

  async execute(action: string, payload: any): Promise<WorkerResponse> {
    try {
      const response = await fetch(this.workerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, payload }),
      });

      if (!response.ok) {
        return { success: false, error: `Worker responded with status: ${response.status}` };
      }

      const result = await response.json();
      return { success: true, data: result };

    } catch (error: any) {
      console.error('[CloudflareWorkerAdapter] Error:', error);
      return { success: false, error: error.message };
    }
  }
}
