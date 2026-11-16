-- Estrutura opcional para avaliações moderadas e alertas sincronizados.
-- Execute no SQL Editor do Supabase quando quiser ativar a segunda etapa.

create table if not exists public.avaliacoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  produto_id text not null,
  conforto smallint not null check (conforto between 1 and 5),
  som smallint not null check (som between 1 and 5),
  microfone smallint check (microfone between 1 and 5),
  comentario text check (char_length(comentario) <= 1000),
  status text not null default 'pendente' check (status in ('pendente', 'publicada', 'rejeitada')),
  criado_em timestamptz not null default now(),
  unique (user_id, produto_id)
);

create table if not exists public.alertas_preco (
  user_id uuid not null references auth.users(id) on delete cascade,
  produto_id text not null,
  preco_alvo numeric(10,2) not null check (preco_alvo > 0),
  ativo boolean not null default true,
  criado_em timestamptz not null default now(),
  primary key (user_id, produto_id)
);

create table if not exists public.sugestoes_catalogo (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  produto_id text,
  dados jsonb not null,
  status text not null default 'pendente' check (status in ('pendente', 'aprovada', 'rejeitada')),
  criado_em timestamptz not null default now()
);

alter table public.avaliacoes enable row level security;
alter table public.alertas_preco enable row level security;
alter table public.sugestoes_catalogo enable row level security;

create policy "avaliações publicadas são públicas" on public.avaliacoes
  for select using (status = 'publicada' or auth.uid() = user_id);
create policy "usuário cria a própria avaliação" on public.avaliacoes
  for insert with check (auth.uid() = user_id and status = 'pendente');
create policy "usuário edita avaliação pendente" on public.avaliacoes
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id and status = 'pendente');
create policy "usuário remove a própria avaliação" on public.avaliacoes
  for delete using (auth.uid() = user_id);

create policy "usuário gerencia os próprios alertas" on public.alertas_preco
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "usuário vê as próprias sugestões" on public.sugestoes_catalogo
  for select using (auth.uid() = user_id);
create policy "usuário envia sugestão pendente" on public.sugestoes_catalogo
  for insert with check (auth.uid() = user_id and status = 'pendente');

-- Moderação e alterações de catálogo devem ser feitas pelo painel do Supabase
-- ou por uma função de servidor com service_role; nunca exponha essa chave no app.
