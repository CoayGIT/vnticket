# Script para executar ANTES de trabalhar no projeto
# Execute: .\before-work.ps1

Write-Host "📥 Buscando alterações do GitHub..." -ForegroundColor Green
Write-Host ""

# Buscar alterações do GitHub
git fetch origin

# Verificar se há alterações remotas
$localCommit = git rev-parse HEAD
$remoteCommit = git rev-parse origin/main 2>$null

if ($LASTEXITCODE -eq 0 -and $localCommit -ne $remoteCommit) {
    Write-Host "📥 Há alterações no GitHub. Fazendo pull..." -ForegroundColor Yellow
    git pull origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Repositório local atualizado!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "⚠️  Erro ao fazer pull. Verifique manualmente." -ForegroundColor Red
    }
} else {
    Write-Host "✅ Repositório local está atualizado!" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 Pronto para trabalhar!" -ForegroundColor Cyan
Write-Host ""

