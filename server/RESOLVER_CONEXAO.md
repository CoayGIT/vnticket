# 🔧 Resolver Problema de Conexão com Supabase

## 📋 Situação Atual

A connection string foi atualizada para:
```
postgresql://postgres:AdminTicket123@db.exzyywcdclgzafbqsfkg.supabase.co:5432/postgres?schema=public
```

Mas ainda está dando erro de conexão.

## ✅ Soluções Possíveis

### Opção 1: Habilitar Conexões Externas no Supabase (Recomendado)

1. Acesse o dashboard do Supabase: https://exzyywcdclgzafbqsfkg.supabase.co
2. Vá em **Settings** → **Database**
3. Procure por **"Connection string"** ou **"Network restrictions"**
4. Verifique se há uma opção **"Allow connections from outside"** ou **"Allow all IPs"**
5. Se houver, habilite e aguarde alguns minutos
6. Tente novamente: `npm run check:festa-cor`

### Opção 2: Obter Connection String de Pooling Correta

O pooling é mais confiável e recomendado:

1. No dashboard do Supabase, vá em **Settings** → **Database**
2. Role até **"Connection string"**
3. Clique na aba **"Connection pooling"**
4. Selecione **"Session mode"**
5. Copie a connection string completa (ela já vem no formato correto)
6. Atualize o arquivo `server/.env` com essa connection string
7. Substitua `[YOUR-PASSWORD]` por `AdminTicket123` (se necessário)

### Opção 3: Verificar se o Evento Existe via SQL Editor

Se não conseguir conectar via Prisma, você pode verificar diretamente no Supabase:

1. Acesse o dashboard do Supabase
2. Vá em **SQL Editor**
3. Execute esta query:

```sql
SELECT 
  e.id,
  e.name,
  e.date,
  e.time,
  e.location,
  e.category,
  json_agg(
    json_build_object(
      'id', tt.id,
      'name', tt.name,
      'price', tt.price,
      'available', tt.available
    )
  ) as ticket_types
FROM "Event" e
LEFT JOIN "TicketType" tt ON tt."eventId" = e.id
WHERE e.name LIKE '%Festa de Cor%'
GROUP BY e.id, e.name, e.date, e.time, e.location, e.category;
```

Se o evento não existir, execute o script SQL:
- Abra o arquivo `CRIAR_EVENTO_FESTA_COR.sql`
- Copie e cole no SQL Editor
- Execute

## 🎯 Após Resolver a Conexão

Depois de conseguir conectar:

1. **Verificar se o evento existe:**
   ```bash
   npm run check:festa-cor
   ```

2. **Se o evento não existir, criá-lo:**
   ```bash
   npm run create:festa-cor
   ```

3. **Iniciar o servidor:**
   ```bash
   npm run dev
   ```

## 📝 Nota

A connection string atual no `.env` está configurada, mas o Supabase pode estar bloqueando conexões externas. A melhor solução é usar connection pooling (porta 6543) que é mais confiável e recomendado pelo Supabase.

