## 🤖 BigQuery Analytics - Asystent AI

### Opis dla użytkownika:

"Cześć! Jestem asystentem BigQuery Analytics. Pomogę Ci analizować duże zbiory danych, pisać zapytania SQL i odkrywać cenne informacje w Twoich danych przechowywanych w Google BigQuery."

### Instrukcje krok po kroku:

1.  **Krok 1: Wybierz projekt i dataset**: Z list rozwijanych wybierz projekt Google Cloud i zbiór danych (dataset), który chcesz analizować.
2.  **Krok 2: Napisz zapytanie SQL**: W edytorze SQL wpisz swoje zapytanie. Możesz skorzystać z gotowych szablonów lub poprosić AI o wygenerowanie zapytania na podstawie opisu w języku naturalnym.
3.  **Krok 3: Wykonaj zapytanie**: Kliknij przycisk 'Wykonaj Zapytanie', aby uruchomić analizę w BigQuery.
4.  **Rezultat**: Wyniki Twojego zapytania pojawią się w tabeli poniżej. Zobaczysz również metadane, takie jak czas wykonania i przetworzone dane.

### Przykłady użycia:

-   **Scenariusz A (Prosta analiza)**: Wybierz swój projekt i dataset, a następnie w edytorze wpisz `SELECT * FROM `nazwa_tabeli` LIMIT 10;`, aby zobaczyć pierwsze 10 wierszy z tabeli.
-   **Scenariusz B (Generowanie SQL przez AI)**: Wpisz w polu AI 'pokaż mi 10 najpopularniejszych produktów w ostatnim miesiącu', a następnie kliknij przycisk generowania SQL. AI przygotuje dla Ciebie gotowe zapytanie.
-   **Scenariusz C (Agregacja danych)**: Użyj zapytania z `GROUP BY`, aby zagregować dane, np. `SELECT kategoria, SUM(sprzedaz) as total_sales FROM `tabela_sprzedazy` GROUP BY kategoria;`, aby zobaczyć sumę sprzedaży w poszczególnych kategoriach.

### Rozwiązywanie problemów:

-   **Problem**: Zapytanie zwraca błąd. → **Rozwiązanie**: Sprawdź składnię swojego zapytania SQL. Upewnij się, że nazwy tabel i kolumn są poprawne. Możesz również poprosić AI o pomoc w debugowaniu zapytania.
-   **Problem**: Brak wyników. → **Rozwiązanie**: Upewnij się, że w wybranym zakresie dat znajdują się dane. Spróbuj uprościć swoje zapytanie lub usunąć warunki `WHERE`, aby zobaczyć, czy tabela zawiera jakiekolwiek dane.
-   **Problem**: Nie widzę mojego projektu/datasetu na liście. → **Rozwiązanie**: Upewnij się, że jesteś zalogowany na właściwe konto Google Cloud i masz uprawnienia do przeglądania wybranych zasobów. Możesz również ręcznie wpisać ID projektu i datasetu.