-- Script SQL para criar o evento "Festa de Cor - Dia da Consciência Negra"
-- Execute este script no Supabase SQL Editor
-- Link: https://exzyywcdclgzafbqsfkg.supabase.co/project/default/sql

-- Inserir o evento (ignora se já existir)
INSERT INTO "Event" (
  id,
  name,
  description,
  date,
  time,
  location,
  image,
  category,
  "createdAt",
  "updatedAt"
)
SELECT 
  gen_random_uuid()::text,
  'Festa de Cor - Dia da Consciência Negra',
  'DA RUA AO RIO apresenta: Festa de Cor - Dia da Consciência Negra

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

Venha celebrar a cultura negra com música, dança, comida e muita alegria!',
  '20 de Novembro 2025',
  '09:00',
  'SINSERP - Juazeiro',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=800&fit=crop',
  'Cultura',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM "Event" WHERE name = 'Festa de Cor - Dia da Consciência Negra'
);

-- Inserir o tipo de ingresso (R$ 50,00 - 500 ingressos disponíveis)
INSERT INTO "TicketType" (
  id,
  "eventId",
  name,
  price,
  available,
  "createdAt",
  "updatedAt"
)
SELECT 
  gen_random_uuid()::text,
  e.id,
  'Ingresso Geral',
  50.00,
  500,
  NOW(),
  NOW()
FROM "Event" e
WHERE e.name = 'Festa de Cor - Dia da Consciência Negra'
  AND NOT EXISTS (
    SELECT 1 
    FROM "TicketType" tt 
    WHERE tt."eventId" = e.id 
      AND tt.name = 'Ingresso Geral'
  );

-- Verificar se o evento foi criado corretamente
SELECT 
  e.id,
  e.name,
  e.date,
  e.time,
  e.location,
  e.category,
  json_agg(
    json_build_object(
      'id', tt.id,
      'name', tt.name,
      'price', tt.price,
      'available', tt.available
    )
  ) as ticket_types
FROM "Event" e
LEFT JOIN "TicketType" tt ON tt."eventId" = e.id
WHERE e.name = 'Festa de Cor - Dia da Consciência Negra'
GROUP BY e.id, e.name, e.date, e.time, e.location, e.category;
