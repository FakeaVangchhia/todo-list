'use client';

import { EditIcon, DeleteIcon } from '@/components/icons';

function LoadingRows() {
  return (
    <>
      {[0, 1, 2].map((row) => (
        <tr key={row} className="skeleton-row">
          <td><div className="skeleton w-24" /></td>
          <td><div className="skeleton w-60" /></td>
          <td><div className="skeleton w-40" /></td>
          <td><div className="skeleton w-40" /></td>
          <td><div className="skeleton w-24" /></td>
        </tr>
      ))}
    </>
  );
}

export default function TaskTable({
  tasks,
  loading,
  onToggleComplete,
  onEdit,
  onDelete,
}) {
  return (
    <div className="table-wrap">
      <table className="task-table">
        <thead>
          <tr>
            <th className="col-check" scope="col">Done</th>
            <th className="col-title" scope="col">Title</th>
            <th className="col-label" scope="col">Label</th>
            <th className="col-date" scope="col">Due Date</th>
            <th className="col-actions" scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <LoadingRows />
          ) : tasks.length === 0 ? (
            <tr>
              <td colSpan={5}>
                <div className="empty-state">
                  <h2>No tasks match your filters</h2>
                  <p>Create a new task or clear your filters to see more items.</p>
                </div>
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr key={task.id}>
                <td>
                  <input
                    className="task-check"
                    type="checkbox"
                    checked={task.completed}
                    onChange={(e) => onToggleComplete(task.id, e.target.checked)}
                    aria-label={`Mark "${task.title}" complete`}
                  />
                </td>
                <td className={`task-title${task.completed ? ' done' : ''}`}>{task.title}</td>
                <td>
                  <span className={`label-pill label-${task.label}`}>{task.label}</span>
                </td>
                <td className={`task-date${task.dueDate ? '' : ' muted'}`}>
                  {task.dueDate ?? 'No date'}
                </td>
                <td>
                  <div className="row-actions">
                    <button
                      className="icon-btn edit"
                      type="button"
                      aria-label={`Edit ${task.title}`}
                      onClick={() => onEdit(task)}
                    >
                      <EditIcon />
                    </button>
                    <button
                      className="icon-btn delete"
                      type="button"
                      aria-label={`Delete ${task.title}`}
                      onClick={() => onDelete(task.id)}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
