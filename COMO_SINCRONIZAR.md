# ⚡ Como Sincronizar Alterações com o GitHub

## ⚠️ IMPORTANTE: Alterações NÃO vão automaticamente para o GitHub!

**As alterações que você faz no código NÃO vão automaticamente para o GitHub.** Você precisa **executar comandos** para enviar as alterações.

## 🔄 Como Funciona

### ❌ O que NÃO acontece automaticamente:
- Editar arquivos → GitHub (NÃO funciona assim!)
- Salvar arquivos → GitHub (NÃO funciona assim!)

### ✅ O que você PRECISA fazer:

#### Opção 1: Usar o Script (Recomendado)

Depois de fazer alterações, execute:

```powershell
.\after-work.ps1
```

Este script:
- ✅ Detecta suas alterações
- ✅ Faz commit
- ✅ Envia para o GitHub
- ✅ Mantém tudo sincronizado

#### Opção 2: Fazer Manualmente

```bash
# 1. Adicionar alterações
git add .

# 2. Fazer commit
git commit -m "Descrição das alterações"

# 3. Enviar para o GitHub
git push origin main
```

## 📋 Fluxo Completo de Trabalho

### 1️⃣ ANTES de Trabalhar

```powershell
.\before-work.ps1
```

**O que faz:**
- Busca alterações do GitHub
- Atualiza seu repositório local
- Garante que você está trabalhando com a versão mais recente

### 2️⃣ TRABALHAR no Código

- Edite arquivos
- Crie arquivos
- Modifique arquivos
- Faça suas alterações normalmente

### 3️⃣ DEPOIS de Trabalhar (IMPORTANTE!)

```powershell
.\after-work.ps1
```

**O que faz:**
- Detecta suas alterações
- Pergunta a mensagem do commit
- Faz commit
- **Envia para o GitHub**
- Mantém GitHub atualizado

## 🔍 Verificar Status

### Ver se há alterações não commitadas

```bash
git status
```

### Ver alterações específicas

```bash
git diff
```

### Ver arquivos modificados

```bash
git status --short
```

## ⚡ Sincronização Rápida

### Comando Único (se você tem alterações)

```powershell
.\after-work.ps1
```

### Comandos Manuais

```bash
git add .
git commit -m "Sua mensagem"
git push origin main
```

## 🎯 Exemplo Prático

### Cenário: Você alterou um arquivo

1. **Você editou:** `server/src/index.ts`
2. **Você salvou:** Arquivo salvo localmente
3. **GitHub ainda não tem:** A alteração ainda não está no GitHub

### O que fazer:

```powershell
# Execute o script
.\after-work.ps1
```

Ou manualmente:

```bash
git add server/src/index.ts
git commit -m "Atualizar index.ts"
git push origin main
```

### Resultado:

✅ Alteração vai para o GitHub
✅ GitHub atualizado
✅ Outros podem ver suas alterações

## 🔄 Verificar se Está Sincronizado

### Verificar status

```bash
git status
```

Se mostrar:
- ✅ `nothing to commit, working tree clean` = Sem alterações locais
- ✅ `Your branch is up to date with 'origin/main'` = Sincronizado com GitHub

### Verificar no GitHub

1. Acesse: https://github.com/CoayGIT/vnticket
2. Verifique se suas alterações estão lá
3. Verifique o histórico de commits

## 🚨 Problemas Comuns

### Problema: "Minhas alterações não estão no GitHub"

**Causa:** Você não executou `git add`, `git commit` e `git push`

**Solução:**
```powershell
.\after-work.ps1
```

### Problema: "Não sei o que mudei"

**Solução:**
```bash
git status
git diff
```

### Problema: "Quero desfazer alterações locais"

**Solução:**
```bash
git restore <arquivo>
```

### Problema: "Quero ver o que tem no GitHub"

**Solução:**
```bash
git pull origin main
```

## 📝 Checklist de Trabalho

### Antes de Trabalhar:
- [ ] Executar `.\before-work.ps1`
- [ ] Verificar status: `git status`

### Depois de Trabalhar:
- [ ] Executar `.\after-work.ps1`
- [ ] Verificar no GitHub se as alterações foram enviadas
- [ ] Verificar status: `git status`

## 🎯 Resumo

### ✅ O que você PRECISA fazer:

1. **Antes de trabalhar:**
   ```powershell
   .\before-work.ps1
   ```

2. **Trabalhar no código:**
   - Editar arquivos normalmente

3. **Depois de trabalhar:**
   ```powershell
   .\after-work.ps1
   ```

### ❌ O que NÃO acontece automaticamente:

- ❌ Alterações não vão automaticamente para o GitHub
- ❌ Salvar arquivo não envia para o GitHub
- ❌ Editar código não atualiza o GitHub

### ✅ O que você PRECISA fazer:

- ✅ Executar `.\after-work.ps1` depois de fazer alterações
- ✅ Fazer commit e push manualmente
- ✅ Manter GitHub atualizado

## 🚀 Dica Rápida

**Sempre que você fizer alterações no código, execute:**

```powershell
.\after-work.ps1
```

Isso garante que suas alterações vão para o GitHub!

---

## 📚 Mais Informações

- **GITHUB_FONTE_VERDADE.md** - Guia completo sobre GitHub como fonte de verdade
- **TRABALHAR_COM_GITHUB.md** - Instruções detalhadas
- **README.md** - Documentação principal

---

**Lembre-se: Alterações NÃO vão automaticamente para o GitHub! Você precisa executar os comandos!** ⚡

