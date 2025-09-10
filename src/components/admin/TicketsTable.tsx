import React, { useState, useEffect } from 'react';

interface Ticket {
    id: string;
    title: string;
    description: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'critical';
    user: string;
    assignee?: string;
    created: string;
    updated: string;
    category: 'bug' | 'feature' | 'support' | 'question';
}

const TicketsTable: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved' | 'closed'>('all');
    const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/admin/tickets');
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                const ticketData = await response.json();
                setTickets(ticketData);
            } catch (err) {
                console.error('Error fetching tickets:', err);
                // Fallback data
                const fallbackTickets: Ticket[] = [
                    {
                        id: 'TIC-001',
                        title: 'Voice AI not responding',
                        description: 'The voice AI system stops responding after multiple queries',
                        status: 'open',
                        priority: 'high',
                        user: 'user_watson',
                        created: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                        updated: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                        category: 'bug'
                    },
                    {
                        id: 'TIC-002',
                        title: 'Feature request: Dark mode toggle',
                        description: 'Add ability to toggle between dark and light themes',
                        status: 'in_progress',
                        priority: 'medium',
                        user: 'mod_nexus',
                        assignee: 'admin_haos77',
                        created: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                        updated: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                        category: 'feature'
                    },
                    {
                        id: 'TIC-003',
                        title: 'System performance issues',
                        description: 'Page loading times are significantly slower',
                        status: 'resolved',
                        priority: 'critical',
                        user: 'test_user',
                        assignee: 'admin_haos77',
                        created: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                        updated: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
                        category: 'bug'
                    },
                    {
                        id: 'TIC-004',
                        title: 'How to use API endpoints?',
                        description: 'Need documentation for API integration',
                        status: 'closed',
                        priority: 'low',
                        user: 'user_watson',
                        created: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                        updated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                        category: 'question'
                    }
                ];
                setTickets(fallbackTickets);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    const filteredTickets = tickets.filter(ticket => {
        if (filter !== 'all' && ticket.status !== filter) return false;
        if (priorityFilter !== 'all' && ticket.priority !== priorityFilter) return false;
        return true;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'text-yellow-400 bg-yellow-400/20';
            case 'in_progress': return 'text-blue-400 bg-blue-400/20';
            case 'resolved': return 'text-green-400 bg-green-400/20';
            case 'closed': return 'text-gray-400 bg-gray-400/20';
            default: return 'text-gray-400 bg-gray-400/20';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical': return 'text-red-400 bg-red-400/20';
            case 'high': return 'text-orange-400 bg-orange-400/20';
            case 'medium': return 'text-yellow-400 bg-yellow-400/20';
            case 'low': return 'text-green-400 bg-green-400/20';
            default: return 'text-gray-400 bg-gray-400/20';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'bug': return '🐛';
            case 'feature': return '✨';
            case 'support': return '🛠️';
            case 'question': return '❓';
            default: return '📋';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 30) return `${diffDays}d ago`;
        return date.toLocaleDateString('pl-PL');
    };

    if (loading) {
        return (
            <div className="bg-gray-900 border border-cyan-500/30 rounded-lg p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-700 rounded mb-4"></div>
                    <div className="space-y-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-16 bg-gray-700 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 border border-cyan-500/30 rounded-lg p-6 relative overflow-hidden">
            {/* Cyber corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>

            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-cyan-300 font-mono">SUPPORT TICKETS</h3>
                <div className="text-sm text-gray-400 font-mono">
                    {filteredTickets.length} / {tickets.length} tickets
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex space-x-2">
                    <span className="text-cyan-300 font-mono text-sm">STATUS:</span>
                    {(['all', 'open', 'in_progress', 'resolved', 'closed'] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-3 py-1 text-sm font-mono border rounded transition-colors ${filter === status
                                    ? 'bg-cyan-500 text-black border-cyan-500'
                                    : 'bg-transparent text-cyan-300 border-cyan-500/50 hover:border-cyan-500'
                                }`}
                        >
                            {status.replace('_', ' ').toUpperCase()}
                        </button>
                    ))}
                </div>

                <div className="flex space-x-2">
                    <span className="text-cyan-300 font-mono text-sm">PRIORITY:</span>
                    {(['all', 'critical', 'high', 'medium', 'low'] as const).map((priority) => (
                        <button
                            key={priority}
                            onClick={() => setPriorityFilter(priority)}
                            className={`px-3 py-1 text-sm font-mono border rounded transition-colors ${priorityFilter === priority
                                    ? 'bg-cyan-500 text-black border-cyan-500'
                                    : 'bg-transparent text-cyan-300 border-cyan-500/50 hover:border-cyan-500'
                                }`}
                        >
                            {priority.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tickets */}
            <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                    <div key={ticket.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-cyan-500/50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-3">
                                <span className="text-lg">{getCategoryIcon(ticket.category)}</span>
                                <div>
                                    <h4 className="text-white font-mono font-bold">{ticket.title}</h4>
                                    <p className="text-gray-400 font-mono text-sm">ID: {ticket.id}</p>
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <span className={`px-2 py-1 rounded text-xs font-mono font-bold ${getStatusColor(ticket.status)}`}>
                                    {ticket.status.replace('_', ' ').toUpperCase()}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs font-mono font-bold ${getPriorityColor(ticket.priority)}`}>
                                    {ticket.priority.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <p className="text-gray-300 text-sm mb-3 line-clamp-2">{ticket.description}</p>

                        <div className="flex items-center justify-between text-sm font-mono">
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-400">
                                    User: <span className="text-cyan-300">{ticket.user}</span>
                                </span>
                                {ticket.assignee && (
                                    <span className="text-gray-400">
                                        Assignee: <span className="text-yellow-300">{ticket.assignee}</span>
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center space-x-4">
                                <span className="text-gray-400">Created: {formatDate(ticket.created)}</span>
                                <span className="text-gray-400">Updated: {formatDate(ticket.updated)}</span>
                                <button className="text-cyan-400 hover:text-cyan-300 font-mono">
                                    VIEW
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredTickets.length === 0 && (
                    <div className="text-center py-8 text-gray-500 font-mono">
                        No tickets found matching current filters
                    </div>
                )}
            </div>
        </div>
    );
};

export default TicketsTable;