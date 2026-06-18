/*
  App.js
  ───────
  Root component. Decides what to show:
  - If user is logged in  → show Dashboard
  - If not logged in      → show Login or Register

  No react-router needed — simple state-based switching.
*/

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login     from './pages/Login';
import Register  from './pages/Register';
import Dashboard from './pages/Dashboard';

function AppContent() {
  const { user } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (user) return <Dashboard />;

  return showRegister
    ? <Register onSwitch={() => setShowRegister(false)} />
    : <Login    onSwitch={() => setShowRegister(true)}  />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
