# polaczek_logs_panel.py – Panel logów/alertów/wykresów (PyQt6 + matplotlib)
import sys, requests
from PyQt6.QtWidgets import QApplication, QWidget, QVBoxLayout, QTableWidget, QTableWidgetItem, QLabel, QPushButton
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure

class LogsPanel(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("POLACZEK Log/Alert Panel")
        self.layout = QVBoxLayout()
        self.logLabel = QLabel("Logi systemowe:"); self.layout.addWidget(self.logLabel)
        self.table = QTableWidget(0, 4); self.table.setHorizontalHeaderLabels(["Timestamp", "Level", "Message", "Agent"]); self.layout.addWidget(self.table)
        self.plotBtn = QPushButton("Pokaż wykres CPU/RAM"); self.plotBtn.clicked.connect(self.showPlot); self.layout.addWidget(self.plotBtn)
        self.figure = Figure(); self.canvas = FigureCanvas(self.figure); self.layout.addWidget(self.canvas)
        self.setLayout(self.layout)
        self.loadLogs()

    def loadLogs(self):
        try:
            logs = requests.get("http://127.0.0.1:5005/api/polaczek-logs").json()
            self.table.setRowCount(0)
            for log in logs:
                row = self.table.rowCount(); self.table.insertRow(row)
                self.table.setItem(row, 0, QTableWidgetItem(log["timestamp"]))
                self.table.setItem(row, 1, QTableWidgetItem(log["level"]))
                self.table.setItem(row, 2, QTableWidgetItem(log["message"]))
                self.table.setItem(row, 3, QTableWidgetItem(log["agent"]))
        except: pass

    def showPlot(self):
        metrics = requests.get("http://127.0.0.1:5005/api/polaczek-metrics").json()
        cpu = [m["cpu_percent"] for m in metrics]
        ram = [m["memory_percent"] for m in metrics]
        ax = self.figure.add_subplot(111)
        ax.clear()
        ax.plot(cpu, label="CPU %")
        ax.plot(ram, label="RAM %")
        ax.legend(); self.canvas.draw()

def main():
    app = QApplication(sys.argv)
    w = LogsPanel(); w.resize(900, 600); w.show()
    app.exec()

if __name__ == "__main__":
    main()