import React, { useState, useEffect } from 'react';

interface MCPServer {
    name: string;
    status: 'connected' | 'disconnected' | 'error';
    description: string;
    endpoint: string;
    lastCheck: Date;
}

const styles = {
    mcpPanel: {
        background: 'rgba(0, 0, 0, 0.8)',
        border: '1px solid #333',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px',
        color: '#00ffff'
    },
    panelHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '10px',
        borderBottom: '1px solid #333'
    },
    refreshBtn: {
        background: '#00ffff',
        color: '#000',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'all 0.3s'
    },
    serversGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '15px'
    },
    serverCard: {
        background: 'rgba(0, 255, 255, 0.05)',
        border: '1px solid #333',
        borderRadius: '6px',
        padding: '15px',
        cursor: 'pointer',
        transition: 'all 0.3s'
    },
    serverCardSelected: {
        background: 'rgba(0, 255, 255, 0.1)',
        borderColor: '#00ffff'
    },
    serverHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
    },
    serverName: {
        fontWeight: 'bold',
        fontSize: '16px',
        color: '#00ffff'
    },
    serverStatus: {
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
    },
    serverDescription: {
        color: '#ccc',
        fontSize: '14px',
        marginBottom: '8px'
    },
    serverEndpoint: {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#888',
        background: 'rgba(0, 0, 0, 0.5)',
        padding: '4px 8px',
        borderRadius: '3px'
    },
    lastCheck: {
        fontSize: '11px',
        color: '#666',
        marginTop: '5px'
    },
    serverDetails: {
        marginTop: '20px',
        padding: '15px',
        background: 'rgba(0, 255, 255, 0.05)',
        border: '1px solid #333',
        borderRadius: '6px'
    }
};

const MCPServersPanel: React.FC = () => {
    const [servers, setServers] = useState<MCPServer[]>([
        {
            name: 'DuckDB',
            status: 'connected',
            description: 'In-memory analytics database',
            endpoint: '/api/mcp/duckdb',
            lastCheck: new Date()
        },
        {
            name: 'PayPal',
            status: 'disconnected',
            description: 'Payment processing and invoicing',
            endpoint: '/api/mcp/paypal',
            lastCheck: new Date()
        },
        {
            name: 'HuggingFace',
            status: 'connected',
            description: 'AI models and datasets',
            endpoint: '/api/mcp/huggingface',
            lastCheck: new Date()
        },
        {
            name: 'Memory',
            status: 'connected',
            description: 'Knowledge graph storage',
            endpoint: '/api/mcp/memory',
            lastCheck: new Date()
        }
    ]);

    const [selectedServer, setSelectedServer] = useState<string | null>(null);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'connected': return '#00ff00';
            case 'disconnected': return '#ff9900';
            case 'error': return '#ff0000';
            default: return '#888888';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'connected': return '✅';
            case 'disconnected': return '⚠️';
            case 'error': return '❌';
            default: return '❓';
        }
    };

    return (
        <div style={styles.mcpPanel}>
            <div style={styles.panelHeader}>
                <h3>🔌 MCP Serwery</h3>
                <button style={styles.refreshBtn}>
                    🔄 Odśwież Status
                </button>
            </div>

            <div style={styles.serversGrid}>
                {servers.map((server) => (
                    <div
                        key={server.name}
                        style={{
                            ...styles.serverCard,
                            ...(selectedServer === server.name ? styles.serverCardSelected : {})
                        }}
                        onClick={() => setSelectedServer(selectedServer === server.name ? null : server.name)}
                    >
                        <div style={styles.serverHeader}>
                            <div style={styles.serverName}>{server.name}</div>
                            <div style={styles.serverStatus}>
                                <span>{getStatusIcon(server.status)}</span>
                                <span style={{ color: getStatusColor(server.status) }}>
                                    {server.status.toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div style={styles.serverDescription}>{server.description}</div>
                        <div style={styles.serverEndpoint}>{server.endpoint}</div>
                        <div style={styles.lastCheck}>
                            Ostatnie sprawdzenie: {server.lastCheck.toLocaleTimeString()}
                        </div>
                    </div>
                ))}
            </div>

            {selectedServer && (
                <div style={styles.serverDetails}>
                    <h4>🔧 Szczegóły serwera: {selectedServer}</h4>
                    <p>Szczegółowe informacje o wybranym serwerze MCP.</p>
                    {selectedServer === 'DuckDB' && (
                        <div>
                            <p>• Status bazy danych: Aktywna</p>
                            <p>• Tabele: users, transactions, analytics</p>
                            <p>• Ostatnia kwerenda: {new Date().toLocaleTimeString()}</p>
                        </div>
                    )}
                    {selectedServer === 'PayPal' && (
                        <div>
                            <p>• Status API: Wymagana konfiguracja</p>
                            <p>• Endpoint: Sandbox/Production</p>
                            <p>• Funkcje: Faktury, płatności, transakcje</p>
                        </div>
                    )}
                    {selectedServer === 'HuggingFace' && (
                        <div>
                            <p>• Status API: Połączony</p>
                            <p>• Modele: Dostępne</p>
                            <p>• Datasety: Dostępne</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MCPServersPanel;