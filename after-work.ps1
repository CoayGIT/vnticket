# Script para executar DEPOIS de trabalhar no projeto
# Execute: .\after-work.ps1
# Este script sempre envia alteracoes para o GitHub imediatamente

Write-Host "GitHub como Fonte de Verdade" -ForegroundColor Green
Write-Host "Enviando alteracoes para o GitHub..." -ForegroundColor Yellow
Write-Host ""

# Ler token do arquivo .gitconfig.local (nao commitado)
$tokenFile = ".gitconfig.local"
$token = $null

if (Test-Path $tokenFile) {
    $content = Get-Content $tokenFile -Raw
    if ($content -match "GIT_TOKEN=(.+)") {
        $token = $matches[1].Trim()
        Write-Host "Token encontrado no arquivo .gitconfig.local" -ForegroundColor Gray
    }
}

if (-not $token) {
    $token = $env:GIT_TOKEN
    if ($token) {
        Write-Host "Token encontrado na variavel de ambiente GIT_TOKEN" -ForegroundColor Gray
    }
}

if (-not $token) {
    Write-Host "AVISO: Token do GitHub nao encontrado!" -ForegroundColor Yellow
    Write-Host "Crie um arquivo .gitconfig.local com: GIT_TOKEN=seu_token" -ForegroundColor Gray
    Write-Host "Ou configure a variavel de ambiente GIT_TOKEN" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Tentando usar Git Credential Store..." -ForegroundColor Yellow
}

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
        
        # Usar token se disponivel
        $originalUrl = git remote get-url origin
        if ($token) {
            Write-Host "Usando token para autenticacao..." -ForegroundColor Gray
            git remote set-url origin "https://$token@github.com/CoayGIT/vnticket.git"
        }
        
        git push origin main 2>&1
        
        # Restaurar URL original (sem token)
        git remote set-url origin "https://github.com/CoayGIT/vnticket.git"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "Commits enviados para o GitHub!" -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "Erro ao fazer push!" -ForegroundColor Red
            Write-Host "Verifique se o token esta correto no arquivo .gitconfig.local" -ForegroundColor Gray
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
    
    # Usar token se disponivel
    $originalUrl = git remote get-url origin
    if ($token) {
        Write-Host "Usando token para autenticacao..." -ForegroundColor Gray
        git remote set-url origin "https://$token@github.com/CoayGIT/vnticket.git"
    }
    
    git push origin main 2>&1
    
    # Restaurar URL original (sem token)
    git remote set-url origin "https://github.com/CoayGIT/vnticket.git"
    
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
        Write-Host "Verifique se o token esta correto no arquivo .gitconfig.local" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Para configurar autenticacao:" -ForegroundColor Yellow
        Write-Host "1. Crie um arquivo .gitconfig.local com: GIT_TOKEN=seu_token" -ForegroundColor Gray
        Write-Host "2. O arquivo .gitconfig.local esta no .gitignore (nao sera commitado)" -ForegroundColor Gray
        Write-Host ""
    }
} else {
    Write-Host ""
    Write-Host "Erro ao fazer commit!" -ForegroundColor Red
    Write-Host ""
}
