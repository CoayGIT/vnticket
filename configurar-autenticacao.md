# 🔐 Como Configurar Autenticação do GitHub

## ⚠️ Problema: "credential-manager-core is not a git command"

Este erro ocorre quando o Git está configurado para usar `credential-manager-core`, mas essa ferramenta não está instalada no seu sistema.

## ✅ Soluções

### Opção 1: Usar Git Credential Store (Recomendado)

O Git Credential Store salva suas credenciais em um arquivo texto local.

#### 1. Configurar Git Credential Store

```bash
git config --global credential.helper store
```

#### 2. Fazer push ou pull pela primeira vez

Quando você fizer push ou pull, o Git pedirá suas credenciais:

```bash
git push origin main
```

**Quando pedir:**
- **Username**: Seu usuário do GitHub (ex: `CoayGIT`)
- **Password**: Seu **Personal Access Token** (não sua senha!)

#### 3. Credenciais serão salvas

Após a primeira vez, o Git salvará suas credenciais no arquivo `~/.git-credentials` (ou `C:\Users\SEU_USUARIO\.git-credentials` no Windows) e não pedirá novamente.

### Opção 2: Usar Token na URL do Remote (Temporário)

Você pode usar o token diretamente na URL do remote, mas **NÃO COMMITE ISSO NO GIT**:

```bash
git remote set-url origin https://SEU_TOKEN@github.com/CoayGIT/vnticket.git
```

**⚠️ IMPORTANTE:** Nunca commite o token no repositório!

### Opção 3: Usar Variável de Ambiente

Configure uma variável de ambiente com seu token:

**Windows PowerShell:**
```powershell
$env:GIT_TOKEN = "ghp_SEU_TOKEN_AQUI"
```

**Windows CMD:**
```cmd
set GIT_TOKEN=ghp_SEU_TOKEN_AQUI
```

**Linux/Mac:**
```bash
export GIT_TOKEN=ghp_SEU_TOKEN_AQUI
```

Depois use nos scripts se necessário.

## 🔑 Criar Personal Access Token

Se você não tem um token do GitHub:

1. Acesse: https://github.com/settings/tokens
2. Clique em **"Generate new token"** → **"Generate new token (classic)"**
3. Preencha:
   - **Note**: `sitevnticket` (ou outro nome)
   - **Expiration**: Escolha uma duração (ex: 90 dias)
   - **Select scopes**: Marque `repo` ✅
4. Clique em **"Generate token"**
5. **Copie o token** (começa com `ghp_`) - você só verá uma vez!

## ✅ Verificar Configuração

### Verificar credential helper

```bash
git config --global credential.helper
```

Deve mostrar: `store`

### Verificar remote URL

```bash
git remote -v
```

Deve mostrar: `https://github.com/CoayGIT/vnticket.git`

### Testar conexão

```bash
git fetch origin
```

Se funcionar, está configurado corretamente!

## 🐛 Troubleshooting

### Erro: "credential-manager-core is not a git command"

**Solução:**
```bash
git config --global --unset credential.helper
git config --global credential.helper store
```

### Erro: "Authentication failed"

**Solução:**
1. Verifique se está usando o **Personal Access Token** (não a senha)
2. Verifique se o token tem permissão `repo`
3. Verifique se o token não expirou
4. Tente gerar um novo token

### Erro: "Repository not found"

**Solução:**
1. Verifique se o repositório existe: https://github.com/CoayGIT/vnticket
2. Verifique se você tem permissão de escrita
3. Verifique se a URL está correta

## 📝 Configuração Atual

### Status

- ✅ Git Credential Store configurado: `store`
- ✅ Remote URL: `https://github.com/CoayGIT/vnticket.git`
- ✅ Scripts atualizados para não incluir tokens

### Próximos Passos

1. Execute: `git config --global credential.helper store`
2. Execute: `git push origin main`
3. Quando pedir credenciais, use seu token
4. Pronto! Suas credenciais serão salvas

## 🔒 Segurança

### ✅ O que fazer:

- ✅ Usar Personal Access Token (não senha)
- ✅ Salvar token no Git Credential Store
- ✅ Não commitar tokens no código
- ✅ Não compartilhar tokens publicamente

### ❌ O que NÃO fazer:

- ❌ Commitar tokens no código
- ❌ Compartilhar tokens publicamente
- ❌ Usar senha do GitHub (use token)
- ❌ Deixar tokens em arquivos commitados

## 📚 Mais Informações

- **Git Credential Store**: https://git-scm.com/docs/git-credential-store
- **GitHub Personal Access Tokens**: https://github.com/settings/tokens
- **Git Credential Helpers**: https://git-scm.com/book/en/v2/Git-Tools-Credential-Storage

---

**Configuração concluída!** ✅

Agora você pode usar `git push` e `git pull` sem problemas!

