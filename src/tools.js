import { McpServer } from '@modelcontextprotocol/server';
import { z } from 'zod';
import pkg from '../package.json' with { type: 'json' };
import { catalogs, searchActions, searchTypes } from './catalog.js';
import { readFileSync } from 'node:fs';

const readPrompt = name => readFileSync(new URL('./prompts/' + name + '.md', import.meta.url), 'utf8').trim();
const common = readPrompt('common');
const modes = { disabled: readPrompt('classic'), enabled: readPrompt('power-fx') };

const edition = z.enum(['disabled', 'enabled']);
const instructions = 'Ask the user to choose PAD Classic (disabled) or Power Fx (enabled). Call get_development_context with that choice and reuse power_fx for every action and type lookup.';
const annotations = { readOnlyHint: true, openWorldHint: false, destructiveHint: false };
const result = data => ({ content: [{ type: 'text', text: JSON.stringify(data) }] });
const optionalText = max => z.string().trim().min(1).max(max).optional();
const lookup = { power_fx: edition, query: optionalText(500), max_results: z.number().int().min(1).max(20).default(5) };

export function createServer() {
  const server = new McpServer({ name: pkg.name, version: pkg.version }, { instructions });
  server.registerTool('get_development_context', {
    description: 'Select an edition and get Robin authoring guidance. Omit power_fx to see the choices.',
    inputSchema: z.strictObject({ power_fx: edition.optional() }), annotations
  }, ({ power_fx }) => {
    if (!power_fx) return result({ status: 'selection_required', instructions });
    return result({
      power_fx, catalog: catalogs[power_fx].context,
      guidance: [common, modes[power_fx]]
    });
  });
  server.registerTool('search_actions', {
    description: 'Find actions by English query and/or exact module, or supply an exact action_id alone for its full catalog record.',
    inputSchema: z.strictObject({
      ...lookup, module: optionalText(100), action_id: optionalText(300)
    }), annotations
  }, args => {
    if (Boolean(args.action_id) === Boolean(args.query || args.module)) {
      return { isError: true, content: [{ type: 'text', text: 'Supply action_id alone, or query and/or module.' }] };
    }
    return result(searchActions(args));
  });
  server.registerTool('search_type_reference', {
    description: 'Find PAD parameter types by English query, or supply an exact type_name (including generic notation) for syntax and examples.',
    inputSchema: z.strictObject({ ...lookup, type_name: optionalText(300) }), annotations
  }, args => {
    if (Boolean(args.type_name) === Boolean(args.query)) {
      return { isError: true, content: [{ type: 'text', text: 'Supply either type_name or query.' }] };
    }
    return result(searchTypes(args));
  });
  return server;
}
