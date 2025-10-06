# WinApp bridge (PyQt6) – integracja z backendem/web panelem, workflow orchestration, monitoring
import sys, requests, threading
from PyQt6.QtWidgets import QApplication, QWidget, QVBoxLayout, QPushButton, QLabel, QLineEdit, QTextEdit, QMessageBox

class WinAppBridge(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("POLACZEK WinApp Monitor")
        self.layout = QVBoxLayout()
        self.statusLabel = QLabel("Status: ..."); self.layout.addWidget(self.statusLabel)
        self.workflowEdit = QLineEdit(); self.workflowEdit.setPlaceholderText("Workflow T1->A1->D1"); self.layout.addWidget(self.workflowEdit)
        self.runWorkflowBtn = QPushButton("Run Workflow"); self.runWorkflowBtn.clicked.connect(self.runWorkflow); self.layout.addWidget(self.runWorkflowBtn)
        self.logsBox = QTextEdit(); self.logsBox.setReadOnly(True); self.layout.addWidget(self.logsBox)
        self.refreshLogsBtn = QPushButton("Refresh Logs"); self.refreshLogsBtn.clicked.connect(self.loadLogs); self.layout.addWidget(self.refreshLogsBtn)
        self.setLayout(self.layout)
        self.loadStatus(); self.loadLogs()

    def loadStatus(self):
        try:
            r = requests.get("http://127.0.0.1:5005/api/system_status")
            d = r.json()
            self.statusLabel.setText(f"CPU: {d['cpu']}%, RAM: {d['ram']}%, GPU: {', '.join(d['gpu'])}")
        except Exception as e:
            self.statusLabel.setText(f"ERROR: {e}")

    def runWorkflow(self):
        wf = self.workflowEdit.text()
        steps = [{"agent_id": x.strip(), "payload": {}} for x in wf.split("->") if x.strip()]
        try:
            r = requests.post("http://127.0.0.1:5005/api/workflow", json={"steps": steps})
            QMessageBox.information(self, "Workflow", str(r.json()))
        except Exception as e:
            QMessageBox.warning(self, "Workflow", str(e))

    def loadLogs(self):
        try:
            logs = requests.get("http://127.0.0.1:5005/api/logs").json()
            self.logsBox.setText("\n".join([f"[{l['timestamp']}] [{l['level']}] {l['message']} ({l['agent']})" for l in logs[-50:]]))
        except:
            self.logsBox.setText("Brak logów.")

def main():
    app = QApplication(sys.argv)
    w = WinAppBridge(); w.resize(700, 400); w.show()
    app.exec()

if __name__ == "__main__":
    main()