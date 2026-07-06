create table public.todos (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

alter table public.todos enable row level security;

grant select on public.todos to anon, authenticated;

create policy "todos are publicly readable"
  on public.todos
  for select
  to anon, authenticated
  using (true);

insert into public.todos (name) values
  ('Buy groceries'),
  ('Finish project'),
  ('Call dentist');
