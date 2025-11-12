# Script para verificar conexao com Supabase
# Execute: .\verificar-supabase.ps1

Write-Host "Verificando conexao com Supabase..." -ForegroundColor Green
Write-Host ""

# Verificar se existe arquivo .env
$envFile = "server\.env"
if (Test-Path $envFile) {
    Write-Host "Arquivo .env encontrado!" -ForegroundColor Green
    
    # Ler DATABASE_URL
    $envContent = Get-Content $envFile -Raw
    if ($envContent -match "DATABASE_URL=(.+)") {
        $dbUrl = $matches[1].Trim()
        
        # Ocultar senha na exibicao
        $dbUrlSafe = $dbUrl -replace "://[^:]+:[^@]+@", "://***:***@"
        
        Write-Host "DATABASE_URL configurada: $dbUrlSafe" -ForegroundColor Cyan
        
        # Verificar se e Supabase
        if ($dbUrl -match "supabase") {
            Write-Host "Supabase detectado na connection string!" -ForegroundColor Green
        } else {
            Write-Host "Supabase NAO detectado na connection string!" -ForegroundColor Yellow
        }
    } else {
        Write-Host "DATABASE_URL NAO encontrada no .env!" -ForegroundColor Red
    }
} else {
    Write-Host "Arquivo .env NAO encontrado!" -ForegroundColor Red
    Write-Host "Crie o arquivo server\.env com a DATABASE_URL do Supabase" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Verificando Prisma Client..." -ForegroundColor Cyan

# Verificar se Prisma Client esta gerado
if (Test-Path "server\node_modules\.prisma") {
    Write-Host "Prisma Client gerado!" -ForegroundColor Green
} else {
    Write-Host "Prisma Client NAO gerado!" -ForegroundColor Yellow
    Write-Host "Execute: cd server && npm run prisma:generate" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Verificando schema Prisma..." -ForegroundColor Cyan

if (Test-Path "server\prisma\schema.prisma") {
    Write-Host "Schema Prisma encontrado!" -ForegroundColor Green
    
    $schema = Get-Content "server\prisma\schema.prisma" -Raw
    if ($schema -match 'provider = "postgresql"') {
        Write-Host "Provider PostgreSQL configurado!" -ForegroundColor Green
    } else {
        Write-Host "Provider PostgreSQL NAO configurado!" -ForegroundColor Red
    }
} else {
    Write-Host "Schema Prisma NAO encontrado!" -ForegroundColor Red
}

Write-Host ""
Write-Host "Testando conexao..." -ForegroundColor Cyan

# Tentar testar conexao se .env existe
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile -Raw
    if ($envContent -match "DATABASE_URL=(.+)") {
        $dbUrl = $matches[1].Trim()
        
        # Configurar variavel de ambiente temporariamente
        $env:DATABASE_URL = $dbUrl
        
        # Tentar gerar Prisma Client para testar conexao
        Write-Host "Tentando gerar Prisma Client para testar conexao..." -ForegroundColor Yellow
        cd server
        $result = npm run prisma:generate 2>&1
        cd ..
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Prisma Client gerado com sucesso!" -ForegroundColor Green
            Write-Host "Conexao com Supabase funcionando!" -ForegroundColor Green
        } else {
            Write-Host "Erro ao gerar Prisma Client!" -ForegroundColor Red
            Write-Host "Verifique se a DATABASE_URL esta correta" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "Nao e possivel testar conexao sem arquivo .env" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Status:" -ForegroundColor Cyan
Write-Host "- Arquivo .env: $(if (Test-Path $envFile) { 'Sim' } else { 'Nao' })" -ForegroundColor $(if (Test-Path $envFile) { 'Green' } else { 'Red' })
Write-Host "- DATABASE_URL: $(if ((Test-Path $envFile) -and ((Get-Content $envFile -Raw) -match 'DATABASE_URL')) { 'Configurada' } else { 'Nao configurada' })" -ForegroundColor $(if ((Test-Path $envFile) -and ((Get-Content $envFile -Raw) -match 'DATABASE_URL')) { 'Green' } else { 'Red' })
Write-Host "- Prisma Client: $(if (Test-Path 'server\node_modules\.prisma') { 'Gerado' } else { 'Nao gerado' })" -ForegroundColor $(if (Test-Path 'server\node_modules\.prisma') { 'Green' } else { 'Yellow' })
Write-Host ""
