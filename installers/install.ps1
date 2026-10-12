param(
  [Parameter(Mandatory=$true)][string]$RepositoryUrl,
  [Parameter(Mandatory=$true)][string]$ReleaseTag
)
$ErrorActionPreference = 'Stop'
# Download, inspect, then run: .\install.ps1 -RepositoryUrl HTTPS_URL -ReleaseTag TAG
foreach ($tool in @('git','node','npm')) {
  if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) { throw "Install $tool first. Node.js >=22.12 includes npm." }
}
$nodeVersion = (& node --version).TrimStart('v')
if ($LASTEXITCODE -ne 0 -or [version]$nodeVersion -lt [version]'22.12.0') { throw 'Node.js >=22.12 required.' }
if (-not $RepositoryUrl.StartsWith('https://')) { throw 'Use an HTTPS repository URL.' }
if ($ReleaseTag.StartsWith('-')) { throw 'Invalid release tag.' }
$installerDir = Join-Path ([IO.Path]::GetTempPath()) ('dreams-modules-agent-' + [Guid]::NewGuid().ToString('N'))
$toolDir = Join-Path $installerDir 'tool'
New-Item -ItemType Directory -Path $installerDir | Out-Null
& git clone --depth 1 --branch $ReleaseTag -- $RepositoryUrl $toolDir
if ($LASTEXITCODE -ne 0) { throw 'Repository download failed.' }
Write-Host "Installer source: $toolDir"
& node (Join-Path $toolDir 'bin/install.mjs')
if ($LASTEXITCODE -ne 0) { throw 'Installer failed; review the reported error.' }
