# 🔧 Variáveis de Ambiente para Netlify

## 📋 Configuração no Netlify Dashboard

Acesse: **Site settings** → **Environment variables** → **Add variable**

---

## ✅ Variáveis Obrigatórias

### Backend (Netlify Functions)

Adicione estas variáveis no Netlify:

```env
# Database
DATABASE_URL=postgresql://postgres:AdminTicket2025@db.exzyywcdclgzafbqsfkg.supabase.co:5432/postgres?schema=public

# Supabase API (para fallback quando Prisma não conectar)
SUPABASE_URL=https://exzyywcdclgzafbqsfkg.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4enl5d2NkY2xnemFmYnFzZmtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMzk5OTcsImV4cCI6MjA3ODM5OTk5N30.nvJ_9ltSuuQTBRxJ7W_McxJSv20uEL_St92CX0uPBFs

# Ambiente
NODE_ENV=production
NETLIFY=true

# Frontend URL (substitua pela URL do seu site no Netlify)
FRONTEND_URL=https://vnticket.netlify.app

# JWT Secrets (gere novos secrets para produção!)
JWT_SECRET=vn_ticket_jwt_secret_change_in_production_2025_secure_key
JWT_REFRESH_SECRET=vn_ticket_refresh_secret_change_in_production_2025_secure_key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Stripe (adicione suas chaves do Stripe)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Bcrypt
BCRYPT_ROUNDS=12
```

### Frontend (Build-time)

```env
# API URL (será /api em produção, que redireciona para Netlify Functions)
VITE_API_URL=/api

# Stripe Publishable Key (adicione sua chave pública do Stripe)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

---

## 🎯 Passo a Passo

### 1. Acessar Netlify Dashboard

1. Acesse: https://app.netlify.com/
2. Selecione seu site (ou crie um novo)
3. Vá em **Site settings** → **Environment variables**

### 2. Adicionar Variáveis

Para cada variável acima:
1. Clique em **Add variable**
2. Digite o **Key** (nome da variável)
3. Digite o **Value** (valor da variável)
4. Clique em **Save**

### 3. Importante

- **FRONTEND_URL**: Substitua `https://vnticket.netlify.app` pela URL real do seu site
- **JWT_SECRET e JWT_REFRESH_SECRET**: Gere novos secrets para produção:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **Stripe Keys**: Use as chaves do Stripe (test ou live, conforme necessário)

### 4. Fazer Deploy

Após adicionar todas as variáveis:

1. Faça commit e push das alterações
2. O Netlify fará deploy automaticamente
3. Ou clique em **Trigger deploy** → **Deploy site**

---

## ✅ Verificação

Após o deploy, verifique:

1. **API funcionando**: Acesse `https://seu-site.netlify.app/api/events`
   - Deve retornar o evento "Festa de Cor - Dia da Consciência Negra"

2. **Frontend funcionando**: Acesse `https://seu-site.netlify.app/eventos`
   - Deve mostrar os cards dos eventos
   - Deve ter botão "Ver Detalhes"
   - Deve ter botão "Comprar Ingresso"

3. **Evento visível**: 
   - Card com imagem
   - Nome: "Festa de Cor - Dia da Consciência Negra"
   - Data: "20 de Novembro 2025"
   - Local: "SINSERP - Juazeiro"
   - Preço: "R$ 50,00"

---

## 🔄 Connection Pooling (Opcional - Recomendado)

Para melhor performance, use connection pooling:

1. No Supabase Dashboard → **Settings** → **Database**
2. Aba **"Connection pooling"**
3. Selecione **"Session mode"**
4. Copie a connection string
5. Substitua `DATABASE_URL` no Netlify pela connection string de pooling

Formato:
```
postgresql://postgres.exzyywcdclgzafbqsfkg:AdminTicket2025@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

---

## 📝 Status Atual

✅ **Evento criado no banco de dados**
✅ **API configurada com fallback para Supabase**
✅ **Frontend pronto com cards bonitinhos**
✅ **Netlify Functions configurado**
✅ **Pronto para deploy!**

**Próximo passo:** Adicionar as variáveis de ambiente no Netlify e fazer deploy!

