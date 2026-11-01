import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import { createListener } from '../src/http.js';
import { createRateLimit } from '../src/rate-limit.js';

test('rolling budget releases requests individually after 60 seconds', () => {
  let time = 0;
  const retry = createRateLimit(2, () => time);
  assert.equal(retry(), 0);
  time = 5000;
  assert.equal(retry(), 0);
  assert.equal(retry(), 55);
  time = 60_000;
  assert.equal(retry(), 0);
  assert.equal(retry(), 5);
  assert.throws(() => createRateLimit(0), /positive integer/);
});

test('anonymous POSTs share a limit and health checks remain available', async t => {
  const listener = createListener('https://pad.example', 1);
  listener.listen(0, '127.0.0.1');
  await once(listener, 'listening');
  t.after(() => new Promise(resolve => listener.close(resolve)));
  const base = 'http://127.0.0.1:' + listener.address().port;
  await fetch(base + '/mcp', { method: 'POST' });
  const blocked = await fetch(base + '/mcp', { method: 'POST', headers: { 'X-Forwarded-For': '192.0.2.1' } });
  assert.equal(blocked.status, 429);
  assert.ok(Number(blocked.headers.get('Retry-After')) > 0);
  assert.equal((await fetch(base + '/healthz')).status, 200);
});

for (const mode of ['legacy', { pin: '2026-07-28' }]) {
  test('anonymous Streamable HTTP using ' + JSON.stringify(mode), async t => {
    const listener = createListener('https://pad.example');
    listener.listen(0, '127.0.0.1');
    await once(listener, 'listening');
    t.after(() => new Promise(resolve => listener.close(resolve)));
    const endpoint = new URL('http://127.0.0.1:' + listener.address().port + '/mcp');
    const client = new Client({ name: 'test', version: '1' }, { versionNegotiation: { mode } });
    await client.connect(new StreamableHTTPClientTransport(endpoint));
    t.after(() => client.close());
    assert.equal((await fetch(endpoint, { method: 'POST', headers: { Origin: 'https://other.example' } })).status, 403);
    assert.equal((await fetch(endpoint)).status, 405);
    assert.equal((await fetch(new URL('/healthz', endpoint))).status, 200);
    const names = (await client.listTools()).tools.map(tool => tool.name).sort();
    assert.deepEqual(names, ['get_development_context', 'search_actions']);
    const call = async (name, args) => {
      const reply = await client.callTool({ name, arguments: args });
      assert.ok(!reply.isError, reply.content[0].text);
      return JSON.parse(reply.content[0].text);
    };
    assert.equal((await call(names[0], {})).status, 'selection_required');
    for (const power_fx of ['enabled', 'disabled']) {
      const context = await call(names[0], { power_fx });
      assert.equal(context.power_fx, power_fx);
      assert.equal(Boolean(context.catalog.value_syntax), power_fx === 'enabled');
      const matches = await call(names[1], { power_fx, query: 'activate cell', module: 'Excel', max_results: 1 });
      assert.equal(matches.results.length, 1);
      assert.equal(matches.truncated, true);
      const action_id = matches.results[0].actionId;
      const { record } = await call(names[1], { power_fx, action_id });
      assert.equal(record.actionId, action_id);
      assert.ok(record.golden_example);
      assert.equal((await call(names[1], { power_fx, action_id: 'Missing.Action' })).record, null);
      assert.ok((await client.callTool({ name: names[1], arguments: { power_fx, action_id, query: 'cell' } })).isError);
    }
  });
}
