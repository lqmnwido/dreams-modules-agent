import { lstat, readdir, readFile, writeFile, mkdir, mkdtemp, rename, rm } from 'node:fs/promises';
import { resolve, join, dirname, parse, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

export const SKILL_NAMES = ['d-documents', 'd-frontend', 'd-backend', 'd-testing', 'd-manual'];
import { HARNESS_NAMES, HARNESS_REGISTRY, canonicalHarness, targetForHarness, listHarnesses } from './harnesses.mjs';
export { HARNESS_NAMES } from './harnesses.mjs';
const OWNER = 'dreams-modules-agent';
const MARKER = '.dreams-install.json';
const COMMAND_MARKER = '<!-- dreams-modules-agent:managed-command -->';
const SKILLS_SOURCE = fileURLToPath(new URL('../skills/', import.meta.url));
const DESCRIPTION = {
  'd-documents': 'D-ReAMS Phase 1 source documents and user locking',
  'd-frontend': 'D-ReAMS Phase 2 standalone frontend prototype',
  'd-backend': 'D-ReAMS Phase 3 Java backend and real API integration',
  'd-testing': 'D-ReAMS scoped testing and actual verification evidence',
  'd-manual': 'D-ReAMS verified user manual and handover',
};

export const HELP = `D-ReAMS portable skills installer (offline; no dependencies required)

Usage: node skills.js --cursor [options]
       node skills.js --codex [options]
       node skills.js --claude [options]
       node skills.js --opencode [options]
       node skills.js --gemini [options]
       node skills.js --harness <name> [--harness <name> ...] [options]
       node skills.js --all [options]
       node skills.js --dest <skills-directory> [options]

Targets: ${HARNESS_NAMES.length} registered adapters/directory targets, including Cursor, Gemini,
Copilot, Windsurf, Cline, Roo, Kilo, Continue, Augment, Amp, Goose, Kiro,
Qwen, OpenHands, Zed, and more. Use --list-harnesses for exact paths/sources.
A registered path is not proof of a live-tested harness or slash-command support.

Options:
  --harness <name>   Select a registry ID/alias; direct --<name> flags also work
  --all             All registered harnesses (project-only targets need --project)
  --project <path>   Install into that existing project instead of user home
  --dest <path>      Custom skills root; no wrappers; incompatible with --project,
                    --all or multiple harness selections
  --skill <name>     Select skill; repeat as needed (default: all five)
  --dry-run         Show destinations/actions without writing
  --force           Replace changed managed packages, including local edits;
                    never overwrite unowned packages/commands or follow symlinks
  --list            List bundled skills without installing
  --list-harnesses  List all targets, paths, evidence, sources and aliases
  --json            Machine-readable output for --list-harnesses only
  --help            Show this help

Existing identical files are left unchanged. Shared paths are deduplicated.
No settings, AGENTS, project code, locks, credentials or harness binaries change.
Codex uses $d-documents; Claude Code/Cursor use /d-documents; other invocation varies.
Refresh/restart your harness if required. Prefer selecting the harnesses you use;
--all is the dated registry snapshot, not every tool that exists.
`;

export function parseArgs(args) {
  const options = { harnesses: [], skills: [], force: false, dryRun: false };
  const values = new Set(['--project', '--dest', '--skill', '--harness']);
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg.startsWith('--') && canonicalHarness(arg.slice(2))) options.harnesses.push(canonicalHarness(arg.slice(2)));
    else if (arg === '--all') options.all = true;
    else if (arg === '--force') options.force = true;
    else if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--help') options.help = true;
    else if (arg === '--list') options.list = true;
    else if (arg === '--list-harnesses') options.listHarnesses = true;
    else if (arg === '--json') options.json = true;
    else if (values.has(arg)) {
      const value = args[++i];
      if (!value || value.startsWith('--')) throw Error(`${arg} requires a value.`);
      if (arg === '--skill') options.skills.push(value === 'd-dooc' ? 'd-documents' : value);
      else if (arg === '--harness') {
        const name = canonicalHarness(value);
        if (!name) throw Error(`Unknown harness: ${value}. Use --list-harnesses.`);
        options.harnesses.push(name);
      } else {
        const key = arg.slice(2);
        if (options[key]) throw Error(`${arg} was supplied twice.`);
        options[key] = value;
      }
    } else throw Error(`Unknown argument: ${arg}. Use --help.`);
  }
  options.explicitHarnesses = [...new Set(options.harnesses)];
  if (options.all) options.harnesses.push(...HARNESS_REGISTRY.harnesses.filter(entry => !entry.generic).map(entry => entry.id));
  options.harnesses = [...new Set(options.harnesses)];
  options.skills = options.skills.length ? [...new Set(options.skills)] : [...SKILL_NAMES];
  for (const name of options.skills) if (!SKILL_NAMES.includes(name)) throw Error(`Unknown skill: ${name}. Use --list.`);
  if (options.dest && (options.project || options.all || options.harnesses.length > 1)) throw Error('--dest cannot be combined with --project, --all or multiple harnesses.');
  if (!options.harnesses.length && !options.dest && !options.help && !options.list && !options.listHarnesses) throw Error('Choose --codex, --claude, --opencode, --agents, --all or --dest.');
  if (options.json && !options.listHarnesses) throw Error('--json requires --list-harnesses.');
  return options;
}

async function statMaybe(path) {
  try { return await lstat(path); } catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}

// Resolve lexically, then inspect every ancestor so copying cannot escape via a symlink.
export async function checkPath(path) {
  const absolute = resolve(path);
  const parts = [];
  for (let current = absolute; ; current = dirname(current)) {
    parts.push(current);
    if (current === parse(current).root) break;
  }
  for (const current of parts.reverse()) {
    const info = await statMaybe(current);
    if (!info) continue;
    if (info.isSymbolicLink()) throw Error(`Refusing symlink: ${current}`);
    if (current !== absolute && !info.isDirectory()) throw Error(`Not a directory: ${current}`);
  }
  return absolute;
}

async function readTree(root, prefix = '') {
  const result = new Map();
  for (const entry of await readdir(join(root, prefix), { withFileTypes: true })) {
    const name = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isSymbolicLink()) throw Error(`Refusing symlink inside skill: ${join(root, name)}`);
    if (entry.isDirectory()) for (const [key, value] of await readTree(root, name)) result.set(key, value);
    else if (entry.isFile()) result.set(name, await readFile(join(root, name)));
    else throw Error(`Unsupported skill entry: ${join(root, name)}`);
  }
  return result;
}

export function targetsFor(options, context = {}) {
  if (options.dest) return [{ harness: 'custom', skills: resolve(options.dest), invocation: 'discover' }];
  return options.harnesses.map(name => {
    const target = targetForHarness(name, { ...context, project: options.project });
    if (target.projectOnly && (!options.all || options.explicitHarnesses?.includes(name))) {
      throw Error(`${name} has no documented global skills directory. Use --project <existing-path> or --dest.`);
    }
    return target;
  });
}

function sameTree(a, b) {
  return a.size === b.size && [...a].every(([name, bytes]) => b.has(name) && bytes.equals(b.get(name)));
}

function commandFor(name) {
  return `---\ndescription: ${DESCRIPTION[name]}\n---\n\n${COMMAND_MARKER}\n\nLoad the Agent Skill named \`${name}\` with the skill tool and follow its instructions in the current module workspace.\n\nUser context: $ARGUMENTS\n\nIf the skill is unavailable, stop and report its missing installation. Do not guess its workflow. Respect phase locks, submodule selection and human acceptance; invocation does not authorize unknown database execution or deployment.\n`;
}

async function classify(operation, force) {
  await checkPath(operation.path);
  const info = await statMaybe(operation.path);
  if (!info) return 'create';
  if (operation.kind === 'directory') {
    if (!info.isDirectory()) throw Error(`Existing skill is not a directory: ${operation.path}`);
    const current = await readTree(operation.path);
    if (sameTree(current, operation.files)) return 'unchanged';
    let owner;
    try { owner = JSON.parse(current.get(MARKER)?.toString()); } catch { /* Unowned packages are preserved. */ }
    if (owner?.owner !== OWNER || owner?.skill !== operation.name) throw Error(`Unowned skill exists; preserved even with --force: ${operation.path}`);
  } else {
    if (!info.isFile()) throw Error(`Existing command is not a file: ${operation.path}`);
    const content = await readFile(operation.path);
    if (content.equals(operation.content)) return 'unchanged';
    if (!content.toString().includes(COMMAND_MARKER)) throw Error(`Unowned command exists; preserved even with --force: ${operation.path}`);
  }
  if (!force) throw Error(`Changed managed destination: ${operation.path}. Review it, then use --force to replace this package (including its local edits).`);
  return 'replace';
}

export async function createInstallPlan(options, context = {}) {
  if (options.project) {
    await checkPath(options.project);
    if (!(await statMaybe(resolve(options.project)))?.isDirectory()) throw Error('--project must name an existing directory.');
  }
  const source = context.source || SKILLS_SOURCE;
  const operations = new Map();
  const targets = targetsFor(options, context);
  for (const target of targets) {
    if (target.projectOnly) continue;
    for (const name of options.skills) {
      const sourcePath = join(source, name);
      await checkPath(sourcePath);
      const files = await readTree(sourcePath);
      const entry = files.get('SKILL.md')?.toString();
      if (!entry?.startsWith('---\n') || !entry.includes(`\nname: ${name}\n`)) throw Error(`Invalid bundled skill: ${name}`);
      files.set(MARKER, Buffer.from(`${JSON.stringify({ owner: OWNER, format: 1, skill: name }, null, 2)}\n`));
      const path = resolve(target.skills, name);
      if (relative(target.skills, path) !== name) throw Error('Invalid skill destination.');
      operations.set(path, { name, kind: 'directory', path, files });
      if (target.commands) {
        const commandPath = resolve(target.commands, `${name}.md`);
        operations.set(commandPath, { name, kind: 'file', path: commandPath, content: Buffer.from(commandFor(name)) });
      }
    }
  }
  // Preflight the entire selection before any write, including command collisions.
  for (const operation of operations.values()) operation.action = await classify(operation, options.force);
  return { targets, operations: [...operations.values()] };
}

async function applyOperation(operation, force) {
  const action = await classify(operation, force);
  if (action === 'unchanged') return action;
  await checkPath(dirname(operation.path));
  await mkdir(dirname(operation.path), { recursive: true });
  const stage = await mkdtemp(join(dirname(operation.path), '.dreams-skill-stage-'));
  const fresh = join(stage, 'new');
  const backup = join(stage, 'old');
  let backedUp = false;
  let installed = false;
  try {
    if (operation.kind === 'directory') {
      await mkdir(fresh);
      for (const [name, bytes] of operation.files) {
        const output = join(fresh, name);
        await mkdir(dirname(output), { recursive: true });
        await writeFile(output, bytes, { flag: 'wx' });
      }
    } else await writeFile(fresh, operation.content, { flag: 'wx' });
    // Recheck after staging; no unowned destination is replaced intentionally.
    const latest = await classify(operation, force);
    if (latest === 'unchanged') return latest;
    if (latest === 'replace') { await rename(operation.path, backup); backedUp = true; }
    await rename(fresh, operation.path);
    installed = true;
    return latest;
  } catch (error) {
    if (backedUp && !installed) {
      try { await rename(backup, operation.path); backedUp = false; }
      catch { throw Error(`${error.message}; restore the preserved backup at ${backup}.`); }
    }
    throw error;
  } finally {
    // Keep a backup if restoration failed. Successful replacements remove the old managed package.
    if (installed || !backedUp) await rm(stage, { recursive: true, force: true });
  }
}

export async function installSkills(options, context = {}) {
  const plan = await createInstallPlan(options, context);
  if (options.dryRun) return plan;
  for (const operation of plan.operations) operation.action = await applyOperation(operation, options.force);
  return plan;
}

export async function main(args = process.argv.slice(2)) {
  const options = parseArgs(args);
  if (options.help) { console.log(HELP); return; }
  if (options.listHarnesses) {
    const entries = listHarnesses();
    if (options.json) console.log(JSON.stringify({ checkedAt: HARNESS_REGISTRY.checkedAt, targets: entries }, null, 2));
    else for (const entry of entries) {
      console.log(`--${entry.harness}: ${entry.displayName} [${entry.evidence}]`);
      console.log(`  user: ${entry.skills || 'project-only; no documented global target'}`);
      console.log(`  project: ${entry.projectSkills}`);
      if (entry.aliases.length) console.log(`  aliases: ${entry.aliases.map(alias => `--${alias}`).join(', ')}`);
      for (const source of entry.sources) console.log(`  source: ${source}`);
    }
    return;
  }
  if (options.list) { for (const name of SKILL_NAMES) console.log(`${name}: ${DESCRIPTION[name]}`); return; }
  const plan = await installSkills(options);
  console.log(options.dryRun ? 'Dry run: no files written.' : 'Skill installation complete.');
  for (const operation of plan.operations) console.log(`${operation.action}: ${operation.path}`);
  for (const target of plan.targets) {
    if (target.projectOnly) console.log(`${target.harness}: skipped project-only target; use --project to install it.`);
    else if (target.invocation === 'dollar') console.log(`${target.harness}: use $d-documents, $d-frontend <submodule>, $d-backend <submodule>, $d-testing <submodule>, $d-manual <submodule> (or the skill selector).`);
    else if (target.invocation === 'slash' || target.invocation === 'opencode-command') console.log(`${target.harness}: use /d-documents, /d-frontend <submodule>, /d-backend <submodule>, /d-testing <submodule>, /d-manual <submodule>.`);
    else if (target.invocation === 'mention') console.log(`${target.harness}: use @d-documents, @d-frontend, @d-backend, @d-testing, @d-manual through the skill mention interface.`);
    else console.log(`${target.harness}: ask your agent to load skill d-documents, d-frontend, d-backend, d-testing or d-manual; do not assume /name commands are supported.`);
    if (target.evidence === 'registry') console.log(`  Registry-based path, not independently live-tested. Verify discovery in your installed ${target.displayName} version.`);
    for (const note of target.notes || []) console.log(`  ${note}`);
  }
  console.log('Start a new session if your harness does not refresh skills. No scaffolder, project settings, locks or database were changed.');
}
