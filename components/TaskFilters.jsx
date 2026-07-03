'use client';

import { LABELS } from '@/lib/tasks';

const STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
];

export default function TaskFilters({ labelFilter, statusFilter, onLabelChange, onStatusChange }) {
  return (
    <div className="filters">
      <div className="filter-group" aria-label="Filter by status">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={`filter-btn${statusFilter === filter.id ? ' active' : ''}`}
            onClick={() => onStatusChange(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="filter-group" aria-label="Filter by label">
        <button
          type="button"
          className={`filter-btn${labelFilter === 'all' ? ' active' : ''}`}
          onClick={() => onLabelChange('all')}
        >
          All labels
        </button>
        {LABELS.map((label) => (
          <button
            key={label}
            type="button"
            className={`filter-btn${labelFilter === label ? ' active' : ''}`}
            onClick={() => onLabelChange(label)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
