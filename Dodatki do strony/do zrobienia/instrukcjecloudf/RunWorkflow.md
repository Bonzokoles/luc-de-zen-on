---
title: Run Workflows · Cloudflare Agents docs
description: Agents can trigger asynchronous Workflows, allowing your Agent to
  run complex, multi-step tasks in the background. This can include
  post-processing files that a user has uploaded, updating the embeddings in a
  vector database, and/or managing long-running user-lifecycle email or SMS
  notification workflows.
lastUpdated: 2025-05-14T14:20:47.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/agents/api-reference/run-workflows/
  md: https://developers.cloudflare.com/agents/api-reference/run-workflows/index.md
---

Agents can trigger asynchronous [Workflows](https://developers.cloudflare.com/workflows/), allowing your Agent to run complex, multi-step tasks in the background. This can include post-processing files that a user has uploaded, updating the embeddings in a [vector database](https://developers.cloudflare.com/vectorize/), and/or managing long-running user-lifecycle email or SMS notification workflows.

Because an Agent is just like a Worker script, it can create Workflows defined in the same project (script) as the Agent *or* in a different project.

Agents vs. Workflows

Agents and Workflows have some similarities: they can both run tasks asynchronously. For straightforward tasks that are linear or need to run to completion, a Workflow can be ideal: steps can be retried, they can be cancelled, and can act on events.

Agents do not have to run to completion: they can loop, branch and run forever, and they can also interact directly with users (over HTTP or WebSockets). An Agent can be used to trigger multiple Workflows as it runs, and can thus be used to co-ordinate and manage Workflows to achieve its goals.

## Trigger a Workflow

An Agent can trigger one or more Workflows from within any method, whether from an incoming HTTP request, a WebSocket connection, on a delay or schedule, and/or from any other action the Agent takes.

Triggering a Workflow from an Agent is no different from [triggering a Workflow from a Worker script](https://developers.cloudflare.com/workflows/build/trigger-workflows/):

* JavaScript

  ```js
  export class MyAgent extends Agent {
    async onRequest(request) {
      let userId = request.headers.get("user-id");
      // Trigger a schedule that runs a Workflow
      // Pass it a payload
      let { taskId } = await this.schedule(300, "runWorkflow", {
        id: userId,
        flight: "DL264",
        date: "2025-02-23",
      });
    }


    async runWorkflow(data) {
      let instance = await env.MY_WORKFLOW.create({
        id: data.id,
        params: data,
      });


      // Schedule another task that checks the Workflow status every 5 minutes...
      await this.schedule("*/5 * * * *", "checkWorkflowStatus", {
        id: instance.id,
      });
    }
  }


  export class MyWorkflow extends WorkflowEntrypoint {
    async run(event, step) {
      // Your Workflow code here
    }
  }
  ```

* TypeScript

  ```ts
  interface Env {
    MY_WORKFLOW: Workflow;
    MyAgent: AgentNamespace<MyAgent>;
  }


  export class MyAgent extends Agent<Env> {
    async onRequest(request: Request) {
      let userId = request.headers.get("user-id");
      // Trigger a schedule that runs a Workflow
      // Pass it a payload
      let { taskId } = await this.schedule(300, "runWorkflow", { id: userId, flight: "DL264", date: "2025-02-23" });
    }


    async runWorkflow(data) {
      let instance = await env.MY_WORKFLOW.create({
        id: data.id,
        params: data,
      })


      // Schedule another task that checks the Workflow status every 5 minutes...
      await this.schedule("*/5 * * * *", "checkWorkflowStatus", { id: instance.id });
    }
  }


  export class MyWorkflow extends WorkflowEntrypoint<Env> {
    async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
      // Your Workflow code here
    }
  }
  ```

You'll also need to make sure your Agent [has a binding to your Workflow](https://developers.cloudflare.com/workflows/build/trigger-workflows/#workers-api-bindings) so that it can call it:

* wrangler.jsonc

  ```jsonc
  {
    // ...
    // Create a binding between your Agent and your Workflow
    "workflows": [
      {
        // Required:
        "name": "EMAIL_WORKFLOW",
        "class_name": "MyWorkflow",
        // Optional: set the script_name field if your Workflow is defined in a
        // different project from your Agent
        "script_name": "email-workflows"
      }
     ],
    // ...
  }
  ```

* wrangler.toml

  ```toml
  [[workflows]]
  name = "EMAIL_WORKFLOW"
  class_name = "MyWorkflow"
  script_name = "email-workflows"
  ```

## Trigger a Workflow from another project

You can also call a Workflow that is defined in a different Workers script from your Agent by setting the `script_name` property in the `workflows` binding of your Agent:

* wrangler.jsonc

  ```jsonc
  {
      // Required:
      "name": "EMAIL_WORKFLOW",
      "class_name": "MyWorkflow",
      // Optional: set the script_name field if your Workflow is defined in a
      // different project from your Agent
      "script_name": "email-workflows"
  }
  ```

* wrangler.toml

  ```toml
  name = "EMAIL_WORKFLOW"
  class_name = "MyWorkflow"
  script_name = "email-workflows"
  ```

Refer to the [cross-script calls](https://developers.cloudflare.com/workflows/build/workers-api/#cross-script-calls) section of the Workflows documentation for more examples.
