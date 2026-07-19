import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const code = 'tk_12345';
  
  // First, create a dummy house with this token to test
  const { data: authData } = await supabase.auth.signUp({
    email: `test_${Date.now()}@test.com`, password: 'password123', options: { data: { nome: 'Tester' } }
  });
  
  const { data: newCasa } = await supabase.from('casas').insert([{ nome: 'Token Home' }]).select().single();
  await supabase.from('membros_casa').insert([{ user_id: authData.user.id, casa_id: newCasa.id }]);
  await supabase.from('casas').update({ token_convite: code }).eq('id', newCasa.id);

  const { data, error } = await supabase.rpc('validar_codigo_convite', { termo: code });
  console.log('RPC Validation Data for Token:', data);
  console.log('RPC Validation Error for Token:', error);
}

test();
