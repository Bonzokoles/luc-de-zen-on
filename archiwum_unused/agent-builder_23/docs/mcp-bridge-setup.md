# MCP Bridge API Setup Guide

This guide will help you set up and run the MCP Bridge API locally and connect it to Cloudflare Gateway for secure access.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Setup](#local-setup)
3. [Configuration](#configuration)
4. [Running the MCP Bridge Server](#running-the-mcp-bridge-server)
5. [Connecting to MCP Servers](#connecting-to-mcp-servers)
6. [Cloudflare Gateway Setup](#cloudflare-gateway-setup)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, make sure you have the following installed:

- Node.js (v16 or later)
- npm or yarn
- A Cloudflare account (for Cloudflare Gateway setup)

## Local Setup

1. Clone the repository:

\`\`\`bash
git clone https://github.com/your-org/agent-builder.git
cd agent-builder
\`\`\`

2. Install dependencies:

\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Build the project:

\`\`\`bash
npm run build
# or
yarn build
\`\`\`

## Configuration

The MCP Bridge server uses a configuration file to define its behavior. You can create a custom configuration file or use the default one.

### Default Configuration

\`\`\`json
{
  "port": 3001,
  "host": "localhost",
  "cors": {
    "enabled": true,
    "origins": ["*"]
  },
  "websocket": {
    "heartbeatInterval": 30,
    "reconnectAttempts": 5,
    "compression": true
  },
  "rateLimit": {
    "enabled": true,
    "requests": 100,
    "window": 60
  },
  "logging": {
    "level": "info",
    "file": "./logs/mcp-bridge.log"
  }
}
\`\`\`

### Custom Configuration

Create a file named `mcp-bridge-config.json` in the root directory of your project and customize the settings as needed.

## Running the MCP Bridge Server

1. Start the MCP Bridge server:

\`\`\`bash
# Using default configuration
npm run start-mcp-bridge

# Using custom configuration
npm run start-mcp-bridge -- --config ./path/to/config.json
\`\`\`

2. The server will start on the configured port (default: 3001).

3. You can access the MCP Bridge API at `http://localhost:3001/api/mcp`.

## Connecting to MCP Servers

Once the MCP Bridge server is running, you can connect to MCP servers through the dashboard or API.

### Using the Dashboard

1. Open the Agent Builder application in your browser.
2. Navigate to the MCP Bridge page.
3. Use the "Add Server" button to add a new MCP server.
4. Fill in the server details:
   - Name: A descriptive name for the server
   - URL: The WebSocket or HTTP URL of the MCP server (e.g., `ws://localhost:8001/mcp`)
   - Protocol: WebSocket or HTTP
5. Click "Connect" to establish a connection to the server.

### Using the API

You can also connect to MCP servers programmatically using the API:

\`\`\`javascript
// Add a new server
const response = await fetch('http://localhost:3001/api/mcp/servers', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Database MCP Server',
    url: 'ws://localhost:8001/mcp',
    protocol: 'websocket'
  })
});

const { data: server } = await response.json();

// Connect to the server
await fetch('http://localhost:3001/api/mcp/connect', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ serverId: server.id })
});
\`\`\`

## Cloudflare Gateway Setup

To expose your MCP Bridge API securely through Cloudflare, follow these steps:

### 1. Create a Cloudflare Worker

1. Log in to your Cloudflare dashboard.
2. Select your domain or add a new one.
3. Go to "Workers & Pages" and click "Create a Worker".
4. Replace the default code with the following:

\`\`\`javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Parse request URL
  const url = new URL(request.url)
  
  // Forward to MCP Bridge API
  if (url.pathname.startsWith('/api/mcp')) {
    return await forwardToMCPBridge(request)
  }
  
  // Default response
  return new Response('MCP Bridge Worker', {
    headers: { 'content-type': 'text/plain' }
  })
}

async function forwardToMCPBridge(request) {
  // Replace with your MCP Bridge API URL
  const mcpBridgeUrl = 'http://your-server-ip:3001'
  const url = new URL(request.url)
  
  // Create new request to MCP Bridge
  const mcpRequest = new Request(
    `${mcpBridgeUrl}${url.pathname}${url.search}`,
    {
      method: request.method,
      headers: request.headers,
      body: request.body
    }
  )
  
  // Forward the request
  const response = await fetch(mcpRequest)
  
  // Add CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  }
  
  // Create new response with CORS headers
  const responseHeaders = new Headers(response.headers)
  Object.keys(corsHeaders).forEach(key => {
    responseHeaders.set(key, corsHeaders[key])
  })
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders
  })
}
\`\`\`

5. Replace `'http://your-server-ip:3001'` with the actual URL of your MCP Bridge server.
6. Save and deploy the worker.

### 2. Configure Routes

1. In the Cloudflare dashboard, go to "Workers & Pages".
2. Find your worker and click on "Add Route".
3. Add a route pattern like `api.yourdomain.com/api/mcp*` or `yourdomain.com/api/mcp*`.
4. Select your worker from the dropdown.
5. Click "Save".

### 3. Configure DNS

1. In the Cloudflare dashboard, go to "DNS".
2. Add a new record:
   - Type: A or CNAME
   - Name: api (or whatever subdomain you want to use)
   - Value: Your server's IP address (for A record) or your domain (for CNAME)
   - Proxy status: Proxied

### 4. Test the Connection

1. In the Agent Builder application, go to the MCP Bridge page.
2. Navigate to the "Cloudflare Gateway" tab.
3. Connect to your Cloudflare account using your email and API key.
4. Verify that your routes are correctly configured.
5. Test the connection by sending a request to your Cloudflare-proxied API endpoint.

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Make sure the MCP Bridge server is running.
   - Check that the port is not blocked by a firewall.

2. **WebSocket Connection Failed**
   - Verify that the MCP server supports WebSocket connections.
   - Check that the WebSocket URL is correct (should start with `ws://` or `wss://`).

3. **
