// Placeholder interfaces for Cloudflare Agents SDK
export interface Connection {
  id: string;
  send(message: string): Promise<void>;
}
export interface ConnectionContext {
  request: Request;
}
export class Agent<E, S> {
  constructor(config: any) {}
  protected state: S = {} as S;
  protected name: string = '';
  protected schedule(cron: string, task: string, data: any): Promise<any> { throw new Error("Not implemented"); }
  protected sql(strings: TemplateStringsArray, ...values: any[]): Promise<any> { throw new Error("Not implemented"); }
  protected setState(newState: Partial<S>): void { this.state = { ...this.state, ...newState }; }
}
export interface AgentNamespace<T> {
  get(id: any): Promise<any>;
  idFromName(name: string): any;
}
