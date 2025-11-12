# Script para executar ANTES de trabalhar no projeto
# Execute: .\before-work.ps1
# Este script sempre busca as alteracoes mais recentes do GitHub

Write-Host "GitHub como Fonte de Verdade" -ForegroundColor Green
Write-Host "Buscando alteracoes do GitHub..." -ForegroundColor Yellow
Write-Host ""

# Sempre buscar alteracoes do GitHub primeiro
Write-Host "1. Buscando alteracoes remotas..." -ForegroundColor Cyan
git fetch origin

# Verificar se ha alteracoes remotas
$localCommit = git rev-parse HEAD
$remoteCommit = git rev-parse origin/main 2>$null

if ($LASTEXITCODE -eq 0) {
    if ($localCommit -ne $remoteCommit) {
        Write-Host ""
        Write-Host "Ha alteracoes no GitHub. Fazendo pull..." -ForegroundColor Yellow
        git pull origin main --no-rebase
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "Repositorio local atualizado do GitHub!" -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "Erro ao fazer pull. Verifique manualmente." -ForegroundColor Red
            Write-Host "Execute: git pull origin main" -ForegroundColor Gray
            Write-Host ""
            Write-Host "Se precisar autenticar:" -ForegroundColor Yellow
            Write-Host "Execute: git config --global credential.helper store" -ForegroundColor Gray
            Write-Host "E depois: git pull origin main (digite o token quando pedir)" -ForegroundColor Gray
        }
    } else {
        Write-Host ""
        Write-Host "Repositorio local esta sincronizado com o GitHub!" -ForegroundColor Green
    }
} else {
    Write-Host ""
    Write-Host "Nao foi possivel verificar o GitHub." -ForegroundColor Yellow
    Write-Host "Verifique sua conexao ou autenticacao." -ForegroundColor Gray
}

# Verificar status final
Write-Host ""
Write-Host "Status atual:" -ForegroundColor Cyan
git status --short

Write-Host ""
Write-Host "Repositorio GitHub: https://github.com/CoayGIT/vnticket" -ForegroundColor Cyan
Write-Host "Pronto para trabalhar com a versao mais recente do GitHub!" -ForegroundColor Green
Write-Host ""
