# PAD MCP Light

A self-hosted MCP server for looking up Power Automate Desktop actions while writing Robin flows. It serves the bundled Classic and Power Fx action catalogs through one anonymous, read-only Streamable HTTP endpoint at `/mcp`.

Light runs from a clone with no database, API keys or persistent volumes. For team snippets, publishing and access management, see [PAD MCP](https://github.com/ttiaMa/pad-mcp).

## Run locally with Docker Compose

```sh
git clone https://github.com/ttiaMa/pad-mcp-light.git
cd pad-mcp-light
docker compose -f compose.yaml -f compose.local.yaml up --build -d
curl http://localhost:8080/healthz
```

The health check returns `{"status":"ok"}`. In your MCP client, select **Streamable HTTP**, enter `http://localhost:8080/mcp` and leave authentication empty. Ask the assistant to find the Excel action for activating a cell in a Classic flow.

## Deploy from the repository

In Coolify, select **Docker Compose**, point the deployment at this repository and use `compose.yaml`. Set `PUBLIC_URL` to your external HTTPS origin (for example, `https://pad.example.com`) and route that domain to service `pad-mcp-light` on container port `8080`. Connect clients to `https://pad.example.com/mcp`.

On another Docker host, set the same `PUBLIC_URL` in a local `.env`, run `docker compose up --build -d`, and attach your HTTPS reverse proxy to the service network. Preserve the original Host header and disable proxy buffering on `/mcp` so streamed responses reach clients as they arrive. The base Compose file exposes the port inside the Docker network. The local override binds it to loopback for testing.

## The two tools

| Tool | Inputs and result |
| --- | --- |
| `get_development_context` | Call with `{}` to see the edition choices. Pass `power_fx` as `disabled` (Classic) or `enabled` (Power Fx) to get edition-specific guidance, catalog version and PAD build. |
| `search_actions` | Pass the selected `power_fx` with an English `query`, a case-insensitive exact `module`, or both. Returns up to five compact matches by default. Set `max_results` to 1–20. Use `action_id` instead of search terms to retrieve a complete record. |

For example, call `search_actions` with `{"power_fx":"disabled","module":"Excel","query":"activate cell"}`, then with `{"power_fx":"disabled","action_id":"Excel.ActivateCellInExcel.ActivateCell"}`. The full record includes the template, example, parameters and selector constraints. An unknown ID returns `{"record":null}`. Requests are stateless, so send the edition on each lookup.

## Develop locally

With Node.js 24 or newer, run `npm ci`, then `npm test` or `npm start`. The server binds to `127.0.0.1:8080` by default. Override `HOST` and `PORT` to change the listener and `PUBLIC_URL` to set the accepted public origin. The integration tests connect an MCP client over HTTP and exercise both catalog editions.

## Licenses

The server code uses the [MIT license](LICENSE). The two bundled action catalogs are by Joe Green and use CC BY 4.0. Their source revision and attribution are in the [catalog notice](catalogs/NOTICE.md).
