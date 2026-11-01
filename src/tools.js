import { McpServer } from '@modelcontextprotocol/server';
import { z } from 'zod';
import pkg from '../package.json' with { type: 'json' };
import { catalogs, searchActions } from './catalog.js';

const edition = z.enum(['disabled', 'enabled']);
const instructions = 'Ask the user to choose PAD Classic (disabled) or Power Fx (enabled). Call get_development_context with that choice and reuse power_fx for every action lookup.';
const annotations = { readOnlyHint: true, openWorldHint: false, destructiveHint: false };
const result = data => ({ content: [{ type: 'text', text: JSON.stringify(data) }] });
const optionalText = max => z.string().trim().min(1).max(max).optional();

export function createServer() {
  const server = new McpServer({ name: pkg.name, version: pkg.version }, { instructions });
  server.registerTool('get_development_context', {
    description: 'Select an edition and get Robin authoring guidance. Omit power_fx to see the choices.',
    inputSchema: z.strictObject({ power_fx: edition.optional() }), annotations
  }, ({ power_fx }) => {
    if (!power_fx) return result({ status: 'selection_required', instructions });
    return result({
      power_fx, catalog: catalogs[power_fx].context,
      guidance: [
        power_fx === 'enabled' ? 'Start from Power Fx golden examples and follow value_syntax.' :
          'Start from Classic golden examples. Use bare variables in expressions and percent interpolation inside text.',
        'Search by English keyword or module, then fetch the exact action_id. Preserve the selector, argument names, and output bindings.',
        'Replace recorded UI placeholders with elements from the target flow. Test the composed Robin in PAD with real inputs.'
      ]
    });
  });
  server.registerTool('search_actions', {
    description: 'Find actions by English query and/or exact module, or supply an exact action_id alone for its full catalog record.',
    inputSchema: z.strictObject({
      power_fx: edition, query: optionalText(500), module: optionalText(100),
      action_id: optionalText(300), max_results: z.number().int().min(1).max(20).default(5)
    }), annotations
  }, args => {
    if (Boolean(args.action_id) === Boolean(args.query || args.module)) {
      return { isError: true, content: [{ type: 'text', text: 'Supply action_id alone, or query and/or module.' }] };
    }
    return result(searchActions(args));
  });
  return server;
}
