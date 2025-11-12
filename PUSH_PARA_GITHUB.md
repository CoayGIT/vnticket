# 🚀 Como Fazer Push para o GitHub

O repositório está configurado e pronto para enviar ao GitHub! Siga os passos abaixo:

## ✅ Status Atual

- ✅ Repositório Git criado localmente
- ✅ 2 commits criados (141 arquivos)
- ✅ Repositório remoto configurado: `https://github.com/CoayGIT/vnticket.git`
- ⚠️ Precisa autenticar para fazer push

## 🔐 Opção 1: Usar Personal Access Token (Recomendado)

### Passo 1: Criar Personal Access Token no GitHub

1. Acesse: https://github.com/settings/tokens
2. Clique em **"Generate new token"** → **"Generate new token (classic)"**
3. Preencha:
   - **Note**: `sitevnticket-push`
   - **Expiration**: Escolha uma duração (ex: 90 dias ou "No expiration")
   - **Select scopes**: Marque `repo` (acesso completo aos repositórios)
4. Clique em **"Generate token"** no final da página
5. **Copie o token** (começa com `ghp_`) - você só verá uma vez!

### Passo 2: Fazer Push com Token

No terminal, execute:

```bash
git push -u origin main
```

Quando pedir credenciais:
- **Username**: `CoayGIT` (ou seu usuário do GitHub)
- **Password**: Cole o **Personal Access Token** (não sua senha!)

## 🔐 Opção 2: Usar GitHub CLI (Mais Fácil)

### Passo 1: Instalar GitHub CLI

Se você não tem o GitHub CLI instalado:

**Windows:**
```bash
winget install GitHub.cli
```

Ou baixe em: https://cli.github.com/

### Passo 2: Autenticar

```bash
gh auth login
```

Siga as instruções na tela para autenticar.

### Passo 3: Fazer Push

```bash
git push -u origin main
```

## 🔐 Opção 3: Configurar Credenciais no Windows (Persistente)

### Passo 1: Instalar Git Credential Manager

Se você não tem o Git Credential Manager:

**Windows:**
```bash
winget install Microsoft.GitCredentialManager
```

Ou baixe em: https://github.com/GitCredentialManager/git-credential-manager/releases

### Passo 2: Configurar Credenciais

```bash
git config --global credential.helper manager-core
```

### Passo 3: Fazer Push

```bash
git push -u origin main
```

Na primeira vez, uma janela do navegador abrirá para você autenticar. Use seu Personal Access Token.

## 📋 Comandos para Executar

Depois de autenticar, execute:

```bash
# Verificar status
git status

# Ver commits
git log --oneline

# Fazer push
git push -u origin main
```

## ✅ Verificar no GitHub

Após o push bem-sucedido:

1. Acesse: https://github.com/CoayGIT/vnticket
2. Verifique se todos os arquivos estão lá
3. Verifique se os 2 commits aparecem
4. Verifique se não há arquivos `.env` (devem estar no .gitignore)

## 🔄 Comandos para Futuros Pushes

Depois do primeiro push, para enviar alterações futuras:

```bash
# Adicionar alterações
git add .

# Fazer commit
git commit -m "Descrição das alterações"

# Fazer push
git push
```

## 🐛 Troubleshooting

### Erro: "Authentication failed"

- Verifique se o Personal Access Token está correto
- Verifique se o token tem permissão `repo`
- Verifique se o token não expirou

### Erro: "Repository not found"

- Verifique se o repositório existe no GitHub
- Verifique se você tem permissão de escrita no repositório
- Verifique se a URL do repositório está correta: `https://github.com/CoayGIT/vnticket.git`

### Erro: "Permission denied"

- Verifique se você tem acesso ao repositório
- Verifique se o Personal Access Token tem permissão `repo`
- Verifique se você está autenticado corretamente

## 🎉 Próximos Passos

Após fazer o push:

1. ✅ Conectar ao Netlify para deploy automático
2. ✅ Configurar variáveis de ambiente no Netlify
3. ✅ Fazer deploy do site

Consulte `GUIA_DEPLOY_NETLIFY.md` para instruções detalhadas.

---

**Pronto para fazer push!** 🚀

Escolha uma das opções acima e faça o push para o GitHub!

