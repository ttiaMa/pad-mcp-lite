<p align="center">
  <img src="assets/pad-mcp-lite-azure.png" alt="pad-mcp-lite" width="260">
</p>

**A Robin reference for agents building Power Automate Desktop flows.** Look up actions, parameter types and syntax for Classic and Power Fx through a single read-only MCP endpoint.

> **Bring your team's Robin code.** Publish reusable snippets and coding conventions so agents can draw on them when building flows. [Explore pad-mcp →](https://github.com/ttiaMa/pad-mcp)

| Tool | What it returns |
| --- | --- |
| `get_development_context` | Shared Robin guidance and the rules for the selected edition. |
| `search_actions` | Actions matching a keyword or module. Look up an exact `action_id` for parameters and a Robin example. |
| `search_type_reference` | Types matching a keyword. Look up an exact `type_name` for its format and an edition-specific example. |

## Try it right now on my instance

**Codex**

```sh
codex mcp add pad-mcp-lite --url https://pad-mcp-lite.mathya.it/mcp
```

**Claude Code**

```sh
claude mcp add --transport http pad-mcp-lite https://pad-mcp-lite.mathya.it/mcp
```

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
