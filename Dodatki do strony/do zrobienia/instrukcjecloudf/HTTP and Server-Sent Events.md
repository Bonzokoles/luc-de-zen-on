---
title: HTTP and Server-Sent Events · Cloudflare Agents docs
description: The Agents SDK allows you to handle HTTP requests and has native
  support for Server-Sent Events (SSE). This allows you build applications that
  can push data to clients and avoid buffering.
lastUpdated: 2025-03-18T12:13:40.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/agents/api-reference/http-sse/
  md: https://developers.cloudflare.com/agents/api-reference/http-sse/index.md
---

The Agents SDK allows you to handle HTTP requests and has native support for [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) (SSE). This allows you build applications that can push data to clients and avoid buffering.

### Handling HTTP requests

Agents can handle HTTP requests using the `onRequest` method, which is called whenever an HTTP request is received by the Agent instance. The method takes a `Request` object as a parameter and returns a `Response` object.

* JavaScript

  ```js
  class MyAgent extends Agent {
    // Handle HTTP requests coming to this Agent instance
    // Returns a Response object
    async onRequest(request) {
      return new Response("Hello from Agent!");
    }


    async callAIModel(prompt) {
      // Implement AI model call here
    }
  }
  ```

* TypeScript

  ```ts
  class MyAgent extends Agent<Env, State> {
    // Handle HTTP requests coming to this Agent instance
    // Returns a Response object
    async onRequest(request: Request) {
      return new Response("Hello from Agent!");
    }


    async callAIModel(prompt: string) {
      // Implement AI model call here
    }
  }
  ```

Review the [Agents API reference](https://developers.cloudflare.com/agents/api-reference/agents-api/) to learn more about the `Agent` class and its methods.

### Implementing Server-Sent Events

The Agents SDK support Server-Sent Events directly: you can use SSE to stream data back to the client over a long running connection. This avoids buffering large responses, which can both make your Agent feel slow, and forces you to buffer the entire response in memory.

When an Agent is deployed to Cloudflare Workers, there is no effective limit on the total time it takes to stream the response back: large AI model responses that take several minutes to reason and then respond will not be prematurely terminated.

Note that this does not mean the client can't potentially disconnect during the streaming process: you can account for this by either [writing to the Agent's stateful storage](https://developers.cloudflare.com/agents/api-reference/store-and-sync-state/) and/or [using WebSockets](https://developers.cloudflare.com/agents/api-reference/websockets/). Because you can always [route to the same Agent](https://developers.cloudflare.com/agents/api-reference/calling-agents/), you do not need to use a centralized session store to pick back up where you left off when a client disconnects.

The following example uses the AI SDK to generate text and stream it back to the client. It will automatically stream the response back to the client as the model generates it:

* JavaScript

  ```js
  import {
    Agent,
    AgentNamespace,
    getAgentByName,
    routeAgentRequest,
  } from "agents";
  import { streamText } from "ai";
  import { createOpenAI, openai } from "@ai-sdk/openai";


  export class MyAgent extends Agent {
    async onRequest(request) {
      // Test it via:
      // curl -d '{"prompt": "Write me a Cloudflare Worker"}' <url>
      let data = await request.json();
      let stream = await this.callAIModel(data.prompt);
      // This uses Server-Sent Events (SSE)
      return stream.toTextStreamResponse({
        headers: {
          "Content-Type": "text/x-unknown",
          "content-encoding": "identity",
          "transfer-encoding": "chunked",
        },
      });
    }


    async callAIModel(prompt) {
      const openai = createOpenAI({
        apiKey: this.env.OPENAI_API_KEY,
      });


      return streamText({
        model: openai("gpt-4o"),
        prompt: prompt,
      });
    }
  }


  export default {
    async fetch(request, env) {
      let agentId = new URL(request.url).searchParams.get("agent-id") || "";
      const agent = await getAgentByName(env.MyAgent, agentId);
      return agent.fetch(request);
    },
  };
  ```

* TypeScript

  ```ts
  import { Agent, AgentNamespace, getAgentByName, routeAgentRequest } from 'agents';
  import { streamText } from 'ai';
  import { createOpenAI, openai } from '@ai-sdk/openai';


  interface Env {
    MyAgent: AgentNamespace<MyAgent>;
    OPENAI_API_KEY: string;
  }


  export class MyAgent extends Agent<Env> {
    async onRequest(request: Request) {
      // Test it via:
      // curl -d '{"prompt": "Write me a Cloudflare Worker"}' <url>
      let data = await request.json<{ prompt: string }>();
      let stream = await this.callAIModel(data.prompt);
      // This uses Server-Sent Events (SSE)
      return stream.toTextStreamResponse({
        headers: {
          'Content-Type': 'text/x-unknown',
          'content-encoding': 'identity',
          'transfer-encoding': 'chunked',
        },
      });
    }


    async callAIModel(prompt: string) {
      const openai = createOpenAI({
        apiKey: this.env.OPENAI_API_KEY,
      });


      return streamText({
        model: openai('gpt-4o'),
        prompt: prompt,
      });
    }
  }


  export default {
    async fetch(request: Request, env: Env) {
      let agentId = new URL(request.url).searchParams.get('agent-id') || '';
      const agent = await getAgentByName<Env, MyAgent>(env.MyAgent, agentId);
      return agent.fetch(request);
    },
  };
  ```

### WebSockets vs. Server-Sent Events

Both WebSockets and Server-Sent Events (SSE) enable real-time communication between clients and Agents. Agents built on the Agents SDK can expose both WebSocket and SSE endpoints directly.

* WebSockets provide full-duplex communication, allowing data to flow in both directions simultaneously. SSE only supports server-to-client communication, requiring additional HTTP requests if the client needs to send data back.
* WebSockets establish a single persistent connection that stays open for the duration of the session. SSE, being built on HTTP, may experience more overhead due to reconnection attempts and header transmission with each reconnection, especially when there is a lot of client-server communication.
* While SSE works well for simple streaming scenarios, WebSockets are better suited for applications requiring minutes or hours of connection time, as they maintain a more stable connection with built-in ping/pong mechanisms to keep connections alive.
* WebSockets use their own protocol (ws\:// or wss\://), separating them from HTTP after the initial handshake. This separation allows WebSockets to better handle binary data transmission and implement custom subprotocols for specialized use cases.

If you're unsure of which is better for your use-case, we recommend WebSockets. The [WebSockets API documentation](https://developers.cloudflare.com/agents/api-reference/websockets/) provides detailed information on how to use WebSockets with the Agents SDK.

### Next steps

* Review the [API documentation](https://developers.cloudflare.com/agents/api-reference/agents-api/) for the Agents class to learn how to define them.
* [Build a chat Agent](https://developers.cloudflare.com/agents/getting-started/build-a-chat-agent/) using the Agents SDK and deploy it to Workers.
* Learn more [using WebSockets](https://developers.cloudflare.com/agents/api-reference/websockets/) to build interactive Agents and stream data back from your Agent.
* [Orchestrate asynchronous workflows](https://developers.cloudflare.com/agents/api-reference/run-workflows) from your Agent by combining the Agents SDK and [Workflows](https://developers.cloudflare.com/workflows).
