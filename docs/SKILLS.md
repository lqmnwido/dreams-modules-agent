# D-ReAMS phase skills

Install once, then invoke a phase skill instead of pasting the long prompts. Skills carry their own instructions and references; the installer does not change the module scaffolder, project settings, locks or credentials.

## Install

From the `dreams-modules-agent` checkout:

```bash
node skills.js --codex
node skills.js --claude
node skills.js --opencode
node skills.js --cursor
node skills.js --gemini
node skills.js --copilot
node skills.js --windsurf
```

Choose the harness you use; running every example line is not required. For all 79 named registry targets (review destinations first):

```bash
node skills.js --all --dry-run
# After reviewing the destinations:
node skills.js --all
```

Default is user-wide installation. Preview before writing:

```bash
node skills.js --codex --dry-run
node skills.js --list
node skills.js --help
node skills.js --list-harnesses
node skills.js --list-harnesses --json
```

Project-only installation, using an existing project directory:

```bash
node skills.js --codex --project /path/to/module-workspace
node skills.js --claude --project /path/to/module-workspace
node skills.js --opencode --project /path/to/module-workspace
```

Install just one skill, or repeat `--skill` to select several:

```bash
node skills.js --codex --skill d-frontend
```

If the installer reports changed **managed** packages, review local edits before updating:

```bash
node skills.js --codex --dry-run --force
node skills.js --codex --force
```

`--force` replaces the selected previously managed package including local edits. It never overwrites an unowned skill/command. Identical packages are left unchanged. Keep local customizations under a different skill name if you need to preserve them. Do not run concurrent installers against the same destination.

## Available harnesses

The installer now includes 79 named harness targets plus portable `--agents`. See the complete [harness/path/evidence matrix](HARNESS-SUPPORT.md). Direct flags and `--harness NAME` both work; aliases include `--gemini`, `--copilot`, `--roo-code`, `--kilo-code`, `--qwen` and `--kiro`.

Only vendor-docs entries have additional vendor-path verification; other entries are registry-based adapters, not live-tested harnesses. This does not promise all tools that exist.

## Invocation

| Phase | Codex native invocation | Claude Code / OpenCode / Cursor / Cline |
| --- | --- | --- |
| 1: source documents, confirmation, request user locking | `$d-documents` | `/d-documents` |
| 2: one standalone frontend prototype | `$d-frontend attendance` | `/d-frontend attendance` |
| 3: one Java backend and real integration | `$d-backend attendance` | `/d-backend attendance` |
| Scoped verification and TESTING evidence | `$d-testing attendance` | `/d-testing attendance` |
| Verified USERMANUAL and handover | `$d-manual attendance` | `/d-manual attendance` |

`attendance` is an example; use an actual scope submodule. `d-documents` is the document-phase skill; legacy installer selection `--skill d-dooc` resolves to it. Existing installed d-dooc copies are not automatically removed. The user still answers unresolved decisions, locks Phase 1 files, accepts each interface and authorizes any real database target execution. Installing or invoking a skill is not acceptance of its results.

Start or refresh the harness session if the new skill is not visible. Codex also offers its skill selector; it does not use arbitrary `/d-*` commands simply because a skill directory exists. OpenCode receives explicit command wrappers that load the named skill and pass `$ARGUMENTS`. Claude Code exposes the skill itself as a slash command.

## Original adapter locations

The full current list, including Cursor, Gemini, Copilot, Windsurf and the remaining adapters, is in [HARNESS-SUPPORT.md](HARNESS-SUPPORT.md).

| Flag | User scope | `--project /path` |
| --- | --- | --- |
| `--codex` | `~/.agents/skills/<name>/` | `/path/.agents/skills/<name>/` |
| `--claude` | `~/.claude/skills/<name>/` | `/path/.claude/skills/<name>/` |
| `--opencode` | `~/.config/opencode/skills/<name>/` and sibling `commands/<name>.md` | `/path/.opencode/skills/<name>/` and sibling `commands/<name>.md` |
| `--agents` | `~/.agents/skills/<name>/` | `/path/.agents/skills/<name>/` |

OpenCode uses `$XDG_CONFIG_HOME/opencode` when `XDG_CONFIG_HOME` is set. `--agents` is the portable Agent Skills directory, not an assertion that every harness reads it. OpenCode can also discover `.agents` and `.claude` skills; installing to several recognized locations may expose duplicate names. Prefer one scope/harness installation where possible.

Paths/invocation conventions follow the official [Codex skill documentation](https://learn.chatgpt.com/docs/build-skills), [Claude Code skills documentation](https://code.claude.com/docs/en/skills), and [OpenCode skills](https://opencode.ai/docs/skills/) / [custom commands](https://opencode.ai/docs/commands/) documentation. Harness version, trust and administrator policy can affect discovery.

## Other harnesses and older installations

These are standard `SKILL.md` packages, not a universal plugin API. For another Agent Skills-compatible harness, use the directory it documents:

```bash
node skills.js --dest /path/to/that-harness/skills --dry-run
node skills.js --dest /path/to/that-harness/skills
```

For an older Codex installation configured to read `~/.codex/skills`, an explicit custom destination is available:

```bash
node skills.js --dest /path/to/your/.codex/skills
```

Do not install the same names to several discovery roots unnecessarily. `--dest` installs skills only; it does not create slash commands or modify another tool's configuration. It cannot be combined with `--project` or multiple harness flags. Tools without Agent Skills support need their own adapter. `--all` covers the dated registry snapshot, reports project-only skips in user scope, and deduplicates shared locations; it does not claim every possible tool. Kiro and some other harness versions may need manual skill-resource configuration. See HARNESS-SUPPORT.md for invocation and configuration limits.

## What is packaged

- `d-documents`: Phase 1 instructions and eight self-contained document templates.
- `d-frontend`: Phase 2 prototype/UI/test instructions plus the shared UI/service contract.
- `d-backend`: Phase 3 own-database Java/Flyway/API/integration instructions, backend contract tables, database implementation patterns and existing-project/JUnit 5 test rules.
- `d-testing`: selected-submodule test plans/execution, mandatory format/lint checks, actual TESTING evidence and defect reporting.
- `d-manual`: verified user instructions, actual masked screenshots, evidence links and handover review.
- Each has Codex UI metadata in `agents/openai.yaml`; other harnesses use portable `SKILL.md` frontmatter.

The skills preserve the current three-phase workflow, no separate database human-review record, human-only design locks, one submodule per cycle, explicit missing-component cards, ESLint/Prettier and Java lint/format checks. They ask on ambiguity rather than invent rules or repeat unavailable-information questions.

No MCP server, browser, JDK, npm dependency, harness binary or authentication is installed by this script. Playwright MCP browser tests still require the actual tool to be configured. No working harness UI has been exercised by filesystem installation tests alone.

Phase 1 reads Module Code from `module.config.json` field `code` and selects `.docs/documents/mockup/{module code}/` (the actual matching folder, for example M12 → m12). Missing or ambiguous codes/folders require clarification; other modules’ mockups are excluded.

Install only the two additional skills without replacing existing phase skills:

```bash
node skills.js --codex --skill d-testing --skill d-manual
```

Replace --codex with your harness flag. Default installation now includes all five skills. Testing and manual skills support the same three-phase workflow; they do not add implementation phases or bypass user acceptance, document locks or identified database execution authorization.
