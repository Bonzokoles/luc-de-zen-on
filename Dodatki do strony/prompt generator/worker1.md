How to Use Cloudflare Workers to Deploy a Minimal Node.js API
#
node
#
worker
#
discuss
#
explainlikeimfive
When we think of deploying APIs, especially with Node.js, our minds usually go to Express.js servers running on EC2 instances, Heroku, Vercel, or DigitalOcean. But what if you could deploy lightweight APIs in less than 50ms globally, without managing servers, scaling headaches, or even worrying about cold starts?

Welcome to the world of Cloudflare Workers.

Cloudflare Workers allow you to write serverless functions that run on Cloudflare’s edge network — which means your code executes closer to the user, offering lightning-fast performance.

1. What Are Cloudflare Workers?
Cloudflare Workers are serverless functions that run on Cloudflare's global edge network. Think of them as JavaScript (or WebAssembly) scripts that execute instantly, with minimal latency, across over 300 cities.

They’re perfect for:

APIs
Lightweight server-side logic
A/B testing
Authentication middlewares
Caching, redirects, and more
Key Benefits
Global deployment by default
No cold starts (unlike AWS Lambda)
Blazing fast (under 1ms compute in most locations)
Built-in caching and storage (via Workers KV and Durable Objects)
Free tier generous enough for small APIs
But, before you get too excited...

2. Limitations of Cloudflare Workers
Workers are incredibly fast and efficient — but they’re not meant to replace your entire Node.js backend. Here’s why:

No full Node.js runtime: You can’t use native Node modules (fs, net, child_process, etc.)
Code size limit: 1MB per script (including dependencies)
Execution time limit: 10ms CPU time per request on the free plan (extendable with paid plan)
Memory limitations: 128MB max
You’ll need to rethink some patterns (like file system usage, background jobs, or database drivers that need TCP). Still, for JSON APIs, edge logic, or low-latency services, they shine.

3. Setting Up the Environment
We’ll use Wrangler, the official CLI tool by Cloudflare to develop and deploy Workers.

Step 1: Install Wrangler
npm install -g wrangler
Check it’s working:

wrangler --version
Step 2: Authenticate with Cloudflare
wrangler login
This will open your browser to authenticate with your Cloudflare account.

Step 3: Create a New Worker Project
wrangler init node-api --type=javascript
cd node-api
You can also choose --type=webpack or --type=none, but javascript gives us a minimal setup.

This creates:

wrangler.toml – configuration
index.js – your Worker’s entry point
package.json – for dependencies
Let’s move on to writing our API.

4. Writing a Minimal Node.js-Style API
Let’s simulate a mini Express-like API using Workers.

First, replace the content of index.js with the following:

import { Router } from 'itty-router'
 
const router = Router()
 
// Home Route
router.get('/', () => new Response('Welcome to Cloudflare Workers API!', {
  headers: { 'Content-Type': 'text/plain' }
}))
 
// JSON Hello Route
router.get('/api/hello', () => {
  return Response.json({ message: 'Hello from Cloudflare Worker!' })
})
 
// Dynamic Params
router.get('/api/user/:id', ({ params }) => {
  return Response.json({ userId: params.id })
})
 
// 404 handler
router.all('*', () => new Response('Not Found', { status: 404 }))
 
// Worker export
export default {
  fetch: (request) => router.handle(request)
}
Breakdown:
We use itty-router — a small router built specifically for Cloudflare Workers.
We define routes: root, API hello, and a dynamic user route.
At the end, we export a fetch handler — the standard Worker entry point.
Let’s test it.

5. Run and Test Locally
Cloudflare Workers run in a simulated environment locally using wrangler dev.

wrangler dev
This starts a dev server at http://localhost:8787.

Try these endpoints in your browser or with curl/Postman:

GET / → “Welcome to Cloudflare Workers API!”
GET /api/hello → { "message": "Hello from Cloudflare Worker!" }
GET /api/user/42 → { "userId": "42" }
GET /unknown → Not Found
You’re already running a fast, minimal Node.js-style API!

6. Deploy to the Edge (Global)
Once you're happy with the local dev version, it’s time to deploy it globally.

wrangler publish
This gives you a .workers.dev subdomain like:

https://node-api.your-username.workers.dev
Boom. Your API is now accessible across the world — with edge performance.

7. Bonus: Add a POST Endpoint with JSON Body
Let’s simulate a typical POST request — like submitting a form or JSON payload.

Add this route to your index.js:

router.post('/api/data', async (request) => {
  const contentType = request.headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    const data = await request.json()
    return Response.json({ received: data })
  } else {
    return new Response("Invalid content type", { status: 400 })
  }
})
Now try:

curl -X POST https://node-api.your-username.workers.dev/api/data \
  -H "Content-Type: application/json" \
  -d '{"name": "Arun", "role": "Dev"}'
Output:

 

{
  "received": {
    "name": "Arun",
    "role": "Dev"
  }
}
This mimics an Express-like behavior — no server, no cold start.

8. Add KV Storage (Optional: Persistent Storage)
Cloudflare Workers don’t have a built-in database, but you can use Workers KV — a global key-value store — for persistent data.

Let’s add that.

Step 1: Update wrangler.toml
name = "node-api"
type = "javascript"
account_id = "your-cloudflare-account-id"
workers_dev = true
compatibility_date = "2024-05-01"
 
[[kv_namespaces]]
binding = "MY_KV"
id = "your-kv-namespace-id"
preview_id = "your-preview-id"
You can create a namespace using:

wrangler kv:namespace create "MY_KV"
Step 2: Use KV in Your Code
Update your index.js:

router.post('/api/kv', async (request) => {
  const { key, value } = await request.json()
  await MY_KV.put(key, value)
  return Response.json({ status: 'Saved', key, value })
})
 
router.get('/api/kv/:key', async ({ params }) => {
  const value = await MY_KV.get(params.key)
  return Response.json({ key: params.key, value })
})
Don’t forget to bind MY_KV in the fetch method:

export default {
  fetch: (request, env) => router.handle(request, env)
}
And update the router methods to accept env:

router.post('/api/kv', async (request, env) => {
  const { key, value } = await request.json()
  await env.MY_KV.put(key, value)
  return Response.json({ status: 'Saved', key, value })
})
 
router.get('/api/kv/:key', async ({ params }, env) => {
  const value = await env.MY_KV.get(params.key)
  return Response.json({ key: params.key, value })
})
Test it with curl or Postman — you now have persistent key-value storage!

9. Final Project Structure
Your project now looks like:

node-api/
├── index.js
├── package.json
├── wrangler.toml
You’ve got:

A mini API framework
Dynamic routing
JSON input handling
Persistent KV storage
Instant global deployment
And it all runs without a Node.js server or containers.

10. Real-World Use Cases
Here’s how real teams use Cloudflare Workers for API development:

Geo-aware logic – Serve content based on user’s location (via request.cf.country)
Authentication gateways – Lightweight auth verification before routing
Third-party API proxies – Rate-limit, sanitize, or augment outbound API requests
Webhook handlers – Receive GitHub, Stripe, or Slack events instantly
Form processing – Process and store form submissions without a server
If you're building a JAMstack app, Workers can fill the gaps that static hosts can't.

Conclusion
Deploying APIs doesn’t need to mean spinning up servers or managing complex infrastructure. With Cloudflare Workers, you can build and deploy minimal, blazing-fast APIs globally — using just JavaScript and a few CLI commands.

Key Takeaways:
Workers give you edge-powered, serverless APIs with no cold starts
You don’t need Express — lightweight routers like itty-router do the job
You can persist data using Workers KV
Deployment is as simple as wrangler publish
Perfect for microservices, edge logic, and fast APIs
If you’re building modern apps and want your backend to match your frontend in speed and simplicity — Cloudflare Workers deserve your attention.