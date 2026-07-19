import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const email = `test_${Date.now()}@test.com`;
  
  // 1. Criar user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password: 'password123',
    options: { data: { nome: 'Tester' } }
  });
  if (authError) { console.error('Sign up error', authError); return; }

  // 2. Criar casa
  const { data: newCasa, error: casaError } = await supabase
    .from('casas')
    .insert([{ nome: 'Test Home' }])
    .select()
    .single();
  if (casaError) { console.error('House error', casaError); return; }
  
  // 3. Vincular user a casa (se não tiver policy, pode falhar mas o trigger pode criar? Não, authStore insere manual)
  const { error: membroError } = await supabase
    .from('membros_casa')
    .insert([{ user_id: authData.user.id, casa_id: newCasa.id }]);
  if (membroError) { console.error('Member error', membroError); return; }
  
  // 4. Gerar convite (UPDATE na casa)
  const codigo = 'TEST-123';
  const { data: casaUpdate, error: updateError } = await supabase
    .from('casas')
    .update({ codigo_convite: codigo })
    .eq('id', newCasa.id)
    .select()
    .single();

  if (updateError) { 
    console.error('Update error on casas! RLS blocks update!', updateError); 
  } else {
    console.log('Update success!', casaUpdate);
  }
}

test();
