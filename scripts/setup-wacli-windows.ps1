# Instala wacli (Windows amd64) em %LOCALAPPDATA%\wacli e adiciona ao PATH do usuário.
# Uso: powershell -ExecutionPolicy Bypass -File scripts/setup-wacli-windows.ps1

$ErrorActionPreference = "Stop"
$version = "0.13.0"
$zipName = "wacli_${version}_windows_amd64.zip"
$url = "https://github.com/openclaw/wacli/releases/download/v$version/$zipName"
$dest = Join-Path $env:LOCALAPPDATA "wacli"
$zipPath = Join-Path $env:TEMP $zipName

Write-Host "Baixando wacli v$version..."
Invoke-WebRequest -Uri $url -OutFile $zipPath

New-Item -ItemType Directory -Force -Path $dest | Out-Null
Expand-Archive -Path $zipPath -DestinationPath $dest -Force

$exe = Get-ChildItem -Path $dest -Filter "wacli.exe" -Recurse | Select-Object -First 1
if (-not $exe) { throw "wacli.exe não encontrado no zip." }

# Garante exe na pasta raiz do dest
Copy-Item $exe.FullName (Join-Path $dest "wacli.exe") -Force

$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -notlike "*$dest*") {
  [Environment]::SetEnvironmentVariable("Path", "$userPath;$dest", "User")
  $env:Path = "$env:Path;$dest"
  Write-Host "PATH do usuário atualizado com $dest"
}

Write-Host ""
Write-Host "OK: $($dest)\wacli.exe"
Write-Host ""
Write-Host "Próximos passos:"
Write-Host "  1) Feche e abra o terminal"
Write-Host "  2) wacli accounts add me"
Write-Host "  3) wacli --account me auth     (escaneie o QR no WhatsApp)"
Write-Host "  4) wacli --account me sync --once"
Write-Host "  5) wacli --account me chats list --json   (copie os nomes/JIDs dos grupos)"
Write-Host "  6) Edite config/auto-pipeline.json (targets; sendToWhatsApp=false ate anunciar)"
Write-Host "  7) node --env-file=.env.local scripts/auto-pipeline.mjs"
Write-Host "  8) Quando for anunciar: sendToWhatsApp true + docs/OPERACAO-MK-TIPS.md"
