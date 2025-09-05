---
title: Browse the web · Cloudflare Agents docs
description: Agents can browse the web using the Browser Rendering API or your
  preferred headless browser service.
lastUpdated: 2025-05-16T16:37:37.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/agents/api-reference/browse-the-web/
  md: https://developers.cloudflare.com/agents/api-reference/browse-the-web/index.md
---

Agents can browse the web using the [Browser Rendering](https://developers.cloudflare.com/browser-rendering/) API or your preferred headless browser service.

### Browser Rendering API

The [Browser Rendering](https://developers.cloudflare.com/browser-rendering/) allows you to spin up headless browser instances, render web pages, and interact with websites through your Agent.

You can define a method that uses Puppeteer to pull the content of a web page, parse the DOM, and extract relevant information by calling the OpenAI model:

* JavaScript

  ```js
  export class MyAgent extends Agent {
    async browse(browserInstance, urls) {
      let responses = [];
      for (const url of urls) {
        const browser = await puppeteer.launch(browserInstance);
        const page = await browser.newPage();
        await page.goto(url);


        await page.waitForSelector("body");
        const bodyContent = await page.$eval(
          "body",
          (element) => element.innerHTML,
        );
        const client = new OpenAI({
          apiKey: this.env.OPENAI_API_KEY,
        });


        let resp = await client.chat.completions.create({
          model: this.env.MODEL,
          messages: [
            {
              role: "user",
              content: `Return a JSON object with the product names, prices and URLs with the following format: { "name": "Product Name", "price": "Price", "url": "URL" } from the website content below. <content>${bodyContent}</content>`,
            },
          ],
          response_format: {
            type: "json_object",
          },
        });


        responses.push(resp);
        await browser.close();
      }


      return responses;
    }
  }
  ```

* TypeScript

  ```ts
  interface Env {
    BROWSER: Fetcher;
  }


  export class MyAgent extends Agent<Env> {
    async browse(browserInstance: Fetcher, urls: string[]) {
      let responses = [];
      for (const url of urls) {
        const browser = await puppeteer.launch(browserInstance);
        const page = await browser.newPage();
        await page.goto(url);


        await page.waitForSelector("body");
        const bodyContent = await page.$eval(
          "body",
          (element) => element.innerHTML,
        );
        const client = new OpenAI({
          apiKey: this.env.OPENAI_API_KEY,
        });


        let resp = await client.chat.completions.create({
          model: this.env.MODEL,
          messages: [
            {
              role: "user",
              content: `Return a JSON object with the product names, prices and URLs with the following format: { "name": "Product Name", "price": "Price", "url": "URL" } from the website content below. <content>${bodyContent}</content>`,
            },
          ],
          response_format: {
            type: "json_object",
          },
        });


        responses.push(resp);
        await browser.close();
      }


      return responses;
    }
  }
  ```

You'll also need to add install the `@cloudflare/puppeteer` package and add the following to the wrangler configuration of your Agent:

* npm

  ```sh
  npm i -D @cloudflare/puppeteer
  ```

* yarn

  ```sh
  yarn add -D @cloudflare/puppeteer
  ```

* pnpm

  ```sh
  pnpm add -D @cloudflare/puppeteer
  ```

- wrangler.jsonc

  ```jsonc
  {
    // ...
    "browser": {
      "binding": "MYBROWSER",
    },
    // ...
  }
  ```

- wrangler.toml

  ```toml
  [browser]
  binding = "MYBROWSER"
  ```

### Browserbase

You can also use [Browserbase](https://docs.browserbase.com/integrations/cloudflare/typescript) by using the Browserbase API directly from within your Agent.

Once you have your [Browserbase API key](https://docs.browserbase.com/integrations/cloudflare/typescript), you can add it to your Agent by creating a [secret](https://developers.cloudflare.com/workers/configuration/secrets/):

```sh
cd your-agent-project-folder
npx wrangler@latest secret put BROWSERBASE_API_KEY
```

```sh
Enter a secret value: ******
Creating the secret for the Worker "agents-example"
Success! Uploaded secret BROWSERBASE_API_KEY
```

Install the `@cloudflare/puppeteer` package and use it from within your Agent to call the Browserbase API:

* npm

  ```sh
  npm i @cloudflare/puppeteer
  ```

* yarn

  ```sh
  yarn add @cloudflare/puppeteer
  ```

* pnpm

  ```sh
  pnpm add @cloudflare/puppeteer
  ```

- JavaScript

  ```js
  export class MyAgent extends Agent {
    constructor(env) {
      super(env);
    }
  }
  ```

- TypeScript

  ```ts
  interface Env {
    BROWSERBASE_API_KEY: string;
  }


  export class MyAgent extends Agent<Env> {
    constructor(env: Env) {
      super(env);
    }
  }
  ```
