import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, mkdir, readdir, symlink, lstat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { SKILL_NAMES, parseArgs, targetsFor, installSkills } from '../lib/skills.mjs';
import { HARNESS_REGISTRY, HARNESS_NAMES, canonicalHarness } from '../lib/harnesses.mjs';

const temporary = () => mkdtemp(join(tmpdir(), 'dreams-skills-test-'));
const source = fileURLToPath(new URL('../skills/', import.meta.url));
const cli = fileURLToPath(new URL('../skills.js', import.meta.url));
const exists = async path => { try { await lstat(path); return true; } catch (error) { if (error.code === 'ENOENT') return false; throw error; } };

async function assertPortableReferences(skillRoot, directory = skillRoot) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await assertPortableReferences(skillRoot, path);
    else if (entry.isFile() && entry.name.endsWith('.md')) {
      const body = await readFile(path, 'utf8');
      for (const [, link] of body.matchAll(/\]\(([^)]+)\)/g)) {
        if (/^(?:https?:|#)/.test(link)) continue;
        const target = resolve(dirname(path), link.split('#')[0]);
        const within = relative(skillRoot, target);
        assert.ok(within !== '..' && !within.startsWith('../'), `Reference escapes skill: ${path} -> ${link}`);
        assert.equal(await exists(target), true, `Missing bundled reference: ${path} -> ${link}`);
      }
    }
  }
}

test('skill CLI validates choices and rejects ambiguous or traversal arguments', () => {
  assert.throws(() => parseArgs([]), /Choose/);
  assert.throws(() => parseArgs(['--unknown']), /Unknown argument/);
  assert.throws(() => parseArgs(['--codex', '--project']), /requires a value/);
  assert.throws(() => parseArgs(['--codex', '--skill', '../outside']), /Unknown skill/);
  assert.throws(() => parseArgs(['--all', '--dest', '/tmp/skills']), /multiple harnesses/);
  assert.throws(() => parseArgs(['--dest', '/tmp/skills', '--project', '/tmp/project']), /cannot be combined/);
  assert.deepEqual(parseArgs(['--codex', '--codex']).harnesses, ['codex']);
  assert.equal(parseArgs(['--help']).help, true);
  assert.deepEqual(parseArgs(['--codex', '--skill', 'd-dooc']).skills, ['d-documents']);
});

test('target resolution distinguishes global/project roots and honors OpenCode XDG config', () => {
  const home = resolve('fake-user-home');
  const config = resolve('fake-xdg');
  const targets = targetsFor(parseArgs(['--codex', '--claude', '--opencode']), { home, env: { XDG_CONFIG_HOME: config } });
  assert.equal(targets[0].skills, join(home, '.agents', 'skills'));
  assert.equal(targets[1].skills, join(home, '.claude', 'skills'));
  assert.equal(targets[2].commands, join(config, 'opencode', 'commands'));
  const project = resolve('project');
  const local = targetsFor(parseArgs(['--opencode', '--project', project]), { home, env: {} });
  assert.equal(local[0].skills, join(project, '.opencode', 'skills'));
  assert.equal(local[0].commands, join(project, '.opencode', 'commands'));
});

test('dry run writes no target directories and shared Codex/agents target is deduplicated', async () => {
  const home = await temporary();
  const plan = await installSkills(parseArgs(['--codex', '--agents', '--dry-run']), { home, env: {} });
  assert.equal(plan.operations.length, 3);
  assert.deepEqual(await readdir(home), []);
  assert.ok(plan.operations.every(operation => operation.action === 'create'));
});

test('original three adapters retain self-contained skills and OpenCode slash wrappers', async () => {
  const project = await temporary();
  const plan = await installSkills(parseArgs(['--codex', '--claude', '--opencode', '--project', project]));
  assert.equal(plan.operations.length, 12);
  for (const directory of ['.agents/skills', '.claude/skills', '.opencode/skills']) {
    for (const name of SKILL_NAMES) {
      const installed = join(project, directory, name);
      assert.equal(await readFile(join(installed, 'SKILL.md'), 'utf8'), await readFile(join(source, name, 'SKILL.md'), 'utf8'));
      assert.equal(JSON.parse(await readFile(join(installed, '.dreams-install.json'), 'utf8')).skill, name);
      assert.equal(JSON.parse(await readFile(join(installed, '.dreams-install.json'), 'utf8')).owner, 'dreams-modules-agent');
      await assertPortableReferences(installed);
      const body = await readFile(join(installed, 'SKILL.md'), 'utf8');
      for (const [, link] of body.matchAll(/\]\((references\/[^)]+)\)/g)) {
        assert.equal(await exists(join(installed, link)), true, link);
      }
    }
  }
  for (const name of SKILL_NAMES) {
    const wrapper = await readFile(join(project, '.opencode/commands', `${name}.md`), 'utf8');
    assert.ok(wrapper.includes(`\`${name}\``));
    assert.ok(wrapper.includes('$ARGUMENTS'));
  }
  assert.equal(await exists(join(project, 'AGENTS.md')), false);
  assert.equal(await exists(join(project, '.opencode/opencode.json')), false);
  assert.ok(!(await readdir(join(project, '.agents/skills'))).some(name => name.startsWith('.dreams-skill-stage-')));
});

test('repeat installation is unchanged; managed local edits require explicit force', async () => {
  const project = await temporary();
  const options = parseArgs(['--codex', '--project', project]);
  await installSkills(options);
  const again = await installSkills(options);
  assert.ok(again.operations.every(operation => operation.action === 'unchanged'));
  const file = join(project, '.agents/skills/d-frontend/SKILL.md');
  await writeFile(file, 'Local user edit\n');
  await assert.rejects(installSkills(options), /Changed managed destination/);
  assert.equal(await readFile(file, 'utf8'), 'Local user edit\n');
  const forced = await installSkills({ ...options, force: true });
  assert.equal(forced.operations.find(operation => operation.name === 'd-frontend').action, 'replace');
  assert.equal(await readFile(file, 'utf8'), await readFile(join(source, 'd-frontend/SKILL.md'), 'utf8'));
});

test('unowned skill collision is preserved even with force before any other skills are written', async () => {
  const project = await temporary();
  const collision = join(project, '.claude/skills/d-backend');
  await mkdir(collision, { recursive: true });
  await writeFile(join(collision, 'SKILL.md'), 'Existing unrelated skill\n');
  await assert.rejects(installSkills(parseArgs(['--claude', '--project', project, '--force'])), /Unowned skill/);
  assert.equal(await exists(join(project, '.claude/skills/d-documents')), false);
  assert.equal(await readFile(join(collision, 'SKILL.md'), 'utf8'), 'Existing unrelated skill\n');
});

test('unowned OpenCode slash command blocks all writes and is not overwritten by force', async () => {
  const project = await temporary();
  const commands = join(project, '.opencode/commands');
  await mkdir(commands, { recursive: true });
  await writeFile(join(commands, 'd-documents.md'), 'User command\n');
  await assert.rejects(installSkills(parseArgs(['--opencode', '--project', project, '--force'])), /Unowned command/);
  assert.equal(await exists(join(project, '.opencode/skills')), false);
  assert.equal(await readFile(join(commands, 'd-documents.md'), 'utf8'), 'User command\n');
});

test('symlinked destination ancestors and skill entries are rejected without following them', async t => {
  if (process.platform === 'win32') { t.skip('Symlink creation requires local Windows privileges.'); return; }
  const project = await temporary();
  const outside = await temporary();
  await symlink(outside, join(project, '.agents'), 'dir');
  await assert.rejects(installSkills(parseArgs(['--codex', '--project', project])), /Refusing symlink/);
  assert.deepEqual(await readdir(outside), []);
  const second = await temporary();
  const options = parseArgs(['--codex', '--project', second]);
  await installSkills(options);
  await symlink(outside, join(second, '.agents/skills/d-documents/external'), 'dir');
  await assert.rejects(installSkills({ ...options, force: true }), /Refusing symlink inside skill/);
  assert.deepEqual(await readdir(outside), []);
});

test('custom destination installs selected portable skill only; CLI works outside the repository', async () => {
  const cwd = await temporary();
  const destination = join(cwd, 'portable skills');
  const result = spawnSync(process.execPath, [cli, '--dest', destination, '--skill', 'd-frontend'], { cwd, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(await readdir(destination), ['d-frontend']);
  assert.equal(await exists(join(cwd, 'commands')), false);
  assert.ok(result.stdout.includes('custom:'));
  const help = spawnSync(process.execPath, [cli, '--help'], { cwd, encoding: 'utf8' });
  assert.equal(help.status, 0);
  assert.ok(help.stdout.includes('--codex'));
  const list = spawnSync(process.execPath, [cli, '--list'], { cwd, encoding: 'utf8' });
  assert.equal(list.status, 0);
  for (const name of SKILL_NAMES) assert.ok(list.stdout.includes(`${name}:`));
});


test('extended flags, aliases and --harness select documented target IDs', () => {
  assert.deepEqual(parseArgs(['--cursor', '--gemini', '--copilot', '--harness', 'roo-code']).harnesses, ['cursor', 'gemini-cli', 'github-copilot', 'roo']);
  assert.deepEqual(parseArgs(['--claude-code', '--claude']).harnesses, ['claude']);
  assert.throws(() => parseArgs(['--harness', 'unknown-agent']), /Unknown harness/);
  assert.throws(() => parseArgs(['--codex', '--json']), /requires --list-harnesses/);
  assert.equal(parseArgs(['--list-harnesses', '--json']).listHarnesses, true);
  assert.equal(new Set(HARNESS_NAMES).size, HARNESS_NAMES.length);
  for (const [alias, canonical] of Object.entries(HARNESS_REGISTRY.aliases)) assert.equal(canonicalHarness(alias), canonical);
});

test('vendor-confirmed Cursor, Gemini, Copilot, Cline and Windsurf use their native roots', () => {
  const home = resolve('test-home');
  const cases = [
    ['cursor', '.cursor/skills', '.cursor/skills'],
    ['gemini', '.gemini/skills', '.gemini/skills'],
    ['copilot', '.copilot/skills', '.github/skills'],
    ['cline', '.cline/skills', '.cline/skills'],
    ['windsurf', '.codeium/windsurf/skills', '.windsurf/skills'],
  ];
  for (const [flag, globalPath, localPath] of cases) {
    const [global] = targetsFor(parseArgs([`--${flag}`]), { home, env: {} });
    assert.equal(global.skills, join(home, globalPath));
    assert.equal(global.evidence, 'vendor-docs');
    const [local] = targetsFor(parseArgs([`--${flag}`, '--project', home]), { home, env: {} });
    assert.equal(local.skills, join(home, localPath));
  }
});

test('registry-backed profiles honor documented config and profile-root overrides', () => {
  const home = resolve('home');
  const config = resolve('config');
  const claudeRoot = resolve('custom-claude');
  const vibeRoot = resolve('custom-vibe');
  const env = { XDG_CONFIG_HOME: config, CLAUDE_CONFIG_DIR: claudeRoot, VIBE_HOME: vibeRoot };
  assert.equal(targetsFor(parseArgs(['--claude']), { home, env })[0].skills, join(claudeRoot, 'skills'));
  assert.equal(targetsFor(parseArgs(['--mistral-vibe']), { home, env })[0].skills, join(vibeRoot, 'skills'));
  assert.equal(targetsFor(parseArgs(['--goose']), { home, env })[0].skills, join(config, 'goose/skills'));
});

test('project-only targets require a project while global --all reports skips without inventing paths', async () => {
  const home = await temporary();
  for (const entry of HARNESS_REGISTRY.harnesses.filter(candidate => !candidate.userSkills)) {
    await assert.rejects(installSkills(parseArgs([`--${entry.id}`]), { home, env: {} }), /no documented global/);
    const project = await temporary();
    const plan = await installSkills(parseArgs([`--${entry.id}`, '--project', project, '--skill', 'd-frontend']));
    assert.equal(plan.operations.length, 1);
    assert.equal(await exists(join(project, entry.projectSkills, 'd-frontend/SKILL.md')), true);
  }
  const plan = await installSkills(parseArgs(['--all', '--dry-run', '--skill', 'd-frontend']), { home, env: {} });
  assert.ok(plan.targets.some(target => target.projectOnly));
  assert.ok(plan.operations.every(operation => typeof operation.path === 'string' && !operation.path.includes('undefined')));
  assert.deepEqual(await readdir(home), []);
});

test('all registered project adapters install once per distinct destination with no settings edits', async () => {
  const project = await temporary();
  const options = parseArgs(['--all', '--project', project, '--skill', 'd-frontend']);
  const plan = await installSkills(options, { env: {} });
  const directories = new Set(HARNESS_REGISTRY.harnesses.filter(entry => !entry.generic).map(entry => resolve(project, entry.projectSkills, 'd-frontend')));
  assert.equal(plan.operations.filter(operation => operation.kind === 'directory').length, directories.size);
  assert.equal(plan.operations.filter(operation => operation.kind === 'file').length, 1);
  for (const path of directories) {
    assert.equal(await readFile(join(path, 'SKILL.md'), 'utf8'), await readFile(join(source, 'd-frontend/SKILL.md'), 'utf8'));
    await assertPortableReferences(path);
  }
  for (const path of ['AGENTS.md', 'CLAUDE.md', '.cursor/settings.json', '.gemini/settings.json', '.opencode/opencode.json']) assert.equal(await exists(join(project, path)), false);
  const again = await installSkills(options, { env: {} });
  assert.ok(again.operations.every(operation => operation.action === 'unchanged'));
});

test('harness list JSON exposes complete path/provenance inventory without writing', async () => {
  const cwd = await temporary();
  const result = spawnSync(process.execPath, [cli, '--list-harnesses', '--json'], { cwd, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  const inventory = JSON.parse(result.stdout);
  assert.equal(inventory.targets.length, HARNESS_NAMES.length);
  for (const target of inventory.targets) {
    assert.ok(target.sources.length && target.sources.every(url => url.startsWith('https://')));
    assert.ok(target.projectSkills);
    assert.ok(target.skills || target.projectOnly);
  }
  assert.deepEqual(await readdir(cwd), []);
});
