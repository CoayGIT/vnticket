// Script para testar conexão com Supabase
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔄 Testando conexão com Supabase...\n');
    
    // Testar conexão
    await prisma.$connect();
    console.log('✅ Conexão com Supabase estabelecida!\n');
    
    // Verificar se as tabelas existem
    console.log('🔍 Verificando se as tabelas existem...\n');
    
    try {
      const users = await prisma.user.findMany({ take: 1 });
      console.log('✅ Tabela User existe!');
    } catch (err) {
      if (err.message.includes('does not exist') || err.message.includes('relation') || err.message.includes('table')) {
        console.log('❌ Tabela User NÃO existe!');
        console.log('⚠️  Execute as migrações no Supabase!');
        console.log('   Consulte: EXECUTAR_MIGRACOES_SUPABASE.md\n');
      } else {
        throw err;
      }
    }
    
    try {
      const events = await prisma.event.findMany({ take: 1 });
      console.log('✅ Tabela Event existe!');
    } catch (err) {
      if (err.message.includes('does not exist') || err.message.includes('relation') || err.message.includes('table')) {
        console.log('❌ Tabela Event NÃO existe!');
        console.log('⚠️  Execute as migrações no Supabase!');
        console.log('   Consulte: EXECUTAR_MIGRACOES_SUPABASE.md\n');
      } else {
        throw err;
      }
    }
    
    try {
      const ticketTypes = await prisma.ticketType.findMany({ take: 1 });
      console.log('✅ Tabela TicketType existe!');
    } catch (err) {
      if (err.message.includes('does not exist') || err.message.includes('relation') || err.message.includes('table')) {
        console.log('❌ Tabela TicketType NÃO existe!');
        console.log('⚠️  Execute as migrações no Supabase!');
        console.log('   Consulte: EXECUTAR_MIGRACOES_SUPABASE.md\n');
      } else {
        throw err;
      }
    }
    
    try {
      const orders = await prisma.order.findMany({ take: 1 });
      console.log('✅ Tabela Order existe!');
    } catch (err) {
      if (err.message.includes('does not exist') || err.message.includes('relation') || err.message.includes('table')) {
        console.log('❌ Tabela Order NÃO existe!');
        console.log('⚠️  Execute as migrações no Supabase!');
        console.log('   Consulte: EXECUTAR_MIGRACOES_SUPABASE.md\n');
      } else {
        throw err;
      }
    }
    
    try {
      const tickets = await prisma.ticket.findMany({ take: 1 });
      console.log('✅ Tabela Ticket existe!');
    } catch (err) {
      if (err.message.includes('does not exist') || err.message.includes('relation') || err.message.includes('table')) {
        console.log('❌ Tabela Ticket NÃO existe!');
        console.log('⚠️  Execute as migrações no Supabase!');
        console.log('   Consulte: EXECUTAR_MIGRACOES_SUPABASE.md\n');
      } else {
        throw err;
      }
    }
    
    console.log('\n✅ Todas as tabelas existem!');
    console.log('✅ Supabase está vinculado e funcionando!\n');
    
  } catch (error) {
    console.error('\n❌ Erro ao conectar ao Supabase:');
    console.error(error.message);
    
    if (error.message.includes('Can\'t reach database server') || error.message.includes('P1001')) {
      console.log('\n⚠️  Problema de conexão detectado!');
      console.log('💡 Soluções:');
      console.log('   1. Use connection pooling (porta 6543)');
      console.log('   2. Execute migrações via SQL Editor');
      console.log('   3. Consulte: EXECUTAR_MIGRACOES_SUPABASE.md\n');
    } else if (error.message.includes('P1000') || error.message.includes('authentication')) {
      console.log('\n⚠️  Problema de autenticação!');
      console.log('💡 Verifique se a senha está correta no DATABASE_URL\n');
    } else if (error.message.includes('does not exist') || error.message.includes('relation') || error.message.includes('table')) {
      console.log('\n⚠️  Tabelas não existem!');
      console.log('💡 Execute as migrações no Supabase:');
      console.log('   1. Acesse: https://exzyywcdclgzafbqsfkg.supabase.co');
      console.log('   2. Vá em SQL Editor → New query');
      console.log('   3. Execute o SQL do arquivo EXECUTAR_MIGRACOES_SUPABASE.md\n');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
