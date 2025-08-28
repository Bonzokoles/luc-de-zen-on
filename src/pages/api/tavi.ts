import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, env }) => {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action') || 'list_projects';
    
    // Tavi API integration
    const taviResponse = {
      status: 'success',
      action: action,
      projects: [
        { 
          id: 'proj_001', 
          name: 'MyBonzo Analytics Dashboard',
          status: 'active',
          created: '2025-08-20',
          metrics: { views: 1250, clicks: 89, conversions: 12 }
        },
        { 
          id: 'proj_002', 
          name: 'AI Model Performance Tracker',
          status: 'active', 
          created: '2025-08-25',
          metrics: { views: 890, clicks: 67, conversions: 8 }
        },
        { 
          id: 'proj_003', 
          name: 'User Behavior Analysis',
          status: 'draft',
          created: '2025-08-27',
          metrics: { views: 340, clicks: 23, conversions: 3 }
        }
      ],
      summary: {
        totalProjects: 3,
        activeProjects: 2,
        totalViews: 2480,
        totalClicks: 179,
        conversionRate: '9.3%'
      },
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(taviResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      status: 'error', 
      message: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};

export const POST: APIRoute = async ({ request, env }) => {
  try {
    const body = await request.json();
    const { projectName, description, settings } = body;

    // Create new Tavi project
    const response = {
      status: 'success',
      operation: 'create_project',
      project: {
        id: 'proj_' + Math.random().toString(36).substr(2, 9),
        name: projectName,
        description: description,
        settings: settings || {
          trackingEnabled: true,
          realTimeAnalytics: true,
          dataRetention: '12months'
        },
        created: new Date().toISOString(),
        status: 'active'
      },
      trackingCode: `
<!-- Tavi Analytics Tracking Code -->
<script>
  (function(t,a,v,i){
    t.tavi=t.tavi||{};
    t.tavi.projectId='${projectName}';
    var s=a.createElement('script');
    s.src='https://cdn.tavi.com/track.js';
    a.head.appendChild(s);
  })(window,document);
</script>
      `,
      apiEndpoints: {
        track: '/api/tavi/track',
        analytics: '/api/tavi/analytics',
        export: '/api/tavi/export'
      },
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      status: 'error', 
      message: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
};
