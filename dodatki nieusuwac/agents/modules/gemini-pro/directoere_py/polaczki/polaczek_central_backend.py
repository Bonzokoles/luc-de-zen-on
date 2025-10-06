# POLACZEK Central Backend – Flask + SQLAlchemy + system monitor + agenty jako klasy Python
# (do uruchomienia: python polaczek_central_backend.py)

import os, platform, psutil, threading
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
DB_PATH = "sqlite:///agents_center.db"
app.config["SQLALCHEMY_DATABASE_URI"] = DB_PATH
db = SQLAlchemy(app)

class Agent(db.Model):
    id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String)
    type = db.Column(db.String)
    role = db.Column(db.String)
    status = db.Column(db.String)
    description = db.Column(db.String)
    endpoint = db.Column(db.String)

db.create_all()

# Przykładowi agenci jako klasy
class PolaczekTlumacz:
    def handle(self, payload): return {"result": f"TLUMACZ: {payload.get('text', '')} → EN"}

class PolaczekMusic:
    def handle(self, payload): return {"result": "MUSIC: playing..."}

class PolaczekDashboard:
    def handle(self, payload): return {"result": "DASHBOARD: status OK"}

class PolaczekBiblio:
    def handle(self, payload): return {"result": "BIBLIO: found 3 assets"}

AGENT_CLASSES = {
    "POLACZEK_T": PolaczekTlumacz(),
    "POLACZEK_M1": PolaczekMusic(),
    "POLACZEK_D1": PolaczekDashboard(),
    "POLACZEK_B": PolaczekBiblio()
}

@app.route("/api/polaczek-agents", methods=["GET"])
def api_get_agents():
    agents = Agent.query.all()
    return jsonify([a.__dict__ for a in agents])

@app.route("/api/polaczek-agents", methods=["POST"])
def api_add_agent():
    data = request.json
    agent = Agent(**data)
    db.session.merge(agent)
    db.session.commit()
    return jsonify({"success": True})

@app.route("/api/polaczek-agents/<id>", methods=["PATCH"])
def api_patch_agent(id):
    agent = Agent.query.get(id)
    if not agent: return jsonify({"error": "Agent not found"}), 404
    for k, v in request.json.items(): setattr(agent, k, v)
    db.session.commit()
    return jsonify({"success": True})

@app.route("/api/polaczek-agents/<id>", methods=["DELETE"])
def api_del_agent(id):
    agent = Agent.query.get(id)
    if agent:
        db.session.delete(agent)
        db.session.commit()
    return jsonify({"success": True})

@app.route("/agent/<agent_id>", methods=["POST"])
def agent_handler(agent_id):
    agent = AGENT_CLASSES.get(agent_id)
    if not agent: return jsonify({"error": "Agent not found"}), 404
    payload = request.json
    return jsonify(agent.handle(payload))

@app.route("/api/polaczek-config", methods=["GET"])
def api_config():
    return jsonify({
        "gpu": get_gpu_info(),
        "ram": f"{psutil.virtual_memory().total // (1024**2)} MB",
        "cpu": platform.processor(),
        "os": platform.system(),
        "db": DB_PATH,
        "routing": "dynamic",
        "agentsCount": Agent.query.count()
    })

def get_gpu_info():
    try:
        import GPUtil
        gpus = GPUtil.getGPUs()
        if gpus: return f"{gpus[0].name} ({gpus[0].memoryTotal}MB)"
        else: return "GPU not detected"
    except Exception: return "GPUtil not installed"

# Uruchom backend w osobnym threadzie (np. dla PyQt)
def run_flask():
    app.run("127.0.0.1", 5005)
if __name__ == "__main__":
    threading.Thread(target=run_flask, daemon=True).start()