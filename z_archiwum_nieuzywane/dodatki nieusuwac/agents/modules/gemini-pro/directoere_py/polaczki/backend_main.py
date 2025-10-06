# FastAPI backend – agenci, workflow orchestration, logi, monitoring, DB integration
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import sqlalchemy, pymongo, psutil, GPUtil, datetime

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# MODELE
class Agent(BaseModel):
    id: str
    name: str
    type: str
    role: str
    status: str
    description: str = ""
    endpoint: str = ""

class WorkflowStep(BaseModel):
    agent_id: str
    payload: Dict[str, Any] = {}

class WorkflowRun(BaseModel):
    steps: List[WorkflowStep]

# BAZA (Postgres/Mongo demo)
# SQLAlchemy/Postgres setup
SQL_ENGINE = sqlalchemy.create_engine("postgresql://user:pass@localhost/polaczek")
# PyMongo/Mongo setup
MONGO_CLIENT = pymongo.MongoClient("mongodb://localhost:27017/")
MONGO_DB = MONGO_CLIENT["polaczek_db"]

# DANE TESTOWE
AGENTS = [
    Agent(id="POLACZEK_T1", name="Tłumacz", type="T", role="translator", status="active", description="Agent tłumaczeń", endpoint="/agent/t1"),
    Agent(id="POLACZEK_A1", name="Analityk", type="A", role="analytics", status="active", description="Monitor systemowy", endpoint="/agent/a1"),
    Agent(id="POLACZEK_D1", name="Dashboard Keeper", type="D", role="dashboard", status="idle", description="Panel statusu", endpoint="/agent/d1"),
    Agent(id="POLACZEK_S1", name="Searcher", type="S", role="searcher", status="active", description="Agent wyszukiwania", endpoint="/agent/s1"),
]

# ENDPOINTY
@app.get("/api/agents", response_model=List[Agent])
def get_agents():
    return AGENTS

@app.post("/api/agents", response_model=Agent)
def add_agent(agent: Agent):
    AGENTS.append(agent)
    # Możesz dodać zapis do DB
    return agent

@app.post("/api/workflow")
def run_workflow(workflow: WorkflowRun):
    results = []
    for step in workflow.steps:
        # Tu: wywołanie REST/WS do agenta, demo response
        results.append({"agent_id": step.agent_id, "result": f"Executed payload {step.payload}"})
    return {"success": True, "results": results}

@app.get("/api/system_status")
def system_status():
    gpu = [g.name for g in GPUtil.getGPUs()] if GPUtil.getGPUs() else []
    return {
        "ram": psutil.virtual_memory().percent,
        "cpu": psutil.cpu_percent(interval=1),
        "gpu": gpu,
        "timestamp": datetime.datetime.now().isoformat()
    }

@app.get("/api/metrics")
def metrics():
    return [{"cpu_percent": psutil.cpu_percent(), "memory_percent": psutil.virtual_memory().percent, "timestamp": datetime.datetime.now().isoformat()} for _ in range(10)]

@app.get("/api/logs")
def logs():
    # Demo logs, podmień na plik/bazę
    return [{"timestamp": datetime.datetime.now().isoformat(), "level": "INFO", "message": "Log test", "agent": "POLACZEK_T1"}]

# Integracja z AI (Gemini, Bielik, Llama)
@app.post("/api/ai/gemini")
def ai_gemini(payload: Dict[str, Any]):
    # Tu podłącz REST do Gemini
    return {"response": "Gemini response", "input": payload}

@app.post("/api/ai/bielik")
def ai_bielik(payload: Dict[str, Any]):
    return {"response": "Bielik response", "input": payload}

@app.post("/api/ai/llama")
def ai_llama(payload: Dict[str, Any]):
    return {"response": "Llama response", "input": payload}