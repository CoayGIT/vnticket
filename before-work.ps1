# Script para executar ANTES de trabalhar no projeto
# Execute: .\before-work.ps1
# Este script sempre busca as alterações mais recentes do GitHub

Write-Host "🔄 GitHub como Fonte de Verdade" -ForegroundColor Green
Write-Host "📥 Buscando alterações do GitHub..." -ForegroundColor Yellow
Write-Host ""

# Sempre buscar alterações do GitHub primeiro
Write-Host "1️⃣  Buscando alterações remotas..." -ForegroundColor Cyan
git fetch origin

# Verificar se há alterações remotas
$localCommit = git rev-parse HEAD
$remoteCommit = git rev-parse origin/main 2>$null

if ($LASTEXITCODE -eq 0) {
    if ($localCommit -ne $remoteCommit) {
        Write-Host ""
        Write-Host "📥 Há alterações no GitHub. Fazendo pull..." -ForegroundColor Yellow
        git pull origin main --no-rebase
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Repositório local atualizado do GitHub!" -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "⚠️  Erro ao fazer pull. Verifique manualmente." -ForegroundColor Red
            Write-Host "   Execute: git pull origin main" -ForegroundColor Gray
        }
    } else {
        Write-Host ""
        Write-Host "✅ Repositório local está sincronizado com o GitHub!" -ForegroundColor Green
    }
} else {
    Write-Host ""
    Write-Host "⚠️  Não foi possível verificar o GitHub." -ForegroundColor Yellow
    Write-Host "   Verifique sua conexão ou autenticação." -ForegroundColor Gray
}

# Verificar status final
Write-Host ""
Write-Host "📊 Status atual:" -ForegroundColor Cyan
git status --short

Write-Host ""
Write-Host "🌐 Repositório GitHub: https://github.com/CoayGIT/vnticket" -ForegroundColor Cyan
Write-Host "🚀 Pronto para trabalhar com a versão mais recente do GitHub!" -ForegroundColor Green
Write-Host ""

