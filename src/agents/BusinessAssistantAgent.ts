
import { BaseAgent } from './BaseAgent';

export class BusinessAssistantAgent extends BaseAgent {
  constructor(config: any) {
    super({
      id: 'business_assistant_agent',
      name: 'Business Assistant',
      model: 'business-assistant',
      category: 'business',
      icon: '💼',
      color: '#1f2937',
      priority: 'HIGH',
      description: 'Comprehensive business operations and management assistant',
      capabilities: ['Task Management', 'Meeting Planning', 'Document Generation', 'Email Drafting', 'Project Planning']
    });
  }

  async createMeetingAgenda(topic: string, duration: number, participants: string[]): Promise<string> {
    try {
      this.updateStatus('processing');
      
      const prompt = `Stwórz profesjonalną agendę spotkania:

Temat: ${topic}
Czas trwania: ${duration} minut
Uczestnicy: ${participants.join(', ')}

Agenda powinna zawierać:
- Cel spotkania
- Punkty dyskusji z przybliżonym czasem na każdy punkt
- Akcje i odpowiedzialności po spotkaniu
- Zasoby potrzebne do spotkania

Proszę stwórz agendę w formacie JSON z polami: title, purpose, agendaItems (tablica obiektów z punktami), actions, resources`;

      const response = await this.generateResponse(prompt);
      return response;
    } catch (error) {
      this.updateStatus('error');
      throw new Error(`Failed to create meeting agenda: ${error}`);
    }
  }

  async draftEmail(subject: string, content: string, recipient: string, sender: string): Promise<string> {
    try {
      this.updateStatus('processing');
      
      const prompt = `Stwórz profesjonalny email na podstawie następujących danych:

Temat: ${subject}
Treść: ${content}
Odbiorca: ${recipient}
Nadawca: ${sender}

Email powinien zawierać:
- Przywitanie
- Główną treść wiadomości
- Zakończenie z podpisem
- Styl odpowiedni dla kontekstu biznesowego`;

      const response = await this.generateResponse(prompt);
      return response;
    } catch (error) {
      this.updateStatus('error');
      throw new Error(`Failed to draft email: ${error}`);
    }
  }

  async generateFinancialReport(revenue: number, expenses: number, period: string): Promise<string> {
    try {
      this.updateStatus('processing');
      
      const profit = revenue - expenses;
      const profitMargin = ((profit / revenue) * 100).toFixed(2);

      const prompt = `Stwórz raport finansowy dla okresu ${period}:

Dane finansowe:
- Przychody: ${revenue.toLocaleString()} PLN
- Wydatki: ${expenses.toLocaleString()} PLN
- Zysk: ${profit.toLocaleString()} PLN
- Marża: ${profitMargin}%

Raport powinien zawierać:
- Podsumowanie finansowe
- Analizę wydatków i przychodów
- Wskazówki dotyczące poprawy wyników
- Prognozę na następny okres`;

      const response = await this.generateResponse(prompt);
      return response;
    } catch (error) {
      this.updateStatus('error');
      throw new Error(`Failed to generate financial report: ${error}`);
    }
  }

  async planEcommerceLaunch(productName: string, targetAudience: string, launchDate: string): Promise<string> {
    try {
      this.updateStatus('processing');
      
      const prompt = `Zaprojektuj plan wdrożenia sklepu internetowego dla produktu:

Nazwa produktu: ${productName}
Docelowa grupa: ${targetAudience}
Data wdrożenia: ${launchDate}

Plan powinien zawierać:
- Etapy przygotowania sklepu
- Strategię marketingową
- Kanały promocji
- Harmonogram działań
- Krytyczne punkty do uwagi`;

      const response = await this.generateResponse(prompt);
      return response;
    } catch (error) {
      this.updateStatus('error');
      throw new Error(`Failed to plan e-commerce launch: ${error}`);
    }
  }

  async manageTasks(tasks: any[]): Promise<string> {
    try {
      this.updateStatus('processing');
      
      const prompt = `Zarządzaj listą zadań:

Zadania:
${tasks.map((task, index) => `${index + 1}. ${task.description} (Priorytet: ${task.priority}, Status: ${task.status})`).join('\n')}

Proszę stworzyć:
- Raport zadań
- Priorytetyzację zadań
- Proponowane kroki działania
- Harmonogram realizacji`;

      const response = await this.generateResponse(prompt);
      return response;
    } catch (error) {
      this.updateStatus('error');
      throw new Error(`Failed to manage tasks: ${error}`);
    }
  }
}
