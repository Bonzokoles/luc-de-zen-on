export const GET = async ({ locals, url }: { locals: any; url: URL }) => {
    try {
        return new Response(JSON.stringify({
            success: true,
            message: 'Environment Debug Information',
            timestamp: new Date().toISOString(),
            debug: {
                hasLocals: !!locals,
                localsType: typeof locals,
                localsKeys: locals ? Object.keys(locals) : [],
                hasRuntime: !!locals?.runtime,
                runtimeType: typeof locals?.runtime,
                runtimeKeys: locals?.runtime ? Object.keys(locals.runtime) : [],
                hasEnv: !!locals?.runtime?.env,
                envType: typeof locals?.runtime?.env,
                envKeys: locals?.runtime?.env ? Object.keys(locals.runtime.env) : [],
                urlPath: url.pathname,
                userAgent: url.searchParams.get('ua') || 'none'
            }
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
    } catch (error) {
        const err = error as Error;
        return new Response(JSON.stringify({
            success: false,
            error: 'Debug endpoint failed',
            message: err?.message || 'Unknown error',
            timestamp: new Date().toISOString()
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
    }
};

export const OPTIONS = () => {
    return new Response(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
};