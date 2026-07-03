'use client';

import { useEffect, useRef } from 'react';
import { LABELS } from '@/lib/tasks';

export default function TaskDialog({
  open,
  editingId,
  title,
  label,
  dueDate,
  onTitleChange,
  onLabelChange,
  onDueDateChange,
  onClose,
  onSubmit,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) dialog.showModal();
    else if (dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="dialog"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <form onSubmit={onSubmit}>
        <h2>{editingId ? 'Edit Task' : 'Create Task'}</h2>
        <p className="dialog-subtitle">
          {editingId
            ? 'Update the task details below.'
            : 'Add a title, pick a label, and optionally set a due date.'}
        </p>

        <label htmlFor="task-title">
          Title
          <input
            id="task-title"
            type="text"
            required
            placeholder="e.g. Finish lesson plan"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
          />
        </label>

        <label htmlFor="task-label">
          Label
          <select
            id="task-label"
            value={label}
            onChange={(e) => onLabelChange(e.target.value)}
            required
          >
            {LABELS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="task-due-date">
          Due Date
          <input
            id="task-due-date"
            type="date"
            value={dueDate}
            onChange={(e) => onDueDateChange(e.target.value)}
          />
        </label>

        <div className="dialog-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {editingId ? 'Save changes' : 'Create task'}
          </button>
        </div>
      </form>
    </dialog>
  );
}
