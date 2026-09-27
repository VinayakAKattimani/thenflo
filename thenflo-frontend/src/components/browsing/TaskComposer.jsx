import React, { useState } from 'react';
import { SendIcon } from '../common/Icons.jsx';
import './TaskComposer.css';

const PLACEHOLDER_EXAMPLES = [
  'Go to a website and...',
  'Open the company site and find the pricing page...',
  'Check my leave balance on the employee portal...',
  'Find all plans on this website and compare them...'
];

export default function TaskComposer({ onSubmit, disabled }) {
  const [value, setValue] = useState('');
  const [placeholder] = useState(() => PLACEHOLDER_EXAMPLES[Math.floor(Math.random() * PLACEHOLDER_EXAMPLES.length)]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue('');
  };

  return (
    <form className="task-composer" onSubmit={handleSubmit}>
      <label className="task-composer-label" htmlFor="task-instruction">
        What would you like ThenFLo to do?
      </label>
      <div className="task-composer-field">
        <input
          id="task-instruction"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
        />
        <button type="submit" className="task-composer-submit" disabled={disabled || !value.trim()} aria-label="Start task">
          <SendIcon />
        </button>
      </div>
    </form>
  );
}
