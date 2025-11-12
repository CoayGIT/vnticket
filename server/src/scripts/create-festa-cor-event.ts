import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const prisma = new PrismaClient();

async function createFestaCorEvent() {
  try {
    console.log('🎨 Criando evento Festa de Cor - Dia da Consciência Negra...');
    console.log('');

    // Primeiro, tentar usar Prisma (se conexão funcionar)
    try {
      console.log('📝 Tentativa 1: Usando Prisma Client...');
      const existingEvent = await prisma.event.findFirst({
        where: {
          name: {
            contains: 'Festa de Cor',
          },
        },
        include: {
          ticketTypes: true,
        },
      });

      if (existingEvent) {
        console.log('✅ Evento "Festa de Cor" já existe!');
        console.log('📋 ID do evento:', existingEvent.id);
        console.log('🎫 Tipos de ingresso:');
        existingEvent.ticketTypes.forEach((ticketType) => {
          console.log(`   - ${ticketType.name}: R$ ${ticketType.price.toFixed(2)} (${ticketType.available} disponíveis)`);
        });
        console.log('');
        console.log('🎉 Evento já está disponível para compra!');
        return;
      }

      // Criar o evento usando Prisma
      const event = await prisma.event.create({
        data: {
          name: 'Festa de Cor - Dia da Consciência Negra',
          description: `DA RUA AO RIO apresenta: Festa de Cor - Dia da Consciência Negra

Uma celebração vibrante e colorida em homenagem ao Dia da Consciência Negra! 

DATA: 20 de Novembro (Quinta-feira)
HORARIO: A partir das 09h
LOCAL: SINSERP - Juazeiro

ATRACOES:
• Xandão da Bahia
• João Sereno
• Grupo Samba Raízes
• Coco Kaaporã
• Capoeira Embondeiro

ATIVIDADES:
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
                available: 500,
              },
            ],
          },
        },
        include: {
          ticketTypes: true,
        },
      });

      console.log('✅ Evento criado com sucesso via Prisma!');
      console.log('📋 Detalhes:');
      console.log('   ID:', event.id);
      console.log('   Nome:', event.name);
      console.log('   Data:', event.date);
      console.log('   Horário:', event.time);
      console.log('   Local:', event.location);
      console.log('   Categoria:', event.category);
      console.log('🎫 Tipos de ingresso:');
      event.ticketTypes.forEach((ticketType) => {
        console.log(`   - ${ticketType.name}: R$ ${ticketType.price.toFixed(2)} (${ticketType.available} disponíveis)`);
      });
      console.log('');
      console.log('🎉 Evento disponível para compra!');
      return;
    } catch (prismaError: any) {
      if (prismaError.message?.includes("Can't reach database") || prismaError.code === 'P1001') {
        console.log('⚠️  Prisma não conseguiu conectar. Tentando via API REST...');
        console.log('');
        // Continuar para tentar via API REST
      } else {
        throw prismaError;
      }
    }

    // Se Prisma falhou, tentar via API REST
    console.log('📝 Tentativa 2: Usando Supabase API REST...');
    await createEventViaSupabaseAPI();

  } catch (error: any) {
    console.error('❌ Erro ao criar evento:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function createEventViaSupabaseAPI() {
  // Extrair informações da DATABASE_URL
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('DATABASE_URL não configurada no arquivo .env');
  }

  // Extrair project reference da URL
  const match = dbUrl.match(/@db\.([^.]+)\.supabase\.co/);
  if (!match) {
    throw new Error('Não foi possível extrair project reference da DATABASE_URL');
  }

  const projectRef = match[1];
  const supabaseUrl = `https://${projectRef}.supabase.co`;

  console.log('📋 Informações do Supabase:');
  console.log('   Project Reference:', projectRef);
  console.log('   Supabase URL:', supabaseUrl);
  console.log('');

  // Obter chave de API
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!anonKey) {
    throw new Error('SUPABASE_ANON_KEY não configurada no arquivo .env');
  }

  console.log('🔑 Usando Anon Key');
  console.log('');

  // Primeiro, verificar se o evento já existe
  console.log('🔍 Verificando se o evento já existe...');
  const checkEventResponse = await fetch(`${supabaseUrl}/rest/v1/Event?name=eq.Festa de Cor - Dia da Consciência Negra&select=id,name`, {
    method: 'GET',
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
  });

  if (!checkEventResponse.ok) {
    const errorText = await checkEventResponse.text();
    throw new Error(`Erro ao verificar evento: ${checkEventResponse.status} ${checkEventResponse.statusText}\n${errorText}`);
  }

  const existingEvents = await checkEventResponse.json();
  
  let eventId: string;

  if (existingEvents && existingEvents.length > 0) {
    console.log('✅ Evento já existe!');
    eventId = existingEvents[0].id;
    console.log('   ID:', eventId);
  } else {
    // Criar o evento
    console.log('📝 Criando evento...');
    eventId = randomUUID();
    const createEventResponse = await fetch(`${supabaseUrl}/rest/v1/Event`, {
      method: 'POST',
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        id: eventId,
        name: 'Festa de Cor - Dia da Consciência Negra',
        description: `DA RUA AO RIO apresenta: Festa de Cor - Dia da Consciência Negra

Uma celebração vibrante e colorida em homenagem ao Dia da Consciência Negra! 

DATA: 20 de Novembro (Quinta-feira)
HORARIO: A partir das 09h
LOCAL: SINSERP - Juazeiro

ATRACOES:
• Xandão da Bahia
• João Sereno
• Grupo Samba Raízes
• Coco Kaaporã
• Capoeira Embondeiro

ATIVIDADES:
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    });

    if (!createEventResponse.ok) {
      const errorText = await createEventResponse.text();
      throw new Error(`Erro ao criar evento: ${createEventResponse.status} ${createEventResponse.statusText}\n${errorText}`);
    }

    const createdEvent = await createEventResponse.json();
    const finalEventId = Array.isArray(createdEvent) ? createdEvent[0].id : createdEvent.id;
    eventId = finalEventId || eventId;
    console.log('✅ Evento criado com sucesso!');
    console.log('   ID:', eventId);
    console.log('   Nome: Festa de Cor - Dia da Consciência Negra');
    console.log('   Data: 20 de Novembro 2025');
    console.log('   Horário: 09:00');
    console.log('   Local: SINSERP - Juazeiro');
    console.log('   Categoria: Cultura');
  }

  // Verificar se o tipo de ingresso já existe
  console.log('');
  console.log('🔍 Verificando tipo de ingresso...');
  const checkTicketTypeResponse = await fetch(`${supabaseUrl}/rest/v1/TicketType?eventId=eq.${eventId}&name=eq.Ingresso Geral&select=id,name,price,available`, {
    method: 'GET',
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (checkTicketTypeResponse.ok) {
    const existingTicketTypes = await checkTicketTypeResponse.json();
    
    if (!existingTicketTypes || existingTicketTypes.length === 0) {
      // Criar o tipo de ingresso
      console.log('📝 Criando tipo de ingresso...');
      const ticketTypeId = randomUUID();
      const createTicketTypeResponse = await fetch(`${supabaseUrl}/rest/v1/TicketType`, {
        method: 'POST',
        headers: {
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          id: ticketTypeId,
          eventId: eventId,
          name: 'Ingresso Geral',
          price: 50.00,
          available: 500,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!createTicketTypeResponse.ok) {
        const errorText = await createTicketTypeResponse.text();
        throw new Error(`Erro ao criar tipo de ingresso: ${createTicketTypeResponse.status} ${createTicketTypeResponse.statusText}\n${errorText}`);
      }

      console.log('✅ Tipo de ingresso criado com sucesso!');
      console.log('   Nome: Ingresso Geral');
      console.log('   Preço: R$ 50,00');
      console.log('   Disponíveis: 500');
    } else {
      console.log('✅ Tipo de ingresso já existe!');
      const ticketType = existingTicketTypes[0];
      console.log('   Nome:', ticketType.name);
      console.log('   Preço: R$', ticketType.price.toFixed(2));
      console.log('   Disponíveis:', ticketType.available);
    }
  }

  console.log('');
  console.log('🎉 Evento "Festa de Cor - Dia da Consciência Negra" está disponível para compra!');
  console.log('');
}

createFestaCorEvent()
  .then(() => {
    console.log('✅ Processo concluído com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  });
