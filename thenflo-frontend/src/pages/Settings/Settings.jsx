import React, { useState } from 'react';
import PageHeader from '../../components/common/PageHeader.jsx';
import './Settings.css';

const sections = [
  {
    title: 'Workspace',
    fields: [
      { key: 'workspaceName', label: 'Workspace name', type: 'text', defaultValue: 'Asha\u2019s Team' },
      { key: 'defaultModel', label: 'Default conversation model', type: 'text', defaultValue: 'ThenFLo Standard' }
    ]
  },
  {
    title: 'Notifications',
    fields: [
      { key: 'emailUpdates', label: 'Email me when a browsing task finishes', type: 'toggle', defaultValue: true },
      { key: 'weeklyDigest', label: 'Weekly usage digest', type: 'toggle', defaultValue: false }
    ]
  }
];

export default function Settings() {
  const [values, setValues] = useState(() =>
    Object.fromEntries(sections.flatMap((s) => s.fields.map((f) => [f.key, f.defaultValue])))
  );
  const [saved, setSaved] = useState(false);

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Real path: PATCH the settings via a future settingsService.js once the
    // Gateway exposes a contract for it — kept isolated here for now.
    setSaved(true);
  };

  return (
    <div className="settings-page">
      <PageHeader title="Settings" subtitle="Manage your workspace preferences." />

      <form onSubmit={handleSave}>
        {sections.map((section) => (
          <div key={section.title} className="settings-section">
            <h3>{section.title}</h3>
            <div className="settings-fields">
              {section.fields.map((field) => (
                <label key={field.key} className="settings-field">
                  <span>{field.label}</span>
                  {field.type === 'toggle' ? (
                    <button
                      type="button"
                      className={'settings-toggle' + (values[field.key] ? ' is-on' : '')}
                      onClick={() => handleChange(field.key, !values[field.key])}
                      aria-pressed={values[field.key]}
                    >
                      <span className="settings-toggle-knob" />
                    </button>
                  ) : (
                    <input
                      type="text"
                      value={values[field.key]}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                    />
                  )}
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="settings-actions">
          <button type="submit" className="btn btn-primary">
            Save changes
          </button>
          {saved && <span className="settings-saved">Saved.</span>}
        </div>
      </form>
    </div>
  );
}
