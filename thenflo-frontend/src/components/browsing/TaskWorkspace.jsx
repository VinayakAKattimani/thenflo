import React from 'react';
import BrowserPreview from './BrowserPreview.jsx';
import TaskStatusTimeline from './TaskStatusTimeline.jsx';
import StatusBadge from './../common/StatusBadge.jsx';
import { StopIcon, CheckIcon, AlertIcon } from '../common/Icons.jsx';
import { TASK_STATUS, PROGRESS_SEQUENCE, TASK_STATUS_LABEL } from '../../services/browsingService.js';
import { statusTone, statusLabel } from './browsingDisplay.js';
import './TaskWorkspace.css';

function buildSteps(task) {
  const currentIndex = PROGRESS_SEQUENCE.indexOf(task.status);
  const terminalFailed = task.status === TASK_STATUS.FAILED;
  const terminalStopped = task.status === TASK_STATUS.STOPPED;

  return PROGRESS_SEQUENCE.map((key, i) => {
    let state = 'pending';
    if (terminalFailed && i === Math.max(currentIndex, 0)) state = 'failed';
    else if (currentIndex === -1 && (terminalFailed || terminalStopped)) state = 'pending';
    else if (i < currentIndex || (currentIndex === -1 && task.status === TASK_STATUS.COMPLETED)) state = 'done';
    else if (i === currentIndex) state = 'active';

    return { key, label: TASK_STATUS_LABEL[key], state };
  });
}

export default function TaskWorkspace({ task, onStop }) {
  const isRunning = ![TASK_STATUS.COMPLETED, TASK_STATUS.FAILED, TASK_STATUS.STOPPED].includes(task.status);
  const steps = buildSteps(task);

  return (
    <div className="task-workspace">
      <div className="task-workspace-bar">
        <div>
          <span className="task-workspace-label">Task</span>
          <p className="task-workspace-instruction">“{task.instruction}”</p>
        </div>
        <div className="task-workspace-bar-right">
          <StatusBadge label={statusLabel(task.status)} tone={statusTone(task.status)} />
          {isRunning && (
            <button className="btn btn-danger-ghost" onClick={onStop}>
              <StopIcon /> Stop task
            </button>
          )}
        </div>
      </div>

      <div className="task-workspace-grid">
        <BrowserPreview status={isRunning ? 'active' : task.status === TASK_STATUS.FAILED ? 'error' : 'idle'} url={task.site} />

        <div className="task-workspace-side">
          <TaskStatusTimeline steps={steps} />

          <div className="task-workspace-activity">
            <h4>Activity</h4>
            {task.activity.length === 0 ? (
              <p className="task-workspace-muted">Waiting to begin…</p>
            ) : (
              <ul className="task-workspace-activity-list">
                {task.activity.map((item, i) => (
                  <li key={i}>
                    <CheckIcon /> {item.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {task.status === TASK_STATUS.COMPLETED && task.result && (
            <div className="task-workspace-result">
              <h4>Result</h4>
              <p>{task.result}</p>
            </div>
          )}

          {task.status === TASK_STATUS.FAILED && task.error && (
            <div className="task-workspace-error">
              <h4>
                <AlertIcon /> What went wrong
              </h4>
              <p>{task.error}</p>
            </div>
          )}

          {task.status === TASK_STATUS.STOPPED && <p className="task-workspace-muted">This task was stopped before it finished.</p>}
        </div>
      </div>
    </div>
  );
}
