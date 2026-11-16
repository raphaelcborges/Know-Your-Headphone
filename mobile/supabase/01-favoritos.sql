-- Favoritos do Know Your Headphone.
--
-- Rode uma vez no Supabase: SQL Editor → New query → cole tudo → Run.
--
-- O catálogo continua no app (src/data/products.ts); aqui guardamos só quem
-- salvou o quê. Por isso `produto_id` é texto: é o mesmo `id` do catálogo.

create table if not exists public.favoritos (
  usuario_id  uuid        not null references auth.users (id) on delete cascade,
  produto_id  text        not null,
  criado_em   timestamptz not null default now(),
  primary key (usuario_id, produto_id)
);

-- Consulta mais comum: "meus favoritos, mais recentes primeiro".
create index if not exists favoritos_por_usuario
  on public.favoritos (usuario_id, criado_em desc);

-- Sem isto, qualquer pessoa com a chave publishable leria os favoritos de todo
-- mundo. Com RLS ligada e nenhuma policy, ninguém lê nada — as policies abaixo
-- liberam só as próprias linhas.
alter table public.favoritos enable row level security;

drop policy if exists "cada um lê os próprios favoritos" on public.favoritos;
create policy "cada um lê os próprios favoritos"
  on public.favoritos for select
  using (auth.uid() = usuario_id);

drop policy if exists "cada um salva os próprios favoritos" on public.favoritos;
create policy "cada um salva os próprios favoritos"
  on public.favoritos for insert
  with check (auth.uid() = usuario_id);

drop policy if exists "cada um apaga os próprios favoritos" on public.favoritos;
create policy "cada um apaga os próprios favoritos"
  on public.favoritos for delete
  using (auth.uid() = usuario_id);
