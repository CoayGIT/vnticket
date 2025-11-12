# Sistema de Pagamento Stripe e QR Codes

## ✅ Funcionalidades Implementadas

### 1. Integração com Stripe
- ✅ Processamento de pagamentos seguro
- ✅ Payment Intents
- ✅ Webhook para processar pagamentos
- ✅ Suporte a cartões de crédito/débito
- ✅ Modo de desenvolvimento (sem Stripe) e produção (com Stripe)

### 2. QR Codes Únicos
- ✅ Geração de QR code único para cada ingresso
- ✅ Hash seguro baseado no código do ingresso
- ✅ Validação de QR codes
- ✅ Exibição de QR codes no dashboard
- ✅ Download de QR codes

### 3. Validação de Ingressos
- ✅ Página de validação para organizadores
- ✅ Validação de QR codes
- ✅ Marcação de ingressos como usados
- ✅ Informações do ingresso na validação
- ✅ Proteção contra QR codes falsificados

## 🚀 Como Usar

### 1. Configurar Stripe (Opcional)

Se quiser usar pagamentos reais, configure o Stripe:

1. Crie uma conta no Stripe: https://stripe.com
2. Obtenha suas chaves da API
3. Configure as variáveis de ambiente (veja `server/STRIPE_SETUP.md`)

**Nota**: Se não configurar o Stripe, o sistema funcionará sem pagamentos (modo desenvolvimento).

### 2. Instalar Dependências

```bash
# Backend
cd server
npm install

# Frontend
npm install
```

### 3. Configurar Banco de Dados

```bash
cd server
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### 4. Configurar Variáveis de Ambiente

**Backend** (`server/.env`):
```env
STRIPE_SECRET_KEY=sk_test_... (opcional)
STRIPE_WEBHOOK_SECRET=whsec_... (opcional)
```

**Frontend** (`.env`):
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... (opcional)
VITE_API_URL=http://localhost:3001/api
```

### 5. Iniciar Servidores

```bash
# Backend
cd server
npm run dev

# Frontend
npm run dev
```

## 📱 Fluxo de Compra

1. **Usuário seleciona evento e ingresso**
2. **Preenche dados do comprador**
3. **Se Stripe estiver configurado:**
   - Cria Payment Intent
   - Mostra checkout do Stripe
   - Processa pagamento
   - Webhook cria ingressos com QR codes
4. **Se Stripe NÃO estiver configurado:**
   - Cria ordem diretamente
   - Gera ingressos com QR codes imediatamente
5. **Usuário vê ingressos no dashboard**
6. **Pode visualizar QR codes dos ingressos**

## 🔍 Validação de Ingressos

### Para Organizadores

1. Acesse `/validate`
2. Escaneie ou digite o QR code do ingresso
3. Sistema valida o QR code
4. Mostra informações do ingresso
5. Marca como usado (opcional)

### Segurança

- QR codes são únicos e não podem ser falsificados
- Hash seguro baseado no código do ingresso
- Validação server-side
- Proteção contra reutilização

## 🎫 QR Codes

### Formato

Cada QR code contém:
- ID do ingresso
- Código do ingresso
- Hash de verificação

### Geração

QR codes são gerados automaticamente quando:
- Ingresso é criado (após pagamento confirmado)
- Pagamento é processado via webhook

### Visualização

Usuários podem:
- Ver QR code no dashboard
- Baixar QR code
- Apresentar QR code na entrada do evento

## 🔐 Segurança

### Pagamentos
- Dados de cartão nunca passam pelo servidor
- Processamento seguro via Stripe
- Webhooks verificados com assinatura
- Transações atômicas

### QR Codes
- Hash seguro (SHA-256)
- Verificação server-side
- Proteção contra falsificação
- Validação única

## 📝 Endpoints da API

### Pagamentos
- `POST /api/orders` - Criar ordem (com Payment Intent se Stripe configurado)
- `POST /api/payments/webhook` - Webhook do Stripe
- `GET /api/payments/status/:orderId` - Verificar status do pagamento

### QR Codes
- `GET /api/tickets/:id/qrcode` - Obter QR code do ingresso
- `POST /api/tickets/validate` - Validar QR code
- `POST /api/tickets/mark-used` - Marcar ingresso como usado

## 🧪 Testando

### Sem Stripe (Desenvolvimento)
1. Deixe variáveis do Stripe vazias
2. Compre ingresso normalmente
3. Ingressos são criados imediatamente

### Com Stripe (Produção)
1. Configure chaves do Stripe
2. Use cartões de teste:
   - Sucesso: `4242 4242 4242 4242`
   - Falha: `4000 0000 0000 0002`
3. Teste webhook localmente com Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3001/api/payments/webhook
   ```

## 📚 Documentação Adicional

- `server/STRIPE_SETUP.md` - Guia completo de configuração do Stripe
- `server/README.md` - Documentação do backend
- `README.md` - Documentação geral do projeto

## 🐛 Troubleshooting

### QR Code não aparece
- Verifique se o ingresso foi criado após pagamento
- Verifique logs do servidor
- Confirme que o pagamento foi processado

### Pagamento não processa
- Verifique configuração do Stripe
- Verifique webhook no painel do Stripe
- Verifique logs do servidor
- Teste com cartão de teste

### Validação falha
- Verifique se o QR code está completo
- Verifique se o ingresso existe no banco
- Verifique logs do servidor

## ✅ Checklist de Produção

- [ ] Configurar chaves do Stripe em produção
- [ ] Configurar webhook em produção
- [ ] Testar fluxo completo de pagamento
- [ ] Testar geração de QR codes
- [ ] Testar validação de ingressos
- [ ] Configurar HTTPS
- [ ] Configurar backup do banco de dados
- [ ] Monitorar logs de segurança
- [ ] Testar com diferentes cartões
- [ ] Validar proteção contra fraude
