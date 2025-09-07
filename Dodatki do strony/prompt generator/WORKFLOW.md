---
title: Overview · Cloudflare Workflows docs
description: >-
  With Workflows, you can build applications that chain together multiple steps,
  automatically retry failed tasks,

  and persist state for minutes, hours, or even weeks - with no infrastructure
  to manage.
lastUpdated: 2025-08-18T14:27:42.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workflows/
  md: https://developers.cloudflare.com/workflows/index.md
---

Build durable multi-step applications on Cloudflare Workers with Workflows.

Available on Free and Paid plans

With Workflows, you can build applications that chain together multiple steps, automatically retry failed tasks, and persist state for minutes, hours, or even weeks - with no infrastructure to manage.

Workflows give you:

* Reliable multi-step operations without worrying about timeouts
* Automatic retries and error handling
* Built-in observability for long running operations
* Simple and expressive code for complex processes

- Workflow Code

  ```ts
  export class CheckoutWorkflow extends WorkflowEntrypoint {
    async run (event, step) {
      const processorResponse = await step.do( 'submit payment', async () => {
        let resp = await submitToPaymentProcessor(event.params.payment) ;
        return await resp.json<any>();
      }) ;


      const textResponse = await step.do( 'send confirmation text', sendConfirmation);
      await step.sleep('wait for feedback', '2 days');
      await step.do('send feedback email', sendFeedbackEmail);
      await step.sleep('delay before marketing', '30 days');
      await step.do( 'send marketing follow up', sendFollowUp);
    }
  }
  ```

- Workflow Config

  ```json
  {
    "name": "my-worker-with-workflow",
    "main": "src/index.js",
    "compatibility_date": "2025-02-27",
    "workflows": [
      {
        "name": "checkout-workflow",
        "binding": "CHECKOUT",
        "class_name": "CheckoutWorkflow"
      }
    ]
  }
  ```

[Start building with Workflows](https://developers.cloudflare.com/workflows/get-started/guide/)

***

## Features

### Deploy your first Workflow

Define your first Workflow, understand how to compose multi-steps, and deploy to production.

[Deploy your first Workflow](https://developers.cloudflare.com/workflows/get-started/guide/)

### Rules of Workflows

Understand best practices when writing and building applications using Workflows.

[Best practices](https://developers.cloudflare.com/workflows/build/rules-of-workflows/)

### Trigger Workflows

Learn how to trigger Workflows from your Workers applications, via the REST API, and the command-line.

[Trigger Workflows from Workers](https://developers.cloudflare.com/workflows/build/trigger-workflows/)

***

## Related products

**[Workers](https://developers.cloudflare.com/workers/)**

Build serverless applications and deploy instantly across the globe for exceptional performance, reliability, and scale.

**[Pages](https://developers.cloudflare.com/pages/)**

Deploy dynamic front-end applications in record time.

***

## More resources

[Pricing](https://developers.cloudflare.com/workflows/reference/pricing/)

Learn more about how Workflows is priced.

[Limits](https://developers.cloudflare.com/workflows/reference/limits/)

Learn more about Workflow limits, and how to work within them.

[Storage options](https://developers.cloudflare.com/workers/platform/storage-options/)

Learn more about the storage and database options you can build on with Workers.

[Developer Discord](https://discord.cloudflare.com)

Connect with the Workers community on Discord to ask questions, show what you are building, and discuss the platform with other developers.

[@CloudflareDev](https://x.com/cloudflaredev)

Follow @CloudflareDev on Twitter to learn about product announcements, and what is new in Cloudflare Developer Platform.
