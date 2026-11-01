import { readFileSync } from 'node:fs';

function tokens(value) {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
}

function load(filename) {
  const file = new URL('../catalogs/' + filename, import.meta.url);
  const { version, pad_build, actions, power_fx, error_handling } = JSON.parse(readFileSync(file, 'utf8'));
  const index = actions.map(record => {
    const params = [...record.input_params, ...record.output_params];
    const fields = [record.actionId, record.module, record.description, ...params.flatMap(p => [p.name, p.type])];
    return { record, words: new Set(tokens(fields.join(' '))) };
  });
  return {
    context: { version, pad_build, action_count: actions.length, error_handling, value_syntax: power_fx },
    index
  };
}

export const catalogs = {
  disabled: load('PAD_Robin_ActionKB.json'),
  enabled: load('PAD_Robin_ActionKB_PowerFx.json')
};

export function searchActions({ power_fx, action_id, query, module, max_results }) {
  const { index } = catalogs[power_fx];
  if (action_id) return { record: index.find(({ record }) => record.actionId === action_id)?.record ?? null };

  const terms = [...new Set(tokens(query ?? ''))];
  const matches = [];
  for (const { record, words } of index) {
    if (module && record.module.toLowerCase() !== module.toLowerCase()) continue;
    const exact = record.actionId.toLowerCase() === query?.toLowerCase();
    const score = exact ? Infinity : terms.filter(term => words.has(term)).length;
    if (!query || score > 0) matches.push({ record, score });
  }
  matches.sort((a, b) => b.score - a.score || a.record.actionId.localeCompare(b.record.actionId, 'en'));
  return {
    total_matches: matches.length,
    truncated: matches.length > max_results,
    results: matches.slice(0, max_results).map(({ record }) => ({
      actionId: record.actionId, module: record.module, kind: record.kind, selector: record.selector,
      input_names: record.input_params.map(p => p.name), output_names: record.output_params.map(p => p.name),
      needs_ui_selector: record.needs_ui_selector
    }))
  };
}
