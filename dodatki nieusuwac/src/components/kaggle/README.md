# 🧠 Kaggle Dataset Explorer & ML Pipeline

**Zaawansowana platforma do eksploracji datasetów Kaggle z automatycznym ML pipeline**

## 🎯 Główne funkcjonalności

### 1. Dataset Discovery & Analysis
- **Smart Search**: Wyszukiwanie datasetów z filtrami (rozmiar, kategoria, popularność)
- **Auto-Preview**: Automatyczna analiza struktury i zawartości
- **Data Quality Score**: Ocena jakości danych i kompletności
- **Visualization Engine**: Automatyczne wykresy i statystyki
- **Correlation Matrix**: Analiza korelacji między zmiennymi

### 2. ML Pipeline Automation
- **Auto-ML**: Automatyczne tworzenie modeli ML
- **Feature Engineering**: Automatyczna selekcja i transformacja cech
- **Model Comparison**: Porównanie różnych algorytmów
- **Hyperparameter Tuning**: Optymalizacja parametrów
- **Performance Metrics**: Szczegółowe metryki wydajności

### 3. Competition Integration
- **Competition Browser**: Przeglądanie aktywnych konkursów
- **Submission Manager**: Zarządzanie zgłoszeniami
- **Leaderboard Tracker**: Śledzenie pozycji
- **Code Notebooks**: Integracja z Kaggle Notebooks

## 📊 Dostępne datasety
- Titanic: Machine Learning from Disaster
- House Prices: Advanced Regression Techniques
- Iris Species Classification
- California Housing Prices
- Credit Card Fraud Detection

## 🚀 Quick Start
```python
from kaggle_explorer import KaggleExplorer

explorer = KaggleExplorer()
dataset = explorer.load_dataset("titanic")
model = explorer.auto_ml(dataset, target="Survived")
```