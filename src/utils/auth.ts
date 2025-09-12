// JWT Authentication System for Admin Panel
export interface AdminUser {
    id: string;
    username: string;
    role: 'admin' | 'moderator' | 'viewer';
    permissions: string[];
}

export interface AuthConfig {
    secretKey: string;
    tokenExpiry: number; // in milliseconds
    roles: {
        admin: string[];
        moderator: string[];
        viewer: string[];
    };
}

// Default configuration
export const AUTH_CONFIG: AuthConfig = {
    secretKey: 'MYBONZO_SECRET_2025', // Should be environment variable in production
    tokenExpiry: 3600000, // 1 hour
    roles: {
        admin: ['read', 'write', 'delete', 'manage_users', 'system_control'],
        moderator: ['read', 'write', 'manage_content'],
        viewer: ['read']
    }
};

// User database (in production, use proper database)
const USERS_DB: Record<string, { password: string; role: AdminUser['role'] }> = {
    'admin': { password: 'HAOS77', role: 'admin' },
    'moderator': { password: 'MOD2025', role: 'moderator' },
    'viewer': { password: 'VIEW2025', role: 'viewer' }
};

// Simple JWT implementation (in production, use proper JWT library)
export class AuthService {
    private static encode(payload: any): string {
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const body = btoa(JSON.stringify(payload));
        const signature = btoa(`${header}.${body}.${AUTH_CONFIG.secretKey}`);
        return `${header}.${body}.${signature}`;
    }

    private static decode(token: string): any {
        try {
            const [header, body, signature] = token.split('.');
            const expectedSignature = btoa(`${header}.${body}.${AUTH_CONFIG.secretKey}`);

            if (signature !== expectedSignature) {
                throw new Error('Invalid signature');
            }

            return JSON.parse(atob(body));
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    static authenticate(username: string, password: string): string | null {
        const user = USERS_DB[username];
        if (!user || user.password !== password) {
            return null;
        }

        const payload = {
            id: username,
            username,
            role: user.role,
            permissions: AUTH_CONFIG.roles[user.role],
            exp: Date.now() + AUTH_CONFIG.tokenExpiry,
            iat: Date.now()
        };

        return this.encode(payload);
    }

    static verifyToken(token: string): AdminUser | null {
        try {
            const payload = this.decode(token);

            if (payload.exp < Date.now()) {
                throw new Error('Token expired');
            }

            return {
                id: payload.id,
                username: payload.username,
                role: payload.role,
                permissions: payload.permissions
            };
        } catch (error) {
            return null;
        }
    }

    static hasPermission(user: AdminUser, permission: string): boolean {
        return user.permissions.includes(permission);
    }

    static refreshToken(token: string): string | null {
        const user = this.verifyToken(token);
        if (!user) return null;

        const payload = {
            id: user.id,
            username: user.username,
            role: user.role,
            permissions: user.permissions,
            exp: Date.now() + AUTH_CONFIG.tokenExpiry,
            iat: Date.now()
        };

        return this.encode(payload);
    }
}

// Auth context for React components
export interface AuthContextType {
    user: AdminUser | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
    hasPermission: (permission: string) => boolean;
}

// Storage keys
export const AUTH_STORAGE_KEYS = {
    TOKEN: 'mybonzo_admin_token',
    USER: 'mybonzo_admin_user',
    LAST_ACTIVITY: 'mybonzo_last_activity'
};