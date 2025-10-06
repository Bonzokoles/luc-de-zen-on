import { BielikModelAdapter } from '../adapters/bielikModelAdapter';

// Definicja agenta "Bielik"
// Ten agent jest bardziej zaawansowany, posiada własny model i logikę adaptacyjną.
export class BielikAgent {
  private modelAdapter: BielikModelAdapter;
  public status: string = 'initializing';

  constructor() {
    this.modelAdapter = new BielikModelAdapter();
    this.status = 'idle';
  }

  async processQuery(query: string): Promise<string> {
    this.status = 'busy';
    try {
      const result = await this.modelAdapter.generate(query);
      this.status = 'idle';
      return result;
    } catch (error) {
      this.status = 'error';
      console.error('Bielik Agent Error:', error);
      return 'An error occurred while processing the request.';
    }
  }

  getStatus() {
    return {
      id: 'BIELIK_01',
      name: 'Bielik Agent',
      status: this.status,
      model: this.modelAdapter.getModelInfo(),
    };
  }
}

// Singleton instance
export const bielikAgent = new BielikAgent();
