import React, { useState, useEffect } from 'react';

interface StatsData {
    visitors: number;
    queries: number;
    uptime: string;
    responseTime: number;
    storage: number;
    bandwidth: number;
}

const PanelStats: React.FC = () => {
    const [stats, setStats] = useState<StatsData>({
        visitors: 0,
        queries: 0,
        uptime: '0:00:00',
        responseTime: 0,
        storage: 0,
        bandwidth: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/admin/stats');
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                const data = await response.json();
                setStats(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching stats:', err);
                setError('Błąd ładowania statystyk');
                // Fallback data
                setStats({
                    visitors: 1247,
                    queries: 3892,
                    uptime: '15d 7h 23m',
                    responseTime: 125,
                    storage: 2.3,
                    bandwidth: 45.7
                });
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 30000); // Update every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const StatCard: React.FC<{
        title: string;
        value: string | number;
        unit?: string;
        icon: string;
        trend?: 'up' | 'down' | 'stable';
        trendValue?: number;
    }> = ({ title, value, unit, icon, trend, trendValue }) => (
        <div className="bg-gray-900 border border-cyan-500/30 rounded-lg p-4 relative overflow-hidden">
            {/* Cyber corner accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400"></div>

            <div className="flex items-center justify-between mb-2">
                <span className="text-cyan-300 text-sm font-mono uppercase tracking-wider">{title}</span>
                <span className="text-2xl">{icon}</span>
            </div>

            <div className="flex items-baseline">
                <span className="text-2xl font-bold text-white">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                </span>
                {unit && <span className="text-cyan-400 ml-1 text-sm">{unit}</span>}
            </div>

            {trend && trendValue && (
                <div className="flex items-center mt-2">
                    <span className={`text-xs ${trend === 'up' ? 'text-green-400' :
                            trend === 'down' ? 'text-red-400' :
                                'text-yellow-400'
                        }`}>
                        {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} {trendValue}%
                    </span>
                    <span className="text-gray-500 text-xs ml-1">vs last hour</span>
                </div>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-gray-900 border border-cyan-500/30 rounded-lg p-4 animate-pulse">
                        <div className="h-4 bg-gray-700 rounded mb-2"></div>
                        <div className="h-8 bg-gray-700 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <StatCard
                title="Visitors"
                value={stats.visitors}
                icon="👥"
                trend="up"
                trendValue={12}
            />

            <StatCard
                title="AI Queries"
                value={stats.queries}
                icon="🤖"
                trend="up"
                trendValue={8}
            />

            <StatCard
                title="System Uptime"
                value={stats.uptime}
                icon="⏱️"
                trend="stable"
                trendValue={0}
            />

            <StatCard
                title="Response Time"
                value={stats.responseTime}
                unit="ms"
                icon="⚡"
                trend="down"
                trendValue={5}
            />

            <StatCard
                title="Storage Used"
                value={stats.storage}
                unit="GB"
                icon="💾"
                trend="up"
                trendValue={3}
            />

            <StatCard
                title="Bandwidth"
                value={stats.bandwidth}
                unit="GB"
                icon="🌐"
                trend="up"
                trendValue={15}
            />

            {error && (
                <div className="col-span-full bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                    <div className="flex items-center">
                        <span className="text-red-400 mr-2">⚠️</span>
                        <span className="text-red-300">{error}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PanelStats;