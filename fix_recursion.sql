-- Função com 'security definer' para burlar o RLS de forma controlada e evitar recursão infinita
create or replace function public.is_member_of(target_casa_id uuid)
returns boolean
language sql security definer set search_path = public
as $$
  select exists (
    select 1 from membros_casa 
    where user_id = auth.uid() and casa_id = target_casa_id
  );
$$;

-- Removemos a política antiga que causava recursão
drop policy if exists "Usuários podem ver membros da sua casa" on membros_casa;

-- Criamos a nova política usando a função que resolve o problema
create policy "Usuários podem ver membros da sua casa"
  on membros_casa for select
  using ( is_member_of(casa_id) or user_id = auth.uid() );
