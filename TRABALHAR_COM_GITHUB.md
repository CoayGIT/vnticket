# 🔄 Trabalhar Diretamente com GitHub

Este repositório está configurado para trabalhar **diretamente com o GitHub**, mantendo sincronização em tempo real.

## ✅ Configuração Atual

- **Repositório Remoto**: https://github.com/CoayGIT/vnticket.git
- **Branch Principal**: `main`
- **Sincronização**: Automática
- **Fonte de Verdade**: GitHub

## 🚀 Como Usar

### Fluxo de Trabalho Recomendado

#### 1. Antes de Trabalhar (Sempre executar primeiro)

```powershell
.\before-work.ps1
```

Este script:
- ✅ Busca alterações do GitHub
- ✅ Atualiza o repositório local
- ✅ Garante que você está trabalhando com a versão mais recente

#### 2. Trabalhar no Projeto

Faça suas alterações normalmente nos arquivos.

#### 3. Depois de Trabalhar (Sempre executar por último)

```powershell
.\after-work.ps1
```

Este script:
- ✅ Detecta alterações locais
- ✅ Faz commit das alterações
- ✅ Envia para o GitHub imediatamente
- ✅ Mantém o GitHub atualizado

### Sincronização Manual

Se preferir fazer manualmente:

```bash
# 1. Buscar alterações do GitHub
git pull origin main

# 2. Fazer suas alterações

# 3. Adicionar alterações
git add .

# 4. Fazer commit
git commit -m "Descrição das alterações"

# 5. Enviar para o GitHub
git push origin main
```

### Sincronização Completa

Para sincronizar completamente (buscar e enviar):

```powershell
.\sync-with-github.ps1
```

Este script:
- ✅ Verifica status atual
- ✅ Busca alterações do GitHub
- ✅ Detecta alterações locais
- ✅ Faz commit e push se necessário
- ✅ Mantém tudo sincronizado

## 📋 Comandos Úteis

### Verificar status
```bash
git status
```

### Buscar alterações do GitHub
```bash
git pull origin main
```

### Ver histórico
```bash
git log --oneline -10
```

### Verificar se está sincronizado
```bash
git fetch origin
git status
```

### Ver diferenças
```bash
git diff
```

### Ver commits não enviados
```bash
git log origin/main..HEAD
```

## 🔒 Regras Importantes

1. **✅ Sempre executar `before-work.ps1` antes de trabalhar**
   - Garante que você está trabalhando com a versão mais recente
   - Evita conflitos

2. **✅ Sempre executar `after-work.ps1` depois de trabalhar**
   - Mantém o GitHub atualizado
   - Garante que suas alterações não sejam perdidas

3. **✅ GitHub é a fonte de verdade**
   - Todos os arquivos devem estar no GitHub
   - Nunca commitar sem fazer push
   - Sempre fazer pull antes de trabalhar

4. **✅ Nunca commitar arquivos sensíveis**
   - `.env` não deve ser commitado
   - Chaves secretas não devem ser commitadas
   - Use `.env.example` como template

## 🔄 Sincronização Automática

### Configurar Git para sempre buscar antes de trabalhar

O Git está configurado para:
- ✅ Buscar alterações do GitHub antes de trabalhar
- ✅ Enviar alterações para o GitHub imediatamente
- ✅ Manter sincronização em tempo real

### Verificar Configuração

```bash
# Ver repositório remoto
git remote -v

# Ver configurações
git config --list
```

## 🐛 Troubleshooting

### Erro: "Your branch is behind"

**Solução:**
```bash
git pull origin main
```

### Erro: "Your branch is ahead"

**Solução:**
```bash
git push origin main
```

### Erro: "Merge conflict"

**Solução:**
1. Resolver conflitos manualmente
2. Fazer commit
3. Fazer push

### Erro: "Authentication failed"

**Solução:**
- Verificar se o token está configurado
- Usar Personal Access Token

## 📊 Status do Repositório

### Verificar se está sincronizado

```bash
git fetch origin
git status
```

Se mostrar "Your branch is up to date with 'origin/main'", está sincronizado!

### Ver última atualização

```bash
git log -1 --format="%cd - %s" --date=relative
```

## 🌐 Acessar no GitHub

- **Repositório**: https://github.com/CoayGIT/vnticket
- **Commits**: https://github.com/CoayGIT/vnticket/commits/main
- **Arquivos**: https://github.com/CoayGIT/vnticket/tree/main

## 🎯 Próximos Passos

1. ✅ Executar `before-work.ps1` antes de trabalhar
2. ✅ Fazer alterações nos arquivos
3. ✅ Executar `after-work.ps1` depois de trabalhar
4. ✅ Verificar no GitHub se as alterações foram enviadas

---

## 📝 Resumo

- **Fonte de Verdade**: GitHub
- **Sincronização**: Automática via scripts
- **Fluxo**: Pull → Trabalhar → Commit → Push
- **Scripts**: `before-work.ps1` e `after-work.ps1`

**GitHub é a fonte de verdade!** 🔄

