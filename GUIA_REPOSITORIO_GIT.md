# 📦 Guia: Conectar Repositório ao GitHub

O repositório Git local foi criado com sucesso! Agora você precisa conectá-lo ao GitHub.

## ✅ O que já foi feito:

- ✅ Repositório Git inicializado
- ✅ Arquivos adicionados ao Git
- ✅ Commit inicial criado (141 arquivos)
- ✅ Branch renomeada para `main`
- ✅ `.gitignore` configurado (protegendo arquivos sensíveis)

## 🚀 Próximos Passos:

### 1. Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Preencha:
   - **Repository name**: `sitevnticket` (ou outro nome de sua escolha)
   - **Description**: `Sistema completo de venda de ingressos com React e Node.js`
   - **Visibility**: 
     - 🔒 **Private** (recomendado) - para projetos privados
     - 🌐 **Public** - se quiser que seja público
   - **❌ NÃO marque** "Initialize this repository with a README" (já temos um)
   - **❌ NÃO marque** "Add .gitignore" (já temos um)
   - **❌ NÃO marque** "Choose a license" (a menos que queira)
3. Clique em **"Create repository"**

### 2. Conectar Repositório Local ao GitHub

Após criar o repositório no GitHub, você verá uma página com instruções. Use uma das opções abaixo:

#### Opção A: HTTPS (Recomendado)

```bash
# Adicionar repositório remoto (substitua SEU-USUARIO pelo seu usuário do GitHub)
git remote add origin https://github.com/SEU-USUARIO/sitevnticket.git

# Verificar se foi adicionado
git remote -v
```

#### Opção B: SSH

Se você tem SSH configurado no GitHub:

```bash
# Adicionar repositório remoto (substitua SEU-USUARIO pelo seu usuário do GitHub)
git remote add origin git@github.com:SEU-USUARIO/sitevnticket.git

# Verificar se foi adicionado
git remote -v
```

### 3. Fazer Push para o GitHub

```bash
# Fazer push para o GitHub
git push -u origin main
```

**Se solicitado credenciais:**
- **Username**: Seu usuário do GitHub
- **Password**: Use um **Personal Access Token** (não use sua senha do GitHub)

### 4. Criar Personal Access Token (se necessário)

Se o GitHub pedir autenticação:

1. Acesse: https://github.com/settings/tokens
2. Clique em **"Generate new token"** → **"Generate new token (classic)"**
3. Preencha:
   - **Note**: `sitevnticket-local`
   - **Expiration**: Escolha uma duração (ex: 90 dias)
   - **Select scopes**: Marque `repo` (acesso completo aos repositórios)
4. Clique em **"Generate token"**
5. **Copie o token** (você só verá uma vez!)
6. Use este token como senha ao fazer push

## ✅ Verificar

Após o push, acesse seu repositório no GitHub e verifique:

- ✅ Todos os arquivos estão lá
- ✅ README.md está visível
- ✅ Não há arquivos `.env` (devem estar no .gitignore)
- ✅ Não há `node_modules` (devem estar no .gitignore)

## 🔄 Comandos Úteis

### Verificar status
```bash
git status
```

### Ver histórico de commits
```bash
git log --oneline
```

### Verificar repositórios remotos
```bash
git remote -v
```

### Fazer push de alterações futuras
```bash
git add .
git commit -m "Descrição das alterações"
git push
```

### Atualizar repositório local
```bash
git pull
```

## 🔐 Segurança

### ✅ Arquivos Protegidos (NÃO serão commitados):

- `.env` (variáveis de ambiente)
- `server/.env` (variáveis de ambiente do servidor)
- `node_modules/` (dependências)
- `dist/` (builds)
- `*.db` (banco de dados local)
- `.netlify/` (arquivos do Netlify)

### ⚠️ Importante:

- **NUNCA** commite arquivos `.env`
- **NUNCA** commite secrets do JWT
- **NUNCA** commite chaves do Stripe
- **NUNCA** commite senhas do banco de dados

## 🚀 Próximo Passo: Deploy no Netlify

Após conectar ao GitHub:

1. Acesse: https://app.netlify.com
2. Clique em **"Add new site"** → **"Import an existing project"**
3. Conecte seu repositório GitHub
4. O Netlify detectará automaticamente as configurações do `netlify.toml`
5. Configure as variáveis de ambiente no Netlify
6. Faça o deploy!

Consulte `GUIA_DEPLOY_NETLIFY.md` para instruções detalhadas.

---

**Repositório criado com sucesso! 🎉**

Agora você pode:
- ✅ Fazer push para o GitHub
- ✅ Colaborar com outros desenvolvedores
- ✅ Fazer deploy automático no Netlify
- ✅ Versionar seu código

