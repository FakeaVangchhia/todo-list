alter table public.todos rename column name to title;

alter table public.todos
  add column label text not null default 'personal',
  add column due_date date,
  add column completed boolean not null default false;

alter table public.todos
  add constraint todos_label_check
  check (label in ('personal', 'shopping', 'work', 'home'));

update public.todos
set title = 'Dentist', label = 'personal'
where title = 'Call dentist';

update public.todos
set label = 'shopping'
where title = 'Buy groceries';

update public.todos
set label = 'work'
where title = 'Finish project';

drop policy if exists "todos are publicly readable" on public.todos;

grant insert, update, delete on public.todos to anon, authenticated;

create policy "todos are publicly readable"
  on public.todos
  for select
  to anon, authenticated
  using (true);

create policy "todos are publicly insertable"
  on public.todos
  for insert
  to anon, authenticated
  with check (true);

create policy "todos are publicly updatable"
  on public.todos
  for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "todos are publicly deletable"
  on public.todos
  for delete
  to anon, authenticated
  using (true);
