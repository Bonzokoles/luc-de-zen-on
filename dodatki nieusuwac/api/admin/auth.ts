import { createSuccessResponse, createErrorResponse, createOPTIONSHandler } from '../../../utils/corsUtils';

export const OPTIONS = createOPTIONSHandler(['POST']);

export const POST = async ({ request, locals }: { request: Request; locals: any }) => {
    try {
        const body = await request.json();
        const { password } = body;
        
        if (!password) {
            return createErrorResponse('Hasło jest wymagane', 400);
        }
        
        // Get admin password from environment
        const adminPassword = locals.runtime?.env?.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || 'HAOS77';
        
        if (password === adminPassword) {
            // Generate a simple session token (in production use JWT with expiry)
            const sessionToken = btoa(`admin-${Date.now()}-${Math.random()}`);
            
            return createSuccessResponse({
                authenticated: true,
                sessionToken,
                message: 'Autoryzacja pomyślna'
            });
        } else {
            return createErrorResponse('Nieprawidłowe hasło', 401);
        }
        
    } catch (error) {
        console.error('Admin auth error:', error);
        return createErrorResponse('Błąd serwera', 500);
    }
};