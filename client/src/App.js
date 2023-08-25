import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import ManagerPage from './pages/ManagerPage';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Default route */}
        <Route path="" element={<Navigate to="/home" />} />

        <Route path="/auth" element={<AuthPage/>} />
        <Route path="/home" element={<HomePage/>} />
        <Route path="/manager" element={<ManagerPage/>} />
      </Routes>
    </div>
  );
}

export default App;
