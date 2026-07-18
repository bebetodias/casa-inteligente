-- Habilitar a extensão para geração de UUIDs (se não estiver ativada)
create extension if not exists "uuid-ossp";

-- 1. CRIAÇÃO DAS TABELAS

-- Tabela de perfis
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  nome text not null,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabela de Casas
create table public.casas (
  id uuid default uuid_generate_v4() primary key,
  nome text not null,
  codigo_convite text unique,
  token_convite text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabela de relacionamento Membros da Casa
create table public.membros_casa (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  casa_id uuid references public.casas(id) on delete cascade not null,
  criado_em timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, casa_id)
);

-- Tabela de Compras
create table public.compras (
  id uuid default uuid_generate_v4() primary key,
  casa_id uuid references public.casas(id) on delete cascade not null,
  nome text not null,
  categoria text not null,
  comprado boolean default false not null,
  criado_por uuid references public.profiles(id),
  criado_em timestamp with time zone default timezone('utc'::text, now()) not null
);


-- 2. HABILITAR ROW LEVEL SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.casas enable row level security;
alter table public.membros_casa enable row level security;
alter table public.compras enable row level security;


-- 3. CRIAÇÃO DAS POLÍTICAS DE SEGURANÇA (POLICIES)

-- Políticas para 'profiles'
create policy "Perfis são visíveis para todos."
  on profiles for select
  using ( true );

create policy "Usuários podem atualizar o próprio perfil."
  on profiles for update
  using ( auth.uid() = id );

-- Políticas para 'casas'
create policy "Usuários podem ver a casa se forem membros"
  on casas for select
  using ( exists (
    select 1 from membros_casa
    where membros_casa.casa_id = casas.id
    and membros_casa.user_id = auth.uid()
  ));

create policy "Usuários autenticados podem criar casas"
  on casas for insert
  with check ( auth.uid() is not null );

create policy "Usuários podem atualizar a casa se forem membros"
  on casas for update
  using ( exists (
    select 1 from membros_casa
    where membros_casa.casa_id = casas.id
    and membros_casa.user_id = auth.uid()
  ));

-- Políticas para 'membros_casa'
create policy "Usuários podem ver membros da sua casa"
  on membros_casa for select
  using ( exists (
    select 1 from membros_casa as mc
    where mc.casa_id = membros_casa.casa_id
    and mc.user_id = auth.uid()
  ) or user_id = auth.uid() );

create policy "Usuários podem se adicionar a uma casa"
  on membros_casa for insert
  with check ( auth.uid() = user_id );

-- Políticas para 'compras'
create policy "Membros da casa podem ver as compras da casa"
  on compras for select
  using ( exists (
    select 1 from membros_casa
    where membros_casa.casa_id = compras.casa_id
    and membros_casa.user_id = auth.uid()
  ));

create policy "Membros da casa podem inserir compras na casa"
  on compras for insert
  with check ( exists (
    select 1 from membros_casa
    where membros_casa.casa_id = compras.casa_id
    and membros_casa.user_id = auth.uid()
  ));

create policy "Membros da casa podem atualizar compras da casa"
  on compras for update
  using ( exists (
    select 1 from membros_casa
    where membros_casa.casa_id = compras.casa_id
    and membros_casa.user_id = auth.uid()
  ));

create policy "Membros da casa podem deletar compras da casa"
  on compras for delete
  using ( exists (
    select 1 from membros_casa
    where membros_casa.casa_id = compras.casa_id
    and membros_casa.user_id = auth.uid()
  ));


-- 4. TRIGGERS E FUNÇÕES

-- Função para criar automaticamente o 'profile' ao cadastrar no Supabase Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nome)
  values (new.id, new.raw_user_meta_data->>'nome');
  return new;
end;
$$;

-- Trigger que chama a função acima quando um usuário é inserido na tabela auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Para Realtime funcionar na tabela compras
drop publication if exists supabase_realtime;
create publication supabase_realtime;
alter publication supabase_realtime add table compras;
