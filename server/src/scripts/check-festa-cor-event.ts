import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../../.env') });

const prisma = new PrismaClient();

async function checkFestaCorEvent() {
  try {
    console.log('🔍 Verificando se o evento "Festa de Cor - Dia da Consciência Negra" está disponível...');
    console.log('');

    const event = await prisma.event.findFirst({
      where: {
        name: {
          contains: 'Festa de Cor',
        },
      },
      include: {
        ticketTypes: true,
      },
    });

    if (event) {
      console.log('✅ Evento encontrado!');
      console.log('');
      console.log('📋 Informações do Evento:');
      console.log('   ID:', event.id);
      console.log('   Nome:', event.name);
      console.log('   Data:', event.date);
      console.log('   Horário:', event.time);
      console.log('   Local:', event.location);
      console.log('   Categoria:', event.category);
      console.log('');
      console.log('🎫 Tipos de Ingresso:');
      
      if (event.ticketTypes.length > 0) {
        event.ticketTypes.forEach((ticketType) => {
          console.log(`   - ${ticketType.name}:`);
          console.log(`     Preço: R$ ${ticketType.price.toFixed(2)}`);
          console.log(`     Disponíveis: ${ticketType.available}`);
          console.log(`     ID: ${ticketType.id}`);
        });
      } else {
        console.log('   ⚠️  Nenhum tipo de ingresso encontrado!');
      }
      
      console.log('');
      console.log('🎉 O evento está DISPONÍVEL para compra!');
    } else {
      console.log('❌ Evento NÃO encontrado!');
      console.log('');
      console.log('📝 Para criar o evento, execute:');
      console.log('   npm run create:festa-cor');
      console.log('');
      console.log('   Ou execute o script SQL no Supabase:');
      console.log('   CRIAR_EVENTO_FESTA_COR.sql');
    }
  } catch (error: any) {
    if (error.message?.includes("Can't reach database") || error.code === 'P1001') {
      console.error('❌ Erro: Não foi possível conectar ao banco de dados');
      console.error('   Verifique se a DATABASE_URL está configurada corretamente no arquivo .env');
      console.error('');
      console.error('   Detalhes do erro:', error.message);
    } else {
      console.error('❌ Erro ao verificar evento:', error.message);
      throw error;
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkFestaCorEvent()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  });

