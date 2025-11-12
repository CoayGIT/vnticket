import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Criar eventos de exemplo
  const event1 = await prisma.event.create({
    data: {
      name: 'Future Tech Expo 2025',
      description: 'O maior evento de tecnologia do Brasil! Palestras com especialistas, workshops práticos, networking e exposição das últimas inovações em tecnologia, IA, blockchain e desenvolvimento de software.',
      date: '15-17 Dezembro 2025',
      time: '09:00-18:00',
      location: 'Centro de Convenções, Brasília - DF',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200',
      category: 'Tecnologia',
      ticketTypes: {
        create: [
          {
            name: 'Passe Completo - 3 Dias',
            price: 450.00,
            available: 120,
          },
          {
            name: 'Ingresso VIP',
            price: 850.00,
            available: 30,
          },
          {
            name: 'Ingresso 1 Dia',
            price: 180.00,
            available: 250,
          },
        ],
      },
    },
  });

  const event2 = await prisma.event.create({
    data: {
      name: 'Electronic Music Festival',
      description: 'Festival de música eletrônica com os maiores DJs do mundo. Uma experiência única de música, luzes e tecnologia.',
      date: '20 Janeiro 2026',
      time: '20:00-06:00',
      location: 'Arena Open Air, São Paulo - SP',
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200',
      category: 'Música',
      ticketTypes: {
        create: [
          {
            name: 'Ingresso Pista',
            price: 280.00,
            available: 500,
          },
          {
            name: 'Ingresso VIP',
            price: 550.00,
            available: 100,
          },
        ],
      },
    },
  });

  const event3 = await prisma.event.create({
    data: {
      name: 'Business Summit 2026',
      description: 'Conferência de negócios com palestrantes internacionais. Networking, cases de sucesso e insights sobre o futuro dos negócios.',
      date: '10-12 Fevereiro 2026',
      time: '08:00-19:00',
      location: 'Centro de Eventos, Rio de Janeiro - RJ',
      image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200',
      category: 'Negócios',
      ticketTypes: {
        create: [
          {
            name: 'Passe Completo',
            price: 450.00,
            available: 200,
          },
          {
            name: 'Ingresso 1 Dia',
            price: 180.00,
            available: 300,
          },
        ],
      },
    },
  });

  console.log('Eventos criados:', { event1, event2, event3 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
