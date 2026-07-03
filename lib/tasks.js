export const LABELS = ['personal', 'shopping', 'work', 'home'];

const STORAGE_KEY = 'task-app-tasks';

function readTasks() {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export async function fetchTasks() {
  return readTasks();
}

export async function createTask({ title, label, dueDate }) {
  const task = {
    id: crypto.randomUUID(),
    title,
    label,
    dueDate: dueDate || null,
    completed: false,
  };

  const tasks = readTasks();
  tasks.push(task);
  writeTasks(tasks);
  return task;
}

export async function updateTask(id, { title, label, dueDate, completed }) {
  const tasks = readTasks();
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) throw new Error('Task not found.');

  const current = tasks[index];
  const updated = {
    ...current,
    ...(title !== undefined && { title }),
    ...(label !== undefined && { label }),
    ...(dueDate !== undefined && { dueDate }),
    ...(completed !== undefined && { completed }),
  };

  tasks[index] = updated;
  writeTasks(tasks);
  return updated;
}

export async function deleteTask(id) {
  const tasks = readTasks().filter((task) => task.id !== id);
  writeTasks(tasks);
}
