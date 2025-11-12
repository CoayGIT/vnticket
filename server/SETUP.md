# Guia de Instalação Rápida

## 1. Instalar Dependências

```bash
cd server
npm install
```

## 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na pasta `server` com o seguinte conteúdo:

```env
PORT=3001
FRONTEND_URL=http://localhost:8080
JWT_SECRET=vn_ticket_jwt_secret_change_in_production_2025_secure_key
JWT_REFRESH_SECRET=vn_ticket_refresh_secret_change_in_production_2025_secure_key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
DATABASE_URL="file:./dev.db"
NODE_ENV=development
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_ROUNDS=12
```

## 3. Configurar Banco de Dados

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## 4. Iniciar Servidor

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3001`

## 5. Testar API

Você pode testar a API fazendo uma requisição para:

```bash
curl http://localhost:3001/health
```

Ou acessando no navegador: `http://localhost:3001/health`

## Próximos Passos

1. Configure o frontend para apontar para a API
2. Teste o cadastro e login
3. Teste a criação de eventos
4. Teste a compra de ingressos

## Troubleshooting

### Erro: "Cannot find module '@prisma/client'"

Execute:
```bash
npm run prisma:generate
```

### Erro: "Database does not exist"

Execute:
```bash
npm run prisma:migrate
```

### Erro: "Port already in use"

Altere a porta no arquivo `.env`:
```env
PORT=3002
```

### Erro: "CORS error"

Verifique se o `FRONTEND_URL` no `.env` está correto e corresponde à URL do frontend.
