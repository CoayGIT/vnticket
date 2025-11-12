# Backend - Site VN Ticket

Backend seguro para sistema de venda de ingressos.

## Segurança Implementada

- ✅ Autenticação JWT com refresh tokens
- ✅ Hash de senhas com bcrypt (12 rounds)
- ✅ Validação de dados com Zod
- ✅ Rate limiting para prevenir ataques DDoS
- ✅ Helmet para headers de segurança HTTP
- ✅ CORS configurado
- ✅ Prisma ORM (proteção contra SQL injection)
- ✅ Validação de CPF
- ✅ Sanitização de inputs
- ✅ Logging de segurança
- ✅ Proteção de rotas sensíveis
- ✅ Transações de banco de dados

## Configuração

1. Instale as dependências:
```bash
cd server
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure:
- `JWT_SECRET`: String aleatória segura para JWT
- `JWT_REFRESH_SECRET`: String aleatória segura para refresh tokens
- `DATABASE_URL`: URL do banco de dados
- `FRONTEND_URL`: URL do frontend (para CORS)

3. Configure o banco de dados:
```bash
npm run prisma:generate
npm run prisma:migrate
```

4. Inicie o servidor:
```bash
npm run dev
```

## API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/refresh` - Renovar token

### Eventos
- `GET /api/events` - Listar eventos
- `GET /api/events/:id` - Obter evento por ID
- `POST /api/events` - Criar evento (requer autenticação)
- `PUT /api/events/:id` - Atualizar evento (requer autenticação)
- `DELETE /api/events/:id` - Deletar evento (requer autenticação)

### Pedidos
- `POST /api/orders` - Criar pedido (requer autenticação)
- `GET /api/orders` - Listar pedidos do usuário (requer autenticação)
- `GET /api/orders/:id` - Obter pedido por ID (requer autenticação)

### Ingressos
- `GET /api/tickets` - Listar ingressos do usuário (requer autenticação)
- `GET /api/tickets/:id` - Obter ingresso por ID (requer autenticação)
- `GET /api/tickets/code/:code` - Obter ingresso por código (requer autenticação)

## Variáveis de Ambiente

- `PORT`: Porta do servidor (padrão: 3001)
- `FRONTEND_URL`: URL do frontend para CORS
- `JWT_SECRET`: Secret para JWT access tokens
- `JWT_REFRESH_SECRET`: Secret para JWT refresh tokens
- `JWT_EXPIRES_IN`: Tempo de expiração do access token (padrão: 15m)
- `JWT_REFRESH_EXPIRES_IN`: Tempo de expiração do refresh token (padrão: 7d)
- `DATABASE_URL`: URL do banco de dados
- `NODE_ENV`: Ambiente (development/production)
- `RATE_LIMIT_WINDOW_MS`: Janela de tempo para rate limiting (padrão: 900000)
- `RATE_LIMIT_MAX_REQUESTS`: Máximo de requisições por janela (padrão: 100)
- `BCRYPT_ROUNDS`: Rounds do bcrypt (padrão: 12)

## Produção

Para produção, certifique-se de:
1. Usar um banco de dados PostgreSQL (não SQLite)
2. Configurar secrets JWT seguros e aleatórios
3. Configurar HTTPS
4. Configurar variáveis de ambiente adequadas
5. Usar um reverse proxy (nginx)
6. Configurar firewall adequadamente
7. Monitorar logs de segurança
