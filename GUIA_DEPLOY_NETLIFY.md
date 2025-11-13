# 🚀 Guia de Deploy no Netlify com Supabase

Este guia explica como fazer o deploy completo do VN TICKET no Netlify com banco de dados Supabase.

## 📋 Pré-requisitos

1. Conta no [Netlify](https://www.netlify.com/)
2. Conta no [Supabase](https://supabase.com/)
3. Conta no [Stripe](https://stripe.com/) (para pagamentos)
4. Git configurado no projeto

---

## 🔧 Parte 1: Configurar Supabase

### 1.1 Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com/) e faça login
2. Clique em **"New Project"**
3. Preencha:
   - **Name**: `vnticket` (ou o nome que preferir)
   - **Database Password**: Crie uma senha forte (anote ela!)
   - **Region**: Escolha a região mais próxima (ex: `South America (São Paulo)`)
4. Clique em **"Create new project"**
5. Aguarde alguns minutos enquanto o projeto é criado

### 1.2 Obter Connection String

1. No dashboard do Supabase, vá em **Settings** → **Database**
2. Role até a seção **"Connection string"**
3. Selecione **"URI"** na aba
4. Copie a connection string (ela será algo como: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`)
5. **IMPORTANTE**: Substitua `[YOUR-PASSWORD]` pela senha que você criou no passo 1.1
6. Adicione `?schema=public` no final:
   ```
   postgresql://postgres:SUA_SENHA@db.xxxxx.supabase.co:5432/postgres?schema=public
   ```

### 1.3 Executar Migrações do Prisma

1. No terminal, vá para a pasta do servidor:
   ```bash
   cd server
   ```

2. Configure a variável de ambiente temporariamente:
   ```bash
   # Windows PowerShell
   $env:DATABASE_URL="postgresql://postgres:SUA_SENHA@db.xxxxx.supabase.co:5432/postgres?schema=public"
   
   # Linux/Mac
   export DATABASE_URL="postgresql://postgres:SUA_SENHA@db.xxxxx.supabase.co:5432/postgres?schema=public"
   ```

3. Gere o Prisma Client:
   ```bash
   npm run prisma:generate
   ```

4. Execute as migrações:
   ```bash
   npm run prisma:migrate
   ```
   
   Quando perguntado sobre o nome da migração, digite: `init`

5. (Opcional) Popular o banco com dados de exemplo:
   ```bash
   npm run prisma:seed
   ```

---

## 🔧 Parte 2: Configurar Variáveis de Ambiente no Netlify

### 2.1 Criar Site no Netlify

1. Acesse [app.netlify.com](https://app.netlify.com/)
2. Clique em **"Add new site"** → **"Import an existing project"**
3. Conecte seu repositório Git (GitHub, GitLab, Bitbucket)
4. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`

### 2.2 Adicionar Variáveis de Ambiente

No dashboard do Netlify, vá em **Site settings** → **Environment variables** e adicione:

#### Variáveis do Frontend:
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_API_BASE_URL=https://seu-site.netlify.app
```

#### Variáveis do Backend (para Netlify Functions):
```
NODE_ENV=production
DATABASE_URL=postgresql://postgres:SUA_SENHA@db.xxxxx.supabase.co:5432/postgres?schema=public
JWT_SECRET=seu_jwt_secret_aqui
JWT_REFRESH_SECRET=seu_jwt_refresh_secret_aqui
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=https://seu-site.netlify.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
NETLIFY=true
```

**⚠️ IMPORTANTE:**
- Substitua `seu-site.netlify.app` pela URL real do seu site no Netlify
- Use as mesmas chaves JWT que você configurou localmente
- Para produção, use as chaves do Stripe em modo **Live** (não test)

---

## 🔧 Parte 3: Configurar Build no Netlify

### 3.1 Criar arquivo `netlify.toml` (já criado)

O arquivo `netlify.toml` já está configurado na raiz do projeto com:
- Build command
- Publish directory
- Functions directory
- Redirects para SPA
- Headers de segurança

### 3.2 Atualizar Scripts de Build

O `package.json` já está configurado. Certifique-se de que o build funciona localmente:

```bash
npm run build
```

---

## 🔧 Parte 4: Configurar Stripe Webhook

### 4.1 Criar Webhook no Stripe

1. Acesse [dashboard.stripe.com](https://dashboard.stripe.com/)
2. Vá em **Developers** → **Webhooks**
3. Clique em **"Add endpoint"**
4. Configure:
   - **Endpoint URL**: `https://seu-site.netlify.app/api/payments/webhook`
   - **Events to send**: Selecione:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `payment_intent.canceled`
5. Clique em **"Add endpoint"**
6. Copie o **Signing secret** (começa com `whsec_`)
7. Adicione no Netlify como `STRIPE_WEBHOOK_SECRET`

---

## 🔧 Parte 5: Fazer Deploy

### 5.1 Push para Git

```bash
git add .
git commit -m "Configuração para deploy no Netlify"
git push
```

### 5.2 Deploy Automático

O Netlify detectará automaticamente o push e fará o deploy.

### 5.3 Verificar Deploy

1. Acesse o dashboard do Netlify
2. Vá em **Deploys**
3. Aguarde o build completar
4. Clique no link do deploy para testar

---

## 🔧 Parte 6: Pós-Deploy

### 6.1 Verificar Funcionamento

1. Acesse `https://seu-site.netlify.app`
2. Teste:
   - ✅ Página inicial carrega
   - ✅ Login/Registro funciona
   - ✅ Listagem de eventos funciona
   - ✅ Criação de pedido funciona
   - ✅ Pagamento com Stripe funciona

### 6.2 Verificar Logs

No Netlify, vá em **Functions** → **api** para ver os logs da API.

### 6.3 Configurar Domínio Customizado (Opcional)

1. No Netlify, vá em **Domain settings**
2. Clique em **"Add custom domain"**
3. Siga as instruções para configurar seu domínio

---

## 🐛 Troubleshooting

### Erro: "Cannot connect to database"

- Verifique se a `DATABASE_URL` está correta no Netlify
- Verifique se o Supabase está ativo
- Verifique se as migrações foram executadas

### Erro: "Prisma Client not generated"

Adicione no `netlify.toml`:
```toml
[build]
  command = "cd server && npm run prisma:generate && cd .. && npm run build"
```

### Erro: "Function timeout"

Netlify Functions têm timeout de 10s (free) ou 26s (pro). Para operações longas, considere:
- Usar um serviço separado para o backend (Railway, Render)
- Otimizar queries do banco
- Usar Netlify Pro para timeout maior

### Erro: "CORS"

Verifique se `FRONTEND_URL` no Netlify está correto e inclui o protocolo `https://`

---

## 📝 Checklist Final

- [ ] Projeto criado no Supabase
- [ ] Migrações executadas no Supabase
- [ ] Variáveis de ambiente configuradas no Netlify
- [ ] Webhook do Stripe configurado
- [ ] Deploy realizado com sucesso
- [ ] Site funcionando corretamente
- [ ] Testes de pagamento realizados

---

## 🎉 Pronto!

Seu site está no ar! 🚀

Para atualizações futuras, basta fazer `git push` e o Netlify fará o deploy automaticamente.




