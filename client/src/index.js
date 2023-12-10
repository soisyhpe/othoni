import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { NotificationProvider } from './components/context/NotificationContext';

import App from './App';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <NotificationProvider>
        <App/>
      </NotificationProvider>
    </BrowserRouter>
  </React.StrictMode>
);