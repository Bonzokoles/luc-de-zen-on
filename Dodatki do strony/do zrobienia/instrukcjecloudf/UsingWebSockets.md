---
title: Using WebSockets · Cloudflare Agents docs
description: Users and clients can connect to an Agent directly over WebSockets,
  allowing long-running, bi-directional communication with your Agent as it
  operates.
lastUpdated: 2025-03-18T12:13:40.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/agents/api-reference/websockets/
  md: https://developers.cloudflare.com/agents/api-reference/websockets/index.md
---

Users and clients can connect to an Agent directly over WebSockets, allowing long-running, bi-directional communication with your Agent as it operates.

To enable an Agent to accept WebSockets, define `onConnect` and `onMessage` methods on your Agent.

* `onConnect(connection: Connection, ctx: ConnectionContext)` is called when a client establishes a new WebSocket connection. The original HTTP request, including request headers, cookies, and the URL itself, are available on `ctx.request`.
* `onMessage(connection: Connection, message: WSMessage)` is called for each incoming WebSocket message. Messages are one of `ArrayBuffer | ArrayBufferView | string`, and you can send messages back to a client using `connection.send()`. You can distinguish between client connections by checking `connection.id`, which is unique for each connected client.

Here's an example of an Agent that echoes back any message it receives:

* JavaScript

  ```js
  import { Agent, Connection } from "agents";


  export class ChatAgent extends Agent {
    async onConnect(connection, ctx) {
      // Connections are automatically accepted by the SDK.
      // You can also explicitly close a connection here with connection.close()
      // Access the Request on ctx.request to inspect headers, cookies and the URL
    }


    async onMessage(connection, message) {
      // const response = await longRunningAITask(message)
      await connection.send(message);
    }
  }
  ```

* TypeScript

  ```ts
  import { Agent, Connection } from "agents";


  export class ChatAgent extends Agent {
    async onConnect(connection: Connection, ctx: ConnectionContext) {
      // Connections are automatically accepted by the SDK.
      // You can also explicitly close a connection here with connection.close()
      // Access the Request on ctx.request to inspect headers, cookies and the URL
    }


    async onMessage(connection: Connection, message: WSMessage) {
      // const response = await longRunningAITask(message)
      await connection.send(message)
    }
  }
  ```

### Connecting clients

The Agent framework includes a useful helper package for connecting directly to your Agent (or other Agents) from a client application. Import `agents/client`, create an instance of `AgentClient` and use it to connect to an instance of your Agent:

* JavaScript

  ```js
  import { AgentClient } from "agents/client";


  const connection = new AgentClient({
    agent: "dialogue-agent",
    name: "insight-seeker",
  });


  connection.addEventListener("message", (event) => {
    console.log("Received:", event.data);
  });


  connection.send(
    JSON.stringify({
      type: "inquiry",
      content: "What patterns do you see?",
    }),
  );
  ```

* TypeScript

  ```ts
  import { AgentClient } from "agents/client";


  const connection = new AgentClient({
    agent: "dialogue-agent",
    name: "insight-seeker",
  });


  connection.addEventListener("message", (event) => {
    console.log("Received:", event.data);
  });


  connection.send(
    JSON.stringify({
      type: "inquiry",
      content: "What patterns do you see?",
    })
  );
  ```

### React clients

React-based applications can import `agents/react` and use the `useAgent` hook to connect to an instance of an Agent directly:

* JavaScript

  ```js
  import { useAgent } from "agents/react";


  function AgentInterface() {
    const connection = useAgent({
      agent: "dialogue-agent",
      name: "insight-seeker",
      onMessage: (message) => {
        console.log("Understanding received:", message.data);
      },
      onOpen: () => console.log("Connection established"),
      onClose: () => console.log("Connection closed"),
    });


    const inquire = () => {
      connection.send(
        JSON.stringify({
          type: "inquiry",
          content: "What insights have you gathered?",
        }),
      );
    };


    return (
      <div className="agent-interface">
        <button onClick={inquire}>Seek Understanding</button>
      </div>
    );
  }
  ```

* TypeScript

  ```ts
  import { useAgent } from "agents/react";


  function AgentInterface() {
    const connection = useAgent({
      agent: "dialogue-agent",
      name: "insight-seeker",
      onMessage: (message) => {
        console.log("Understanding received:", message.data);
      },
      onOpen: () => console.log("Connection established"),
      onClose: () => console.log("Connection closed"),
    });


    const inquire = () => {
      connection.send(
        JSON.stringify({
          type: "inquiry",
          content: "What insights have you gathered?",
        })
      );
    };


    return (
      <div className="agent-interface">
        <button onClick={inquire}>Seek Understanding</button>
      </div>
    );
  }
  ```

The `useAgent` hook automatically handles the lifecycle of the connection, ensuring that it is properly initialized and cleaned up when the component mounts and unmounts. You can also [combine `useAgent` with `useState`](https://developers.cloudflare.com/agents/api-reference/store-and-sync-state/) to automatically synchronize state across all clients connected to your Agent.

### Handling WebSocket events

Define `onError` and `onClose` methods on your Agent to explicitly handle WebSocket client errors and close events. Log errors, clean up state, and/or emit metrics:

* JavaScript

  ```js
  import { Agent, Connection } from "agents";


  export class ChatAgent extends Agent {
    // onConnect and onMessage methods
    // ...


    // WebSocket error and disconnection (close) handling.
    async onError(connection, error) {
      console.error(`WS error: ${error}`);
    }
    async onClose(connection, code, reason, wasClean) {
      console.log(`WS closed: ${code} - ${reason} - wasClean: ${wasClean}`);
      connection.close();
    }
  }
  ```

* TypeScript

  ```ts
  import { Agent, Connection } from "agents";


  export class ChatAgent extends Agent {
     // onConnect and onMessage methods
    // ...


    // WebSocket error and disconnection (close) handling.
    async onError(connection: Connection, error: unknown): Promise<void> {
      console.error(`WS error: ${error}`);
    }
    async onClose(connection: Connection, code: number, reason: string, wasClean: boolean): Promise<void> {
      console.log(`WS closed: ${code} - ${reason} - wasClean: ${wasClean}`);
      connection.close();
    }
  }
  ```
