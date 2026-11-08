import { readFileSync } from 'node:fs';

function tokens(value) {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
}

function readCatalog(filename) {
  const file = new URL('../catalogs/' + filename, import.meta.url);
  return JSON.parse(readFileSync(file, 'utf8'));
}

function load(suffix) {
  const { version, pad_build, actions, power_fx, error_handling } = readCatalog('PAD_Robin_ActionKB' + suffix + '.json');
  const { types, rules } = readCatalog('PAD_Robin_TypeReference' + suffix + '.json');
  const index = actions.map(record => {
    const params = [...record.input_params, ...record.output_params];
    const fields = [record.actionId, record.module, record.description, ...params.flatMap(p => [p.name, p.type])];
    return { id: record.actionId, record, words: new Set(tokens(fields.join(' '))) };
  });
  return {
    context: { version, pad_build, action_count: actions.length, error_handling, value_syntax: power_fx, type_rules: rules },
    index,
    types: types.map(record => ({
      id: record.type, record, words: new Set(tokens([record.type, record.category, record.description].join(' ')))
    }))
  };
}

export const catalogs = {
  disabled: load(''),
  enabled: load('_PowerFx')
};

function rankedPage(index, query, maxResults, preview) {
  const terms = [...new Set(tokens(query ?? ''))];
  const matches = [];
  for (const { id, record, words } of index) {
    const exact = id.toLowerCase() === query?.toLowerCase();
    const score = exact ? Infinity : terms.filter(term => words.has(term)).length;
    if (!query || score > 0) matches.push({ id, record, score });
  }
  matches.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id, 'en'));
  return {
    total_matches: matches.length,
    truncated: matches.length > maxResults,
    results: matches.slice(0, maxResults).map(({ record }) => preview(record))
  };
}

export function searchActions({ power_fx, action_id, query, module, max_results }) {
  const { index } = catalogs[power_fx];
  if (action_id) {
    const record = index.find(item => item.id === action_id)?.record;
    if (!record) return { record: null };
    const { validation, ...detail } = record;
    return { record: detail };
  }
  const candidates = module ? index.filter(({ record }) => record.module.toLowerCase() === module.toLowerCase()) : index;
  return rankedPage(candidates, query, max_results, record => ({
      actionId: record.actionId, module: record.module, kind: record.kind, selector: record.selector,
      input_names: record.input_params.map(p => p.name), output_names: record.output_params.map(p => p.name),
      needs_ui_selector: record.needs_ui_selector
  }));
}

export function searchTypes({ power_fx, type_name, query, max_results }) {
  const { types } = catalogs[power_fx];
  if (type_name) return { record: types.find(item => item.id === type_name)?.record ?? null };
  return rankedPage(types, query, max_results, ({ type, category, description }) => ({ type, category, description }));
}
