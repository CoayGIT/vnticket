# 🗄️ Executar Migrações no Supabase

## ⚠️ Problema de Conexão

Se você está recebendo o erro de conexão, a forma mais rápida é executar as migrações diretamente no SQL Editor do Supabase.

## ✅ Passo a Passo

### 1. Acessar SQL Editor

1. Acesse: https://exzyywcdclgzafbqsfkg.supabase.co
2. Faça login no dashboard
3. No menu lateral, clique em **"SQL Editor"**
4. Clique em **"New query"**

### 2. Executar Migrações

Copie e cole o SQL abaixo no editor e clique em **"Run"**:

```sql
-- CreateTable
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "cpf" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "TicketType" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "available" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TicketType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "paymentId" TEXT,
    "stripePaymentIntentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Ticket" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ticketTypeId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "qrCode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'valid',
    "validatedAt" TIMESTAMP(3),
    "validatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "User_cpf_key" ON "User"("cpf");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Event_name_idx" ON "Event"("name");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "TicketType_eventId_idx" ON "TicketType"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Order_stripePaymentIntentId_key" ON "Order"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Order_userId_idx" ON "Order"("userId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Order_stripePaymentIntentId_idx" ON "Order"("stripePaymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Ticket_code_key" ON "Ticket"("code");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Ticket_qrCode_key" ON "Ticket"("qrCode");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Ticket_userId_idx" ON "Ticket"("userId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Ticket_code_idx" ON "Ticket"("code");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Ticket_qrCode_idx" ON "Ticket"("qrCode");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Ticket_status_idx" ON "Ticket"("status");

-- AddForeignKey
ALTER TABLE "TicketType" DROP CONSTRAINT IF EXISTS "TicketType_eventId_fkey";
ALTER TABLE "TicketType" ADD CONSTRAINT "TicketType_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" DROP CONSTRAINT IF EXISTS "Order_userId_fkey";
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT IF EXISTS "Ticket_orderId_fkey";
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT IF EXISTS "Ticket_userId_fkey";
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT IF EXISTS "Ticket_ticketTypeId_fkey";
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_ticketTypeId_fkey" FOREIGN KEY ("ticketTypeId") REFERENCES "TicketType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
```

### 3. Verificar Tabelas Criadas

Após executar o SQL, verifique se as tabelas foram criadas:

1. No dashboard do Supabase, vá em **"Table Editor"**
2. Você deve ver as seguintes tabelas:
   - ✅ User
   - ✅ Event
   - ✅ TicketType
   - ✅ Order
   - ✅ Ticket

## 🔧 Alternativa: Habilitar Conexões Externas

Se preferir usar o Prisma CLI, você pode tentar habilitar conexões externas:

1. No dashboard do Supabase, vá em **Settings** → **Database**
2. Verifique se há uma opção para **"Allow connections from outside"**
3. Se houver, habilite e aguarde alguns minutos
4. Tente executar novamente:
   ```bash
   cd server
   npm run prisma:migrate:deploy
   ```

## 🔄 Usar Connection Pooling (Recomendado para Produção)

Para melhor performance no Netlify, use connection pooling:

1. No dashboard do Supabase, vá em **Settings** → **Database**
2. Role até **"Connection string"**
3. Selecione a aba **"Connection pooling"**
4. Escolha **"Session mode"**
5. Copie a connection string
6. Substitua `[YOUR-PASSWORD]` por `AdminTicket2025`
7. Use essa connection string no Netlify (porta 6543)

## ✅ Após Executar as Migrações

Depois de criar as tabelas, você pode:

1. **Testar a conexão:**
   ```bash
   cd server
   npm run dev
   ```

2. **Popular com dados de exemplo (opcional):**
   ```bash
   npm run prisma:seed
   ```

3. **Abrir Prisma Studio (opcional):**
   ```bash
   npm run prisma:studio
   ```

---

**Nota:** O arquivo SQL também está salvo em `server/prisma/migrations/20250101000000_init/migration.sql` caso precise consultar.



