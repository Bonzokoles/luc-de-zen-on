Oto szczegółowy opis oraz plan wdrożenia funkcji 7, 8 i 9 z dashboardu systemu mybonzo, obejmujący opisy, wymagania, technologie i rekomendacje implementacyjne dla tych narzędzi:

***

## 7. Personalizowany generator pytań i odpowiedzi (FAQ dynamiczny)

### Cel  
Automatyczne generowanie i aktualizacja sekcji FAQ na podstawie treści strony, bazy wiedzy i analizy zapytań użytkowników.

### Wymagania funkcjonalne  
- AI generujące pytania i odpowiedzi dynamicznie, z wykorzystaniem modeli językowych (np. OpenAI GPT-4).  
- Integracja z bazą wiedzy i treściami strony (CMS lub własna baza dokumentów).  
- Widżet chatowy z dostępem do FAQ i automatycznym kierowaniem do odpowiednich pytań.  
- Automatyczna analiza najczęściej zadawanych pytań i optymalizacja bazy FAQ.  
- Panel administracyjny do manualnej korekty i zatwierdzania treści FAQ.

### Technologie  
- Backend: Cloudflare Workers API + integracja AI.  
- AI: OpenAI GPT-4 do generowania pytań i odpowiedzi.  
- Frontend: Astro + React dla widżetu FAQ i panelu admina.  
- Workflow: Flowise do automatycznej aktualizacji i analizy danych.

***

## 8. System rekomendacji treści edukacyjnych i kursów

### Cel  
Personalizowane rekomendowanie użytkownikom kursów, webinarów, artykułów i innych materiałów edukacyjnych.

### Wymagania funkcjonalne  
- Profilowanie użytkownika i analiza jego potrzeb edukacyjnych (np. historia, preferencje).  
- AI generujący propozycje szkoleniowe dopasowane do profilu (np. OpenAI GPT-4).  
- Integracja z platformami e-learningowymi i bazami materiałów (API lub bazy własne).  
- Dynamiczny widget rekomendacyjny na stronie lub w dashboardzie.  
- Workflow wysyłający powiadomienia o nowych materiałach (e-mail, SMS).

### Technologie  
- Backend: Cloudflare Workers API obsługujący profil i rekomendacje.  
- Frontend: Astro + React widget rekomendacji.  
- AI i workflow: OpenAI GPT-4 i Flowise do analiz i rekomendacji.  
- Integracja API platform edukacyjnych (np. Moodle, Udemy).

***

## 9. Automatyzacja obsługi zgłoszeń i ticketów

### Cel  
Automatyczne przyjmowanie, klasyfikowanie i przypisywanie zgłoszeń serwisowych do odpowiednich zespołów.

### Wymagania funkcjonalne  
- Formularze zgłoszeń integrujące AI do kwalifikacji i nadawania priorytetów.  
- Integracja z systemami ticketowymi typu Jira, Zendesk (API).  
- Automatyczne przypisywanie zgłoszeń do zespołów i wysyłka powiadomień.  
- Raportowanie statystyk obsługi i czasu reakcji.  
- Panel zarządzania zgłoszeniami z monitorowaniem.

### Technologie  
- Backend: Cloudflare Workers API do odbioru zgłoszeń i zarządzania danymi.  
- AI: OpenAI GPT-4 do klasyfikacji i priorytetyzacji zgłoszeń.  
- Integracje API: Jira, Zendesk, inne systemy ticketowe.  
- Workflow: ActivePieces do automatyzacji przypisywania i powiadomień.  
- Frontend: Astro + React panel ticketowy i raporty.

***

## Podsumowanie i rekomendacje

- Realizować wszystkie funkcjonalności modułowo, z podziałem na frontend, backend i workflow, wg wzoru z poprzednich funkcji.  
- Dla AI wykorzystywać dedykowane prompt i modele GPT-4 z odpowiednimi kontekstami.  
- Budować widżety i panele w Astro z React, zgodne ze stylem i UX obecnego dashboardu.  
- Workflow w Flowise i ActivePieces powinny automatyzować cykliczne zadania, powiadomienia i integracje z zewnętrznymi systemami.  
- Dokumentować każdą funkcję w folderze DOC_mentacja z opisem architektury, użytych technologii i instrukcją obsługi               
 przygotuję szczegółowe taski, przykładowe kody i workflow dla tych funkcji  wkleje w następnym tasku 7_9ELEMENT1.md