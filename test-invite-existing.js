import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const { data } = await supabase.from('casas').select('*');
  console.log('Casas:', data);
  
  if(data && data.length > 0) {
     const code = data[data.length -1].codigo_convite;
     if(code) {
       console.log('Testing validate for code:', code);
       const { data: valData, error: valError } = await supabase.rpc('validar_codigo_convite', { termo: code });
       console.log('valData:', valData);
       console.log('valError:', valError);
     }
  }
}

test();
