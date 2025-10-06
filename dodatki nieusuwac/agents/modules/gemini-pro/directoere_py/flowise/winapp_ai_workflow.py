import sys, requests
from PyQt6.QtWidgets import QApplication, QWidget, QVBoxLayout, QLineEdit, QPushButton, QTextEdit, QLabel

class AIWinApp(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("POLACZEK AI Workflow WinApp")
        self.layout = QVBoxLayout()
        self.promptEdit = QLineEdit(); self.promptEdit.setPlaceholderText("Podaj prompt...")
        self.layout.addWidget(QLabel("Prompt:")); self.layout.addWidget(self.promptEdit)
        self.runBtn = QPushButton("URUCHOM WORKFLOW"); self.runBtn.clicked.connect(self.run_workflow)
        self.layout.addWidget(self.runBtn)
        self.outputBox = QTextEdit(); self.outputBox.setReadOnly(True)
        self.layout.addWidget(QLabel("Wynik:")); self.layout.addWidget(self.outputBox)
        self.setLayout(self.layout)

    def run_workflow(self):
        prompt = self.promptEdit.text()
        payload = {"prompt": prompt, "temperature": 0.7, "max_tokens": 1024}
        try:
            r1 = requests.post("http://localhost:9000/api/gemini", json=payload).json()
            r2 = requests.post("http://localhost:11434/api/generate", json={"model":"bielik","prompt":r1["response"]}).json()
            r3 = requests.post("http://localhost:11434/api/generate", json={"model":"llama3","prompt":r2["response"]}).json()
            r4 = requests.post("http://localhost:5005/agent/POLACZEK_D1", json={"ai_results":r3["response"]}).json()
            self.outputBox.setText(f"GEMINI: {r1['response']}\nBIELIK: {r2['response']}\nLLAMA: {r3['response']}\nDASHBOARD: {r4['result']}")
        except Exception as e:
            self.outputBox.setText(f"ERROR: {e}")

def main():
    app = QApplication(sys.argv)
    w = AIWinApp(); w.resize(700, 400); w.show()
    app.exec()

if __name__ == "__main__":
    main()