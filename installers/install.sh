#!/usr/bin/env bash
set -euo pipefail
# Download this script, inspect it, then run bash install.sh <repository-url> <release-tag>.
repo=${1:?Usage: bash install.sh REPOSITORY_URL RELEASE_TAG}
release=${2:?Use a reviewed release tag}
command -v git >/dev/null || { echo 'Install Git first.' >&2; exit 1; }
command -v node >/dev/null || { echo 'Install Node.js >=22.12 (includes npm) first.' >&2; exit 1; }
node -e 'const [a,b]=process.versions.node.split(".").map(Number);if(a<22||(a===22&&b<12))process.exit(1)' || { echo 'Node >=22.12 required.' >&2; exit 1; }
command -v npm >/dev/null || { echo 'npm is required for frontend dependencies.' >&2; exit 1; }
case "$repo" in https://*) ;; *) echo 'Use an HTTPS repository URL.' >&2; exit 1;; esac
case "$release" in -*) echo 'Invalid release tag.' >&2; exit 1;; esac
installer_dir=$(mktemp -d "${TMPDIR:-/tmp}/dreams-modules-agent.XXXXXXXX")
git clone --depth 1 --branch "$release" -- "$repo" "$installer_dir/tool"
echo "Installer source: $installer_dir/tool"
node "$installer_dir/tool/bin/install.mjs"
