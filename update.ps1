param ($S1)
if ($S1 -eq 'npm') {
    Write-Host "[pwsh] I hope you know what you're doing." -ForegroundColor Yellow
    Write-Output "[pwsh] Checking for new package dependencies."
    npm i
    Write-Output "[pwsh] > Checking install."
    npm ci
    Write-Output "[pwsh] > Auditing."
    npm audit fix
} elseif ( $S1 -eq 'bot' ) { 
    Write-Output "[pwsh] > Fetching."
    git fetch --all
    Write-Output "[pwsh] > Pulling."
    git pull
} else {
    Write-Host "[pwsh] > I didn't expect argument '$S1'. I won't do anything, just in case." -ForegroundColor Yellow
}
Write-Host "[pwsh] > Done." -ForegroundColor Green
