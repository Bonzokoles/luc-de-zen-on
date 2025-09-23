// ZENON Dashboard Functions - Embedded lokalnie

const dashboards = {
    'jimbo': { name: 'Jimbo Chat', url: '/dashboard/jimbo-chat', hotkey: '1' },
    'video': { name: 'Video Dashboard', url: '/dashboard/video-dashboard', hotkey: '2' },
    'chatbox': { name: 'Chatbox', url: '/dashboard/chatbox', hotkey: '3' },
    'agent': { name: 'Agent Dashboard', url: '/dashboard/agent-dashboard', hotkey: '4' },
    'master': { name: 'Master Dashboard', url: '/dashboard/master-dashboard', hotkey: '5' }
};

let currentDashboard = null;

// Load dashboard
window.loadDashboard = function(dashboardId) {
    const dashboard = dashboards[dashboardId];
    if (!dashboard) return;
    
    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = `
        <iframe class="dashboard-frame" src="${dashboard.url}" frameborder="0"></iframe>
        <div style="position: absolute; top: 10px; right: 10px; z-index: 100;">
            <button onclick="closeDashboard()" style="
                background: #ff4444; color: white; border: none;
                padding: 0.5rem 1rem; cursor: pointer; border-radius: 3px;
            ">Zamknij (ESC)</button>
        </div>
    `;
    
    currentDashboard = dashboardId;
    setLastActivity(`Otworzono: ${dashboard.name}`);
};

// Close dashboard
window.closeDashboard = function() {
    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = `
        <div class="welcome-screen">
            <h2>🚀 ZENON Unified Dashboard System</h2>
            <p>Dashboard zamknięty. Wybierz kolejny z menu lub użyj skrótów klawiaturowych.</p>
        </div>
    `;
    currentDashboard = null;
};

// System functions
window.openHealthCheck = function() {
    alert('Health Check - funkcja dostępna w pełnej wersji');
};

window.openPORReceiver = function() {
    alert('POR Receiver - funkcja dostępna w pełnej wersji');
};

window.openCloudflareAI = function() {
    alert('Cloudflare AI - funkcja dostępna w pełnej wersji');
};

window.showCloudflarePanel = function() {
    alert('Cloudflare Panel - funkcja dostępna w pełnej wersji');
};

window.deployToStaging = function() {
    alert('Deploy Staging - funkcja dostępna w pełnej wersji');
};

window.deployToProduction = function() {
    alert('Deploy Production - funkcja dostępna w pełnej wersji');
};

window.testCloudflareEndpoints = function() {
    alert('Test Endpoints - funkcja dostępna w pełnej wersji');
};

window.showWorkerLogs = function() {
    alert('Worker Logs - funkcja dostępna w pełnej wersji');
};

// Update system status
function updateSystemStatus() {
    document.getElementById('systemStatus').innerHTML = 
        '<span class="status-online">● LOCAL MODE</span> (Dashboard aktywny)';
    document.getElementById('activeServices').textContent = 'Dashboard lokalny';
}

// Set last activity
function setLastActivity(activity = null) {
    const now = new Date();
    const timeString = now.toLocaleTimeString('pl-PL');
    
    if (activity && typeof localStorage !== 'undefined') {
        localStorage.setItem('lastZenonActivity', `${timeString} - ${activity}`);
    }
    
    let lastActivity = 'Uruchomiono dashboard';
    if (typeof localStorage !== 'undefined') {
        lastActivity = localStorage.getItem('lastZenonActivity') || lastActivity;
    }
    
    const element = document.getElementById('lastActivity');
    if (element) {
        element.textContent = lastActivity;
    }
}

// Initialize dashboard
function initDashboard() {
    updateSystemStatus();
    setLastActivity();
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            window.closeDashboard();
        }
        if (e.key >= '1' && e.key <= '5') {
            const dashboardKeys = ['jimbo', 'video', 'chatbox', 'agent', 'master'];
            const index = parseInt(e.key) - 1;
            if (index < dashboardKeys.length) {
                window.loadDashboard(dashboardKeys[index]);
            }
        }
    });
}

// Auto-initialize when DOM loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
} else {
    initDashboard();
}