# PyQt6: Panel Dyrektor agentów (minimalny, do rozbudowy)
from PyQt6.QtWidgets import (
    QApplication, QWidget, QVBoxLayout, QTableWidget, QTableWidgetItem,
    QLineEdit, QPushButton, QComboBox, QLabel, QHBoxLayout
)
import sys

class DyrektorUI(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("POLACZEK Dyrektor – Zarządzanie Agentami")
        self.layout = QVBoxLayout()
        self.search = QLineEdit()
        self.search.setPlaceholderText("Szukaj agentów...")
        self.layout.addWidget(self.search)

        self.table = QTableWidget(0, 7)
        self.table.setHorizontalHeaderLabels(["ID", "Nazwa", "Typ", "Rola", "Status", "Opis", "Akcje"])
        self.layout.addWidget(self.table)
        self.addRow = QHBoxLayout()
        self.typeBox = QComboBox()
        self.typeBox.addItems(["T", "M", "D", "B", "Dyrektor", "Magazynier"])
        self.addRow.addWidget(self.typeBox)
        self.nameEdit = QLineEdit()
        self.nameEdit.setPlaceholderText("Nazwa agenta")
        self.addRow.addWidget(self.nameEdit)
        self.roleEdit = QLineEdit()
        self.roleEdit.setPlaceholderText("Rola agenta")
        self.addRow.addWidget(self.roleEdit)
        self.descEdit = QLineEdit()
        self.descEdit.setPlaceholderText("Opis")
        self.addRow.addWidget(self.descEdit)
        self.addBtn = QPushButton("Dodaj")
        self.addRow.addWidget(self.addBtn)
        self.layout.addLayout(self.addRow)
        self.setLayout(self.layout)
        self.agents = []
        self.addBtn.clicked.connect(self.addAgent)

    def addAgent(self):
        agent = {
            "id": f"POLACZEK_{self.typeBox.currentText()}{len([a for a in self.agents if a['type']==self.typeBox.currentText()])+1}",
            "name": self.nameEdit.text(),
            "type": self.typeBox.currentText(),
            "role": self.roleEdit.text(),
            "status": "active",
            "description": self.descEdit.text()
        }
        self.agents.append(agent)
        self.refreshTable()

    def refreshTable(self):
        self.table.setRowCount(0)
        for agent in self.agents:
            row = self.table.rowCount()
            self.table.insertRow(row)
            self.table.setItem(row, 0, QTableWidgetItem(agent["id"]))
            self.table.setItem(row, 1, QTableWidgetItem(agent["name"]))
            self.table.setItem(row, 2, QTableWidgetItem(agent["type"]))
            self.table.setItem(row, 3, QTableWidgetItem(agent["role"]))
            self.table.setItem(row, 4, QTableWidgetItem(agent["status"]))
            self.table.setItem(row, 5, QTableWidgetItem(agent["description"]))
            self.table.setItem(row, 6, QTableWidgetItem("")) # Akcje (rozbuduj)
            
if __name__ == "__main__":
    app = QApplication(sys.argv)
    w = DyrektorUI()
    w.resize(800, 400)
    w.show()
    sys.exit(app.exec())