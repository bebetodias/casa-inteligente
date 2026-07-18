-- Adiciona a coluna 'criado_por' preenchida automaticamente com o ID de quem está logado
alter table public.casas 
  add column if not exists criado_por uuid references auth.users(id) default auth.uid();

-- Remove a política antiga
drop policy if exists "Usuários podem ver a casa se forem membros" on casas;

-- Cria a nova política permitindo que o criador veja a casa recém-criada
create policy "Usuários podem ver a casa se forem membros"
  on casas for select
  using ( 
    criado_por = auth.uid() 
    or 
    exists (
      select 1 from membros_casa
      where membros_casa.casa_id = casas.id
      and membros_casa.user_id = auth.uid()
    )
  );
