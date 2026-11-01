<p align="center">
  <img src="assets/pad-mcp-light.png" alt="PAD MCP Light" width="260">
</p>

**PAD MCP Light** helps MCP clients write Power Automate Desktop flows using the bundled Robin action and type catalogs for Classic and Power Fx. It runs as a single anonymous, read-only Streamable HTTP service.

| Tool | What it returns |
| --- | --- |
| `get_development_context` | Shared Robin guidance and the rules for the selected edition. |
| `search_actions` | Actions matching a keyword or module. Look up an exact `action_id` for parameters and a Robin example. |
| `search_type_reference` | Types matching a keyword. Look up an exact `type_name` for its format and an edition-specific example. |

## Run locally

```sh
git clone https://github.com/ttiaMa/pad-mcp-light.git
cd pad-mcp-light
docker compose -f compose.yaml -f compose.local.yaml up --build -d
```

Connect your MCP client to `http://localhost:8080/mcp` using **Streamable HTTP** with authentication disabled. Ask it to find an Excel action in Classic or Power Fx.

## Self-host

In Coolify, deploy `compose.yaml` from this repository. Set `PUBLIC_URL` to your HTTPS origin and route the domain to `pad-mcp-light` on port `8080`. With another reverse proxy, preserve the Host header and disable response buffering on `/mcp`.

Each instance accepts **200 requests per rolling minute**, shared across clients. Set `MCP_CALL_RATE_LIMIT_PER_MINUTE` to override the limit. A throttled request returns HTTP 429 with `Retry-After`. The health endpoint is `/healthz`.

For local development with Node.js 24 or newer, run `npm ci`, then `npm test` or `npm start`.

Server code is [MIT licensed](LICENSE). The [bundled catalogs](catalogs/NOTICE.md) are by Joe Green, licensed under CC BY 4.0. For team snippets and publishing, see [PAD MCP](https://github.com/ttiaMa/pad-mcp).
