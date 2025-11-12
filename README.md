# Site VN Ticket - Sistema de Venda de Ingressos

Sistema completo de venda de ingressos com frontend React e backend Node.js seguro.

## 🚀 Funcionalidades

- ✅ Autenticação segura com JWT
- ✅ Cadastro e login de usuários
- ✅ Listagem de eventos
- ✅ Detalhes de eventos
- ✅ Compra de ingressos
- ✅ Dashboard com ingressos do usuário
- ✅ Histórico de compras
- ✅ Validação de CPF
- ✅ Rate limiting
- ✅ Proteção contra SQL injection
- ✅ Criptografia de senhas
- ✅ CORS configurado
- ✅ Validação de dados

## 🛡️ Segurança

O backend implementa as seguintes medidas de segurança:

- **Autenticação JWT** com refresh tokens
- **Hash de senhas** com bcrypt (12 rounds)
- **Validação de dados** com Zod
- **Rate limiting** para prevenir DDoS
- **Helmet** para headers de segurança HTTP
- **CORS** configurado
- **Prisma ORM** (proteção contra SQL injection)
- **Validação de CPF**
- **Sanitização de inputs**
- **Logging de segurança**
- **Proteção de rotas sensíveis**
- **Transações de banco de dados**

## 📦 Instalação

### Backend

1. Entre na pasta do servidor:
```bash
cd server
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure as variáveis necessárias.

4. Configure o banco de dados:
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Inicie o servidor:
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3001`

### Frontend

1. Na raiz do projeto, instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

O frontend estará rodando em `http://localhost:8080`

## 📁 Estrutura do Projeto

```
.
├── server/                 # Backend
│   ├── src/
│   │   ├── controllers/    # Controladores
│   │   ├── middleware/     # Middlewares
│   │   ├── routes/         # Rotas
│   │   ├── utils/          # Utilitários
│   │   └── index.ts        # Entry point
│   ├── prisma/
│   │   └── schema.prisma   # Schema do banco de dados
│   └── package.json
├── src/                    # Frontend
│   ├── components/         # Componentes React
│   ├── pages/              # Páginas
│   ├── lib/                # Bibliotecas e utilitários
│   └── App.tsx             # App principal
└── package.json
```

## 🔌 API Endpoints

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

## 🔐 Variáveis de Ambiente

### Backend (.env)
- `PORT`: Porta do servidor (padrão: 3001)
- `FRONTEND_URL`: URL do frontend para CORS
- `JWT_SECRET`: Secret para JWT access tokens
- `JWT_REFRESH_SECRET`: Secret para JWT refresh tokens
- `DATABASE_URL`: URL do banco de dados
- `NODE_ENV`: Ambiente (development/production)

### Frontend (.env)
- `VITE_API_URL`: URL da API (padrão: http://localhost:3001/api)

## 🚨 Importante para Produção

1. **Altere os secrets JWT** para valores aleatórios e seguros
2. **Use PostgreSQL** em vez de SQLite
3. **Configure HTTPS**
4. **Configure um reverse proxy** (nginx)
5. **Configure firewall** adequadamente
6. **Monitore logs** de segurança
7. **Use variáveis de ambiente** seguras
8. **Configure backup** do banco de dados

## 📝 Licença

Este projeto é privado e confidencial.

## 👨‍💻 Desenvolvimento

Para desenvolvimento, certifique-se de ter:
- Node.js 18+
- npm ou yarn
- Banco de dados configurado

## 🤝 Contribuindo

Este é um projeto privado. Para contribuições, entre em contato com o administrador do projeto.