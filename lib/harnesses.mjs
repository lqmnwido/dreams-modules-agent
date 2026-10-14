import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { resolve, join } from 'node:path';

// Offline location snapshot, not copied harness detection/execution code.
export const HARNESS_REGISTRY = JSON.parse(readFileSync(new URL('./harnesses.json', import.meta.url), 'utf8'));
export const HARNESS_NAMES = HARNESS_REGISTRY.harnesses.map(entry => entry.id);
export const HARNESS_ALIASES = HARNESS_REGISTRY.aliases;

export function canonicalHarness(name) {
  const canonical = HARNESS_ALIASES[name] || name;
  return HARNESS_NAMES.includes(canonical) ? canonical : null;
}

export function targetForHarness(name, { project, home = homedir(), env = process.env } = {}) {
  const canonical = canonicalHarness(name);
  const entry = HARNESS_REGISTRY.harnesses.find(candidate => candidate.id === canonical);
  if (!entry) throw Error(`Unknown harness: ${name}. Use --list-harnesses.`);
  const target = { harness: canonical, displayName: entry.displayName, evidence: entry.evidence, sources: entry.sources, invocation: entry.invocation, notes: entry.notes || [] };
  if (project) target.skills = resolve(project, entry.projectSkills);
  else if (!entry.userSkills) return { ...target, projectOnly: true };
  else {
    const spec = entry.userSkills;
    const config = env.XDG_CONFIG_HOME?.trim() ? resolve(env.XDG_CONFIG_HOME.trim()) : join(home, '.config');
    const override = spec.env && env[spec.env]?.trim();
    target.skills = override ? join(resolve(override), spec.envSuffix) : join(spec.base === 'config' ? config : home, spec.path);
  }
  if (canonical === 'opencode') target.commands = join(target.skills, '..', 'commands');
  return target;
}

export function listHarnesses(context = {}) {
  return HARNESS_NAMES.map(name => {
    const global = targetForHarness(name, context);
    const local = targetForHarness(name, { ...context, project: context.project || '<project>' });
    const entry = HARNESS_REGISTRY.harnesses.find(candidate => candidate.id === name);
    return { ...global, projectSkills: entry.projectSkills, projectCommands: local.commands && '.opencode/commands', aliases: Object.keys(HARNESS_ALIASES).filter(alias => HARNESS_ALIASES[alias] === name) };
  });
}
