import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from '@vercel/analytics/react';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import queryClient from './Query';
import Theme from './Theme';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={Theme}>
        <CssBaseline />
        <App />
        {import.meta.env.VITE_ENVIRONMENT !== 'development' && <Analytics />}
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
