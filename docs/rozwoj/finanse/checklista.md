<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# ok zróbliste na wszystko co wcześniej rozpisaliśmy

Poniżej masz jedną skondensowaną checklistę obejmującą wszystko, co wcześniej rozpisaliśmy dla modułu Finanse + Dokumenty + Asystent AI (backend + UI + AI).

***

## 1. Baza danych (D1)

1. Utwórz schemat D1:
    - `transakcje_finansowe`
    - `dokumenty_finansowe`
    - `koszty`
    - widoki: `v_kpi_miesieczne`, `v_ryzykowne_dokumenty`.
2. Dodaj indeksy na:
    - `tenant_id + data`
    - `poziom_ryzyka`, `status`
    - `kategoria` (koszty).
3. (Opcjonalnie) wstrzyknij kilka technicznych rekordów testowych, żeby dashboard od razu coś pokazywał.

***

## 2. Storage (R2) dla dokumentów

4. Skonfiguruj bucket R2 (np. `mybonzo-finanse`) + binding w configu:
    - `R2_FINANSE`.
5. Ustal konwencję ścieżek PDF:
    - `dokumenty/{timestamp}-{nazwa_pliku}.pdf`.

***

## 3. API finansowe – dane liczbowe

6. Zaimplementuj `/api/finanse/dashboard`:
    - czyta transakcje (i/lub zamówienia Pumo),
    - liczy `kpi_cards` (przychody, koszty, zysk netto, średnia wartość zamówienia, liczba zamówień),
    - buduje `cashflow_chart.data` (dzienne revenue/profit),
    - buduje `category_pie` (przychody/koszty po kategoriach),
    - zwraca `recent_transactions` (ostatnie transakcje).
7. Zaimplementuj `/api/rentownosc`:
    - łączy przychody po kategoriach z kosztami,
    - zwraca `overall` (total revenue, total costs, marża brutto),
    - `by_category` (revenue, costs, profit, margin_pct, orders_count, units_sold),
    - `low_margin_alerts` (kategorie z marżą < 35%).

***

## 4. API dokumentów finansowych

8. Zaimplementuj `/api/dokumenty-finansowe`:
    - listuje dokumenty z `dokumenty_finansowe` (opcjonalne filtry: ryzyko, status, daty),
    - zwraca pola: numer, kwoty, kontrahent, status, ryzyko, dni_przeterminowania.
9. Zaimplementuj `/api/import-dokumentu`:
    - przyjmuje `FormData` z:
        - `plik` (PDF),
        - numer, data_wystawienia, kwota_brutto, kontrahent, termin_platnosci,
    - zapisuje PDF do R2,
    - dodaje rekord do `dokumenty_finansowe`,
    - wywołuje analizę AI (Gemini) i wpisuje wyniki ryzyka.
10. Zaimplementuj `/api/import-dokumentow/csv` (opcjonalnie):
    - parsuje CSV z listą dokumentów,
    - wrzuca do `dokumenty_finansowe`.

***

## 5. API kosztów i importu danych

11. Zaimplementuj `/api/import-kosztow/csv`:
    - przyjmuje CSV z wierszami `data;kwota;kategoria;kontrahent;status`,
    - mapuje na `koszty` (i/lub `transakcje_finansowe`),
    - zwraca liczbę zaimportowanych rekordów.
12. Zaimplementuj `/api/koszty/dashboard` (jeśli chcesz osobny widok):
    - KPI: sumaryczne koszty, marketing, logistyka, itd.
    - wykres dzienny `data → total, marketing, logistyka`.
13. Dodaj `POST /api/transakcje/dodaj`:
    - przyjmuje JSON pojedynczej transakcji,
    - zapisuje do `transakcje_finansowe`.

***

## 6. API podsumowań i Asystent AI

14. Zaimplementuj `/api/podsumowanie-finansowe`:
    - pobiera dashboard + rentowność + ryzykowne dokumenty,
    - buduje prompt po polsku,
    - wywołuje model (Gemini lub inny) i zwraca raport (Markdown).
15. Zaimplementuj `/api/asystent-finanse`:
    - przyjmuje `pytanie`, `tenant_id`, zakres dat,
    - zbiera dane (dashboard, rentowność, ryzyka, opcjonalnie RAG),
    - dokleja system prompt Asystenta Finansowego,
    - wywołuje model (np. GPT-4o),
    - zwraca odpowiedź + ewentualne „następne kroki”.

***

## 7. UI `/finanse` – FinansePro

16. Zbuduj układ strony:
    - nagłówek (tytuł, opis, zakres dat, przyciski „+ Dodaj transakcję”, „Import danych”),
    - pasek filtrów,
    - sekcja KPI (karty),
    - sekcja wykresów (cashflow + kategorie),
    - sekcja „Najnowsze transakcje” (tabela),
    - sekcja „Alerty i ryzyka”,
    - sekcja „Asystent finansowy AI”.
17. Podłącz dane z `/api/finanse/dashboard`:
    - `kpi_cards` → karty,
    - `cashflow_chart` → główny wykres,
    - `category_pie` → wykres struktury,
    - `recent_transactions` → tabela.
18. Podłącz dane z `/api/rentownosc` do „Alerty i ryzyka”:
    - `low_margin_alerts` → lista kategorii z niską marżą.

***

## 8. UI `/finanse/import`

19. Utwórz stronę z trzema kafelkami:
    - „Import przychodów / kosztów (CSV)”
    - „Import dokumentów (CSV)”
    - „Import faktur PDF (z analizą AI)”
20. Dla każdego kafelka:
    - modal/drag\&drop,
    - upload do odpowiedniego endpointu,
    - pokaż wynik („Zaimportowano X rekordów / Y błędów”).
21. Dodaj sekcję „Historia importów” (prosty log w D1 lub nawet tylko w pamięci na start).

***

## 9. UI dokumentów finansowych

22. Na `/finanse` (lub `/finanse/dokumenty`) zrób podstronę/zakładkę:
    - nagłówek „Dokumenty finansowe i ryzyko”,
    - górne KPI: liczba dokumentów, ile wysokiego ryzyka, ile przeterminowanych, suma kwot ryzyka.
23. Podłącz tabelę dokumentów do `/api/dokumenty-finansowe`:
    - kolumny: numer, kontrahent, daty, kwota, ryzyko, status, akcje.
24. Dodaj filtr po poziomie ryzyka i statusie.
25. Dodaj przycisk „+ Dodaj dokument”:
    - modal z formularzem ręcznym (+ opcjonalny upload PDF),
    - submit → `POST /api/import-dokumentu` lub osobny endpoint.

***

## 10. Asystent AI w UI

26. W `AsystentAI.tsx`:
    - wykryj, czy użytkownik jest w module „Finanse”,
    - jeśli tak, kieruj pytanie na `/api/asystent-finanse`,
    - wyświetl odpowiedź jako Markdown + ewentualne „następne kroki”.
27. Dodaj predefiniowane przyciski „Szybkie pytania”:
    - „Podsumuj finanse miesiąca”
    - „Jakie są największe ryzyka?”
    - „Gdzie tracę najwięcej marży?”
    - „Jak wygląda cashflow?”

***

Jeśli chcesz, kolejnym krokiem mogę rozpisać tę checklistę w formie „sprint planu” (np. 3–4 dni, z podziałem: dzień 1 – API, dzień 2 – UI Finanse, dzień 3 – Dokumenty, dzień 4 – Asystent i import), żebyś miał konkretny plan pracy.

