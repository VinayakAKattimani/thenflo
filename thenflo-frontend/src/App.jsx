import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppShell from './layouts/AppShell.jsx';
import RequireAuth from './components/common/RequireAuth.jsx';

import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import Home from './pages/Home/Home.jsx';
import Conversations from './pages/Conversations/Conversations.jsx';
import Voice from './pages/Voice/Voice.jsx';
import Knowledge from './pages/Knowledge/Knowledge.jsx';
import Browsing from './pages/Browsing/Browsing.jsx';
import Analytics from './pages/Analytics/Analytics.jsx';
import Settings from './pages/Settings/Settings.jsx';
import Profile from './pages/Profile/Profile.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/conversations" element={<Conversations />} />
        <Route path="/voice" element={<Voice />} />
        <Route path="/knowledge" element={<Knowledge />} />
        <Route path="/browsing" element={<Browsing />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
