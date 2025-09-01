// durableObjects.ts

import { fetchFromWorker } from "./cloudflareApi";

type DurableObjectNamespace = {
  idFromName(name: string): string;
  idFromString(id: string): string;
  newUniqueId(): string;
  get(id: string): DurableObjectStub;
}

type DurableObjectStub = {
  fetch(request: Request): Promise<Response>
}

class DurableObjectClient {
  constructor(private namespace: DurableObjectNamespace) {}

  async fetchFromDO(id: string, path: string, options?: RequestInit) {
    try {
      const stub: DurableObjectStub = this.namespace.get(id);
      const url = new URL(path, "https://example.com"); // baza do URL path
      const request = new Request(url.toString(), options);
      const response = await stub.fetch(request);
      if (!response.ok) {
        throw new Error(`Durable Object error: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error("DO fetch error:", error);
      throw error;
    }
  }
}

export { DurableObjectClient };
