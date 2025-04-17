import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

function App() {
  return (
      <ThemeProvider theme={theme}>
          <BrowserRouter>
              <Routes>
                  <Route path="/" element={<HomePage />} />
              </Routes>
          </BrowserRouter>
      </ThemeProvider>
  );
}

export default App;