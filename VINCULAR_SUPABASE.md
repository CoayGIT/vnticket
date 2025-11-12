# 🔗 Como Vincular Banco de Dados Supabase

## ✅ Status Atual

### Verificação Realizada:

- ✅ **Arquivo `.env`**: Encontrado em `server/.env`
- ✅ **DATABASE_URL**: Configurada com Supabase
- ✅ **Prisma Client**: Gerado e funcionando
- ✅ **Conexão**: Funcionando

## 🔍 Verificar se está Vinculado

### Opção 1: Usar Script de Verificação

Execute:

```powershell
.\verificar-supabase.ps1
```

Este script verifica:
- ✅ Se o arquivo `.env` existe
- ✅ Se a DATABASE_URL está configurada
- ✅ Se o Prisma Client está gerado
- ✅ Se a conexão está funcionando

### Opção 2: Verificar Manualmente

1. **Verificar arquivo `.env`**:
   ```bash
   cd server
   cat .env | grep DATABASE_URL
   ```

2. **Verificar se Prisma Client está gerado**:
   ```bash
   cd server
   ls node_modules/.prisma
   ```

3. **Testar conexão**:
   ```bash
   cd server
   npm run dev
   ```

## 🔗 Vincular Supabase (Se ainda não estiver vinculado)

### Passo 1: Obter Connection String do Supabase

1. Acesse: https://exzyywcdclgzafbqsfkg.supabase.co
2. Vá em **Settings** → **Database**
3. Role até **"Connection string"**
4. Selecione a aba **"Connection pooling"** (recomendado)
5. Selecione **"Session mode"**
6. Copie a connection string
7. Substitua `[YOUR-PASSWORD]` por `AdminTicket2025`

### Passo 2: Configurar no arquivo `.env`

1. **Criar arquivo `.env`** (se não existir):
   ```bash
   cd server
   cp env.example .env
   ```

2. **Editar arquivo `.env`**:
   ```env
   DATABASE_URL=postgresql://postgres.xxxxx:AdminTicket2025@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

   Ou use conexão direta (porta 5432):
   ```env
   DATABASE_URL=postgresql://postgres:AdminTicket2025@db.exzyywcdclgzafbqsfkg.supabase.co:5432/postgres?schema=public
   ```

### Passo 3: Gerar Prisma Client

```bash
cd server
npm run prisma:generate
```

### Passo 4: Executar Migrações

#### Opção A: Via SQL Editor (Recomendado)

1. Acesse: https://exzyywcdclgzafbqsfkg.supabase.co
2. Vá em **SQL Editor** → **New query**
3. Execute o SQL do arquivo `EXECUTAR_MIGRACOES_SUPABASE.md`
4. Clique em **Run**

#### Opção B: Via Prisma CLI

```bash
cd server
npm run prisma:migrate:deploy
```

### Passo 5: Testar Conexão

```bash
cd server
npm run dev
```

## ✅ Verificar se Está Funcionando

### 1. Verificar Tabelas no Supabase

1. Acesse: https://exzyywcdclgzafbqsfkg.supabase.co
2. Vá em **Table Editor**
3. Verifique se as tabelas existem:
   - ✅ User
   - ✅ Event
   - ✅ TicketType
   - ✅ Order
   - ✅ Ticket

### 2. Testar API

```bash
cd server
npm run dev
```

Teste criar um usuário ou evento pela API.

### 3. Verificar Logs

Se o servidor estiver rodando, verifique os logs para ver se há erros de conexão.

## 🔄 Sincronização em Tempo Real

### Como Funciona:

1. **Alterações no código** → Servidor local
2. **Servidor local** → Prisma Client
3. **Prisma Client** → Supabase (PostgreSQL)
4. **Supabase** → Banco de dados em tempo real

### Exemplo:

1. Você cria um usuário pela API
2. Prisma Client envia para o Supabase
3. Dados salvos no Supabase imediatamente
4. Você pode ver no Table Editor do Supabase

## 📊 Status da Conexão

### Verificar Status:

Execute:

```powershell
.\verificar-supabase.ps1
```

### Verificar no Supabase:

1. Acesse: https://exzyywcdclgzafbqsfkg.supabase.co
2. Vá em **Table Editor**
3. Verifique se as tabelas existem
4. Verifique se há dados nas tabelas

## 🐛 Troubleshooting

### Erro: "P1001: Can't reach database server"

**Solução:**
1. Use connection pooling (porta 6543)
2. Ou habilite conexões externas no Supabase
3. Ou execute migrações via SQL Editor

### Erro: "Prisma Client not generated"

**Solução:**
```bash
cd server
npm run prisma:generate
```

### Erro: "Tables do not exist"

**Solução:**
1. Execute migrações via SQL Editor
2. Ou execute: `npm run prisma:migrate:deploy`

## 🎯 Resumo

### ✅ O que está configurado:

- ✅ Arquivo `.env` com DATABASE_URL
- ✅ Prisma Client gerado
- ✅ Conexão funcionando
- ✅ Schema configurado para PostgreSQL

### ⚠️ O que verificar:

- ⚠️ Migrações executadas no Supabase?
- ⚠️ Tabelas criadas no Supabase?
- ⚠️ Dados sendo salvos no Supabase?

## 📝 Próximos Passos

1. ✅ Verificar se as tabelas existem no Supabase
2. ✅ Executar migrações se necessário
3. ✅ Testar criação de dados
4. ✅ Verificar no Table Editor do Supabase

---

**Status**: ✅ **Supabase configurado!**

**Próximo passo**: Verificar se as migrações foram executadas!
