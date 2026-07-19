import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const code = process.argv[2] || 'tk_';
  console.log('Testing code:', code);
  const { data, error } = await supabase.rpc('validar_codigo_convite', { termo: code });
  console.log('Data:', data);
  console.log('Error:', error);
}

test();
