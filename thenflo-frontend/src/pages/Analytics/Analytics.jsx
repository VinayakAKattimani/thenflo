import React from 'react';
import PageHeader from '../../components/common/PageHeader.jsx';
import './Analytics.css';

const stats = [
  { label: 'Conversations this week', value: '128', delta: '+12%' },
  { label: 'Avg. response time', value: '1.4s', delta: '-8%' },
  { label: 'Knowledge documents', value: '24', delta: '+3' },
  { label: 'Browsing tasks run', value: '9', delta: '+9' }
];

const usageByDay = [
  { day: 'Mon', value: 42 },
  { day: 'Tue', value: 58 },
  { day: 'Wed', value: 51 },
  { day: 'Thu', value: 67 },
  { day: 'Fri', value: 74 },
  { day: 'Sat', value: 22 },
  { day: 'Sun', value: 18 }
];

export default function Analytics() {
  const max = Math.max(...usageByDay.map((d) => d.value));

  return (
    <div className="analytics-page">
      <PageHeader title="Analytics" subtitle="How your team is using ThenFLo." />

      <div className="analytics-stats">
        {stats.map((s) => (
          <div key={s.label} className="analytics-stat">
            <span className="analytics-stat-label">{s.label}</span>
            <span className="analytics-stat-value">{s.value}</span>
            <span className="analytics-stat-delta">{s.delta} vs last week</span>
          </div>
        ))}
      </div>

      <div className="analytics-chart-panel">
        <h3>Messages per day</h3>
        <div className="analytics-chart">
          {usageByDay.map((d) => (
            <div key={d.day} className="analytics-bar-col">
              <div className="analytics-bar" style={{ height: `${(d.value / max) * 100}%` }} />
              <span>{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="analytics-note">
        This view uses illustrative placeholder data. Connect it to the real Gateway/analytics contract when available,
        following the same service-abstraction pattern used elsewhere in the app.
      </p>
    </div>
  );
}
