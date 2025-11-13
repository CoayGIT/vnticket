# 🎯 Próximos Passos - Resolver Conexão e Verificar Evento

## 📋 Situação Atual

- ✅ Connection string configurada no `.env`
- ✅ Senha correta: `AdminTicket2025`
- ❌ Conexão direta (porta 5432) bloqueada pelo Supabase
- ❓ Evento "Festa de Cor" - status desconhecido

## 🚀 Escolha uma opção:

### ✅ Opção 1: Habilitar "Allow all IPs" (2 minutos)

1. Acesse: https://exzyywcdclgzafbqsfkg.supabase.co
2. Settings → Database
3. Procure "Network restrictions" ou "IP Allowlist"
4. Habilite "Allow all IPs"
5. Aguarde 2-3 minutos
6. Execute: `npm run check:festa-cor`

**Se funcionar:**
- ✅ Conexão estabelecida
- Verá se o evento existe ou não
- Se não existir, execute: `npm run create:festa-cor`

---

### ✅ Opção 2: Usar Connection Pooling (5 minutos - Recomendado)

1. No Supabase Dashboard → Settings → Database
2. Aba "Connection pooling"
3. Selecione "Session mode"
4. Copie a connection string completa
5. Envie para mim ou atualize o `.env` manualmente
6. Execute: `npm run check:festa-cor`

**Vantagens:**
- ✅ Funciona de qualquer lugar
- ✅ Não precisa configurar IPs
- ✅ Melhor para produção

---

### ✅ Opção 3: Verificar/Criar via SQL Editor (3 minutos)

**Verificar se o evento existe:**
1. SQL Editor no Supabase
2. Execute:
```sql
SELECT 
  e.id,
  e.name,
  e.date,
  e.time,
  e.location,
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
GROUP BY e.id, e.name, e.date, e.time, e.location;
```

**Se o evento não existir, criar:**
1. Abra o arquivo `CRIAR_EVENTO_FESTA_COR.sql` (na raiz do projeto)
2. Copie todo o conteúdo
3. Cole no SQL Editor do Supabase
4. Execute (Run)

---

## 📝 Após Resolver a Conexão

Depois que conseguir conectar:

1. **Verificar evento:**
   ```bash
   npm run check:festa-cor
   ```

2. **Se o evento não existir, criar:**
   ```bash
   npm run create:festa-cor
   ```

3. **Iniciar servidor:**
   ```bash
   npm run dev
   ```

4. **Testar API:**
   - Acesse: http://localhost:3001/api/events
   - Deve listar os eventos disponíveis

---

## 🎯 Recomendação

**Para desenvolvimento local:** Opção 1 (Allow all IPs) - mais rápido
**Para produção:** Opção 2 (Connection Pooling) - mais robusto

Qual opção você quer tentar primeiro?

