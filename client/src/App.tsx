import React from 'react';
import './App.css';
import { Dashboard } from './pages/dashboard';
import { Auth } from './pages/auth';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FinancialRecordProvider } from './contexts/financial-record-context';

const App: React.FC = () => {
  return (
    <Router>
      <h2>hello</h2>
      <div className="app-container">
        <Routes>
          <Route
            path="/"
            element={
              <FinancialRecordProvider>
                <Dashboard />
              </FinancialRecordProvider>
            }
          />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
