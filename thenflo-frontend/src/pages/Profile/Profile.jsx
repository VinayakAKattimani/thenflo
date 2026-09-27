import React from 'react';
import PageHeader from '../../components/common/PageHeader.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import './Profile.css';

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="profile-page">
      <PageHeader title="Profile" subtitle="Your account details." />

      <div className="profile-card">
        <span className="profile-avatar" style={{ background: user.avatarColor }}>
          {user.name?.[0] ?? '?'}
        </span>
        <div className="profile-meta">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <span className="profile-role">{user.role}</span>
        </div>
      </div>

      <div className="profile-actions">
        <button className="btn btn-danger-ghost" onClick={logout}>
          Sign out
        </button>
      </div>
    </div>
  );
}
