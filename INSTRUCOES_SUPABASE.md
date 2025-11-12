# 🔧 Instruções para Conectar ao Supabase

## ⚠️ Problema de Conexão

Se você está recebendo o erro:
```
Error: P1001: Can't reach database server at `db.exzyywcdclgzafbqsfkg.supabase.co:5432`
```

Isso geralmente acontece porque o Supabase bloqueia conexões diretas de fora por padrão.

## ✅ Soluções

### Opção 1: Usar Connection Pooling (Recomendado)

O Supabase oferece connection pooling na porta **6543**. Use esta connection string:

```
postgresql://postgres.xxxxx:AdminTicket2025@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Como obter:**
1. No dashboard do Supabase, vá em **Settings** → **Database**
2. Role até **"Connection string"**
3. Selecione a aba **"Connection pooling"**
4. Selecione **"Session mode"** ou **"Transaction mode"**
5. Copie a connection string e substitua `[YOUR-PASSWORD]` por `AdminTicket2025`

### Opção 2: Habilitar Conexões Externas

1. No dashboard do Supabase, vá em **Settings** → **Database**
2. Role até **"Connection string"**
3. Verifique se **"Allow connections from outside"** está habilitado
4. Se não estiver, habilite e aguarde alguns minutos

### Opção 3: Executar Migrações via SQL Editor

Se não conseguir conectar via Prisma, você pode executar as migrações diretamente:

1. No dashboard do Supabase, vá em **SQL Editor**
2. Clique em **"New query"**
3. Cole o conteúdo do arquivo `server/prisma/migrations/20250101000000_init/migration.sql`
4. Clique em **"Run"**

## 📝 Connection String Atual

Sua connection string atual está configurada em `server/.env`:

```
DATABASE_URL=postgresql://postgres:AdminTicket2025@db.exzyywcdclgzafbqsfkg.supabase.co:5432/postgres?schema=public
```

## 🔄 Após Resolver a Conexão

Depois de conseguir conectar, execute:

```bash
cd server
npm run prisma:generate
npm run prisma:migrate:deploy
```

Ou se preferir criar uma nova migração:

```bash
npm run prisma:migrate
```

## 🎯 Para Deploy no Netlify

No Netlify, use a connection string com **pooling** (porta 6543) para melhor performance:

```
DATABASE_URL=postgresql://postgres.xxxxx:AdminTicket2025@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

---

**Nota:** A connection string com pooling é mais eficiente para aplicações serverless como Netlify Functions.


