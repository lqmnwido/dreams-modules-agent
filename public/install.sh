#!/usr/bin/env bash
# D-ReAMS Modules Agent bootstrap installer.
# Inspect this script before running it:
#   curl -fsSL https://dreams-agents.kohich.site/install.sh | bash
set -euo pipefail

readonly repository_url='https://github.com/lqmnwido/dreams-modules-agent.git'
readonly revision='main'

command -v git >/dev/null || { echo 'Install Git first.' >&2; exit 1; }
command -v node >/dev/null || { echo 'Install Node.js >=22.12 (includes npm) first.' >&2; exit 1; }
node -e 'const [major,minor]=process.versions.node.split(".").map(Number);if(major<22||(major===22&&minor<12))process.exit(1)' || {
  echo 'Node.js >=22.12 is required.' >&2
  exit 1
}
command -v npm >/dev/null || { echo 'npm is required for frontend dependencies.' >&2; exit 1; }

install_dir=$(mktemp -d "${TMPDIR:-/tmp}/dreams-modules-agent.XXXXXXXX")

git clone --depth 1 --branch "$revision" -- "$repository_url" "$install_dir/tool"
echo "Installer source: $install_dir/tool ($revision)"

# The bootstrap is commonly streamed with curl, so reconnect the interactive
# questionnaire to the invoking terminal instead of curl's exhausted pipe.
if [[ -r /dev/tty ]]; then
  node "$install_dir/tool/bin/install.mjs" </dev/tty
else
  node "$install_dir/tool/bin/install.mjs"
fi
