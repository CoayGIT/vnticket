import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../../.env') });

const SUPABASE_URL = 'https://exzyywcdclgzafbqsfkg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4enl5d2NkY2xnemFmYnFzZmtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMzk5OTcsImV4cCI6MjA3ODM5OTk5N30.nvJ_9ltSuuQTBRxJ7W_McxJSv20uEL_St92CX0uPBFs';

async function checkEventViaAPI() {
  try {
    console.log('🔍 Verificando evento via Supabase API...');
    console.log('');

    // Buscar eventos que contenham "Festa de Cor"
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/Event?name=ilike.%25Festa%20de%20Cor%25&select=*,TicketType(*)`,
      {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na API: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const events = await response.json();

    if (events && events.length > 0) {
      const event = events[0];
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
      
      if (event.TicketType && event.TicketType.length > 0) {
        event.TicketType.forEach((ticketType: any) => {
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
    console.error('❌ Erro ao verificar evento:', error.message);
    throw error;
  }
}

checkEventViaAPI()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  });

