<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# szkc serwisu a następnie warstwy

Pokażę ultra‑konkretny szkic w stylu TypeScript/Node (Express/Fastify) – możesz go łatwo przemapować na swój stack.

## 1. Szkic serwisu `analyzeDocumentRisk`

Załóżmy strukturę:

- `financeRepository` – warstwa dostępu do danych
- `callRiskAI` – helper wołający Twój istniejący `/api/analyze-risk` (Gemini)
- `financeService` – logika biznesowa


### 1.1. Helper do wywołania AI (wewnętrznie)

```ts
// core/ai/riskClient.ts
import fetch from "node-fetch";

export async function callRiskAI(payload: {
  number: string;
  amountGross: number;
  currency: string;
  counterpartyName: string;
  issueDate: string;
  dueDate?: string | null;
  description?: string | null;
}) {
  const res = await fetch("https://www.mybonzo.com/api/analyze-risk", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`analyze-risk failed: ${res.status}`);
  }

  const data = await res.json();
  // Oczekiwany kształt z Twojego endpointu:
  // { risk_score, risk_level, risk_tags, risk_summary, model }
  return data;
}
```


### 1.2. Serwis finansowy z `analyzeDocumentRisk`

```ts
// core/services/financeService.ts
import { financeRepository } from "../db/financeRepository";
import { callRiskAI } from "../ai/riskClient";

export const financeService = {
  async getTransactions(params: { tenantId: string }) {
    return financeRepository.listTransactions(params.tenantId);
  },

  async getDocuments(params: { tenantId: string }) {
    return financeRepository.listDocuments(params.tenantId);
  },

  async analyzeDocumentRisk(params: { tenantId: string; documentId: string }) {
    const doc = await financeRepository.getDocumentById(
      params.tenantId,
      params.documentId
    );
    if (!doc) {
      throw new Error("DOCUMENT_NOT_FOUND");
    }

    // Przygotuj payload pod AI
    const riskInput = {
      number: doc.number,
      amountGross: doc.amount_gross,
      currency: doc.currency,
      counterpartyName: doc.counterparty_name,
      issueDate: doc.issue_date,
      dueDate: doc.due_date,
      description: doc.notes ?? null,
    };

    const aiResult = await callRiskAI(riskInput);

    const updated = await financeRepository.updateDocumentRisk(
      params.tenantId,
      params.documentId,
      {
        risk_score: aiResult.risk_score,
        risk_level: aiResult.risk_level,
        risk_tags: aiResult.risk_tags,
        risk_summary: aiResult.risk_summary,
        ai_model: aiResult.model ?? "gemini-2.5-flash",
        ai_analyzed_at: new Date().toISOString(),
      }
    );

    return updated;
  },
};
```


### 1.3. Handler HTTP dla `POST /finance/documents/analyze`

```ts
// api/financeDocumentsAnalyzeRoute.ts
import { financeService } from "../core/services/financeService";

export async function postFinanceDocumentsAnalyze(req, res) {
  const tenantId = req.user.tenantId; // z auth
  const { document_id } = req.body;

  try {
    const doc = await financeService.analyzeDocumentRisk({
      tenantId,
      documentId: document_id,
    });
    res.status(200).json(doc);
  } catch (err: any) {
    if (err.message === "DOCUMENT_NOT_FOUND") {
      return res.status(404).json({ error: "Document not found" });
    }
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
}
```

To jest cała logika biznesowa: serwis czyta dokument, woła AI, zapisuje risk, zwraca aktualny stan.[^1]

***

## 2. Szkic warstwy repozytorium (DuckDB – bardzo prosto)

Załóżmy, że masz połączenie do DuckDB (lokalnie albo przez driver HTTP do R2/Iceberg), a w repo tylko wrapujesz SQL.

```ts
// core/db/duckdbClient.ts
import duckdb from "duckdb";

const db = new duckdb.Database("mybonzo.duckdb"); // albo connection string do lakehouse

export function getDuckConnection() {
  return db;
}
```


### 2.1. Repozytorium finansowe (minimalne metody)

```ts
// core/db/financeRepository.ts
import { getDuckConnection } from "./duckdbClient";

async function all<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const db = getDuckConnection();
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err: any, rows: T[]) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

async function run(sql: string, params: any[] = []): Promise<void> {
  const db = getDuckConnection();
  return new Promise((resolve, reject) => {
    db.run(sql, params, (err: any) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

export const financeRepository = {
  async listTransactions(tenantId: string) {
    return all(
      `
      SELECT
        id, tenant_id, date, amount, currency, direction,
        category, subcategory, counterparty_name, status,
        payment_method, description
      FROM finance_transactions
      WHERE tenant_id = ?
      ORDER BY date DESC
      LIMIT 500
      `,
      [tenantId]
    );
  },

  async listDocuments(tenantId: string) {
    return all(
      `
      SELECT
        id, tenant_id, type, number, issue_date, due_date,
        currency, amount_net, amount_gross,
        counterparty_name, status,
        risk_score, risk_level, risk_summary, ai_analyzed_at
      FROM finance_documents
      WHERE tenant_id = ?
      ORDER BY issue_date DESC
      LIMIT 500
      `,
      [tenantId]
    );
  },

  async getDocumentById(tenantId: string, documentId: string) {
    const rows = await all(
      `
      SELECT *
      FROM finance_documents
      WHERE tenant_id = ? AND id = ?
      LIMIT 1
      `,
      [tenantId, documentId]
    );
    return rows[^0] ?? null;
  },

  async updateDocumentRisk(
    tenantId: string,
    documentId: string,
    risk: {
      risk_score: number;
      risk_level: string;
      risk_tags: string[];
      risk_summary: string;
      ai_model: string;
      ai_analyzed_at: string;
    }
  ) {
    await run(
      `
      UPDATE finance_documents
      SET
        risk_score   = ?,
        risk_level   = ?,
        risk_tags    = ?,
        risk_summary = ?,
        ai_model     = ?,
        ai_analyzed_at = ?
      WHERE tenant_id = ? AND id = ?
      `,
      [
        risk.risk_score,
        risk.risk_level,
        JSON.stringify(risk.risk_tags),
        risk.risk_summary,
        risk.ai_model,
        risk.ai_analyzed_at,
        tenantId,
        documentId,
      ]
    );

    // zwróć zaktualizowany dokument
    return this.getDocumentById(tenantId, documentId);
  },
};
```

To repo możesz później łatwo przepiąć z lokalnego DuckDB na Iceberg/R2 – interfejs zostaje, zmienia się tylko implementacja `duckdbClient`.[^2][^3][^4]

***

Następny naturalny krok: zaproponować strukturę `GET /finance/summary` (cashflow + przychód/koszt + kilka KPI), która użyje `finance_transactions` i posłuży jako backend do pierwszego mini‑dashboardu FinansePro. Chcesz, żebyśmy od razu zaprojektowali response tego `/finance/summary` pod konkretny widok w panelu (np. wykres + kilka kart KPI)?

<div align="center">⁂</div>

[^1]: MODULY_I_NARZEDZIA.md

[^2]: https://duckdb.org/2022/10/12/modern-data-stack-in-a-box.html

[^3]: https://developers.cloudflare.com/r2/data-catalog/config-examples/duckdb/

[^4]: https://developers.cloudflare.com/r2/data-catalog/

