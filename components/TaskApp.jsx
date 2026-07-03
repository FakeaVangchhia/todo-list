'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask as removeTask,
} from '@/lib/tasks';
import TopBar from '@/components/TopBar';
import TaskStats from '@/components/TaskStats';
import TaskFilters from '@/components/TaskFilters';
import TaskTable from '@/components/TaskTable';
import TaskDialog from '@/components/TaskDialog';
import { PlusIcon } from '@/components/icons';

function filterTasks(tasks, labelFilter, statusFilter) {
  return tasks.filter((task) => {
    const matchesLabel = labelFilter === 'all' || task.label === labelFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'completed' && task.completed) ||
      (statusFilter === 'active' && !task.completed);

    return matchesLabel && matchesStatus;
  });
}

export default function TaskApp() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [labelFilter, setLabelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [label, setLabel] = useState('personal');
  const [dueDate, setDueDate] = useState('');

  const filteredTasks = useMemo(
    () => filterTasks(tasks, labelFilter, statusFilter),
    [tasks, labelFilter, statusFilter],
  );

  useEffect(() => {
    fetchTasks()
      .then(setTasks)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function openDialog(task = null) {
    setEditingId(task?.id ?? null);
    setTitle(task?.title ?? '');
    setLabel(task?.label ?? 'personal');
    setDueDate(task?.dueDate ?? '');
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingId(null);
    setTitle('');
    setLabel('personal');
    setDueDate('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    const taskData = { title: trimmed, label, dueDate: dueDate || null };

    try {
      if (editingId) {
        const updated = await updateTask(editingId, taskData);
        setTasks((prev) => prev.map((task) => (task.id === editingId ? updated : task)));
      } else {
        const created = await createTask(taskData);
        setTasks((prev) => [...prev, created]);
      }
      closeDialog();
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleComplete(id, completed) {
    try {
      const updated = await updateTask(id, { completed });
      setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteTask(id) {
    try {
      await removeTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="app-shell">
      <TopBar />

      <main className="page">
        <section className="card">
          <div className="card-header">
            <div>
              <h1>Your Tasks</h1>
              <p>Track lessons, assignments, and personal to-dos in one place.</p>
            </div>
            <button className="create-btn" type="button" onClick={() => openDialog()}>
              <span className="create-icon">
                <PlusIcon />
              </span>
              Create Task
            </button>
          </div>

          {error && <p className="error-banner">{error}</p>}

          <TaskStats tasks={tasks} />
          <TaskFilters
            labelFilter={labelFilter}
            statusFilter={statusFilter}
            onLabelChange={setLabelFilter}
            onStatusChange={setStatusFilter}
          />
          <TaskTable
            tasks={filteredTasks}
            loading={loading}
            onToggleComplete={toggleComplete}
            onEdit={openDialog}
            onDelete={deleteTask}
          />
        </section>
      </main>

      <footer className="app-footer">
        Tasks are saved in your browser (localStorage). Explore components in <code>components/</code> and data helpers in <code>lib/</code>.
      </footer>

      <TaskDialog
        open={dialogOpen}
        editingId={editingId}
        title={title}
        label={label}
        dueDate={dueDate}
        onTitleChange={setTitle}
        onLabelChange={setLabel}
        onDueDateChange={setDueDate}
        onClose={closeDialog}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
