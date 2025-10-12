import React, { useState, useEffect } from 'react';

export default function MCPServersPanel() {
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/admin/mcp-status');
        if (response.ok) {
          const data = await response.json();
          setServers(data.servers || []);
        }
      } catch (err) {
        console.error('Error fetching MCP status:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const cardStyle = {
    background: 'rgba(0, 0, 0, 0.8)',
    border: '2px solid #00e7ff',
    borderRadius: '0px',
    padding: '20px',
    color: '#00e7ff',
    fontFamily: 'monospace'
  };

  if (loading) {
    return <div style={cardStyle}>Loading MCP Server status...</div>;
  }

  return (
    <div style={cardStyle}>
      <h3 style={{
        marginBottom: '20px',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: '2px'
      }}>
        🌐 MCP SERVERS STATUS
      </h3>
      <div>
        {servers.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666' }}>No MCP servers data</div>
        ) : (
          servers.map((server: any, index: number) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px',
              background: '#000',
              border: '1px solid #333',
              marginBottom: '5px'
            }}>
              <span>{server.name}</span>
              <span style={{
                color: server.status === 'online' ? '#00ff00' : '#ff0000'
              }}>
                {server.status.toUpperCase()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}