# 🎯 FLOATING BUTTONS I AGENCI 01-10 - KOMPLETNA DOKUMENTACJA

**Status**: ✅ AKTYWNY  
**Wersja**: 3.2.0  
**Ostatnia aktualizacja**: 10.10.2025  
**Lokalizacja**: `src/pages/index.astro` (linie 779-840)

---

## 🔘 FLOATING BUTTONS SYSTEM

### 📍 **Lokalizacja w kodzie**

```astro
<!-- Modular Agents Section (01-10) -->
<!-- Linie 779-840 w src/pages/index.astro -->
```

### 🎨 **Style CSS dla right-btn**

```css
.right-btn {
  background: rgba(0, 0, 0, 0.5);
  color: #ffffff;
  padding: 8px 20px;
  border-radius: 0px;
  box-shadow: 0 1px 26px rgba(20, 215, 230, 0.2);
  font-size: 0.9rem;
  font-weight: 700;
  border: 1px solid rgba(0, 217, 255, 0.3);
  transition: all 0.3s ease;
  display: block;
  text-align: center;
  min-width: 235px;
  cursor: pointer;
  position: relative;
  z-index: 10;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  backdrop-filter: blur(20px);
  font-family: "Courier New", monospace;
}

.right-btn:hover {
  background: rgba(0, 0, 0, 0.7);
  color: #00d7ef;
  transform: translateY(-2px);
  box-shadow: 0 4px 30px rgba(0, 217, 255, 0.4);
  border-color: #00d7ef;
  backdrop-filter: blur(25px);
}
```

### 🌟 **Floating Widget Template Style**

```css
.floating-widget-template {
  background: linear-gradient(
    135deg,
    rgba(15, 56, 70, 0.98),
    rgba(0, 0, 0, 0.95)
  );
  border: 2px solid #1be1ff;
  border-radius: 0;
  backdrop-filter: blur(15px);
  min-width: 480px;
  max-width: 520px;
  min-height: 450px;
  max-height: 600px;
  box-shadow: 0 0 12px rgba(27, 225, 255, 0.2), 0 0 25px rgba(27, 225, 255, 0.08),
    inset 0 1px 0 rgba(27, 225, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;
  z-index: 1000;
  font-family: "Rajdhani", sans-serif;
}
```

---

## 🤖 AGENCI 01-10 - KOMPLETNA ROZPISKA

### **🎤 AGENT 01 - VOICE COMMAND AGENT**

```astro
<button onclick="toggleVoiceAgent()" class="right-btn" id="voiceAgentBtn" title="Agent 01 - Voice Command Agent">
  🎤 AGENT 01 - VOICE
</button>
```

- **Funkcja**: Sterowanie głosowe systemem
- **Emoji**: 🎤
- **Status**: ✅ AKTYWNY
- **Lokalizacja kodu**: Linia 780-782
- **API Integration**: Voice Recognition + TTS
- **Widget**: Floating panel z textarea dla komend głosowych

### **🎵 AGENT 02 - MUSIC CONTROL AGENT**

```astro
<button onclick="toggleMusicAgent()" class="right-btn" id="musicAgentBtn" title="Agent 02 - Music Control Agent">
  🎵 AGENT 02 - MUSIC
</button>
```

- **Funkcja**: Kontrola systemu muzycznego
- **Emoji**: 🎵
- **Status**: ✅ AKTYWNY
- **Lokalizacja kodu**: Linia 784-786
- **Komendy**: play, volume, next, pause, stop
- **Widget**: Music Player floating panel

### **🤖 AGENT 03 - SYSTEM MONITOR AGENT**

```astro
<button onclick="toggleSystemAgent()" class="right-btn" id="systemAgentBtn" title="Agent 03 - System Monitor Agent">
  🤖 AGENT 03 - SYSTEM
</button>
```

- **Funkcja**: Monitoring systemu i zasobów
- **Emoji**: 🤖
- **Status**: ✅ AKTYWNY
- **Lokalizacja kodu**: Linia 788-790
- **Monitoring**: CPU, RAM, Network, Workers status
- **Widget**: System metrics dashboard

### **🕷️ AGENT 04 - WEB CRAWLER AGENT**

```astro
<button onclick="toggleCrawlerAgent()" class="right-btn" id="crawlerAgentBtn" title="Agent 04 - Web Crawler Agent">
  🕷️ AGENT 04 - CRAWLER
</button>
```

- **Funkcja**: Web scraping i crawling
- **Emoji**: 🕷️
- **Status**: ✅ AKTYWNY
- **Lokalizacja kodu**: Linia 792-794
- **Capabilities**: URL analysis, content extraction, SEO data
- **Widget**: Crawler control panel

### **📧 AGENT 05 - EMAIL MANAGER AGENT**

```astro
<button onclick="toggleEmailAgent()" class="right-btn" id="emailAgentBtn" title="Agent 05 - Email Manager Agent">
  📧 AGENT 05 - EMAIL
</button>
```

- **Funkcja**: Zarządzanie systemem email
- **Emoji**: 📧
- **Status**: ✅ AKTYWNY
- **Lokalizacja kodu**: Linia 796-798
- **Features**: Send/receive emails, templates, automation
- **Widget**: Email management interface

### **🗃️ AGENT 06 - DATABASE QUERY AGENT**

```astro
<button onclick="toggleDatabaseAgent()" class="right-btn" id="databaseAgentBtn" title="Agent 06 - Database Query Agent">
  🗃️ AGENT 06 - DATABASE
</button>
```

- **Funkcja**: Zarządzanie bazami danych i zapytaniami
- **Emoji**: 🗃️
- **Status**: ✅ AKTYWNY
- **Lokalizacja kodu**: Linia 800-802
- **Support**: SQL queries, BigQuery integration, data analysis
- **Widget**: Database query interface

### **✍️ AGENT 07 - CONTENT CREATOR AGENT**

```astro
<button onclick="toggleContentAgent()" class="right-btn" id="contentAgentBtn" title="Agent 07 - Content Creator Agent">
  ✍️ AGENT 07 - CONTENT
</button>
```

- **Funkcja**: Tworzenie i zarządzanie treścią
- **Emoji**: ✍️
- **Status**: ✅ AKTYWNY
- **Lokalizacja kodu**: Linia 804-806
- **Capabilities**: Blog posts, articles, social media content
- **Widget**: Content creation studio

### **🛡️ AGENT 08 - SECURITY GUARD AGENT**

```astro
<button onclick="toggleSecurityAgent()" class="right-btn" id="securityAgentBtn" title="Agent 08 - Security Guard Agent">
  🛡️ AGENT 08 - SECURITY
</button>
```

- **Funkcja**: Bezpieczeństwo systemu i monitoring zagrożeń
- **Emoji**: 🛡️
- **Status**: ✅ AKTYWNY
- **Lokalizacja kodu**: Linia 808-810
- **Features**: Threat detection, firewall management, security logs
- **Widget**: Security monitoring dashboard

### **🏢 AGENT 09 - DYREKTOR BIZNESOWY**

```astro
<div class="floating-widget-container">
  <button onclick="toggleAgent09Dyrektor()" class="right-btn" id="agent09DyrektorBtn" title="Agent 09 - Dyrektor Biznesowy">
    <BriefcaseIcon className="w-6 h-6 inline mr-2" /> AGENT 09 - DYREKTOR
  </button>
  <div id="agent09DyrektorWidget" class="floating-widget hidden">
    <div class="floating-widget-template">
      <div class="panel-header">
        <span>🏢 AGENT 09 - DYREKTOR</span>
        <button onclick="toggleAgent09Dyrektor()" style="background: transparent; border: none; color: #000; font-size: 18px; cursor: pointer;">×</button>
      </div>
      <div class="panel-content">
        <Agent09Dyrektor client:load />
      </div>
    </div>
  </div>
</div>
```

- **Funkcja**: Zarządzanie biznesowe i strategiczne decyzje
- **Emoji**: 🏢
- **Status**: ✅ AKTYWNY + FLOATING WIDGET
- **Lokalizacja kodu**: Linia 812-825
- **Component**: `Agent09Dyrektor` (Svelte)
- **Special**: Jedyny agent z dedykowanym floating widget
- **Features**: Business analytics, strategic planning, KPI monitoring

### **📊 AGENT 10 - ANALYTICS PROPHET AGENT**

```astro
<button onclick="toggleAnalyticsAgent()" class="right-btn" id="analyticsAgentBtn" title="Agent 10 - Analytics Prophet Agent">
  📊 AGENT 10 - ANALYTICS
</button>
```

- **Funkcja**: Analityka predykcyjna i business intelligence
- **Emoji**: 📊
- **Status**: ✅ AKTYWNY
- **Lokalizacja kodu**: Linia 827-829
- **Capabilities**: Data visualization, predictive analytics, reports
- **Widget**: Analytics dashboard

---

## 🔧 DODATKOWE AGENCI (POZA SYSTEMEM 01-10)

### **🗂️ FILE MANAGER AGENT**

```astro
<button onclick="toggleFileAgent()" class="right-btn" id="fileAgentBtn" title="File Manager Agent - Zarządzanie plikami">
  🗂️ FILE MANAGER
</button>
```

- **Funkcja**: Zarządzanie plikami systemu
- **Status**: ✅ AKTYWNY
- **Lokalizacja kodu**: Linia 831-833

### **🎯 MARKETING AGENT**

```astro
<button onclick="toggleMarketingAgent()" class="right-btn" id="marketingAgentBtn" title="Marketing Maestro Agent - Marketing AI">
  🎯 MARKETING AGENT
</button>
```

- **Funkcja**: Marketing automation i kampanie
- **Status**: ✅ AKTYWNY
- **Lokalizacja kodu**: Linia 835-837

---

## 🎮 SYSTEM CONTROL BUTTONS

### **💬 MAIN CHAT**

```astro
<button onclick="openMainChat()" class="right-btn">
  <ChatBubbleLeftRightIcon className="w-6 h-6 inline mr-2" /> MAIN CHAT
</button>
```

- **Funkcja**: Główny chat z POLACZEK API
- **Integration**: `/api/polaczek-chat` endpoint
- **Features**: Qwen model, Polish language support

### **🔄 REFRESH**

```astro
<button onclick="openRefresh()" class="right-btn">
  <ArrowPathIcon className="w-6 h-6 inline mr-2" /> REFRESH
</button>
```

- **Funkcja**: Odświeżanie systemu i komponentów

### **📁 FOLDER**

```astro
<button onclick="openFolder()" class="right-btn">
  <FolderIcon className="w-6 h-6 inline mr-2" /> FOLDER
</button>
```

- **Funkcja**: Dostęp do systemu plików

### **❌ CLOSE**

```astro
<button onclick="openClose()" class="right-btn">
  <XMarkIcon className="w-6 h-6 inline mr-2" /> CLOSE
</button>
```

- **Funkcja**: Zamykanie paneli i widgetów

---

## 📱 FLOATING WIDGETS SYSTEM

### **🎵 Music Player Widget**

- **ID**: `musicPlayerWidget`
- **Lokalizacja**: Linia 292
- **Status**: Zawsze widoczny
- **Style**: Floating widget template

### **🤖 POLACZEK Widget**

- **ID**: `polaczekWidget`
- **Lokalizacja**: Linia 306
- **Status**: Zawsze widoczny
- **Integration**: POLACZEK system

### **🎤 Voice Assistant Widget**

- **ID**: `voiceAssistantWidget`
- **Lokalizacja**: Linia 318
- **Status**: Hidden by default
- **Toggle**: `toggleVoiceAssistant()`

### **🧠 Gemini Pro Widget**

- **ID**: `geminiProWidget`
- **Lokalizacja**: Linia 328
- **Status**: Hidden by default
- **AI Model**: Gemini Pro integration

### **👁️ Gemini Vision Widget**

- **ID**: `geminiVisionWidget`
- **Lokalizacja**: Linia 370
- **Status**: Hidden by default
- **AI Model**: Gemini Vision Pro

### **⚡ Code Bison Widget**

- **ID**: `codeBisonWidget`
- **Lokalizacja**: Linia 412
- **Status**: Hidden by default
- **AI Model**: Code generation

### **📝 Text Bison Widget**

- **ID**: `textBisonWidget`
- **Lokalizacja**: Linia 454
- **Status**: Hidden by default
- **AI Model**: Text generation

### **🎭 Google Bard Widget**

- **ID**: `googleBardWidget`
- **Lokalizacja**: Linia 501
- **Status**: Hidden by default
- **AI Model**: Google Bard integration

---

## 🔗 JAVASCRIPT FUNCTIONS MAPPING

### **Agent Toggle Functions**

```javascript
toggleVoiceAgent(); // Agent 01 - Voice
toggleMusicAgent(); // Agent 02 - Music
toggleSystemAgent(); // Agent 03 - System
toggleCrawlerAgent(); // Agent 04 - Crawler
toggleEmailAgent(); // Agent 05 - Email
toggleDatabaseAgent(); // Agent 06 - Database
toggleContentAgent(); // Agent 07 - Content
toggleSecurityAgent(); // Agent 08 - Security
toggleAgent09Dyrektor(); // Agent 09 - Dyrektor (Special)
toggleAnalyticsAgent(); // Agent 10 - Analytics
```

### **Additional Functions**

```javascript
toggleFileAgent(); // File Manager
toggleMarketingAgent(); // Marketing Agent
openMainChat(); // Main Chat System
openRefresh(); // System Refresh
openFolder(); // File System Access
openClose(); // Close Panels
```

---

## 🎨 DESIGN SYSTEM

### **Color Scheme**

- **Primary**: `#1be1ff` (Cyan blue)
- **Background**: `rgba(0, 0, 0, 0.5)` (Semi-transparent black)
- **Border**: `rgba(0, 217, 255, 0.3)` (Transparent cyan)
- **Hover**: `#00d7ef` (Bright cyan)

### **Typography**

- **Font Family**: `'Courier New', monospace`
- **Font Weight**: `700` (Bold)
- **Text Transform**: `uppercase`
- **Letter Spacing**: `0.5px`

### **Effects**

- **Backdrop Filter**: `blur(20px)`
- **Box Shadow**: Multiple layered shadows with cyan glow
- **Transitions**: `all 0.3s ease`
- **Hover Transform**: `translateY(-2px)`

---

## 📊 SYSTEM STATISTICS

### **Agenci aktywni**: 10 głównych + 2 dodatkowe

### **Floating Widgets**: 8 dostępnych

### **Toggle Functions**: 12 funkcji JavaScript

### **CSS Classes**:

- `.right-btn` - 235px min-width
- `.floating-widget-template` - 480-520px width
- `.floating-widget-container` - Responsive containers

### **Integration Points**:

- **POLACZEK API**: `/api/polaczek-chat`
- **Voice System**: Speech Recognition API
- **Music System**: Audio API integration
- **Security**: Real-time monitoring
- **Analytics**: Data visualization tools

---

## 📝 NOTATKI TECHNICZNE

### **Responsive Design**

```css
@media (max-width: 768px) {
  .right-btn {
    min-width: 200px;
    font-size: 0.8rem;
  }
}
```

### **Z-Index Hierarchy**

- Floating Widgets: `z-index: 1000`
- Right Buttons: `z-index: 10`
- Background Elements: `z-index: 1`

### **Performance Optimization**

- Lazy loading dla widget'ów (`client:load`)
- CSS transitions dla smooth animations
- Backdrop filter dla glass effect
- Hover states z GPU acceleration

---

**🎯 UWAGA**: System floating buttons i agentów jest kluczowym elementem interfejsu MyBonzo, zapewniającym szybki dostęp do wszystkich funkcji AI. Każdy agent ma dedykowaną funkcjonalność i może być rozbudowywany niezależnie.
