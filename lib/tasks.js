import { createClient } from '@/utils/supabase/client';

export const LABELS = ['personal', 'shopping', 'work', 'home'];

function toTask(row) {
  return {
    id: row.id,
    title: row.title,
    label: row.label,
    dueDate: row.due_date ?? null,
    completed: row.completed,
  };
}

async function requireUser() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);
  if (!user) throw new Error('You must be signed in to manage tasks.');

  return user;
}

export async function fetchTasks() {
  await requireUser();
  const supabase = createClient();
  const { data, error } = await supabase
    .from('todos')
    .select('id, title, label, due_date, completed')
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map(toTask);
}

export async function createTask({ title, label, dueDate }) {
  const user = await requireUser();
  const supabase = createClient();
  const { data, error } = await supabase
    .from('todos')
    .insert({
      title,
      label,
      due_date: dueDate || null,
      completed: false,
      user_id: user.id,
    })
    .select('id, title, label, due_date, completed')
    .single();

  if (error) throw new Error(error.message);
  return toTask(data);
}

export async function updateTask(id, { title, label, dueDate, completed }) {
  await requireUser();
  const supabase = createClient();
  const updates = {};

  if (title !== undefined) updates.title = title;
  if (label !== undefined) updates.label = label;
  if (dueDate !== undefined) updates.due_date = dueDate || null;
  if (completed !== undefined) updates.completed = completed;

  const { data, error } = await supabase
    .from('todos')
    .update(updates)
    .eq('id', id)
    .select('id, title, label, due_date, completed')
    .single();

  if (error) throw new Error(error.message);
  return toTask(data);
}

export async function deleteTask(id) {
  await requireUser();
  const supabase = createClient();
  const { error } = await supabase.from('todos').delete().eq('id', id);

  if (error) throw new Error(error.message);
}
