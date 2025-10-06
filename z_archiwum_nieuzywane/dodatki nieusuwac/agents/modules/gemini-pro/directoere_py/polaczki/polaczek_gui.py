# POLACZEK GUI – PyQt6 centrum dowodzenia: monitoring, workflow, logi, agenty, alerty, live wykresy
import sys, requests, threading, json
from PyQt6.QtWidgets import (
    QApplication, QWidget, QVBoxLayout, QHBoxLayout, QTableWidget, QTableWidgetItem,
    QLineEdit, QPushButton, QComboBox, QLabel, QMessageBox, QTextEdit
)
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure

class PolaczekGUI(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("POLACZEK – Centrum Dowodzenia AI Agentów")
        self.layout = QVBoxLayout()
        # Status systemu
        self.infoLabel = QLabel("Ładowanie..."); self.layout.addWidget(self.infoLabel)
        # Monitoring hardware
        self.monitorBtn = QPushButton("Odśwież status systemu")
        self.monitorBtn.clicked.connect(self.loadConfig)
        self.layout.addWidget(self.monitorBtn)
        # Logi/alerty
        self.logBox = QTextEdit(); self.logBox.setReadOnly(True); self.layout.addWidget(self.logBox)
        self.refreshLogsBtn = QPushButton("Odśwież logi"); self.refreshLogsBtn.clicked.connect(self.loadLogs)
        self.layout.addWidget(self.refreshLogsBtn)
        # Wykres CPU/RAM
        self.figure = Figure(); self.canvas = FigureCanvas(self.figure); self.layout.addWidget(self.canvas)
        self.plotBtn = QPushButton("Wykres CPU/RAM"); self.plotBtn.clicked.connect(self.showPlot); self.layout.addWidget(self.plotBtn)
        # Workflow orchestration
        self.workflowBox = QTextEdit(); self.workflowBox.setPlaceholderText("Zdefiniuj workflow (np. T1->A1->D1)...")
        self.layout.addWidget(self.workflowBox)
        self.runWorkflowBtn = QPushButton("Uruchom workflow"); self.runWorkflowBtn.clicked.connect(self.runWorkflow)
        self.layout.addWidget(self.runWorkflowBtn)
        # CRUD agentów
        self.search = QLineEdit(); self.search.setPlaceholderText("Szukaj agentów..."); self.layout.addWidget(self.search)
        self.table = QTableWidget(0, 8); self.table.setHorizontalHeaderLabels(["ID", "Nazwa", "Typ", "Rola", "Status", "Opis", "Endpoint", "Akcje"]); self.layout.addWidget(self.table)
        self.addRow = QHBoxLayout()
        self.typeBox = QComboBox(); self.typeBox.addItems(["T", "M", "D", "B", "A", "S", "ART", "Dyrektor", "Magazynier"]); self.addRow.addWidget(self.typeBox)
        self.nameEdit = QLineEdit(); self.nameEdit.setPlaceholderText("Nazwa agenta"); self.addRow.addWidget(self.nameEdit)
        self.roleEdit = QLineEdit(); self.roleEdit.setPlaceholderText("Rola agenta"); self.addRow.addWidget(self.roleEdit)
        self.descEdit = QLineEdit(); self.descEdit.setPlaceholderText("Opis"); self.addRow.addWidget(self.descEdit)
        self.endpointEdit = QLineEdit(); self.endpointEdit.setPlaceholderText("Endpoint"); self.addRow.addWidget(self.endpointEdit)
        self.addBtn = QPushButton("Dodaj"); self.addRow.addWidget(self.addBtn)
        self.layout.addLayout(self.addRow)
        self.agents = []; self.config = {}
        self.addBtn.clicked.connect(self.addAgent); self.search.textChanged.connect(self.refreshTable)
        self.setLayout(self.layout)
        self.loadConfig(); self.loadAgents(); self.loadLogs()

    def loadConfig(self):
        try:
            res = requests.get("http://127.0.0.1:5005/api/polaczek-config")
            self.config = res.json()
            txt = f"GPU: {self.config.get('gpu','?')}, RAM: {self.config.get('ram','?')}, CPU: {self.config.get('cpu','?')}, DB: {self.config.get('db','?')}, Agenci: {self.config.get('agentsCount','?')}"
            self.infoLabel.setText(txt)
        except Exception as e:
            self.infoLabel.setText(f"Błąd konfigu: {e}")

    def loadAgents(self):
        try:
            res = requests.get("http://127.0.0.1:5005/api/polaczek-agents")
            self.agents = res.json()
        except Exception as e:
            QMessageBox.warning(self, "Błąd", f"Nie można pobrać agentów! {e}")
        self.refreshTable()

    def addAgent(self):
        agent = {
            "id": f"POLACZEK_{self.typeBox.currentText()}{len([a for a in self.agents if a['type']==self.typeBox.currentText()])+1}",
            "name": self.nameEdit.text(),
            "type": self.typeBox.currentText(),
            "role": self.roleEdit.text(),
            "status": "active",
            "description": self.descEdit.text(),
            "endpoint": self.endpointEdit.text()
        }
        try:
            requests.post("http://127.0.0.1:5005/api/polaczek-agents", json=agent)
        except Exception as e:
            QMessageBox.warning(self, "Błąd", f"Nie można dodać agenta! {e}")
        self.loadAgents(); self.loadConfig()

    def refreshTable(self):
        search = self.search.text().lower()
        self.table.setRowCount(0)
        filtered = [a for a in self.agents if search in a["name"].lower() or search in a["role"].lower() or search in a["type"].lower()]
        for agent in filtered:
            row = self.table.rowCount(); self.table.insertRow(row)
            self.table.setItem(row, 0, QTableWidgetItem(agent["id"]))
            self.table.setItem(row, 1, QTableWidgetItem(agent["name"]))
            self.table.setItem(row, 2, QTableWidgetItem(agent["type"]))
            self.table.setItem(row, 3, QTableWidgetItem(agent["role"]))
            self.table.setItem(row, 4, QTableWidgetItem(agent["status"]))
            self.table.setItem(row, 5, QTableWidgetItem(agent["description"]))
            self.table.setItem(row, 6, QTableWidgetItem(agent["endpoint"]))
            btn = QPushButton("Usuń"); btn.clicked.connect(lambda _, id=agent["id"]: self.removeAgent(id)); self.table.setCellWidget(row, 7, btn)

    def removeAgent(self, agent_id):
        try:
            requests.delete(f"http://127.0.0.1:5005/api/polaczek-agents/{agent_id}")
        except Exception as e:
            QMessageBox.warning(self, "Błąd", f"Nie można usunąć agenta! {e}")
        self.loadAgents(); self.loadConfig()

    def loadLogs(self):
        try:
            logs = requests.get("http://127.0.0.1:5005/api/polaczek-logs").json()
            self.logBox.setText("\n".join([f"[{l['timestamp']}] [{l['level']}] {l['message']} ({l['agent']})" for l in logs[-50:]]))
        except: self.logBox.setText("Brak logów.")

    def showPlot(self):
        metrics = requests.get("http://127.0.0.1:5005/api/polaczek-metrics").json()
        cpu = [m["cpu_percent"] for m in metrics]
        ram = [m["memory_percent"] for m in metrics]
        ax = self.figure.add_subplot(111)
        ax.clear()
        ax.plot(cpu, label="CPU %")
        ax.plot(ram, label="RAM %")
        ax.legend(); self.canvas.draw()

    def runWorkflow(self):
        workflow = self.workflowBox.toPlainText()
        # Przykład: T1->A1->D1 (agent IDs separated by ->)
        steps = [s.strip() for s in workflow.split("->") if s.strip()]
        results = []
        for agent_id in steps:
            agent = next((a for a in self.agents if a["id"].endswith(agent_id)), None)
            if agent:
                try:
                    r = requests.post(f"http://127.0.0.1:5005/agent/{agent['id']}", json={"workflow_step": agent_id})
                    results.append(f"{agent_id}: {r.json()}")
                except Exception as e:
                    results.append(f"{agent_id}: ERROR {e}")
            else:
                results.append(f"{agent_id}: NIE ZNALEZIONO")
        QMessageBox.information(self, "Wyniki workflow", "\n".join([str(r) for r in results]))

def main():
    app = QApplication(sys.argv)
    w = PolaczekGUI(); w.resize(1200, 700); w.show()
    app.exec()

if __name__ == "__main__":
    main()