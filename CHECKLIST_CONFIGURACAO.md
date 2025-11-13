# 📋 Checklist Completo de Configuração - VN TICKET

## ✅ Checklist de Configuração

### 🔧 1. Backend - Variáveis de Ambiente (`server/.env`)

```env
# Porta do servidor
PORT=3001

# URL do frontend (para CORS)
FRONTEND_URL=http://localhost:8080
# Em produção: https://vnticket.com.br

# JWT Secrets (OBRIGATÓRIO: gerar strings aleatórias seguras)
# Execute no terminal: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Execute DUAS vezes para gerar JWT_SECRET e JWT_REFRESH_SECRET
JWT_SECRET=COLE_AQUI_A_PRIMEIRA_STRING_GERADA
JWT_REFRESH_SECRET=COLE_AQUI_A_SEGUNDA_STRING_GERADA
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Database
DATABASE_URL="file:./dev.db"
# Em produção: "postgresql://user:password@localhost:5432/vnticket?schema=public"

# Node Environment
NODE_ENV=development
# Em produção: production

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Bcrypt Rounds
BCRYPT_ROUNDS=12

# Stripe (OBRIGATÓRIO para pagamentos reais)
STRIPE_SECRET_KEY=sk_test_... # ou sk_live_... em produção
STRIPE_PUBLISHABLE_KEY=pk_test_... # ou pk_live_... em produção
STRIPE_WEBHOOK_SECRET=whsec_... # Obtido no painel do Stripe
```

**Checklist:**
- [ ] Criar arquivo `server/.env` com as variáveis acima
- [ ] Gerar `JWT_SECRET` (execute: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- [ ] Gerar `JWT_REFRESH_SECRET` (execute novamente o comando acima)
- [ ] Copiar valores gerados para o `.env`

---

### 💳 2. Configuração do Stripe

**Passo a passo:**

1. **Criar conta no Stripe:**
   - [ ] Acessar https://stripe.com
   - [ ] Criar conta
   - [ ] Completar cadastro da empresa

2. **Obter API Keys:**
   - [ ] Acessar: Developers > API keys
   - [ ] Copiar **Publishable key** (começa com `pk_test_` ou `pk_live_`)
   - [ ] Copiar **Secret key** (começa com `sk_test_` ou `sk_live_`)
   - [ ] Colar no arquivo `server/.env`

3. **Configurar Webhook:**
   - [ ] Acessar: Developers > Webhooks
   - [ ] Clicar em "Add endpoint"
   - [ ] URL do endpoint: `https://seu-dominio.com/api/payments/webhook`
   - [ ] Para desenvolvimento local:
     ```bash
     # Instalar Stripe CLI
     # Windows: https://stripe.com/docs/stripe-cli
     # Mac: brew install stripe/stripe-cli/stripe
     # Linux: https://stripe.com/docs/stripe-cli
     
     # Executar:
     stripe listen --forward-to localhost:3001/api/payments/webhook
     ```
   - [ ] Selecionar eventos:
     - [x] `payment_intent.succeeded`
     - [x] `payment_intent.payment_failed`
   - [ ] Copiar **Signing secret** (começa com `whsec_`)
   - [ ] Colar no arquivo `server/.env` como `STRIPE_WEBHOOK_SECRET`

4. **Testar pagamentos:**
   - [ ] Usar cartões de teste:
     - Sucesso: `4242 4242 4242 4242`
     - Falha: `4000 0000 0000 0002`
     - 3D Secure: `4000 0027 6000 3184`
   - [ ] Data: qualquer data futura
   - [ ] CVC: qualquer 3 dígitos
   - [ ] ZIP: qualquer código postal

5. **Modo produção:**
   - [ ] Ativar conta no Stripe
   - [ ] Obter chaves de produção
   - [ ] Configurar webhook em produção
   - [ ] Atualizar variáveis de ambiente

---

### 🗄️ 3. Banco de Dados

**Desenvolvimento (SQLite):**
- [x] Já configurado
- [ ] Executar: `cd server && npm run prisma:generate`
- [ ] Executar: `cd server && npm run prisma:migrate`
- [ ] Executar: `cd server && npm run prisma:seed`

**Produção (PostgreSQL):**
- [ ] Instalar PostgreSQL
- [ ] Criar banco de dados:
  ```sql
  CREATE DATABASE vnticket;
  ```
- [ ] Criar usuário:
  ```sql
  CREATE USER vnticket_user WITH PASSWORD 'senha_segura';
  GRANT ALL PRIVILEGES ON DATABASE vnticket TO vnticket_user;
  ```
- [ ] Atualizar `DATABASE_URL` no `.env`:
  ```env
  DATABASE_URL="postgresql://vnticket_user:senha_segura@localhost:5432/vnticket?schema=public"
  ```
- [ ] Executar migrations:
  ```bash
  cd server
  npm run prisma:migrate
  ```

---

### 🔐 4. Segurança

**Secrets JWT:**
- [ ] Gerar `JWT_SECRET` (mínimo 32 caracteres)
- [ ] Gerar `JWT_REFRESH_SECRET` (mínimo 32 caracteres)
- [ ] NUNCA commitar secrets no git
- [ ] Usar valores diferentes para desenvolvimento e produção

**Produção:**
- [ ] Configurar HTTPS
- [ ] Configurar firewall
- [ ] Configurar backup do banco de dados
- [ ] Configurar logs de segurança
- [ ] Monitorar tentativas de acesso
- [ ] Configurar rate limiting adequado
- [ ] Testar proteção contra SQL injection
- [ ] Testar proteção contra XSS
- [ ] Testar validação de dados

---

### 🎨 5. Frontend - Variáveis de Ambiente (`.env` na raiz)

```env
# API URL
VITE_API_URL=http://localhost:3001/api
# Em produção: https://api.vnticket.com.br/api

# Stripe Publishable Key (OBRIGATÓRIO para pagamentos)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... # ou pk_live_... em produção
```

**Checklist:**
- [ ] Criar arquivo `.env` na raiz do projeto
- [ ] Adicionar `VITE_API_URL`
- [ ] Adicionar `VITE_STRIPE_PUBLISHABLE_KEY`
- [ ] Verificar se as variáveis estão sendo carregadas

---

### 🖼️ 6. Favicon e Imagens

**Favicon:**
- [ ] Converter logo para favicon:
  - Usar: https://realfavicongenerator.net/
  - Ou converter manualmente:
    - `favicon.ico` (16x16, 32x32, 48x48)
    - `favicon-16x16.png` (16x16)
    - `favicon-32x32.png` (32x32)
    - `apple-touch-icon.png` (180x180)
- [ ] Colocar arquivos em `public/`
- [ ] Testar se o favicon aparece no navegador

**Imagens para SEO:**
- [ ] Criar `og-image.png` (1200x630px) para Open Graph
- [ ] Colocar em `public/og-image.png`
- [ ] Atualizar URL no `index.html` quando tiver domínio

**Manifest (opcional):**
- [ ] Criar `site.webmanifest`:
  ```json
  {
    "name": "VN TICKET",
    "short_name": "VN TICKET",
    "description": "Sistema de Venda de Ingressos Digitais",
    "icons": [
      {
        "src": "/favicon-192x192.png",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "/favicon-512x512.png",
        "sizes": "512x512",
        "type": "image/png"
      }
    ],
    "theme_color": "#0ea5e9",
    "background_color": "#ffffff",
    "display": "standalone"
  }
  ```

---

### 🔍 7. SEO

**Meta Tags:**
- [x] Atualizar `index.html` com meta tags completas
- [ ] Atualizar domínio nas URLs quando tiver domínio próprio
- [ ] Adicionar Google Analytics (opcional)
- [ ] Adicionar Google Tag Manager (opcional)

**Sitemap:**
- [ ] Criar `public/sitemap.xml`:
  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://vnticket.com.br/</loc>
      <lastmod>2025-01-01</lastmod>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
    </url>
    <url>
      <loc>https://vnticket.com.br/eventos</loc>
      <lastmod>2025-01-01</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>https://vnticket.com.br/login</loc>
      <lastmod>2025-01-01</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.5</priority>
    </url>
  </urlset>
  ```

**Google Search Console:**
- [ ] Criar conta no Google Search Console
- [ ] Verificar propriedade do site
- [ ] Enviar sitemap
- [ ] Configurar indexação

**Google Analytics (opcional):**
- [ ] Criar conta no Google Analytics
- [ ] Obter ID de rastreamento
- [ ] Adicionar script no `index.html`

---

### 🚀 8. Deploy e Produção

**Domínio e DNS:**
- [ ] Registrar domínio (ex: vnticket.com.br)
- [ ] Configurar DNS:
  - [ ] A record para o servidor
  - [ ] CNAME para www (opcional)
- [ ] Configurar SSL/HTTPS (Let's Encrypt ou similar)
- [ ] Testar acesso via domínio

**Servidor:**
- [ ] Escolher hospedagem:
  - [ ] Vercel (frontend)
  - [ ] Netlify (frontend)
  - [ ] Railway (backend)
  - [ ] Render (backend)
  - [ ] DigitalOcean (full stack)
  - [ ] AWS (full stack)
- [ ] Configurar servidor Node.js
- [ ] Configurar banco de dados PostgreSQL
- [ ] Configurar variáveis de ambiente em produção
- [ ] Configurar backup automático
- [ ] Configurar monitoramento

**Configurações de produção:**
- [ ] Atualizar `NODE_ENV=production`
- [ ] Atualizar `FRONTEND_URL` com domínio real
- [ ] Atualizar `DATABASE_URL` com banco de produção
- [ ] Atualizar chaves do Stripe para produção
- [ ] Configurar webhook do Stripe em produção
- [ ] Atualizar URLs no `index.html`
- [ ] Configurar CORS adequadamente
- [ ] Configurar rate limiting para produção
- [ ] Configurar logs de produção
- [ ] Configurar alertas de erro

---

### 🧪 9. Testes

**Testes Funcionais:**
- [ ] Testar cadastro de usuário
- [ ] Testar login
- [ ] Testar logout
- [ ] Testar listagem de eventos
- [ ] Testar detalhes de evento
- [ ] Testar compra de ingressos
- [ ] Testar pagamento com Stripe
- [ ] Testar geração de QR codes
- [ ] Testar validação de ingressos
- [ ] Testar dashboard
- [ ] Testar histórico de compras
- [ ] Testar download de ingressos

**Testes de Segurança:**
- [ ] Testar rate limiting
- [ ] Testar validação de dados
- [ ] Testar autenticação JWT
- [ ] Testar CORS
- [ ] Testar SQL injection (deve ser bloqueado)
- [ ] Testar XSS (deve ser bloqueado)
- [ ] Testar validação de CPF
- [ ] Testar validação de senha
- [ ] Testar proteção de rotas

**Testes de Performance:**
- [ ] Testar tempo de carregamento
- [ ] Testar tempo de resposta da API
- [ ] Testar com múltiplos usuários
- [ ] Testar com muitos eventos
- [ ] Otimizar imagens
- [ ] Otimizar queries do banco

---

### 📦 10. Instalação e Configuração Inicial

**Backend:**
```bash
# 1. Instalar dependências
cd server
npm install

# 2. Configurar banco de dados
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# 3. Iniciar servidor
npm run dev
```

**Frontend:**
```bash
# 1. Instalar dependências
npm install

# 2. Remover lovable-tagger (se ainda estiver)
npm uninstall lovable-tagger

# 3. Iniciar servidor de desenvolvimento
npm run dev
```

**Verificações:**
- [ ] Backend rodando na porta 3001
- [ ] Frontend rodando na porta 8080
- [ ] Banco de dados criado
- [ ] Migrations executadas
- [ ] Seed executado (eventos de exemplo criados)
- [ ] Variáveis de ambiente configuradas
- [ ] Stripe configurado (ou modo desenvolvimento sem Stripe)

---

### 🐛 11. Troubleshooting

**Erro: "Failed to fetch"**
- [ ] Verificar se backend está rodando
- [ ] Verificar se a porta está correta
- [ ] Verificar se CORS está configurado
- [ ] Verificar se a URL da API está correta
- [ ] Verificar console do navegador para mais detalhes

**Erro: "Cannot find module"**
- [ ] Executar `npm install`
- [ ] Executar `npm run prisma:generate`
- [ ] Limpar cache: `rm -rf node_modules package-lock.json && npm install`

**Erro: "Database does not exist"**
- [ ] Verificar `DATABASE_URL` no `.env`
- [ ] Executar `npm run prisma:migrate`
- [ ] Verificar permissões do banco de dados

**Erro: "Port already in use"**
- [ ] Alterar porta no `.env`
- [ ] Ou parar processo que está usando a porta

**Erro: "Stripe error"**
- [ ] Verificar se as chaves do Stripe estão corretas
- [ ] Verificar se o webhook está configurado
- [ ] Verificar logs do Stripe
- [ ] Testar com cartão de teste

---

### 📝 12. Documentação

**Arquivos de documentação:**
- [x] `README.md` - Documentação geral
- [x] `README_STRIPE_QRCODE.md` - Documentação de Stripe e QR codes
- [x] `server/README.md` - Documentação do backend
- [x] `server/STRIPE_SETUP.md` - Configuração do Stripe
- [x] `server/SETUP.md` - Guia de instalação
- [x] `CHECKLIST_CONFIGURACAO.md` - Este arquivo

**Atualizar documentação:**
- [ ] Atualizar URLs quando tiver domínio
- [ ] Atualizar screenshots
- [ ] Adicionar instruções de deploy
- [ ] Adicionar troubleshooting

---

## 🎯 Resumo Rápido

### Configuração Mínima para Funcionar:

1. **Backend:**
   - [ ] Criar `server/.env` com variáveis básicas
   - [ ] Gerar secrets JWT
   - [ ] Executar `npm install`
   - [ ] Executar `npm run prisma:generate`
   - [ ] Executar `npm run prisma:migrate`
   - [ ] Executar `npm run prisma:seed`

2. **Frontend:**
   - [ ] Criar `.env` com `VITE_API_URL`
   - [ ] Executar `npm install`
   - [ ] Remover `lovable-tagger` (já feito)
   - [ ] Executar `npm run dev`

3. **Stripe (Opcional):**
   - [ ] Criar conta no Stripe
   - [ ] Obter API keys
   - [ ] Configurar webhook
   - [ ] Adicionar chaves no `.env`

### Para Produção:

1. **Backend:**
   - [ ] Configurar PostgreSQL
   - [ ] Configurar HTTPS
   - [ ] Configurar variáveis de ambiente de produção
   - [ ] Configurar backup
   - [ ] Configurar monitoramento

2. **Frontend:**
   - [ ] Atualizar URLs no `index.html`
   - [ ] Configurar domínio
   - [ ] Configurar SSL/HTTPS
   - [ ] Otimizar build

3. **Stripe:**
   - [ ] Ativar conta
   - [ ] Obter chaves de produção
   - [ ] Configurar webhook em produção
   - [ ] Testar pagamentos reais

---

## 🔗 Links Úteis

- **Stripe:** https://stripe.com
- **Stripe Dashboard:** https://dashboard.stripe.com
- **Stripe API Docs:** https://stripe.com/docs/api
- **Stripe CLI:** https://stripe.com/docs/stripe-cli
- **Prisma Docs:** https://www.prisma.io/docs
- **PostgreSQL:** https://www.postgresql.org
- **Real Favicon Generator:** https://realfavicongenerator.net
- **Google Search Console:** https://search.google.com/search-console
- **Google Analytics:** https://analytics.google.com

---

## 📞 Suporte

Se precisar de ajuda com a configuração, verifique:
1. Logs do servidor
2. Console do navegador
3. Documentação dos serviços utilizados
4. Troubleshooting acima

---

**Última atualização:** 2025-01-01




