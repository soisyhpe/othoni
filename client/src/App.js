import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ErrorNotification from './components/notifications/ErrorNotification';
import InfoNotification from './components/notifications/InfoNotification';
import SuccessNotification from './components/notifications/SuccessNotification';
import WarningNotification from './components/notifications/WarningNotification';

import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import ServerPage from './pages/ServerPage';
import ManagerPage from './pages/ManagerPage';
import ErrorPage from './pages/ErrorPage';

function App() {
  return (
    <div className="App">
      <ErrorNotification/>
      <InfoNotification/>
      <SuccessNotification/>
      <WarningNotification/>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/home" />} />

        <Route path="/auth" element={<AuthPage/>} />
        <Route path="/home" element={<HomePage/>} />
        <Route path="/server/:serverAddress" element={<ServerPage />} />
        <Route path="/manager" element={<ManagerPage/>} />

        <Route path="*" element={<ErrorPage/>} />
      </Routes>
    </div>
  );
}

export default App;
