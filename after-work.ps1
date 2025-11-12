# Script para executar DEPOIS de trabalhar no projeto
# Execute: .\after-work.ps1

Write-Host "📤 Enviando alterações para o GitHub..." -ForegroundColor Green
Write-Host ""

# Verificar se há alterações
$status = git status --porcelain
if (-not $status) {
    Write-Host "✅ Nenhuma alteração para enviar!" -ForegroundColor Green
    Write-Host ""
    exit 0
}

# Mostrar alterações
Write-Host "📋 Alterações detectadas:" -ForegroundColor Yellow
git status --short
Write-Host ""

# Perguntar mensagem do commit
$message = Read-Host "Digite a mensagem do commit (ou pressione Enter para usar mensagem padrão)"
if (-not $message) {
    $message = "Atualização: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
}

# Adicionar alterações
Write-Host ""
Write-Host "📝 Adicionando alterações..." -ForegroundColor Yellow
git add .

# Fazer commit
Write-Host "💾 Fazendo commit..." -ForegroundColor Yellow
git commit -m $message

if ($LASTEXITCODE -eq 0) {
    # Fazer push
    Write-Host ""
    Write-Host "📤 Enviando para o GitHub..." -ForegroundColor Yellow
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Alterações enviadas com sucesso!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🌐 Repositório: https://github.com/CoayGIT/vnticket" -ForegroundColor Cyan
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "❌ Erro ao fazer push!" -ForegroundColor Red
        Write-Host ""
    }
} else {
    Write-Host ""
    Write-Host "❌ Erro ao fazer commit!" -ForegroundColor Red
    Write-Host ""
}

