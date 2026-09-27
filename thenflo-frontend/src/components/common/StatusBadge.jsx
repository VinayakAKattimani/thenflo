import React from 'react';
import './StatusBadge.css';

/**
 * tone: 'neutral' | 'active' | 'success' | 'error'
 * 'active' is the only tone that renders the pulsing amber dot — the
 * accent color is reserved for things that are currently in motion.
 */
export default function StatusBadge({ label, tone = 'neutral' }) {
  return (
    <span className={`status-badge status-badge-${tone}`}>
      <span className="status-badge-dot" aria-hidden="true" />
      {label}
    </span>
  );
}
