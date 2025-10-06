# workflow_orchestration.py – Definicja i automatyzacja workflow agentów POLACZEK
import requests

class WorkflowOrchestrator:
    def __init__(self, api_url="http://127.0.0.1:5005"):
        self.api_url = api_url

    def run_workflow(self, workflow_steps):
        results = []
        for step in workflow_steps:
            agent_id = step["agent_id"]
            payload = step.get("payload", {})
            try:
                res = requests.post(f"{self.api_url}/agent/{agent_id}", json=payload)
                results.append({"agent_id": agent_id, "response": res.json()})
            except Exception as e:
                results.append({"agent_id": agent_id, "error": str(e)})
        return results

    def define_workflow(self, workflow_name, steps):
        wf = {"name": workflow_name, "steps": steps}
        # Zapisz workflow do pliku/bazy
        with open(f"{workflow_name}.json", "w", encoding="utf-8") as f:
            json.dump(wf, f, indent=2)
        return wf

    def load_workflow(self, workflow_name):
        with open(f"{workflow_name}.json", "r", encoding="utf-8") as f:
            wf = json.load(f)
        return wf

def main():
    orchestrator = WorkflowOrchestrator()
    # Przykład workflow: tłumacz->analityk->dashboard
    steps = [
        {"agent_id": "POLACZEK_T1", "payload": {"text": "Przetłumacz na EN"}},
        {"agent_id": "POLACZEK_A1", "payload": {"analyze": True}},
        {"agent_id": "POLACZEK_D1", "payload": {"update": True}}
    ]
    wf = orchestrator.define_workflow("t1_a1_d1", steps)
    results = orchestrator.run_workflow(steps)
    print("Workflow results:", results)

if __name__ == "__main__":
    main()