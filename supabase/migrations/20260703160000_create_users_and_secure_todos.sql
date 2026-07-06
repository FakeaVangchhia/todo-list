create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  provider text not null default 'google',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users enable row level security;

grant select, update on public.users to authenticated;

create policy "users can view own profile"
  on public.users
  for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "users can update own profile"
  on public.users
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users (id, email, full_name, avatar_url, provider)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture'),
    coalesce(new.raw_app_meta_data->>'provider', 'google')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

insert into public.users (id, email, full_name, avatar_url, provider)
select
  id,
  email,
  coalesce(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name'),
  coalesce(raw_user_meta_data->>'avatar_url', raw_user_meta_data->>'picture'),
  coalesce(raw_app_meta_data->>'provider', 'google')
from auth.users
on conflict (id) do nothing;

delete from public.todos;

alter table public.todos
  add column user_id uuid references public.users (id) on delete cascade;

alter table public.todos
  alter column user_id set not null;

drop policy if exists "todos are publicly readable" on public.todos;
drop policy if exists "todos are publicly insertable" on public.todos;
drop policy if exists "todos are publicly updatable" on public.todos;
drop policy if exists "todos are publicly deletable" on public.todos;

revoke all on public.todos from anon;
grant select, insert, update, delete on public.todos to authenticated;

create policy "users can view own todos"
  on public.todos
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "users can create own todos"
  on public.todos
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "users can update own todos"
  on public.todos
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "users can delete own todos"
  on public.todos
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
