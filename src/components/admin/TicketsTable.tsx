import React, { useState, useEffect } from 'react';

export default function TicketsTable() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('/api/admin/tickets');
        if (response.ok) {
          const data = await response.json();
          setTickets(data.tickets || []);
        }
      } catch (err) {
        console.error('Error fetching tickets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
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
    return <div style={cardStyle}>Loading tickets...</div>;
  }

  return (
    <div style={cardStyle}>
      <h3 style={{
        marginBottom: '20px',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: '2px'
      }}>
        🎫 SUPPORT TICKETS
      </h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'left' }}>ID</th>
            <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'left' }}>Subject</th>
            <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'left' }}>Status</th>
            <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td style={{ border: '1px solid #333', padding: '8px' }}>{ticket.id}</td>
              <td style={{ border: '1px solid #333', padding: '8px' }}>{ticket.subject}</td>
              <td style={{ border: '1px solid #333', padding: '8px' }}>{ticket.status}</td>
              <td style={{ border: '1px solid #333', padding: '8px' }}>
                <button>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}