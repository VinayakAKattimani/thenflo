import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  ChatIcon,
  MicIcon,
  KnowledgeIcon,
  BrowsingIcon,
  AnalyticsIcon,
  SettingsIcon,
  ProfileIcon
} from '../common/Icons.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import './Sidebar.css';

const primaryItems = [
  { to: '/', label: 'Home', icon: HomeIcon, end: true },
  { to: '/conversations', label: 'Conversations', icon: ChatIcon },
  { to: '/voice', label: 'Voice', icon: MicIcon },
  { to: '/knowledge', label: 'Knowledge', icon: KnowledgeIcon },
  { to: '/browsing', label: 'Automated Browsing', icon: BrowsingIcon },
  { to: '/analytics', label: 'Analytics', icon: AnalyticsIcon }
];

const secondaryItems = [
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
  { to: '/profile', label: 'Profile', icon: ProfileIcon }
];

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-mark" aria-hidden="true" />
        <span className="sidebar-brand-name">ThenFLo</span>
      </div>

      <nav className="sidebar-nav" aria-label="Primary">
        {primaryItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => 'sidebar-link' + (isActive ? ' is-active' : '')}
          >
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-divider" />

      <nav className="sidebar-nav" aria-label="Secondary">
        {secondaryItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => 'sidebar-link' + (isActive ? ' is-active' : '')}>
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {user && (
        <div className="sidebar-user">
          <span className="sidebar-user-avatar" style={{ background: user.avatarColor }}>
            {user.name?.[0] ?? '?'}
          </span>
          <div className="sidebar-user-meta">
            <span className="sidebar-user-name">{user.name}</span>
            <span className="sidebar-user-role">{user.role}</span>
          </div>
        </div>
      )}
    </aside>
  );
}
