import React from 'react';
import { CheckIcon } from '../common/Icons.jsx';
import './TaskStatusTimeline.css';

/**
 * steps: [{ key, label, state }] where state is 'done' | 'active' | 'pending' | 'failed'
 * Generic and reusable — not specific to Automated Browsing's step names.
 */
export default function TaskStatusTimeline({ steps }) {
  return (
    <ol className="status-timeline">
      {steps.map((step) => (
        <li key={step.key} className={`status-timeline-item is-${step.state}`}>
          <span className="status-timeline-marker">
            {step.state === 'done' ? <CheckIcon /> : <span className="status-timeline-dot" />}
          </span>
          <span className="status-timeline-label">{step.label}</span>
        </li>
      ))}
    </ol>
  );
}
