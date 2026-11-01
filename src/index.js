import { createListener } from './http.js';

const port = Number(process.env.PORT ?? 8080);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid PORT.');
const publicUrl = process.env.PUBLIC_URL ?? 'http://localhost:' + port;
const listener = createListener(publicUrl, Number(process.env.MCP_CALL_RATE_LIMIT_PER_MINUTE ?? 200));
listener.listen(port, process.env.HOST ?? '127.0.0.1', () => {
  console.log('pad-mcp-lite ready at ' + new URL('/mcp', publicUrl));
});
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => listener.close());
}
