import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const prisma = new PrismaClient();

async function createFestaCorEvent() {
  try {
    console.log('🎨 Criando evento Festa de Cor - Dia da Consciência Negra...');

    // Verificar se o evento já existe
    const existingEvent = await prisma.event.findFirst({
      where: {
        name: {
          contains: 'Festa de Cor',
        },
      },
    });

    if (existingEvent) {
      console.log('⚠️  Evento "Festa de Cor" já existe!');
      console.log('ID do evento:', existingEvent.id);
      return;
    }

    // Criar o evento
    const event = await prisma.event.create({
      data: {
        name: 'Festa de Cor - Dia da Consciência Negra',
        description: `DA RUA AO RIO apresenta: Festa de Cor - Dia da Consciência Negra

Uma celebração vibrante e colorida em homenagem ao Dia da Consciência Negra! 

📅 DATA: 20 de Novembro (Quinta-feira)
⏰ HORÁRIO: A partir das 09h
📍 LOCAL: SINSERP - Juazeiro

🎤 ATRAÇÕES:
• Xandão da Bahia
• João Sereno
• Grupo Samba Raízes
• Coco Kaaporã
• Capoeira Embondeiro

🎉 ATIVIDADES:
• Roda de Capoeira
• Feijoada
• Cerveja
• Muita música e diversão!

Venha celebrar a cultura negra com música, dança, comida e muita alegria!`,
        date: '20 de Novembro 2025',
        time: '09:00',
        location: 'SINSERP - Juazeiro',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=800&fit=crop',
        category: 'Cultura',
        ticketTypes: {
          create: [
            {
              name: 'Ingresso Geral',
              price: 50.00,
              available: 500, // 500 ingressos disponíveis
            },
          ],
        },
      },
      include: {
        ticketTypes: true,
      },
    });

    console.log('✅ Evento criado com sucesso!');
    console.log('📋 Detalhes do evento:');
    console.log('   ID:', event.id);
    console.log('   Nome:', event.name);
    console.log('   Data:', event.date);
    console.log('   Horário:', event.time);
    console.log('   Local:', event.location);
    console.log('   Categoria:', event.category);
    console.log('');
    console.log('🎫 Tipos de ingresso:');
    event.ticketTypes.forEach((ticketType) => {
      console.log(`   - ${ticketType.name}: R$ ${ticketType.price.toFixed(2)} (${ticketType.available} disponíveis)`);
    });
    console.log('');
    console.log('🎉 Evento disponível para compra!');
    console.log('');

  } catch (error) {
    console.error('❌ Erro ao criar evento:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createFestaCorEvent()
  .then(() => {
    console.log('✅ Processo concluído!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro:', error);
    process.exit(1);
  });

