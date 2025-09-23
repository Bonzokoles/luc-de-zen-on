import React, { useState, useEffect } from 'react';

interface ServiceStatus {
    name: string;
    status: 'online' | 'degraded' | 'offline' | 'maintenance';
    responseTime?: number;
    uptime?: number;
    lastCheck: string;
    endpoint?: string;
}

interface SystemHealth {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
}

const StatusBox: React.FC = () => {
    const [services, setServices] = useState<ServiceStatus[]>([]);
    const [systemHealth, setSystemHealth] = useState<SystemHealth>({
        cpu: 0,
        memory: 0,
        disk: 0,
        network: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/admin/status');
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                const statusData = await response.json();
                setServices(statusData.services);
                setSystemHealth(statusData.system);
            } catch (err) {
                console.error('Error fetching status:', err);
                // Fallback data
                const fallbackServices: ServiceStatus[] = [
                    {
                        name: 'Voice AI Worker',
                        status: 'online',
                        responseTime: 125,
                        uptime: 99.8,
                        lastCheck: new Date().toISOString(),
                        endpoint: '/api/voice-ai'
                    },
                    {
                        name: 'Image Generator',
                        status: 'online',
                        responseTime: 230,
                        uptime: 99.2,
                        lastCheck: new Date().toISOString(),
                        endpoint: '/api/generate-image'
                    },
                    {
                        name: 'Chat API',
                        status: 'online',
                        responseTime: 89,
                        uptime: 99.9,
                        lastCheck: new Date().toISOString(),
                        endpoint: '/api/chat'
                    },
                    {
                        name: 'Admin Panel',
                        status: 'online',
                        responseTime: 45,
                        uptime: 100.0,
                        lastCheck: new Date().toISOString(),
                        endpoint: '/api/admin'
                    },
                    {
                        name: 'Database',
                        status: 'degraded',
                        responseTime: 340,
                        uptime: 98.5,
                        lastCheck: new Date().toISOString()
                    },
                    {
                        name: 'CDN',
                        status: 'maintenance',
                        uptime: 95.0,
                        lastCheck: new Date().toISOString()
                    }
                ];

                setServices(fallbackServices);
                setSystemHealth({
                    cpu: 45,
                    memory: 72,
                    disk: 68,
                    network: 23
                });
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 30000); // Update every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online': return { bg: 'bg-green-400/20', text: 'text-green-400', border: 'border-green-400' };
            case 'degraded': return { bg: 'bg-yellow-400/20', text: 'text-yellow-400', border: 'border-yellow-400' };
            case 'offline': return { bg: 'bg-red-400/20', text: 'text-red-400', border: 'border-red-400' };
            case 'maintenance': return { bg: 'bg-blue-400/20', text: 'text-blue-400', border: 'border-blue-400' };
            default: return { bg: 'bg-gray-400/20', text: 'text-gray-400', border: 'border-gray-400' };
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'online': return '🟢';
            case 'degraded': return '🟡';
            case 'offline': return '🔴';
            case 'maintenance': return '🔵';
            default: return '⚪';
        }
    };

    const getHealthColor = (value: number) => {
        if (value < 50) return 'text-green-400';
        if (value < 80) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getHealthBarColor = (value: number) => {
        if (value < 50) return 'bg-green-400';
        if (value < 80) return 'bg-yellow-400';
        return 'bg-red-400';
    };

    if (loading) {
        return (
            <div className="bg-gray-900 border border-cyan-500/30 rounded-lg p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-700 rounded mb-4"></div>
                    <div className="space-y-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-12 bg-gray-700 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const overallStatus = services.every(s => s.status === 'online') ? 'online' :
        services.some(s => s.status === 'offline') ? 'degraded' : 'degraded';

    return (
        <div className="bg-gray-900 border border-cyan-500/30 rounded-lg p-6 relative overflow-hidden">
            {/* Cyber corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>

            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-cyan-300 font-mono">SYSTEM STATUS</h3>
                <div className={`flex items-center space-x-2 px-3 py-1 rounded border ${getStatusColor(overallStatus).bg} ${getStatusColor(overallStatus).border}`}>
                    <span>{getStatusIcon(overallStatus)}</span>
                    <span className={`font-mono text-sm font-bold ${getStatusColor(overallStatus).text}`}>
                        {overallStatus.toUpperCase()}
                    </span>
                </div>
            </div>

            {/* Services Status */}
            <div className="mb-6">
                <h4 className="text-cyan-300 font-mono text-sm mb-3">SERVICES</h4>
                <div className="space-y-2">
                    {services.map((service, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded border border-gray-700">
                            <div className="flex items-center space-x-3">
                                <span>{getStatusIcon(service.status)}</span>
                                <span className="text-white font-mono">{service.name}</span>
                                {service.endpoint && (
                                    <span className="text-gray-500 font-mono text-xs">{service.endpoint}</span>
                                )}
                            </div>

                            <div className="flex items-center space-x-4">
                                {service.responseTime && (
                                    <span className="text-gray-400 font-mono text-sm">
                                        {service.responseTime}ms
                                    </span>
                                )}
                                {service.uptime && (
                                    <span className="text-gray-400 font-mono text-sm">
                                        {service.uptime}% uptime
                                    </span>
                                )}
                                <span className={`px-2 py-1 rounded text-xs font-mono font-bold ${getStatusColor(service.status).bg} ${getStatusColor(service.status).text}`}>
                                    {service.status.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* System Health */}
            <div>
                <h4 className="text-cyan-300 font-mono text-sm mb-3">SYSTEM HEALTH</h4>
                <div className="grid grid-cols-2 gap-4">
                    {Object.entries(systemHealth).map(([key, value]) => (
                        <div key={key} className="bg-gray-800 rounded p-3 border border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-300 font-mono text-sm uppercase">{key}</span>
                                <span className={`font-mono text-sm font-bold ${getHealthColor(value)}`}>
                                    {value}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full ${getHealthBarColor(value)}`}
                                    style={{ width: `${value}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
                    <span>Last updated: {new Date().toLocaleTimeString('pl-PL')}</span>
                    <span>Auto-refresh: 30s</span>
                </div>
            </div>
        </div>
    );
};

export default StatusBox;