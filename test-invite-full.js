import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const email = `test_${Date.now()}@test.com`;
  
  console.log('Signing up...');
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password: 'password123',
    options: { data: { nome: 'Tester' } }
  });
  
  if (authError) { console.error('Sign up error', authError); return; }

  console.log('Creating house...');
  const { data: newCasa, error: casaError } = await supabase
    .from('casas')
    .insert([{ nome: 'Test Home' }])
    .select()
    .single();
    
  if (casaError) { console.error('House error', casaError); return; }
  
  console.log('Generating invite...');
  const codigo = Math.random().toString(36).slice(2, 8).toUpperCase();
  const token = `tk_${Math.random().toString(36).slice(2)}`;
  
  const { data: casaUpdate, error: updateError } = await supabase
    .from('casas')
    .update({ codigo_convite: codigo, token_convite: token })
    .eq('id', newCasa.id)
    .select()
    .single();

  if (updateError) { console.error('Update error', updateError); return; }

  console.log('Invite code generated:', codigo);

  // Now logout and test validation as a guest
  await supabase.auth.signOut();
  console.log('Logged out.');

  console.log('Testing RPC validate...');
  const { data, error } = await supabase.rpc('validar_codigo_convite', { termo: codigo });
  console.log('RPC Data:', data);
  console.log('RPC Error:', error);
}

test();
