---
title: Configuration · Cloudflare Agents docs
description: An Agent is configured like any other Cloudflare Workers project,
  and uses a wrangler configuration file to define where your code is and what
  services (bindings) it will use.
lastUpdated: 2025-03-18T12:13:40.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/agents/api-reference/configuration/
  md: https://developers.cloudflare.com/agents/api-reference/configuration/index.md
---

An Agent is configured like any other Cloudflare Workers project, and uses [a wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/) file to define where your code is and what services (bindings) it will use.

### Project structure

The typical file structure for an Agent project created from `npm create cloudflare@latest agents-starter -- --template cloudflare/agents-starter` follows:

```sh
.
|-- package-lock.json
|-- package.json
|-- public
|   `-- index.html
|-- src
|   `-- index.ts // your Agent definition
|-- test
|   |-- index.spec.ts // your tests
|   `-- tsconfig.json
|-- tsconfig.json
|-- vitest.config.mts
|-- worker-configuration.d.ts
`-- wrangler.jsonc // your Workers & Agent configuration
```

### Example configuration

Below is a minimal `wrangler.jsonc` file that defines the configuration for an Agent, including the entry point, `durable_object` namespace, and code `migrations`:

* wrangler.jsonc

  ```jsonc
  {
    "$schema": "node_modules/wrangler/config-schema.json",
    "name": "agents-example",
    "main": "src/index.ts",
    "compatibility_date": "2025-02-23",
    "compatibility_flags": ["nodejs_compat"],
    "durable_objects": {
      "bindings": [
        {
          // Required:
          "name": "MyAgent", // How your Agent is called from your Worker
          "class_name": "MyAgent", // Must match the class name of the Agent in your code
          // Optional: set this if the Agent is defined in another Worker script
          "script_name": "the-other-worker"
        },
      ],
    },
    "migrations": [
      {
        "tag": "v1",
        // Mandatory for the Agent to store state
        "new_sqlite_classes": ["MyAgent"],
      },
    ],
    "observability": {
      "enabled": true,
    },
  }
  ```

* wrangler.toml

  ```toml
  "$schema" = "node_modules/wrangler/config-schema.json"
  name = "agents-example"
  main = "src/index.ts"
  compatibility_date = "2025-02-23"
  compatibility_flags = [ "nodejs_compat" ]


  [[durable_objects.bindings]]
  name = "MyAgent"
  class_name = "MyAgent"
  script_name = "the-other-worker"


  [[migrations]]
  tag = "v1"
  new_sqlite_classes = [ "MyAgent" ]


  [observability]
  enabled = true
  ```

The configuration includes:

* A `main` field that points to the entry point of your Agent, which is typically a TypeScript (or JavaScript) file.
* A `durable_objects` field that defines the [Durable Object namespace](https://developers.cloudflare.com/durable-objects/reference/glossary/) that your Agents will run within.
* A `migrations` field that defines the code migrations that your Agent will use. This field is mandatory and must contain at least one migration. The `new_sqlite_classes` field is mandatory for the Agent to store state.

Agents must define these fields in their `wrangler.jsonc` (or `wrangler.toml`) config file.
