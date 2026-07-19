import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkDb() {
  const { data, error } = await supabase.from('casas').select('*');
  console.log('ALL CASAS:', data);
  if(error) console.log(error);
}

checkDb();
