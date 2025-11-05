# 💡 SZABLONY I PRZYKŁADY - Praktyczne Rozwiązania

> Gotowe do użytku szablony, prompty i scenariusze dla Centrum Biznesowego

---

## 🎯 7 Najczęstszych Scenariuszy Użycia

### Scenario 1️⃣: Nowy Przedsiębiorca - Pierwszy Dzień

**Problem:** Nie wiem od czego zacząć.

**Rozwiązanie:**

```
👤 Użytkownik:
"Właśnie założyłem firmę X, nie wiem co robić"

🤖 AI Centrum:
"Super! Pomogę Ci w 5 krokach:

1️⃣ SETUP BIZNESU (15 min)
   ✅ Wprowadź dane firmy: nazwa, NIP, adres
   ✅ Ustaw system rachunkowości (proste)
   
2️⃣ PIERWSZY KLIENT (1 dzień)
   ✅ Dodaj pierwszych 5 potencjalnych klientów
   ✅ Wygeneruj ofertę za pomoc AI
   
3️⃣ DOKUMENTY (1 dzień)
   ✅ Umowa z klientem (AI generated)
   ✅ Polityka prywatności (AI generated)
   ✅ Regulamin (AI generated)
   
4️⃣ PIERWSZA FAKTURA (30 min)
   ✅ Generuj pierwszą fakturę VAT
   ✅ Przetestuj system
   
5️⃣ PLAN DZIAŁAŃ (30 min)
   ✅ Utwórz zadania na tydzień
   ✅ Zaplanuj marketing

W sumie 3-4 dni bazy! Chcesz zacząć?"
```

---

### Scenario 2️⃣: Zwiększenie Przychodu o 20% w 3 Miesiące

**Problem:** Mój biznes stagnuje, nie wiem jak rośnąć.

**Workflow:**

```
📊 ANALIZA STATUSU QUO
→ AI analizuje: przychód, wydatki, klientów, marżę

💡 AI SUGESTIE (3 opcje)
→ Opcja A: Zwiększ ceny o 15-20%
→ Opcja B: Dodaj nowe usługi
→ Opcja C: Zwiększ marketing

📋 PLAN 30 DNI
→ AI generuje konkretny plan
→ Podział na tygodnie
→ KPI do śledzenia każdego tygodnia

📅 AUTOMAT ZADAŃ
→ AI tworzy 20+ zadań
→ Przypomnienia co tydzień
→ Tracking progress vs plan

📈 DASHBOARD PROGRESS
→ Każdy tydzień: czy na ścieżce?
→ Adjustmenty w czasie rzeczywistym
→ Prognoza: czy 20% growth jest realistyczny?
```

**Konkretne akcje:**

```
Tydzień 1: Analiza & Benchmarking
□ Kto to jest Twój idealny klient?
□ Jakie są ich pain-points?
□ Ile warte jest Twoje rozwiązanie?
□ Co robi konkurencja?

Tydzień 2: Optimizacja Pricing
□ Nowa cena dla usługi A: 1200 PLN (było 1000)
□ Nowa cena dla usługi B: 800 PLN (było 600)
□ Testowe zwiększenie dla nowych klientów
□ Komunikacja zmian obecnym klientom

Tydzień 3: Marketing Push
□ 5 postów/tydzień na LinkedIn
□ 2 case studies nowych
□ Email do 50 poprzednich klientów
□ Outreach do 20 nowych leads

Tydzień 4: Launch Nowej Usługi
□ Opracowanie oferty: "Konsultacja VIP"
□ Wycena: 2000 PLN (limited slots)
□ Promo do top 10 klientów
□ Landing page ze studiami przypadków

Tydzień 5-12: Monitoring & Optimizacja
□ Cotygodniowe raporty
□ Adjustment pricing/marketing
□ Follow-up na cold leads
□ Retention current clients
```

---

### Scenario 3️⃣: Automatyzacja Faktur i Rachunkowości

**Problem:** Spędzam 20 godzin/mies na administracji.

**Rozwiązanie:**

```javascript
// WORKFLOW: Faktura w 2 minuty zamiast 30 minut

const fakturaWorkflow = {
  trigger: "Nowy client added to CRM",
  
  steps: [
    {
      1: "AI ekstrahuje dane klienta z CRM",
      data: {
        name: "ZenBrowsers Sp. z o.o.",
        nip: "123-456-78-90",
        kontakt: "jan@zen.pl"
      }
    },
    {
      2: "AI generuje fakturę (template PL)",
      inputs: {
        numer: "auto-increment",
        data_wystawienia: "today",
        uslugi: "from quote",
        vat: "calculated 23%"
      }
    },
    {
      3: "AI wysyła PDF do klienta",
      actions: [
        "Email z fakturą",
        "Reminder o terminie płatności",
        "SMS alert jeśli zaległa"
      ]
    },
    {
      4: "AI rejestruje w rachunkowości",
      zapisane_do: [
        "Rejestr VAT",
        "KPiR (przychody)",
        "Dashboard finansowy"
      ]
    }
  ],
  
  oszczednosc_czasu: "25 min/faktura = 150 godzin/rok"
};
```

**Procesy do automatyzacji:**

| Proces | Before | After | Gain |
|--------|--------|-------|------|
| Faktury | 30 min | 2 min | 28 min |
| Wydatki | 20 min | 3 min | 17 min |
| Raport | 60 min | 5 min | 55 min |
| Follow-up | 40 min | 5 min | 35 min |
| **Razem** | **150 min** | **15 min** | **135 min/tydzień** |

---

### Scenario 4️⃣: Generowanie Ideów na Marketing

**Problem:** Nie wiem co pisać na media społeczne.

**AI Prompts:**

```powershell
# 1. Idee na posty (LinkedIn)
gemini --profile marketing \
  "Wygeneruj 20 tematów na posty LinkedIn dla firmy B2B zajmującej się
   konsultingiem biznesowym. Każdy temat powinien:
   - Rozwiązać problem przedsiębiorcy
   - Pokazać value naszych usług
   - Zawierać hook i CTA
   - Być gotowy do publikacji"

# 2. Kampania email
gemini --profile marketing \
  "Stwórz 3-częściową sekwencję email:
   Email 1: Lead magnet (free guide)
   Email 2: Problem-solution
   Email 3: Limited offer
   
   Dla: Właściciele sklepów online, którzy chcą zwiększyć sprzedaż"

# 3. Content calendar na miesiąc
gemini --profile centrum-biznesowe \
  "Utwórz content calendar na listopad:
   - 4 posty/tydzień na LinkedIn
   - 2 blog posts
   - 1 email campaign
   
   Tematy: AI dla małych biznesów, case studies, porady"
```

**Wyjście - Gotowy Post LinkedIn:**

```
🚀 Przedsiębiorca to nie zawód...

To przygoda w której mierzysz się z własnymi wątpliwościami.

Wiesz co jest najczęstszym wyzwaniem? 
➡️ Nie brak pomysłów. 
➡️ Nie brak pieniędzy.
➡️ BRAK CZASU. 

Miałem klientka (e-commerce), która spędzała 25 godzin/tydzień 
na administracji. Faktury, arkusze, emaile, follow-upy.

Po 2 tygodniach wdrożenia automation (AI + tools):
✅ 5 godzin/tydzień (zamiast 25)
✅ ZERO błędów
✅ Automatyczne raporty

Efekt? Skupiła się na tym co naprawdę liczy: rozmowy z klientami.

Jak ktoś Ci mówi "musisz pracować więcej"... 
To nie advice, to mindset failure 💯

Jaki Twój biggest time-waster?

#Przedsiębiorca #Automation #SMB #AI
```

---

### Scenario 5️⃣: Przygotowanie Oferty Handlowej w 10 Minut

**Problem:** Każda oferta to godzina pracy.

**Komenda AI:**

```powershell
gemini --profile dokumenty \
  "Przygotuj profesjonalną ofertę handlową dla:

Klient: ZenBrowsers Sp. z o.o. (e-commerce)
Kontakt: Jan Kowalski, CEO
Problem: Potrzebują zwiększyć sprzedaż online
Usługa: Konsultacja marketingu 10 godzin

Struktura oferty:
1. Header z logoem i datą
2. Powitanie + problem klienta
3. Nasza solucja (3-5 punkty)
4. Timeline (2 tygodnie)
5. Wycena: 6000 PLN netto (23% VAT)
6. Warunki płatności: 50% zaraz, 50% na koniec
7. Ograniczenie: 'Ważna przez 7 dni'
8. Signature block

Ton: Profesjonalny, pewny siebie, value-focused
Język: Polski
Format: Markdown + instrukcje do konwersji na PDF"

# Rezultat: Oferuje.md - gotowy do wysłania
```

---

### Scenario 6️⃣: CRM Pipeline - Śledzenie Dealów

**Problem:** Nie wiem jak są moje szanse na sprzedaż.

**Setup:**

```json
{
  "crm_pipeline": {
    "stages": [
      {
        "id": 1,
        "name": "Lead",
        "opis": "Świeży kontakt",
        "days_expected": 3
      },
      {
        "id": 2,
        "name": "Qualified",
        "opis": "Wstępnie zakwalifikowany",
        "days_expected": 5
      },
      {
        "id": 3,
        "name": "Proposal",
        "opis": "Wysłana oferta",
        "days_expected": 7,
        "ai_action": "Wyślij follow-up po 3 dni"
      },
      {
        "id": 4,
        "name": "Negotiation",
        "opis": "Rozmowy cenowe",
        "days_expected": 10
      },
      {
        "id": 5,
        "name": "Won",
        "opis": "Zawarty kontrakt ✅",
        "ai_action": "Generuj umowę, wyślij zaproszenie na kick-off"
      },
      {
        "id": 6,
        "name": "Lost",
        "opis": "Stracony deal ❌",
        "ai_action": "Zapisz powód i prośbę o feedback"
      }
    ],
    
    "ai_scoring": {
      "lead_temperature": "hot/warm/cold",
      "conversion_probability": "% bazując na historii",
      "recommended_action": "Co robić dzisiaj?",
      "alert": "Jeśli deal stagnuje > 14 dni"
    }
  }
}
```

**Przykład Deal'u:**

```
DEAL: ZenBrowsers - Konsultacja Marketing

Status: Proposal (wysłane)
Value: PLN 6,000
Probability: 65% (temperatura: warm)
Days in stage: 4/7

🤖 AI RECOMMENDATION:
"Wysłano ofertę 4 dni temu. Średni czas response: 5 dni.
Sugestia: Wyślij follow-up email dzisiaj z pytaniem 'Czy masz pytania?'
Link do follow-up template poniżej."

📊 AI SCORING:
- Kompletne dane klienta: ✅
- Wcześniejsze rozmowy: ✅ (2 rozmowy)
- Pasuje do profile: ✅
- Budget OK: ✅
- Timeline: ✅ (chcą start w listopadzie)
→ SCORE: 8/10 (prawdopodobnie się uda)

⚠️ ALERTS:
- Jeśli brak odpowiedzi do 7-go dnia: STAGNACJA
- Automatic reminder tomorrow @11:00
```

---

### Scenario 7️⃣: Cotygodniowy Raport Biznesowy

**Komenda:**

```powershell
# Wygeneruj raport ze wszystkimi danymi
gemini --profile centrum-biznesowe \
  "Stwórz profesjonalny raport tygodniowy (4-5 stron MD) na temat:

DANE DO RAPORTU:
- Przychód tydzień: PLN 18,500 (vs 16,200 poprzednio)
- Wydatki: PLN 12,300
- Marża: 34.2%
- Nowych klientów: 7
- Closed dealów: 2 (wartość: PLN 12,000)
- Open leads: 14

SEKCJE RAPORTU:
1. Executive Summary (3 zdania TL;DR)
2. KPI Dashboard (tabela z trendem)
3. Revenue Analysis (co sprzedaliśmy)
4. Expense Breakdown (gdzie poszły pieniądze)
5. Sales Pipeline (open deals + forecast)
6. Customer Metrics (new, churned, retention)
7. Key Insights (co się zmieniło)
8. Recommendations (co robić w następnym tygodniu)
9. Action Items (konkretne tasks)

Ton: Profesjonalny, optymistyczny, actionable
Format: Beautiful Markdown ready for PDF export"

# Output: Raport_Tydzien_43.md
```

**Przykład Wyjścia:**

```markdown
# 📊 Raport Tygodniowy - Tydzień 43 (28 Oct - 3 Nov 2025)

## 🎯 Executive Summary
Najlepszy tydzień tego miesiąca! Przychód wzrósł o 14% vs poprzedni tydzień. 
Zamknęliśmy 2 duże deale o wartości PLN 12k i zyskaliśmy 7 nowych leads high-quality.
Marża osiągnęła rekordu: 34.2% (cel: 32%).

## 📈 Key Metrics

| Metrika | Wartość | Trend | Cel |
|---------|---------|-------|-----|
| Przychód | PLN 18,500 | ↗️ +14% | PLN 20,000 |
| Wydatki | PLN 12,300 | → flat | PLN 14,000 |
| Marża | 34.2% | ↗️ +2.1% | 32% |
| Nowych Lead | 7 | ↗️ +1 | 5 |
| Closed Deals | 2 | ↗️ +1 | 1.5 |

## 💰 Revenue Analysis

**Źródła przychodu:**
- Konsultacje: PLN 8,500 (46%)
- Projektów: PLN 6,200 (34%)
- Retainer clients: PLN 3,800 (20%)

**Top Deal:**
ZenBrowsers - PLN 7,500 (konsultacja + implementacja)

## 💸 Wydatki Breakdown

- Infrastruktura: PLN 3,200 (Azure, GitHub, Cloudflare)
- Marketing: PLN 2,800 (LinkedIn Ads, Content)
- Narzędzia: PLN 1,500 (Notion, Zapier, Figma)
- Pozostałe: PLN 4,800

**Obserwacja:** Marketing wydatki rosną, ale ROI jest 3:1 (worth it)

## 🎯 Sales Pipeline

| Deal | Wartość | Stage | Days | Probability |
|------|---------|-------|------|-------------|
| Deal A | PLN 12k | Won ✅ | - | 100% |
| Deal B | PLN 5.5k | Proposal | 4 dni | 75% |
| Deal C | PLN 8k | Qualified | 8 dni | 60% |
| Deal D | PLN 4.2k | Lead | 2 dni | 40% |

**Forecast dla następnego tygodnia: PLN 16,500-18,000**

## 👥 Customer Metrics

- Nowych: 7 (quality: High)
- Churned: 0 (świetnie!)
- Retention rate: 100%
- NPS estimated: 8.5/10

## 🔍 Key Insights

1. **Pricing Increase Worked** - Zwiększyliśmy ceny 2 tygodnie temu i nikt nie zrezygnował
2. **LinkedIn Strategy Pays Off** - 70% nowych leads z LinkedIn
3. **Expense Control** - Marża rosnie mimo wzrostu wydatków
4. **Deal Velocity** - Średni czas: Lead→Won: 14 dni (cel: 15 dni) ✅

## 🚀 Recommendations

**Co zrobić w następnym tygodniu:**

1. **Priority 1**: Close Deal B i C (PLN 13.5k potential)
   - Action: Follow-up call w poniedziałek
   - Deadline: do piątku
   
2. **Priority 2**: Scale Marketing Spend
   - Current: PLN 2,800/tydzień
   - Proposal: PLN 3,500/tydzień
   - Expected ROI: 3.5:1
   
3. **Priority 3**: Improve Conversion Rate
   - Current: 35% (Lead→Proposal)
   - Target: 45%
   - How: Better qualification + faster follow-up

## ✅ Action Items

- [ ] Call ZenBrowsers (Deal B) - Tuesday 11:00
- [ ] Send proposal templates AI generated - Today
- [ ] Increase LinkedIn ad spend to PLN 3,500 - Tomorrow
- [ ] Review losing deals for insights - Friday
- [ ] Celebrate! 🎉 Best week yet!
```

---

## 🎨 Szablony Dokumentów

### Template: Umowa Świadczenia Usług

```markdown
# UMOWA ŚWIADCZENIA USŁUG

**zawarta w dniu {data} roku w {miejsce}**

**między:**

**WYKONAWCĄ:** {Nazwa Firmy}, z siedzibą w {adres}, 
NIP: {NIP}, reprezentowany przez {osoba},

**ZAMAWIAJĄCYM:** {Nazwa Klienta}, z siedzibą w {adres}, 
NIP: {NIP}, reprezentowany przez {osoba},

**§1. Przedmiot umowy**

1. Wykonawca zobowiązuje się do wykonania dla Zamawiającego 
   następujących usług: {opis usług}

2. Zakres usług obejmuje:
   - {punkt 1}
   - {punkt 2}
   - {punkt 3}

**§2. Wynagrodzenie**

1. Za wykonanie usług Zamawiający zapłaci Wykonawcy 
   wynagrodzenie w wysokości: **{kwota} PLN netto**

2. Do kwoty netto zostanie doliczony VAT w wysokości 23%, 
   razem: **{kwota z VAT} PLN brutto**

3. Faktury będą wystawiane: {harmonogram}

4. Termin płatności: {dni} dni od wystawienia faktury

5. Forma płatności: {forma} na rachunek: {nr rachunku}

**§3. Okres obowiązywania**

1. Umowa obowiązuje od dnia {data początek} do dnia {data koniec}

2. Każda ze stron może rozwiązać umowę ze skutkiem natychmiastowym, 
   jeśli druga strona naruszył istotne obowiązki.

**§4. Odpowiedzialność**

1. Wykonawca odpowiada za prawidłowe wykonanie usług 
   zgodnie ze stwierdzonymi w umowie warunkami.

2. Zamawiający ponosi odpowiedzialność za udostępnienie 
   niezbędnych informacji i materiałów.

**§5. Postanowienia końcowe**

1. Umowę podpisano w trzech egzemplarzach, po jednym dla każdej strony 
   oraz dla ksiąg rachunkowych.

2. Wszelkie zmiany do umowy wymagają formy pisemnej podpisane przez obie strony.

---

WYKONAWCA:

_________________________
Podpis, data


ZAMAWIAJĄCY:

_________________________
Podpis, data
```

---

### Template: Email Follow-up

```
Subject: Czy masz pytania dotyczące oferty? 📋

Cześć {imię},

Przesłaliśmy Ci ofertę 3 dni temu dotyczącą {nazwa usługi}.
Chciałem się upewnić, czy do Ciebie trafiła i czy masz jakieś pytania?

Na szybkie pytanie, oto kluczowe liczby z naszej propozycji:

📊 OFERTA:
- Usługa: {opis}
- Wartość: PLN {kwota}
- Timeline: {dni} dni
- Rezultat: {outcome}

Jeśli coś Ci się nie podoba lub masz alternatywne pomysły - 
chętnie o tym porozmawiamy! Mogę być elastyczny na temat zakresu lub ceny.

Wolny jestem w:
⏰ Wtorek 14:00-16:00
⏰ Środa 10:00-12:00

Zarezerwuj sobie 30 min: {link do kalendarza}

Czekam na Twoją wiadomość!

Pozdrawiam,
{Imię}
{Stanowisko}
{Kontakt}

---
P.S. Jeśli nie jesteś zainteresowany, powiedz mi dlaczego - 
chciałbym się nauczyć i ulepszyć się :)
```

---

## 📱 SMS Alerts (Dla Zaległych Płatności)

```
Template 1 (Dzień 5):
"Cześć {imię}! Faktura {nr} (PLN {kwota}) przypada jutro. 
Potwierdzisz odbiór do 12:00? Link do faktury: {link}"

Template 2 (Dzień 15 - Zaległa):
"⚠️ Faktura {nr} zaległa! PLN {kwota}. 
Możemy ją uzgodnić? Tel: {tel} lub tutaj: {link}"

Template 3 (Dzień 30 - Drażliwa):
"⛔ OSTATNIE WEZWANIE: Faktura {nr} zaległa o miesiąc! 
Rozwiążemy to dzisiaj czy powiadomię doradcę podatkowego? {link}"
```

---

## 🔄 Integracja z Google Calendar

```javascript
// Automatyczne ustawienie reminder'ów
const calendarEvents = [
  {
    title: "Follow-up: ZenBrowsers",
    date: "2025-11-07T14:00:00",
    description: "Call about Deal B proposal",
    reminder: 60 // 1 godzina przed
  },
  {
    title: "Send Weekly Report",
    date: "2025-11-07T17:00:00",
    description: "Generate and send weekly report",
    reminder: 120
  },
  {
    title: "Review Invoices Due",
    date: "2025-11-10T09:00:00",
    description: "Check which invoices are due this week",
    reminder: 1440 // dzień przed
  }
];

// Gemini generuje automatycznie bazując na CRM
```

---

**Gotowe szablony do copypaste'u! Powodzenia! 🚀**
