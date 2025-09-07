## **Jak uruchomić w środowisku Windows:**

### **1. Wymagania:**

```shellscript
# Sprawdź czy masz zainstalowane:
node --version    # Node.js 18+ wymagane
npm --version     # npm 9+ wymagane
```

### **2. Instalacja:**

```shellscript
# Pobierz projekt (Download Code button)
# Rozpakuj ZIP
# Otwórz folder w terminalu/PowerShell

# Zainstaluj zależności
npm install
```

### **3. Uruchomienie - 3 sposoby:**

#### **A) Batch Script (CMD):**

```plaintext
# Kliknij dwukrotnie na:
scripts/start-local.bat
```

#### **B) PowerShell Script:**

```powershell
# W PowerShell uruchom:
.\scripts\start-local.ps1
```

#### **C) Ręcznie (Terminal/CMD):**

```shellscript
# Terminal 1 - MCP Bridge
npm run mcp-bridge

# Terminal 2 - Dashboard  
npm run dev
```

### **4. Dostęp:**

- 🌐 **Dashboard:** [http://localhost:3303](http://localhost:3303)
- 🔧 **MCP Bridge:** [http://localhost:3001](http://localhost:3001)
- 🔐 **Hasło:** #Haos77#


### **5. Struktura bez fake danych:**

✅ **Puste dashboardy** - gotowe do wypełnienia✅ **TODO komentarze** - gdzie dodać własne dane✅ **Funkcje przykładowe** - gotowe do rozszerzenia✅ **TypeScript typy** - pełna definicja struktur

Projekt jest teraz gotowy do rozwoju na Windows! 🚀