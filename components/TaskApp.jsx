'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
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
import { ChecklistIcon, GoogleIcon, PlusIcon } from '@/components/icons';
import { signInWithGoogle } from '@/lib/auth';

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
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
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
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      setUser(currentUser ?? null);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('auth_error') === '1') {
      setError('Google sign-in failed. Please try again.');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchTasks()
      .then(setTasks)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

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

  async function handleGoogleSignIn() {
    try {
      setSigningIn(true);
      setError(null);
      await signInWithGoogle();
    } catch (err) {
      setError(err.message);
      setSigningIn(false);
    }
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
      <TopBar user={user} authLoading={authLoading} onAuthError={setError} />

      <main className="page">
        <section className="card">
          {user ? (
            <>
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
            </>
          ) : (
            <div className="auth-panel">
              <div className="auth-panel-intro">
                <div className="signin-hero-icon">
                  <ChecklistIcon />
                </div>
                <h2>Sign in to manage your tasks</h2>
                <p>
                  Connect with Google to save tasks to your Supabase account.
                  Each user only sees their own tasks.
                </p>
              </div>

              {error && <p className="error-banner">{error}</p>}

              <div className="auth-card">
                <button
                  className="google-signin-btn auth-alt-btn"
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={signingIn || authLoading}
                >
                  <GoogleIcon />
                  {signingIn || authLoading ? 'Signing in...' : 'Continue with Google'}
                </button>
                <p className="auth-hint">
                  Make sure Google OAuth is enabled in your Supabase project and
                  <code> http://localhost:3000/auth/callback </code>
                  is added to redirect URLs.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="app-footer">
        {user
          ? 'Tasks are saved in Supabase and linked to your Google account.'
          : 'Sign in with Google to start managing your tasks.'}
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
