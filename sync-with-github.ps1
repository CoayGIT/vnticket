# Script PowerShell para sincronizar com GitHub
# Execute: .\sync-with-github.ps1

Write-Host "🔄 Sincronizando com GitHub..." -ForegroundColor Green
Write-Host ""

# Verificar se estamos no diretório correto
if (-not (Test-Path ".git")) {
    Write-Host "❌ Erro: Não é um repositório Git!" -ForegroundColor Red
    exit 1
}

# Verificar status atual
Write-Host "📋 Verificando status atual..." -ForegroundColor Yellow
git status --short

Write-Host ""
Write-Host "📥 Buscando alterações do GitHub..." -ForegroundColor Yellow
git fetch origin

# Verificar se há alterações locais não commitadas
$status = git status --porcelain
if ($status) {
    Write-Host ""
    Write-Host "⚠️  Há alterações locais não commitadas:" -ForegroundColor Yellow
    git status --short
    Write-Host ""
    $response = Read-Host "Deseja fazer commit e push dessas alterações? (s/n)"
    if ($response -eq "s" -or $response -eq "S") {
        Write-Host ""
        Write-Host "📝 Fazendo commit das alterações..." -ForegroundColor Yellow
        $message = Read-Host "Digite a mensagem do commit"
        if (-not $message) {
            $message = "Atualização: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        }
        git add .
        git commit -m $message
        Write-Host ""
        Write-Host "📤 Enviando para o GitHub..." -ForegroundColor Yellow
        git push origin main
    }
}

# Verificar se há alterações no GitHub
Write-Host ""
Write-Host "🔍 Verificando alterações no GitHub..." -ForegroundColor Yellow
$localCommit = git rev-parse HEAD
$remoteCommit = git rev-parse origin/main 2>$null

if ($LASTEXITCODE -eq 0 -and $localCommit -ne $remoteCommit) {
    Write-Host ""
    Write-Host "📥 Há alterações no GitHub. Fazendo pull..." -ForegroundColor Yellow
    git pull origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Sincronização concluída!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "⚠️  Conflitos detectados. Resolva manualmente." -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "✅ Repositório local está sincronizado com o GitHub!" -ForegroundColor Green
}

# Verificar status final
Write-Host ""
Write-Host "📊 Status final:" -ForegroundColor Cyan
git status --short

Write-Host ""
Write-Host "🌐 Repositório: https://github.com/CoayGIT/vnticket" -ForegroundColor Cyan
Write-Host ""

