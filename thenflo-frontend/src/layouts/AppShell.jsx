import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/nav/Sidebar.jsx';
import './AppShell.css';

export default function AppShell() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-shell-main scroll-region">
        <Outlet />
      </main>
    </div>
  );
}
