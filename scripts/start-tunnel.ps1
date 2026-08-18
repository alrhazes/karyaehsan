# Start local site + Cloudflare quick tunnel
# Usage: .\scripts\start-tunnel.ps1

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$Cloudflared = "C:\Program Files (x86)\cloudflared\cloudflared.exe"
$Port = 8765

if (-not (Test-Path $Cloudflared)) {
    Write-Error "cloudflared not found. Install with: winget install Cloudflare.cloudflared"
    exit 1
}

Set-Location $ProjectRoot

# Start local HTTP server if not already running
$existing = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
if (-not $existing) {
    Start-Process python -ArgumentList "-m", "http.server", $Port -WorkingDirectory $ProjectRoot -WindowStyle Minimized
    Start-Sleep -Seconds 2
    Write-Host "Started local server on http://127.0.0.1:$Port"
} else {
    Write-Host "Local server already running on port $Port"
}

Write-Host "Starting Cloudflare quick tunnel..."
Write-Host "Press Ctrl+C to stop the tunnel."
& $Cloudflared tunnel --url "http://127.0.0.1:$Port"
