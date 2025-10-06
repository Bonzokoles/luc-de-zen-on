// Minimalny backend REST API agentów POLACZEK_X z obsługą bazy (SQLite przez better-sqlite3, Node/Express)
// Rozszerz do Postgres/Mongo wg potrzeb. Optymalizacja pod panel UI (Svelte/PyQt/React).

import express from "express";
import Database from "better-sqlite3";

const db = new Database("agents.db");
const app = express();
app.use(express.json());

// Inicjalizacja tabeli agentów
db.prepare(`
  CREATE TABLE IF NOT EXISTS agents (
    id TEXT PRIMARY KEY,
    name TEXT,
    type TEXT,
    role TEXT,
    status TEXT,
    description TEXT,
    endpoint TEXT
  )
`).run();

// CRUD: GET lista agentów
app.get("/api/polaczek-agents", (req, res) => {
  const agents = db.prepare("SELECT * FROM agents").all();
  res.json(agents);
});

// Dodaj nowego agenta
app.post("/api/polaczek-agents", (req, res) => {
  const { id, name, type, role, status, description, endpoint } = req.body;
  db.prepare(`INSERT OR REPLACE INTO agents (id, name, type, role, status, description, endpoint)
    VALUES (?, ?, ?, ?, ?, ?, ?)`).run(id, name, type, role, status, description, endpoint);
  res.json({ success: true });
});

// Aktualizuj agenta (np. status)
app.patch("/api/polaczek-agents/:id", (req, res) => {
  const { id } = req.params;
  const { status, name, role, type, description, endpoint } = req.body;
  db.prepare(`UPDATE agents SET
    status = COALESCE(?, status),
    name = COALESCE(?, name),
    role = COALESCE(?, role),
    type = COALESCE(?, type),
    description = COALESCE(?, description),
    endpoint = COALESCE(?, endpoint)
    WHERE id = ?`).run(status, name, role, type, description, endpoint, id);
  res.json({ success: true });
});

// Usuń agenta
app.delete("/api/polaczek-agents/:id", (req, res) => {
  const { id } = req.params;
  db.prepare("DELETE FROM agents WHERE id = ?").run(id);
  res.json({ success: true });
});

// Konfiguracja (np. preferencje, routing, info o GPU/RAM)
app.get("/api/polaczek-config", (req, res) => {
  // Przykładowy config, rozbuduj wg systemu
  res.json({
    gpu: "NVIDIA RTX 4060",
    ram: "32GB",
    db: "SQLite",
    routing: "dynamic",
    agentsCount: db.prepare("SELECT COUNT(*) as cnt FROM agents").get().cnt
  });
});

// Start serwera
app.listen(3000, () => {
  console.log("POLACZEK backend running on http://localhost:3000");
});