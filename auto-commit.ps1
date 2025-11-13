# Script PowerShell para auto-commit e push
# Execute este script para configurar auto-commit

Write-Host "🔧 Configurando auto-commit para GitHub..." -ForegroundColor Cyan

# Verificar se é repositório git
if (-not (Test-Path .git)) {
    Write-Host "❌ Não é um repositório Git!" -ForegroundColor Red
    exit 1
}

# Criar script de auto-commit
$hookContent = @"
#!/bin/sh
# Auto-commit e push para GitHub

if [ -n `$GIT_AUTO_COMMIT ]; then
    exit 0
fi

export GIT_AUTO_COMMIT=1
git push origin HEAD 2>&1
exit 0
"@

# Criar hook se não existir
$hookPath = ".git/hooks/post-commit"
if (-not (Test-Path $hookPath)) {
    Set-Content -Path $hookPath -Value $hookContent
    Write-Host "✅ Hook post-commit criado!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Hook já existe, atualizando..." -ForegroundColor Yellow
    Set-Content -Path $hookPath -Value $hookContent
}

# Tornar executável (no Linux/Mac)
if ($IsLinux -or $IsMacOS) {
    chmod +x $hookPath
}

Write-Host "✅ Auto-commit configurado!" -ForegroundColor Green
Write-Host "📝 Agora cada commit será automaticamente enviado para o GitHub" -ForegroundColor Cyan

