import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const syncData = (await request.json()) as {
      activeButtons?: any[];
      systemStatus?: any;
      agentRegistry?: any;
      timestamp?: string;
    };
    console.log("🌉 AI Bridge Gateway sync called with:", syncData);
    
    // Simulate bridge gateway processing
    const gatewayResponse = {
      timestamp: new Date().toISOString(),
      gatewayId: "mybonzo-bridge-v1",
      syncStatus: "success",
      processedData: {
        activeButtons: syncData.activeButtons?.length || 0,
        systemStatus: syncData.systemStatus ? "received" : "missing",
        agentRegistry: syncData.agentRegistry ? "updated" : "missing",
        blogSyncEnabled: true,
        bridgeInterfaceConnected: true,
      },
      connections: {
        "12keys": {
          status: "active",
          lastSync: new Date().toISOString(),
          functions: 12,
        },
        "9keys": {
          status: "active",
          lastSync: new Date().toISOString(),
          models: 9,
        },
        blog: {
          status: "connected",
          path: "Q:/mybonzo/mybonzoAIblog",
          lastPost: new Date().toISOString(),
        },
      },
      nextSync: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // Next sync in 5 minutes
    };

    console.log("🌉 Bridge Gateway processed:", gatewayResponse);
    
    return new Response(
      JSON.stringify({
        success: true,
        gateway: gatewayResponse,
        message: "Bridge sync completed successfully",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("❌ Bridge Gateway error:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: "Bridge gateway sync failed",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      name: "MyBonzo AI Bridge Gateway",
      version: "1.0.0",
      status: "active",
      description:
        "Connects 12-keys system with 9-keys advanced AI and blog integration",
      capabilities: [
        "System synchronization",
        "Agent coordination",
        "Blog integration",
        "Real-time data flow",
        "Cross-system communication",
      ],
      endpoints: {
        POST: "Sync systems and process bridge data",
        GET: "Get gateway status and capabilities",
      },
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};