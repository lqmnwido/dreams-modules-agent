# D-ReAMS Modules Agent bootstrap installer.
# Inspect this script before running it:
#   irm https://dreams-agents.kohich.site/install.ps1 | iex
$ErrorActionPreference = 'Stop'

$repositoryUrl = 'https://github.com/lqmnwido/dreams-modules-agent.git'
$revision = 'main'

foreach ($tool in @('git', 'node', 'npm')) {
  if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) {
    throw "Install $tool first. Node.js >=22.12 includes npm."
  }
}

$nodeVersion = (& node --version).TrimStart('v')
if ($LASTEXITCODE -ne 0 -or [version]$nodeVersion -lt [version]'22.12.0') {
  throw 'Node.js >=22.12 is required.'
}

$installerDir = Join-Path ([IO.Path]::GetTempPath()) ('dreams-modules-agent-' + [Guid]::NewGuid().ToString('N'))
$toolDir = Join-Path $installerDir 'tool'
New-Item -ItemType Directory -Path $installerDir | Out-Null

& git clone --depth 1 --branch $revision -- $repositoryUrl $toolDir
if ($LASTEXITCODE -ne 0) { throw 'Repository download failed.' }

Write-Host "Installer source: $toolDir ($revision)"
& node (Join-Path $toolDir 'bin/install.mjs')
if ($LASTEXITCODE -ne 0) { throw 'Installer failed; review the reported error.' }
