'use client';

export default function TaskStats({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const pending = total - completed;

  return (
    <div className="stats-grid" aria-label="Task statistics">
      <div className="stat-card total">
        <span className="stat-label">Total</span>
        <span className="stat-value">{total}</span>
      </div>
      <div className="stat-card done">
        <span className="stat-label">Completed</span>
        <span className="stat-value">{completed}</span>
      </div>
      <div className="stat-card pending">
        <span className="stat-label">Pending</span>
        <span className="stat-value">{pending}</span>
      </div>
    </div>
  );
}
