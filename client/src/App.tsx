import React from 'react';
import './App.css';
import { Dashboard } from './pages/dashboard';
import { Auth } from './pages/auth';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FinancialRecordProvider } from './contexts/financial-record-context';
import { SignedIn, UserButton } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <div className="navbar">
          <Link to="/">Dashboard</Link>
          <SignedIn>
            <UserButton appearance={{ baseTheme: dark }} />
          </SignedIn>
        </div>
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
