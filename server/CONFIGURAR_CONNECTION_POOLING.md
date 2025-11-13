# 🔧 Configurar Connection Pooling do Supabase

## ⚠️ Problema Atual

Você está recebendo o erro:
```
Error querying the database: FATAL: Tenant or user not found
```

Isso indica que a connection string de pooling está com formato incorreto.

## ✅ Solução: Obter Connection String Correta do Supabase

### Passo 1: Acessar o Dashboard do Supabase

1. Acesse: https://exzyywcdclgzafbqsfkg.supabase.co
2. Faça login no dashboard

### Passo 2: Obter Connection String de Pooling

1. No menu lateral, vá em **Settings** → **Database**
2. Role até a seção **"Connection string"**
3. Clique na aba **"Connection pooling"**
4. Selecione **"Session mode"** (recomendado para Prisma)
5. Copie a connection string completa

A connection string deve ter um formato similar a:
```
postgresql://postgres.exzyywcdclgzafbqsfkg:[YOUR-PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Passo 3: Atualizar o arquivo .env

1. Abra o arquivo `server/.env`
2. Localize a linha `DATABASE_URL=`
3. Substitua pela connection string que você copiou
4. **IMPORTANTE**: Substitua `[YOUR-PASSWORD]` pela senha real do banco (AdminTicket2025)

Exemplo final:
```env
DATABASE_URL=postgresql://postgres.exzyywcdclgzafbqsfkg:AdminTicket2025@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Passo 4: Testar a Conexão

Após atualizar, teste a conexão:

```bash
cd server
npm run check:festa-cor
```

Se funcionar, você verá informações sobre o evento ou uma mensagem dizendo que o evento não foi encontrado.

## 🔄 Alternativa: Usar Connection String Direta (se Pooling não funcionar)

Se o pooling não funcionar, você pode tentar habilitar conexões externas:

1. No Supabase Dashboard, vá em **Settings** → **Database**
2. Verifique se há uma opção **"Allow connections from outside"**
3. Se houver, habilite e aguarde alguns minutos
4. Use a connection string direta (porta 5432):

```env
DATABASE_URL=postgresql://postgres:AdminTicket2025@db.exzyywcdclgzafbqsfkg.supabase.co:5432/postgres?schema=public
```

## 📝 Nota sobre Pooling

- **Session mode**: Recomendado para Prisma e aplicações que usam transações
- **Transaction mode**: Mais eficiente, mas pode ter limitações com algumas queries
- **Porta 6543**: Porta padrão para connection pooling do Supabase

## ✅ Após Configurar Corretamente

Depois de configurar a connection string correta:

1. Teste a conexão: `npm run check:festa-cor`
2. Se o evento não existir, crie-o: `npm run create:festa-cor`
3. Inicie o servidor: `npm run dev`

