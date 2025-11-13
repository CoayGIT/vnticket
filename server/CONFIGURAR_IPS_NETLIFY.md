# 🌐 Configurar IPs do Netlify no Supabase

## 📋 Situação

Você está tentando conectar ao Supabase e precisa configurar os IPs permitidos. Existem duas situações diferentes:

## 🔧 Para Desenvolvimento Local (Seu Computador)

Se você está tentando conectar do seu computador local (não do Netlify), você tem duas opções:

### Opção 1: Permitir Todos os IPs (Mais Fácil)

1. Acesse: https://exzyywcdclgzafbqsfkg.supabase.co
2. Vá em **Settings** → **Database**
3. Procure por **"Network restrictions"** ou **"IP Allowlist"**
4. Se houver a opção **"Allow all IPs"** ou **"Disable IP restrictions"**, habilite
5. Aguarde alguns minutos e teste novamente

### Opção 2: Usar Connection Pooling (Recomendado)

O pooling não precisa de IP whitelist! Use a connection string de pooling:

1. No Supabase Dashboard → **Settings** → **Database**
2. Aba **"Connection pooling"**
3. Selecione **"Session mode"**
4. Copie a connection string completa
5. Atualize o `.env` com essa string

## 🚀 Para Netlify (Produção)

### Opção 1: Usar Connection Pooling (Recomendado - Não Precisa de IP)

**Esta é a melhor opção!** O connection pooling do Supabase funciona sem precisar configurar IPs:

1. No Supabase Dashboard → **Settings** → **Database**
2. Aba **"Connection pooling"**
3. Selecione **"Session mode"**
4. Copie a connection string (formato):
   ```
   postgresql://postgres.exzyywcdclgzafbqsfkg:AdminTicket2025@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```
5. Use essa connection string no Netlify (variável de ambiente `DATABASE_URL`)

**Vantagem:** Não precisa configurar IPs, funciona de qualquer lugar!

### Opção 2: Obter IPs Estáticos do Netlify (Avançado)

Se você realmente precisar usar IPs específicos:

1. **Contatar Suporte do Netlify:**
   - Entre em contato com o suporte do Netlify
   - Solicite ativação do recurso **"Private Connectivity"**
   - Informe se quer para builds, funções ou ambos

2. **Obter os IPs:**
   - Após ativação, vá em **Team settings** → **General** → **Team details** → **Private Connectivity**
   - Você verá a lista de IPs estáticos

3. **Adicionar no Supabase:**
   - No Supabase Dashboard → **Settings** → **Database**
   - Procure por **"Network restrictions"** ou **"IP Allowlist"**
   - Adicione cada IP da lista do Netlify

**Nota:** Private Connectivity está disponível apenas nas regiões:
- `us-east-2` (US East - Ohio)
- `eu-central-1` (EU - Frankfurt)
- `eu-west-2` (EU - Londres)

## ✅ Solução Recomendada

**Para desenvolvimento local E produção, use Connection Pooling!**

1. Não precisa configurar IPs
2. Funciona de qualquer lugar
3. Melhor performance
4. Mais seguro

### Como Configurar:

1. **No Supabase:**
   - Settings → Database → Connection pooling
   - Copie a connection string de "Session mode"

2. **No seu `.env` local:**
   ```env
   DATABASE_URL=postgresql://postgres.exzyywcdclgzafbqsfkg:AdminTicket2025@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

3. **No Netlify:**
   - Site settings → Environment variables
   - Adicione `DATABASE_URL` com a mesma connection string de pooling

## 🔍 Verificar Network Restrictions no Supabase

1. Acesse: https://exzyywcdclgzafbqsfkg.supabase.co
2. Vá em **Settings** → **Database**
3. Role até **"Network restrictions"** ou **"IP Allowlist"**
4. Verifique se está configurado corretamente:
   - Se estiver vazio ou com "Allow all", está OK
   - Se tiver IPs listados, você precisa adicionar os IPs do Netlify (ou usar pooling)

## 📝 Resumo

- **Desenvolvimento Local:** Use pooling OU habilite "Allow all IPs"
- **Netlify:** Use pooling (não precisa de IP)
- **Se precisar de IPs:** Contate suporte Netlify para Private Connectivity

**Recomendação final:** Use connection pooling para tudo! É mais simples e funciona melhor.

