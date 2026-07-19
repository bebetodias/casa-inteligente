import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const code = 'TEST-123';
  const { data, error } = await supabase.rpc('validar_codigo_convite', { termo: code });
  console.log('RPC Validation Data:', data);
  console.log('RPC Validation Error:', error);
}

test();
