import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../../.env') });

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://exzyywcdclgzafbqsfkg.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4enl5d2NkY2xnemFmYnFzZmtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMzk5OTcsImV4cCI6MjA3ODM5OTk5N30.nvJ_9ltSuuQTBRxJ7W_McxJSv20uEL_St92CX0uPBFs';

async function testSupabaseAPI() {
  console.log('🔍 Testando API do Supabase...\n');
  
  // Tentar diferentes nomes de tabela
  const tableNames = ['Event', '"Event"', 'event'];
  
  for (const tableName of tableNames) {
    try {
      console.log(`📋 Tentando tabela: ${tableName}`);
      
      const url = `${SUPABASE_URL}/rest/v1/${tableName}?select=*,TicketType(*)&limit=1`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log(`   Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ Sucesso! Encontrados ${Array.isArray(data) ? data.length : 1} eventos`);
        console.log(`   Estrutura:`, JSON.stringify(data, null, 2).substring(0, 500));
        console.log('\n✅ Use esta tabela:', tableName);
        return tableName;
      } else {
        const errorText = await response.text();
        console.log(`   ❌ Erro: ${errorText.substring(0, 200)}\n`);
      }
    } catch (error: any) {
      console.log(`   ❌ Exceção: ${error.message}\n`);
    }
  }
  
  console.log('❌ Nenhuma tabela funcionou!');
  process.exit(1);
}

testSupabaseAPI()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  });

