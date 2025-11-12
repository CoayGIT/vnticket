# Script para executar DEPOIS de trabalhar no projeto
# Execute: .\after-work.ps1
# Este script sempre envia alterações para o GitHub imediatamente

Write-Host "🔄 GitHub como Fonte de Verdade" -ForegroundColor Green
Write-Host "📤 Enviando alterações para o GitHub..." -ForegroundColor Yellow
Write-Host ""

# Verificar se há alterações
$status = git status --porcelain
if (-not $status) {
    Write-Host "✅ Nenhuma alteração local detectada!" -ForegroundColor Green
    Write-Host "   Tudo está sincronizado com o GitHub." -ForegroundColor Gray
    Write-Host ""
    
    # Verificar se há commits não enviados
    $localCommits = git log origin/main..HEAD --oneline 2>$null
    if ($localCommits) {
        Write-Host "📤 Há commits locais não enviados:" -ForegroundColor Yellow
        $localCommits | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
        Write-Host ""
        Write-Host "📤 Enviando commits para o GitHub..." -ForegroundColor Yellow
        git push origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Commits enviados para o GitHub!" -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "❌ Erro ao fazer push!" -ForegroundColor Red
        }
    }
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
Write-Host "1️⃣  Adicionando alterações..." -ForegroundColor Cyan
git add .

# Fazer commit
Write-Host "2️⃣  Fazendo commit..." -ForegroundColor Cyan
git commit -m $message

if ($LASTEXITCODE -eq 0) {
    # Fazer push IMEDIATAMENTE para o GitHub
    Write-Host ""
    Write-Host "3️⃣  Enviando para o GitHub (fonte de verdade)..." -ForegroundColor Cyan
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Alterações enviadas para o GitHub com sucesso!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🌐 Repositório: https://github.com/CoayGIT/vnticket" -ForegroundColor Cyan
        Write-Host "📊 Ver alterações: https://github.com/CoayGIT/vnticket/commits/main" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "✅ GitHub atualizado! Fonte de verdade sincronizada." -ForegroundColor Green
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "❌ Erro ao fazer push para o GitHub!" -ForegroundColor Red
        Write-Host "   Verifique sua autenticação ou conexão." -ForegroundColor Gray
        Write-Host ""
    }
} else {
    Write-Host ""
    Write-Host "❌ Erro ao fazer commit!" -ForegroundColor Red
    Write-Host ""
}

