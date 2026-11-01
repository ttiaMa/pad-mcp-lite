<p align="center">
  <img src="assets/pad-mcp-lite-azure.png" alt="pad-mcp-lite" width="260">
</p>

**Build Power Automate Desktop flows with your AI agent.** Your agent can look up actions, check parameter types and find code examples for both Classic and Power Fx flows.

**Try it on my instance**

```sh
# Codex
codex mcp add pad-mcp-lite --url https://pad-mcp-lite.mathya.it/mcp

# Claude Code
claude mcp add --transport http pad-mcp-lite https://pad-mcp-lite.mathya.it/mcp
```

| Tool | What it returns |
| --- | --- |
| `get_development_context` | Syntax and flow-writing guidance for the selected edition. |
| `search_actions` | Matching actions. Look up an exact `action_id` for parameters and an example in Robin, the scripting language used by Power Automate Desktop. |
| `search_type_reference` | Matching parameter types. Look up an exact `type_name` for its format and an example. |

Want your agent to reuse flows your team has already written? Publish your team's snippets and coding conventions on your own instance of [pad-mcp](https://github.com/ttiaMa/pad-mcp).

## Run locally

```sh
git clone https://github.com/ttiaMa/pad-mcp-lite.git
cd pad-mcp-lite
docker compose -f compose.yaml -f compose.local.yaml up --build -d
```

Connect your MCP client to `http://localhost:8080/mcp` using **Streamable HTTP** with authentication disabled.

## Self-host

Deploy with Docker Compose. Set `PUBLIC_URL` to your HTTPS origin and route traffic to the service on port `8080`. Clients connect at `/mcp`.

Each instance accepts **200 requests per rolling minute**, shared across clients. Override the limit with `MCP_CALL_RATE_LIMIT_PER_MINUTE`.

For local development with Node.js 24 or newer, run `npm ci`, then `npm test` or `npm start`.

[MIT licensed](LICENSE) · [Catalog attribution](catalogs/NOTICE.md)
