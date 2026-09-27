import React from 'react';
import StatusBadge from '../common/StatusBadge.jsx';
import EmptyState from '../common/EmptyState.jsx';
import { BrowsingIcon } from '../common/Icons.jsx';
import { statusTone, statusLabel, relativeDay } from './browsingDisplay.js';
import './TaskHistoryList.css';

export default function TaskHistoryList({ tasks, activeTaskId, onSelect }) {
  if (!tasks.length) {
    return (
      <EmptyState
        icon={BrowsingIcon}
        title="No tasks yet"
        description="Tasks you run will show up here so you can revisit what ThenFLo found."
      />
    );
  }

  return (
    <ul className="task-history">
      {tasks.map((task) => (
        <li key={task.id}>
          <button
            className={'task-history-item' + (task.id === activeTaskId ? ' is-active' : '')}
            onClick={() => onSelect(task.id)}
          >
            <div className="task-history-item-main">
              <span className="task-history-item-title">{task.instruction}</span>
              <span className="task-history-item-site">{task.site}</span>
            </div>
            <div className="task-history-item-meta">
              <StatusBadge label={statusLabel(task.status)} tone={statusTone(task.status)} />
              <span className="task-history-item-time">{relativeDay(task.createdAt)}</span>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
