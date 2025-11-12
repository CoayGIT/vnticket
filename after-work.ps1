# Script para executar DEPOIS de trabalhar no projeto
# Execute: .\after-work.ps1
# Este script sempre envia alteracoes para o GitHub imediatamente

Write-Host "GitHub como Fonte de Verdade" -ForegroundColor Green
Write-Host "Enviando alteracoes para o GitHub..." -ForegroundColor Yellow
Write-Host ""

# Verificar se ha alteracoes
$status = git status --porcelain
if (-not $status) {
    Write-Host "Nenhuma alteracao local detectada!" -ForegroundColor Green
    Write-Host "Tudo esta sincronizado com o GitHub." -ForegroundColor Gray
    Write-Host ""
    
    # Verificar se ha commits nao enviados
    $localCommits = git log origin/main..HEAD --oneline 2>$null
    if ($localCommits) {
        Write-Host "Ha commits locais nao enviados:" -ForegroundColor Yellow
        $localCommits | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
        Write-Host ""
        Write-Host "Enviando commits para o GitHub..." -ForegroundColor Yellow
        git push origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "Commits enviados para o GitHub!" -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "Erro ao fazer push!" -ForegroundColor Red
        }
    }
    Write-Host ""
    exit 0
}

# Mostrar alteracoes
Write-Host "Alteracoes detectadas:" -ForegroundColor Yellow
git status --short
Write-Host ""

# Perguntar mensagem do commit
$message = Read-Host "Digite a mensagem do commit (ou pressione Enter para usar mensagem padrao)"
if (-not $message) {
    $message = "Atualizacao: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
}

# Adicionar alteracoes
Write-Host ""
Write-Host "1. Adicionando alteracoes..." -ForegroundColor Cyan
git add .

# Fazer commit
Write-Host "2. Fazendo commit..." -ForegroundColor Cyan
git commit -m $message

if ($LASTEXITCODE -eq 0) {
    # Fazer push IMEDIATAMENTE para o GitHub
    Write-Host ""
    Write-Host "3. Enviando para o GitHub (fonte de verdade)..." -ForegroundColor Cyan
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "Alteracoes enviadas para o GitHub com sucesso!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Repositorio: https://github.com/CoayGIT/vnticket" -ForegroundColor Cyan
        Write-Host "Ver alteracoes: https://github.com/CoayGIT/vnticket/commits/main" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "GitHub atualizado! Fonte de verdade sincronizada." -ForegroundColor Green
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "Erro ao fazer push para o GitHub!" -ForegroundColor Red
        Write-Host "Verifique sua autenticacao ou conexao." -ForegroundColor Gray
        Write-Host ""
    }
} else {
    Write-Host ""
    Write-Host "Erro ao fazer commit!" -ForegroundColor Red
    Write-Host ""
}
