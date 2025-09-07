import React, { useState, useEffect } from 'react';

interface User {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'user' | 'moderator';
    status: 'active' | 'inactive' | 'banned';
    lastLogin: string;
    created: string;
    queries: number;
}

const UsersTable: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'banned'>('all');
    const [sortBy, setSortBy] = useState<keyof User>('lastLogin');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/admin/users');
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                const userData = await response.json();
                setUsers(userData);
            } catch (err) {
                console.error('Error fetching users:', err);
                // Fallback data
                const fallbackUsers: User[] = [
                    {
                        id: '1',
                        username: 'admin_haos77',
                        email: 'admin@example.com',
                        role: 'admin',
                        status: 'active',
                        lastLogin: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
                        created: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                        queries: 1245
                    },
                    {
                        id: '2',
                        username: 'user_watson',
                        email: 'watson@example.com',
                        role: 'user',
                        status: 'active',
                        lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                        created: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                        queries: 89
                    },
                    {
                        id: '3',
                        username: 'mod_nexus',
                        email: 'nexus@example.com',
                        role: 'moderator',
                        status: 'active',
                        lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                        created: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                        queries: 567
                    },
                    {
                        id: '4',
                        username: 'test_user',
                        email: 'test@example.com',
                        role: 'user',
                        status: 'inactive',
                        lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                        created: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
                        queries: 12
                    }
                ];
                setUsers(fallbackUsers);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredAndSortedUsers = users
        .filter(user => {
            if (filter !== 'all' && user.status !== filter) return false;
            if (searchTerm && !user.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
                !user.email.toLowerCase().includes(searchTerm.toLowerCase())) return false;
            return true;
        })
        .sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = (bValue as string).toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });

    const handleSort = (column: keyof User) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('desc');
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin': return 'text-red-400';
            case 'moderator': return 'text-yellow-400';
            case 'user': return 'text-green-400';
            default: return 'text-gray-400';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'text-green-400';
            case 'inactive': return 'text-yellow-400';
            case 'banned': return 'text-red-400';
            default: return 'text-gray-400';
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
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-12 bg-gray-700 rounded"></div>
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
                <h3 className="text-xl font-bold text-cyan-300 font-mono">USER MANAGEMENT</h3>
                <div className="text-sm text-gray-400 font-mono">
                    {filteredAndSortedUsers.length} / {users.length} users
                </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex space-x-2">
                    {(['all', 'active', 'inactive', 'banned'] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-3 py-1 text-sm font-mono border rounded transition-colors ${filter === status
                                    ? 'bg-cyan-500 text-black border-cyan-500'
                                    : 'bg-transparent text-cyan-300 border-cyan-500/50 hover:border-cyan-500'
                                }`}
                        >
                            {status.toUpperCase()}
                        </button>
                    ))}
                </div>

                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-700">
                            <th
                                className="text-left py-3 px-2 text-cyan-300 font-mono text-sm cursor-pointer hover:text-cyan-100"
                                onClick={() => handleSort('username')}
                            >
                                USERNAME {sortBy === 'username' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th
                                className="text-left py-3 px-2 text-cyan-300 font-mono text-sm cursor-pointer hover:text-cyan-100"
                                onClick={() => handleSort('email')}
                            >
                                EMAIL {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th
                                className="text-left py-3 px-2 text-cyan-300 font-mono text-sm cursor-pointer hover:text-cyan-100"
                                onClick={() => handleSort('role')}
                            >
                                ROLE {sortBy === 'role' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th
                                className="text-left py-3 px-2 text-cyan-300 font-mono text-sm cursor-pointer hover:text-cyan-100"
                                onClick={() => handleSort('status')}
                            >
                                STATUS {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th
                                className="text-left py-3 px-2 text-cyan-300 font-mono text-sm cursor-pointer hover:text-cyan-100"
                                onClick={() => handleSort('lastLogin')}
                            >
                                LAST LOGIN {sortBy === 'lastLogin' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th
                                className="text-left py-3 px-2 text-cyan-300 font-mono text-sm cursor-pointer hover:text-cyan-100"
                                onClick={() => handleSort('queries')}
                            >
                                QUERIES {sortBy === 'queries' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="text-left py-3 px-2 text-cyan-300 font-mono text-sm">
                                ACTIONS
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedUsers.map((user) => (
                            <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                <td className="py-3 px-2 text-white font-mono text-sm">{user.username}</td>
                                <td className="py-3 px-2 text-gray-300 font-mono text-sm">{user.email}</td>
                                <td className={`py-3 px-2 font-mono text-sm font-bold ${getRoleColor(user.role)}`}>
                                    {user.role.toUpperCase()}
                                </td>
                                <td className={`py-3 px-2 font-mono text-sm font-bold ${getStatusColor(user.status)}`}>
                                    {user.status.toUpperCase()}
                                </td>
                                <td className="py-3 px-2 text-gray-300 font-mono text-sm">
                                    {formatDate(user.lastLogin)}
                                </td>
                                <td className="py-3 px-2 text-yellow-400 font-mono text-sm font-bold">
                                    {user.queries.toLocaleString()}
                                </td>
                                <td className="py-3 px-2">
                                    <div className="flex space-x-2">
                                        <button className="text-cyan-400 hover:text-cyan-300 text-sm font-mono">
                                            EDIT
                                        </button>
                                        <button className="text-red-400 hover:text-red-300 text-sm font-mono">
                                            BAN
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredAndSortedUsers.length === 0 && (
                    <div className="text-center py-8 text-gray-500 font-mono">
                        No users found matching current filters
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsersTable;