---
// WORKERS_FOLDERS_README.md - Mapa folderów dla 12 przycisków workers grid
---

# WORKERS GRID FOLDERS (3x4 = 12 kart)

## Utworzone foldery w `Q:\mybonzo\Luc_bon_ZOO_zen_AI\dodatki nieusuwac\workers\`

### Rząd 1:
1. **image-generator** ✅ GOTOWE
   - Generator Obrazów AI (Flux-1 Schnell)
   - Interface z prompt input, preview, download
   - Podstawowa funkcjonalność gotowa

2. **ai-chatbot** ✅ GOTOWE  
   - AI Chatbot (OpenAI GPT)
   - Chat interface z quick actions
   - Real-time typing indicator

3. **bigquery-analytics** 📁 FOLDER
   - BigQuery Analytics
   - Potrzebny index.astro
   
### Rząd 2:
4. **kaggle-datasets** 📁 FOLDER
   - Kaggle Datasets
   - Potrzebny index.astro


5. **tavily-ai-search** 📁 FOLDER
   - Tavily AI Search
   - Potrzebny index.astro

6. **voice-ai-assistant** 📁 FOLDER
   - Voice AI Assistant
   - Potrzebny index.astro
   
### Rząd 3: 
7. **flowise** 📁 FOLDER
   - Flowise AI Flow Builder
   - Potrzebny index.astro
    
8. **langflow** ✅ GOTOWE
   - Langflow Visual AI Builder  
   - Flow management interface
   - Templates i recent flows

9. **mcp-servers** ✅ GOTOWE
   - MCP Servers Management
   - 5 aktywnych serwerów
   - Server monitoring i templates
   
### Rząd 4:
10. **nodered** 📁 FOLDER
    - NodeRED Flow Programming
    - Potrzebny index.astro

11. **webmaster** 📁 FOLDER
    - WebMaster Tools
    - Potrzebny index.astro

12. **business-intel** 📁 FOLDER
    - Business Intelligence
    - Potrzebny index.astro

## Status realizacji:
- ✅ **Gotowe (4/12)**: image-generator, ai-chatbot, langflow, mcp-servers
- 📁 **Do zrobienia (8/12)**: Pozostałe foldery potrzebują index.astro

## Następne kroki:
1. Utworzyć index.astro dla pozostałych 8 folderów
2. Każdy index.astro powinien mieć:
   - MyBonzoLayout
   - Podstawowy interface zgodny z tematem
   - Placeholder functionality
   - MyBonzo color scheme
3. Później rozbudować funkcjonalność każdego narzędzia

## Aktualizacja WorkersGridSection.astro:
Wszystkie przyciski w WorkersGridSection.astro już mają poprawne data-worker atrybuty i otwierają odpowiednie foldery:
- `/workers/image-generator` 
- `/workers/ai-chatbot`
- `/workers/bigquery-analytics`
- itd...

### pod przyciskami jeden dłógi na serokość okna i przerw pomiedzy oknami z napisem MY_PRSONAL_AI_BLOG
