import { createServer as createHttpServer } from 'node:http';
import { createMcpHandler } from '@modelcontextprotocol/server';
import { toNodeHandler } from '@modelcontextprotocol/node';
import { createServer } from './tools.js';
import { createRateLimit } from './rate-limit.js';

export function createListener(publicUrl, callsPerMinute = 200) {
  const retryAfter = createRateLimit(callsPerMinute);
  const origin = new URL(publicUrl);
  if (!['https:', 'http:'].includes(origin.protocol) || origin.href !== origin.origin + '/') {
    throw new Error('PUBLIC_URL must be an HTTP(S) origin without a path or credentials.');
  }
  const localHost = /^(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/;
  const mcp = createMcpHandler(createServer, { legacy: 'stateless', responseMode: 'sse' });
  const handle = toNodeHandler(mcp, { maxRequestBodySize: 64 * 1024, onerror: console.error });
  const listener = createHttpServer((req, res) => {
    if (req.url === '/healthz' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' }).end('{"status":"ok"}');
      return;
    }
    if (req.url !== '/mcp') return res.writeHead(404).end();
    if ((req.headers.host !== origin.host && !localHost.test(req.headers.host)) || (req.headers.origin !== undefined && req.headers.origin !== origin.origin)) {
      return res.writeHead(403).end('Host or Origin not allowed.');
    }
    if (req.method !== 'POST') return res.writeHead(405, { Allow: 'POST' }).end();
    const seconds = retryAfter();
    if (seconds) return res.writeHead(429, { 'Retry-After': seconds }).end('MCP request limit reached.');
    return handle(req, res);
  });
  listener.once('close', () => mcp.close().catch(console.error));
  return listener;
}
