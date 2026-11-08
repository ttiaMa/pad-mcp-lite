<p align="center">
  <img src="assets/pad-mcp-lite-azure.png" alt="pad-mcp-lite" width="260">
</p>

**Build Power Automate Desktop flows with your AI agent.** Your agent can look up actions, check parameter types and find code examples for both Classic and Power Fx flows. Paste the generated code directly into the flow designer.

**Try it on my instance right now**

```sh
# Claude Code
claude mcp add --transport http pad-mcp-lite https://pad-mcp-lite.mathya.it/mcp

# Codex
codex mcp add pad-mcp-lite --url https://pad-mcp-lite.mathya.it/mcp
```

| Tool | What it returns |
| --- | --- |
| `get_development_context` | Syntax and flow-writing guidance for the selected edition. |
| `search_actions` | Matching actions. Look up an exact `action_id` for parameters and an example in Robin, the scripting language used by Power Automate Desktop. |
| `search_type_reference` | Matching parameter types. Look up an exact `type_name` for its format and an example. |

Want your agent to reuse flows your team has already written? Publish your team's snippets and coding conventions on your own instance. **[Explore pad-mcp →](https://github.com/ttiaMa/pad-mcp)**

## Run with Docker

You’ll need Git and Docker with Compose. Clone the repository on the machine that will run the server.

```sh
git clone https://github.com/ttiaMa/pad-mcp-lite.git
cd pad-mcp-lite
```

**Local access**

Run the following command, then connect your MCP client to `http://localhost:8080/mcp`.

```sh
docker compose -f compose.yaml -f compose.local.yaml up --build -d
```

**Public access**

Point your domain at the server. Set `PUBLIC_URL=https://pad.example.com` in the project's `.env` file, using your own domain, then start the service.

```sh
docker compose up --build -d
```

Connect your HTTPS reverse proxy to the service's Docker network and forward requests to `pad-mcp-lite:8080`, preserving the original `Host` header. Clients can then connect at `https://pad.example.com/mcp` on your domain.

Each instance accepts **200 requests per rolling minute**, shared across clients. Override the limit with `MCP_CALL_RATE_LIMIT_PER_MINUTE`.

[MIT licensed](LICENSE) · [Catalog attribution](catalogs/NOTICE.md) · [Privacy Policy](PRIVACY.md) · [Terms of Service](TERMS.md)
