# 🎨 Criar Evento: Festa de Cor - Dia da Consciência Negra

## 📋 Informações do Evento

- **Nome:** Festa de Cor - Dia da Consciência Negra
- **Data:** 20 de Novembro 2025 (Quinta-feira)
- **Horário:** A partir das 09h
- **Local:** SINSERP - Juazeiro
- **Categoria:** Cultura
- **Valor do Ingresso:** R$ 50,00
- **Quantidade Disponível:** 500 ingressos

## 🎫 Atrações

- Xandão da Bahia
- João Sereno
- Grupo Samba Raízes
- Coco Kaaporã
- Capoeira Embondeiro

## 🎉 Atividades

- Roda de Capoeira
- Feijoada
- Cerveja
- Muita música e diversão!

## 🚀 Como Criar o Evento

### ✅ Opção 1: Executar SQL no Supabase SQL Editor (Recomendado e Mais Rápido)

1. **Acesse o Supabase Dashboard:**
   - Link: https://exzyywcdclgzafbqsfkg.supabase.co
   - Faça login no dashboard

2. **Abra o SQL Editor:**
   - No menu lateral, clique em **"SQL Editor"**
   - Clique em **"New query"** (ou use uma query existente)

3. **Execute o Script SQL:**
   - Abra o arquivo `CRIAR_EVENTO_FESTA_COR.sql` no projeto
   - Copie TODO o conteúdo do arquivo
   - Cole no editor SQL do Supabase
   - Clique em **"Run"** (ou pressione `Ctrl+Enter`)

4. **Verifique o Resultado:**
   - Você deve ver uma mensagem de sucesso
   - O último `SELECT` deve mostrar o evento criado com os tipos de ingresso
   - Verifique se aparece:
     - **Nome:** "Festa de Cor - Dia da Consciência Negra"
     - **Data:** "20 de Novembro 2025"
     - **Horário:** "09:00"
     - **Local:** "SINSERP - Juazeiro"
     - **Tipo de Ingresso:** "Ingresso Geral" - R$ 50,00 - 500 disponíveis

### Opção 2: Usar Script Node.js (Requere Connection Pooling)

Se você configurou connection pooling no Supabase, pode executar:

```bash
cd server
npm run create:festa-cor
```

**Nota:** Para usar o script Node.js, você precisa configurar a `DATABASE_URL` com connection pooling (porta 6543) no arquivo `.env`.

## 📝 Verificar Evento Criado

Após criar o evento, você pode verificar:

1. **No Supabase Table Editor:**
   - Acesse **"Table Editor"** no dashboard
   - Selecione a tabela **"Event"**
   - Você deve ver o evento "Festa de Cor - Dia da Consciência Negra"
   - Selecione a tabela **"TicketType"**
   - Você deve ver o tipo de ingresso "Ingresso Geral" com preço R$ 50,00

2. **Via API:**
   - Acesse: `GET /api/events`
   - Você deve ver o evento na lista

3. **No Frontend:**
   - O evento deve aparecer na página de eventos
   - Os usuários podem comprar ingressos por R$ 50,00

## ✅ Evento Disponível para Compra

Após criar o evento, ele estará disponível para compra imediatamente. Os usuários poderão:

1. Visualizar o evento na lista de eventos
2. Ver os detalhes do evento
3. Comprar ingressos por R$ 50,00
4. Realizar o pagamento via Stripe
5. Receber os ingressos por e-mail

## 🔄 Atualizar Evento

Se precisar atualizar o evento, você pode:

1. **Via SQL Editor:** Execute uma query `UPDATE` no Supabase
2. **Via API:** Use `PUT /api/events/:id` (requer autenticação)
3. **Via Prisma Studio:** Execute `npm run prisma:studio` e edite o evento

---

**Nota:** O evento está configurado com 500 ingressos disponíveis. Quando os ingressos esgotarem, o evento não aparecerá mais para compra.

