alter table public.compras
  add column if not exists produto_id text,
  add column if not exists quantidade numeric,
  add column if not exists unidade text,
  add column if not exists preco_sugerido numeric;
