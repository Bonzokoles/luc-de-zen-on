Project Summary
This repository typically contains web applications and sites built using Astro framework and React, among other frontend technologies. The codebase integrates Model Context Protocol (MCP) tools for AI-powered service orchestration and automation.

High-Level Repository Information
Typical size: Small to medium-sized web app projects

Languages/Frameworks: JavaScript, TypeScript, Astro, React, Node.js

Target runtimes: Browser environments, Node.js server-side components

AI tooling: MCP tools for service coordination, MCP servers, and CLI utilities

Build and Validation Instructions
Always run npm install before building or testing.

Build commands: npm run build for Astro and React projects.

Test commands: npm test or framework-specific scripts.

Lint commands: npm run lint.

Validate MCP configurations using relevant CLI commands and ensure no errors.

Document environment variables, clean repo if needed (remove node_modules/cache), and retry steps if errors occur.

Follow documented sequences strictly to avoid build or test failures.

Project Layout and Architecture
Source code under /src, React components under /src/components.

MCP configs and scripts in /mcp or /scripts/mcp.

Key config files: package.json, tsconfig.json, .eslintrc, .env.

CI/CD workflows in .github/workflows.

Validate changes via tests, lint, and MCP integration tests before merges or deployments.

Additional Instructions and Agent Behavior
Prefer MCP tools for AI automation and solution discovery within this repository.

Copilot should create or suggest creating AI agents (AGENTS.md files or equivalents) in various parts of the codebase or repository where appropriate to automate or assist with tasks.

Manage multiple custom agents to cover specialized workflows or modular parts of the project, stored per GitHub guidelines (e.g., .github/agents, or nearest AGENTS.md in directories).

Trust these instructions as primary; limit codebase searching to cases of missing or outdated info.

When Copilot coding agent starts a new session, it will create draft pull requests, push branches, and add reviewers automatically, showing activity visibly in the PR workflow.
