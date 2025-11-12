# Configuração do Stripe

## 1. Criar conta no Stripe

1. Acesse https://stripe.com
2. Crie uma conta
3. Complete o cadastro da empresa

## 2. Obter chaves da API

1. No painel do Stripe, vá em **Developers > API keys**
2. Copie a **Publishable key** (chave pública)
3. Copie a **Secret key** (chave secreta) - começa com `sk_`

## 3. Configurar Webhook

1. No painel do Stripe, vá em **Developers > Webhooks**
2. Clique em **Add endpoint**
3. URL do endpoint: `https://seu-dominio.com/api/payments/webhook`
4. Para desenvolvimento local, use o Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3001/api/payments/webhook
   ```
5. Selecione os eventos:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
6. Copie o **Signing secret** (começa com `whsec_`)

## 4. Configurar variáveis de ambiente

No arquivo `.env` do servidor, adicione:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

No arquivo `.env` do frontend, adicione:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 5. Testar pagamentos

Use os cartões de teste do Stripe:
- Sucesso: `4242 4242 4242 4242`
- Falha: `4000 0000 0000 0002`
- 3D Secure: `4000 0027 6000 3184`

Data de validade: qualquer data futura
CVC: qualquer 3 dígitos
ZIP: qualquer código postal

## 6. Modo produção

1. Altere as chaves para as chaves de produção
2. Configure o webhook em produção
3. Atualize as variáveis de ambiente
4. Teste todos os fluxos de pagamento

## Segurança

- **NUNCA** exponha a Secret Key no frontend
- Use apenas a Publishable Key no frontend
- Valide todos os webhooks no backend
- Use HTTPS em produção
- Mantenha as chaves seguras
