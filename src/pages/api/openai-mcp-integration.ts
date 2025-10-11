import type { APIRoute } from "astro";

// OpenAI Agent Builder MCP Integration
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = (locals as any)?.runtime?.env;
    if (!env) {
      return new Response(
        JSON.stringify({ error: "Environment not available" }),
        { status: 503 }
      );
    }

    const body = (await request.json()) as any;
    const { action, agent_id, mcp_servers, webhook_url, message } = body;

    switch (action) {
      case "register_agent":
        return await registerAgentWithMCP(agent_id, mcp_servers, webhook_url);

      case "execute_mcp_function":
        return await executeMCPFunction(
          agent_id,
          body.function_name,
          body.parameters
        );

      case "get_mcp_capabilities":
        return await getMCPCapabilities(mcp_servers);

      case "webhook_receive":
        return await handleWebhookFromOpenAI(body);

      default:
        return new Response(JSON.stringify({ error: "Unknown action" }), {
          status: 400,
        });
    }
  } catch (error) {
    console.error("OpenAI Agent Builder MCP Integration Error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500 }
    );
  }
};

// Register OpenAI Agent with MCP Servers
async function registerAgentWithMCP(
  agent_id: string,
  mcp_servers: string[],
  webhook_url: string
) {
  const registration = {
    agent_id,
    registered_at: new Date().toISOString(),
    mcp_servers: mcp_servers || [
      "browser",
      "docker",
      "github",
      "knowledge",
      "filesystem",
      "shell",
    ],
    webhook_url,
    capabilities: await getMCPCapabilitiesInternal(mcp_servers),
    status: "active",
  };

  return new Response(
    JSON.stringify({
      success: true,
      registration,
      instructions: generateOpenAIInstructions(registration.capabilities),
      webhook_endpoint: `/api/openai-mcp-integration?action=webhook_receive`,
    }),
    { status: 200 }
  );
}

// Execute MCP Function for OpenAI Agent
async function executeMCPFunction(
  agent_id: string,
  function_name: string,
  parameters: any
) {
  console.log(
    `Executing MCP function ${function_name} for agent ${agent_id} with params:`,
    parameters
  );

  try {
    let result;

    if (function_name.startsWith("browser_")) {
      result = await executeBrowserMCP(function_name, parameters);
    } else if (function_name.startsWith("docker_")) {
      result = await executeDockerMCP(function_name, parameters);
    } else if (function_name.startsWith("github_")) {
      result = await executeGitHubMCP(function_name, parameters);
    } else if (function_name.startsWith("knowledge_")) {
      result = await executeKnowledgeMCP(function_name, parameters);
    } else if (function_name.startsWith("fs_")) {
      result = await executeFilesystemMCP(function_name, parameters);
    } else if (function_name.startsWith("shell_")) {
      result = await executeShellMCP(function_name, parameters);
    } else {
      throw new Error(`Unknown MCP function: ${function_name}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        function_name,
        result,
        executed_at: new Date().toISOString(),
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error:
          error instanceof Error ? error.message : "Function execution failed",
      }),
      { status: 500 }
    );
  }
}

// Get MCP Capabilities for OpenAI Agent
async function getMCPCapabilities(mcp_servers: string[]) {
  const capabilities = await getMCPCapabilitiesInternal(mcp_servers);

  return new Response(
    JSON.stringify({
      success: true,
      capabilities,
      openai_function_definitions: generateOpenAIFunctions(capabilities),
    }),
    { status: 200 }
  );
}

// Handle Webhook from OpenAI
async function handleWebhookFromOpenAI(data: any) {
  console.log("Received webhook from OpenAI:", data);

  const { agent_id, message, function_call, timestamp } = data;

  if (function_call) {
    return await executeMCPFunction(
      agent_id,
      function_call.name,
      function_call.arguments
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: "Webhook received and processed",
      timestamp: new Date().toISOString(),
    }),
    { status: 200 }
  );
}

// Internal MCP Capabilities
async function getMCPCapabilitiesInternal(mcp_servers: string[]) {
  const capabilities: Record<
    string,
    { functions: string[]; description: string }
  > = {
    browser: {
      functions: [
        "browser_navigate",
        "browser_click",
        "browser_type",
        "browser_screenshot",
        "browser_get_content",
        "browser_wait_for_element",
      ],
      description: "Web browser automation and interaction",
    },
    docker: {
      functions: [
        "docker_list_containers",
        "docker_create_container",
        "docker_start_container",
        "docker_stop_container",
        "docker_exec_command",
        "docker_get_logs",
      ],
      description: "Docker container management and execution",
    },
    github: {
      functions: [
        "github_create_repo",
        "github_list_files",
        "github_create_file",
        "github_update_file",
        "github_create_pr",
        "github_search_code",
      ],
      description: "GitHub repository management and code operations",
    },
    knowledge: {
      functions: [
        "knowledge_search",
        "knowledge_add_entity",
        "knowledge_get_relations",
        "knowledge_update_node",
        "knowledge_query_graph",
      ],
      description: "Knowledge graph management and querying",
    },
    filesystem: {
      functions: ["fs_list_directory", "fs_read_file", "fs_write_file"],
      description: "File system operations: list, read, and write files",
    },
    shell: {
      functions: ["shell_run_command"],
      description: "Execute shell commands on the server",
    },
  };

  const serverList =
    mcp_servers && mcp_servers.length > 0
      ? mcp_servers
      : Object.keys(capabilities);

  return serverList.reduce((result, server) => {
    if (capabilities[server]) {
      result[server] = capabilities[server];
    }
    return result;
  }, {} as Record<string, { functions: string[]; description: string }>);
}

// Generate OpenAI Function Definitions
function generateOpenAIFunctions(capabilities: any) {
  // This part can be expanded to generate detailed parameters for each function
  const functions = [];
  for (const [server, config] of Object.entries(capabilities)) {
    for (const func of (config as any).functions) {
      functions.push({
        name: func,
        description: `${(config as any).description} - ${func}`,
        parameters: {
          type: "object",
          properties: {
            // Define specific parameters for each function here
            // For now, a generic parameters object
            parameters: {
              type: "object",
              description: "Function-specific parameters",
            },
          },
        },
      });
    }
  }
  return functions;
}

// Generate Instructions for OpenAI Agent
function generateOpenAIInstructions(capabilities: any) {
  return `You are an AI agent with access to Model Context Protocol (MCP) servers. You can perform the following actions:

**Available MCP Capabilities:**
${Object.entries(capabilities)
  .map(
    ([server, config]) =>
      `- **${server.toUpperCase()}**: ${
        (config as any).description
      }\n  Functions: ${(config as any).functions.join(", ")}`
  )
  .join("\n")}

**How to use MCP functions:**
1. When you need to perform an action, call the appropriate MCP function.
2. Provide the necessary parameters for each function.
3. Handle responses and provide feedback to the user.
`;
}

// --- MCP Server Implementations ---

// Filesystem MCP Implementation
async function executeFilesystemMCP(function_name: string, parameters: any) {
  switch (function_name) {
    case "fs_list_directory":
      if (!parameters.path)
        throw new Error("Parameter 'path' is required for fs_list_directory.");
      return {
        success: true,
        action: "list_directory",
        path: parameters.path,
        result: "Directory listing not implemented",
      };
    case "fs_read_file":
      if (!parameters.path)
        throw new Error("Parameter 'path' is required for fs_read_file.");
      return {
        success: true,
        action: "read_file",
        path: parameters.path,
        result: "File reading not implemented",
      };
    case "fs_write_file":
      if (!parameters.path || parameters.content === undefined)
        throw new Error(
          "Parameters 'path' and 'content' are required for fs_write_file."
        );
      return {
        success: true,
        action: "write_file",
        path: parameters.path,
        result: "File writing not implemented",
      };
    default:
      throw new Error(`Unknown filesystem function: ${function_name}`);
  }
}

// Shell (Desktop Commander) MCP Implementation
async function executeShellMCP(function_name: string, parameters: any) {
  switch (function_name) {
    case "shell_run_command":
      if (!parameters.command)
        throw new Error(
          "Parameter 'command' is required for shell_run_command."
        );
      return {
        success: true,
        action: "shell_command",
        command: parameters.command,
        result: "Shell command execution not implemented",
      };
    default:
      throw new Error(`Unknown shell function: ${function_name}`);
  }
}

// --- STUBBED MCP Implementations (as before) ---
async function executeBrowserMCP(function_name: string, parameters: any) {
  return {
    success: true,
    action: function_name,
    result: "Browser action executed (stub)",
    parameters,
  };
}

async function executeDockerMCP(function_name: string, parameters: any) {
  return {
    success: true,
    action: function_name,
    result: "Docker action executed (stub)",
    parameters,
  };
}

async function executeGitHubMCP(function_name: string, parameters: any) {
  return {
    success: true,
    action: function_name,
    result: "GitHub action executed (stub)",
    parameters,
  };
}

async function executeKnowledgeMCP(function_name: string, parameters: any) {
  return {
    success: true,
    action: function_name,
    result: "Knowledge action executed (stub)",
    parameters,
  };
}

// --- GET Endpoint for status and capabilities ---
export const GET: APIRoute = async ({ url }) => {
  const action = url.searchParams.get("action");

  if (action === "capabilities") {
    const servers = url.searchParams.get("servers")?.split(",") || [
      "browser",
      "docker",
      "github",
      "knowledge",
      "filesystem",
      "shell",
    ];
    return await getMCPCapabilities(servers);
  }

  if (action === "status") {
    return new Response(
      JSON.stringify({
        status: "active",
        available_servers: [
          "browser",
          "docker",
          "github",
          "knowledge",
          "filesystem",
          "shell",
        ],
        integration_endpoint: "/api/openai-mcp-integration",
        webhook_endpoint: "/api/openai-mcp-integration?action=webhook_receive",
      }),
      { status: 200 }
    );
  }

  return new Response(JSON.stringify({ error: "Invalid action" }), {
    status: 400,
  });
};
