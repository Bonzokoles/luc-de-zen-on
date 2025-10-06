import { agentB } from '../polaczek/b';

// Adapter dla agenta Bibliotekarz (Polaczek B)
export class PolaczekBAdapter {

  search(query: string): Promise<any> {
    console.log(`[PolaczekBAdapter] Searching for: ${query}`);
    // Symulacja wyszukiwania w bazie wiedzy
    return Promise.resolve([
      { id: 'doc1', score: 0.9, content: `Content related to ${query}` },
      { id: 'doc2', score: 0.8, content: `More content about ${query}` },
    ]);
  }

  getStatus() {
    return agentB;
  }
}
