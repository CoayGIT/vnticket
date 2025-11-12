# 🔍 Verificar Status do Supabase

## ✅ Status Atual

### Configuração:
- ✅ **Prisma Schema**: Configurado para PostgreSQL
- ✅ **DATABASE_URL**: Configurada no `server/.env`
- ✅ **Projeto Supabase**: `https://exzyywcdclgzafbqsfkg.supabase.co`
- ⚠️ **Migrações**: Precisam ser verificadas

## 🔍 Como Verificar se Está Vinculado

### 1. Verificar Conexão

Execute no terminal:

```bash
cd server
npm run prisma:generate
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.\$connect().then(() => { console.log('✅ Conexão funcionando!'); prisma.\$disconnect(); }).catch((err) => { console.log('❌ Erro:', err.message); });"
```

### 2. Verificar Tabelas

Acesse o Supabase:
1. Acesse: https://exzyywcdclgzafbqsfkg.supabase.co
2. Vá em **Table Editor**
3. Verifique se as seguintes tabelas existem:
   - ✅ User
   - ✅ Event
   - ✅ TicketType
   - ✅ Order
   - ✅ Ticket

### 3. Verificar Connection String

No arquivo `server/.env`, verifique se a `DATABASE_URL` está correta:

```env
DATABASE_URL=postgresql://postgres:AdminTicket2025@db.exzyywcdclgzafbqsfkg.supabase.co:5432/postgres?schema=public
```

## ⚠️ Se as Tabelas NÃO Existem

Execute as migrações:

### Opção 1: Via SQL Editor (Recomendado)

1. Acesse: https://exzyywcdclgzafbqsfkg.supabase.co
2. Vá em **SQL Editor** → **New query**
3. Execute o SQL do arquivo `EXECUTAR_MIGRACOES_SUPABASE.md`

### Opção 2: Via Prisma (se conseguir conectar)

```bash
cd server
npm run prisma:generate
npm run prisma:migrate:deploy
```

## 🔄 Se a Conexão NÃO Funciona

### Usar Connection Pooling (Recomendado)

1. No Supabase: **Settings** → **Database**
2. Vá em **Connection pooling**
3. Selecione **Session mode**
4. Copie a connection string
5. Substitua `[YOUR-PASSWORD]` por `AdminTicket2025`
6. Atualize no `server/.env`:

```env
DATABASE_URL=postgresql://postgres.xxxxx:AdminTicket2025@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

## ✅ Verificar Funcionamento

### Teste 1: Criar um Usuário

Execute o servidor:

```bash
cd server
npm run dev
```

Faça uma requisição de registro e verifique no Supabase se o usuário foi criado.

### Teste 2: Criar um Evento

Crie um evento e verifique no Supabase se foi salvo.

### Teste 3: Verificar no Supabase

1. Acesse: https://exzyywcdclgzafbqsfkg.supabase.co
2. Vá em **Table Editor**
3. Verifique se os dados estão sendo salvos em tempo real

## 📊 Status do Banco de Dados

### Configurado:
- ✅ Prisma Schema (PostgreSQL)
- ✅ DATABASE_URL configurada
- ✅ Projeto Supabase identificado

### Precisa Verificar:
- ⚠️ Migrações executadas?
- ⚠️ Tabelas criadas?
- ⚠️ Conexão funcionando?
- ⚠️ Dados sendo salvos?

## 🎯 Próximos Passos

1. **Verificar tabelas no Supabase**
   - Acesse: https://exzyywcdclgzafbqsfkg.supabase.co
   - Vá em **Table Editor**
   - Verifique se as tabelas existem

2. **Se as tabelas NÃO existem:**
   - Execute as migrações via SQL Editor
   - Ou via Prisma (se conseguir conectar)

3. **Testar conexão:**
   - Execute o servidor
   - Crie um usuário
   - Verifique no Supabase se foi salvo

4. **Se a conexão NÃO funciona:**
   - Use connection pooling (porta 6543)
   - Ou habilite conexões externas no Supabase

---

**Status**: Configurado, mas precisa verificar se as migrações foram executadas! 🔍

