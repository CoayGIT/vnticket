# Como Gerar Secrets JWT Seguros

## Método 1: Usando Node.js

No terminal, execute o comando duas vezes para gerar dois secrets diferentes:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Exemplo de saída:**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

## Método 2: Usando OpenSSL (Linux/Mac)

```bash
openssl rand -hex 32
```

## Método 3: Online (NÃO RECOMENDADO para produção)

- https://www.random.org/strings/
- Gere strings de 64 caracteres (32 bytes em hex)

## O que fazer com os secrets

1. **Primeira execução**: Copie o resultado para `JWT_SECRET` no arquivo `server/.env`
2. **Segunda execução**: Copie o resultado para `JWT_REFRESH_SECRET` no arquivo `server/.env`

**Exemplo de `.env`:**
```env
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
JWT_REFRESH_SECRET=z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4
```

## Importante

- ✅ Use secrets diferentes para desenvolvimento e produção
- ✅ Nunca commite secrets no Git
- ✅ Use pelo menos 32 bytes (64 caracteres em hex)
- ✅ Mantenha os secrets seguros
- ❌ NÃO use secrets de exemplo em produção
- ❌ NÃO compartilhe secrets publicamente
- ❌ NÃO use a mesma string para ambos os secrets



