import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testCodes() {
  console.log('Testing code ACNFXZ...');
  const res1 = await supabase.rpc('validar_codigo_convite', { termo: 'ACNFXZ' });
  console.log('Result for ACNFXZ:', res1.data, res1.error);

  console.log('Testing code EPLNAG...');
  const res2 = await supabase.rpc('validar_codigo_convite', { termo: 'EPLNAG' });
  console.log('Result for EPLNAG:', res2.data, res2.error);
  
  console.log('Testing token tk_6eh2ovq5fn9...');
  const res3 = await supabase.rpc('validar_codigo_convite', { termo: 'tk_6eh2ovq5fn9' });
  console.log('Result for token:', res3.data, res3.error);
}

testCodes();
