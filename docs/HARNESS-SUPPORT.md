# Harness installation support

Snapshot checked 2026-10-14: **79 named harness targets plus one portable directory target**. This is the discoverable registry snapshot, not a claim that every possible current/future AI tool supports skills.

Location data comes from the [Vercel skills installer target registry](https://github.com/vercel-labs/skills/blob/main/src/agents.ts) with vendor-document overrides below. Upstream source snapshot SHA-256: `9c64197246db1b61c0b2777114e2e01dd60f503129842ce7eeb78a3c3f2caa25`. The installer bundles these path facts offline; it does not download or execute upstream detection code. No third-party harness implementation code is vendored.

**Evidence labels:** vendor-docs means the location was additionally checked against the vendor's skill documentation; registry means the location is recorded by the public installer registry but was not independently verified in a running harness here; portable is a convention, not a harness. No entry is claimed live-tested solely because files copied successfully.

## Usage

```bash
node skills.js --list-harnesses
node skills.js --list-harnesses --json
node skills.js --cursor --dry-run
node skills.js --cursor
node skills.js --gemini
node skills.js --copilot
node skills.js --windsurf
node skills.js --harness roo --harness kilo
```

Every canonical ID below accepts `--ID` or `--harness ID`. Default scope is user-wide. `--project /path/to/existing-workspace` selects the project root. Preview `--all --dry-run` before deciding whether you want all registered targets; it is not automatic detection of installed harnesses.

`--all` includes all named targets and deduplicates shared destination paths. In global mode it reports/skips project-only targets instead of inventing user paths; explicit selection of such a target without `--project` fails. With `--project`, all registered project locations are included. Only OpenCode gets generated slash-command wrappers; other tools use native skills or their own discovery interface. The portable `--agents` target is available separately.

## Paths and evidence

`<project>` denotes the --project directory. Config-root paths shown as `~/.config` honor XDG_CONFIG_HOME. Profile overrides are listed after the table. Default OpenClaw targets the current .openclaw tree; legacy profile roots can use --dest.

| Harness | Flag | User skills root | Project skills root | Evidence |
| --- | --- | --- | --- | --- |
| AdaL | `--adal` | `~/.adal/skills` | `.adal/skills` | registry |
| Portable Agent Skills directory | `--agents` | `~/.agents/skills` | `.agents/skills` | portable |
| AiderDesk | `--aider-desk` | `~/.aider-desk/skills` | `.aider-desk/skills` | registry |
| Amp | `--amp` | `~/.config/agents/skills` | `.agents/skills` | registry |
| Antigravity | `--antigravity` | `~/.gemini/antigravity/skills` | `.agents/skills` | registry |
| Antigravity CLI | `--antigravity-cli` | `~/.gemini/antigravity-cli/skills` | `.agents/skills` | registry |
| AstrBot | `--astrbot` | `~/.astrbot/data/skills` | `data/skills` | registry |
| Augment | `--augment` | `~/.augment/skills` | `.augment/skills` | registry |
| Autohand Code CLI | `--autohand-code` | `~/.autohand/skills` | `.autohand/skills` | registry |
| IBM Bob | `--bob` | `~/.bob/skills` | `.bob/skills` | registry |
| Claude Code | `--claude` | `~/.claude/skills` | `.claude/skills` | vendor-docs |
| Cline | `--cline` | `~/.cline/skills` | `.cline/skills` | vendor-docs |
| CodeArts Agent | `--codearts-agent` | `~/.codeartsdoer/skills` | `.codeartsdoer/skills` | registry |
| CodeBuddy | `--codebuddy` | `~/.codebuddy/skills` | `.codebuddy/skills` | registry |
| Codemaker | `--codemaker` | `~/.codemaker/skills` | `.codemaker/skills` | registry |
| Code Studio | `--codestudio` | `~/.codestudio/skills` | `.codestudio/skills` | registry |
| Codex | `--codex` | `~/.agents/skills` | `.agents/skills` | vendor-docs |
| Command Code | `--command-code` | `~/.commandcode/skills` | `.commandcode/skills` | registry |
| Continue | `--continue` | `~/.continue/skills` | `.continue/skills` | registry |
| Cortex Code | `--cortex` | `~/.snowflake/cortex/skills` | `.cortex/skills` | registry |
| Crush | `--crush` | `~/.config/crush/skills` | `.crush/skills` | registry |
| Cursor | `--cursor` | `~/.cursor/skills` | `.cursor/skills` | vendor-docs |
| Deep Agents | `--deepagents` | `~/.deepagents/agent/skills` | `.agents/skills` | registry |
| Devin for Terminal | `--devin` | `~/.config/devin/skills` | `.devin/skills` | registry |
| Dexto | `--dexto` | `~/.agents/skills` | `.agents/skills` | registry |
| Droid | `--droid` | `~/.factory/skills` | `.agents/skills` | registry |
| Eve | `--eve` | `Project only` | `agent/skills` | registry |
| Firebender | `--firebender` | `~/.firebender/skills` | `.agents/skills` | registry |
| ForgeCode | `--forgecode` | `~/.forge/skills` | `.forge/skills` | registry |
| fx | `--fx` | `~/.agents/skills` | `.agents/skills` | registry |
| Gemini CLI | `--gemini-cli` | `~/.gemini/skills` | `.gemini/skills` | vendor-docs |
| GitHub Copilot | `--github-copilot` | `~/.copilot/skills` | `.github/skills` | vendor-docs |
| Goose | `--goose` | `~/.config/goose/skills` | `.goose/skills` | registry |
| Grok Build | `--grok` | `~/.grok/skills` | `.grok/skills` | registry |
| Hermes Agent | `--hermes-agent` | `~/.hermes/skills` | `.hermes/skills` | registry |
| iFlow CLI | `--iflow-cli` | `~/.iflow/skills` | `.iflow/skills` | registry |
| inference.sh | `--inference-sh` | `~/.inferencesh/skills` | `.inferencesh/skills` | registry |
| Jazz | `--jazz` | `~/.jazz/skills` | `.jazz/skills` | registry |
| Junie | `--junie` | `~/.junie/skills` | `.junie/skills` | registry |
| Kilo Code | `--kilo` | `~/.kilo/skills` | `.agents/skills` | registry |
| Kimchi | `--kimchi` | `~/.config/kimchi/harness/skills` | `.kimchi/skills` | registry |
| Kimi Code CLI | `--kimi-code-cli` | `~/.agents/skills` | `.agents/skills` | registry |
| Kiro CLI | `--kiro-cli` | `~/.kiro/skills` | `.kiro/skills` | registry |
| Kode | `--kode` | `~/.kode/skills` | `.kode/skills` | registry |
| Lingma | `--lingma` | `~/.lingma/skills` | `.lingma/skills` | registry |
| Loaf | `--loaf` | `~/.agents/skills` | `.agents/skills` | registry |
| MCPJam | `--mcpjam` | `~/.mcpjam/skills` | `.mcpjam/skills` | registry |
| MiniMax Code | `--minimax-code` | `~/.minimax/skills` | `.minimax/skills` | registry |
| Mistral Vibe | `--mistral-vibe` | `~/.vibe/skills` | `.vibe/skills` | registry |
| Moxby | `--moxby` | `~/.moxby/skills` | `.moxby/skills` | registry |
| Mux | `--mux` | `~/.mux/skills` | `.mux/skills` | registry |
| Neovate | `--neovate` | `~/.neovate/skills` | `.neovate/skills` | registry |
| Ona | `--ona` | `~/.ona/skills` | `.ona/skills` | registry |
| OpenClaw | `--openclaw` | `~/.openclaw/skills` | `skills` | registry |
| OpenCode | `--opencode` | `~/.config/opencode/skills` | `.opencode/skills` | vendor-docs |
| OpenHands | `--openhands` | `~/.openhands/skills` | `.openhands/skills` | registry |
| Pi | `--pi` | `~/.agents/skills` | `.agents/skills` | registry |
| Pochi | `--pochi` | `~/.pochi/skills` | `.pochi/skills` | registry |
| Posit Assistant | `--posit-assistant` | `~/.posit/assistant/skills` | `.posit/assistant/skills` | registry |
| PromptScript | `--promptscript` | `Project only` | `.agents/skills` | registry |
| Qoder | `--qoder` | `~/.qoder/skills` | `.qoder/skills` | registry |
| Qoder CN | `--qoder-cn` | `~/.qoder-cn/skills` | `.qoder/skills` | registry |
| Qwen Code | `--qwen-code` | `~/.qwen/skills` | `.qwen/skills` | registry |
| Reasonix | `--reasonix` | `~/.reasonix/skills` | `.reasonix/skills` | registry |
| Replit | `--replit` | `~/.config/agents/skills` | `.agents/skills` | registry |
| Roo Code | `--roo` | `~/.roo/skills` | `.roo/skills` | vendor-docs |
| Rovo Dev | `--rovodev` | `~/.rovodev/skills` | `.rovodev/skills` | registry |
| Sarvam Code | `--sarvam-code` | `~/.agents/skills` | `.agents/skills` | registry |
| Tabnine CLI | `--tabnine-cli` | `~/.tabnine/agent/skills` | `.tabnine/agent/skills` | registry |
| Terramind | `--terramind` | `~/.terramind/skills` | `.terramind/skills` | registry |
| Tinycloud | `--tinycloud` | `~/.tinycloud/skills` | `.tinycloud/skills` | registry |
| Trae | `--trae` | `~/.trae/skills` | `.trae/skills` | registry |
| Trae CN | `--trae-cn` | `~/.trae-cn/skills` | `.trae/skills` | registry |
| Universal | `--universal` | `~/.config/agents/skills` | `.agents/skills` | registry |
| Warp | `--warp` | `~/.agents/skills` | `.agents/skills` | registry |
| Windsurf | `--windsurf` | `~/.codeium/windsurf/skills` | `.windsurf/skills` | vendor-docs |
| ZCode | `--zcode` | `~/.zcode/skills` | `.zcode/skills` | registry |
| Zed | `--zed` | `~/.agents/skills` | `.agents/skills` | registry |
| Zencoder | `--zencoder` | `~/.zencoder/skills` | `.zencoder/skills` | registry |
| Zenflow | `--zenflow` | `~/.zencoder/skills` | `.zencoder/skills` | registry |

## Aliases

- `--claude-code` → `--claude`
- `--gemini` → `--gemini-cli`
- `--copilot` → `--github-copilot`
- `--github` → `--github-copilot`
- `--roo-code` → `--roo`
- `--kilo-code` → `--kilo`
- `--kiro` → `--kiro-cli`
- `--qwen` → `--qwen-code`
- `--kimi` → `--kimi-code-cli`
- `--kimi-cli` → `--kimi-code-cli`
- `--hermes` → `--hermes-agent`
- `--vibe` → `--mistral-vibe`
- `--aiderdesk` → `--aider-desk`

## Environment and host-specific notes

- `autohand-code`: `AUTOHAND_HOME` overrides its profile root; skills append `skills`.
- `claude`: `CLAUDE_CONFIG_DIR` overrides its profile root; skills append `skills`.
- `grok`: `GROK_HOME` overrides its profile root; skills append `skills`.
- `hermes-agent`: `HERMES_HOME` overrides its profile root; skills append `skills`.
- `kiro-cli`: Kiro may require skill resources to be enabled in its agent configuration; this installer does not modify that configuration.
- `mistral-vibe`: `VIBE_HOME` overrides its profile root; skills append `skills`.
- `openclaw`: Uses the current .openclaw directory; use --dest for older .clawdbot/.moltbot workspaces.
- `windsurf`: Windsurf/Devin Desktop documentation still accepts this legacy path; newer desktop versions also use .devin/skills.

Codex retains its current vendor-documented ~/.agents/skills root; use --dest for a deliberately configured legacy ~/.codex/skills location. Cursor uses its documented native .cursor directory rather than relying only on an alias. Cline's vendor-documented .cline path overrides the general registry's .agents path. OpenCode retains this installer's .opencode project path for compatibility and still supports shared .agents discovery.

## Vendor references checked

- [Claude Code](https://code.claude.com/docs/en/skills)
- [Cline](https://docs.cline.bot/customization/skills)
- [Codex](https://learn.chatgpt.com/docs/build-skills)
- [Cursor](https://cursor.com/docs/skills)
- [Gemini CLI](https://geminicli.com/docs/cli/skills/)
- [GitHub Copilot](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)
- [OpenCode](https://opencode.ai/docs/skills/)
- [Roo Code](https://roocodeinc.github.io/Roo-Code/features/skills/)
- [Windsurf](https://docs.devin.ai/desktop/cascade/skills)

Also checked the [GitHub CLI supported-agent inventory](https://cli.github.com/manual/gh_skill_install) for broader discovery. Names with no verified placement in this snapshot are not guessed into the installer. Use --dest with the tool's documented skills directory or request a sourced adapter update.

## Invocation and availability limits

- Codex: `$d-documents`, `$d-frontend`, `$d-backend` or the native skill selector.
- Claude Code, Cursor and Cline: native `/d-documents`, `/d-frontend`, `/d-backend` where enabled in the installed version.
- OpenCode: generated `/d-*` wrappers load the named skill and pass arguments.
- Windsurf/Devin Desktop: `@d-documents`, `@d-frontend`, `@d-backend` skill mentions.
- Gemini and remaining registry adapters: ask the agent to use the named skill or select it in the documented skill interface. The installer does not promise arbitrary slash commands.

Some versions require feature flags, workspace trust or explicit agent skill-resource configuration. Local installs do not deploy skills into cloud workers/remote SSH/container profiles. This installer does not enable features, modify settings, install harness binaries/MCP servers or send remote configuration. Installation tests verify paths/resources and safe file operations, not model behavior in every harness. No symlink destinations or unowned packages/commands are overwritten.
