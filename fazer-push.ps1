# Script PowerShell para fazer push ao GitHub
# Execute: .\fazer-push.ps1

Write-Host "🚀 Enviando código para o GitHub..." -ForegroundColor Green
Write-Host ""

# Verificar se estamos no diretório correto
if (-not (Test-Path ".git")) {
    Write-Host "❌ Erro: Não é um repositório Git!" -ForegroundColor Red
    exit 1
}

# Verificar status
Write-Host "📋 Verificando status do repositório..." -ForegroundColor Yellow
git status --short

Write-Host ""
Write-Host "📦 Verificando commits locais..." -ForegroundColor Yellow
git log --oneline origin/main..main 2>$null | ForEach-Object {
    Write-Host "  ✅ $_" -ForegroundColor Green
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "  ℹ️  Nenhum commit remoto encontrado. Fazendo push inicial..." -ForegroundColor Cyan
}

Write-Host ""
Write-Host "🔐 Autenticação necessária!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Você precisa autenticar para fazer push ao GitHub." -ForegroundColor White
Write-Host ""
Write-Host "Opções:" -ForegroundColor White
Write-Host "  1. Personal Access Token (Recomendado)" -ForegroundColor Cyan
Write-Host "     - Acesse: https://github.com/settings/tokens" -ForegroundColor Gray
Write-Host "     - Gere um novo token com permissão 'repo'" -ForegroundColor Gray
Write-Host "     - Use o token como senha quando solicitado" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. GitHub CLI" -ForegroundColor Cyan
Write-Host "     - Instale: winget install GitHub.cli" -ForegroundColor Gray
Write-Host "     - Execute: gh auth login" -ForegroundColor Gray
Write-Host ""
Write-Host "Pressione Enter para tentar fazer push..." -ForegroundColor White
Read-Host

# Tentar fazer push
Write-Host ""
Write-Host "📤 Fazendo push para o GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Push realizado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Acesse: https://github.com/CoayGIT/vnticket" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Erro ao fazer push!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Consulte PUSH_PARA_GITHUB.md para mais informações." -ForegroundColor Yellow
    Write-Host ""
}

