import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthProvider from './components/context/AuthContext';
import Navbar from './components/Navbar';

const RegistrationForm = lazy(() => import('./components/RegistrationForm'));
const LoginForm = lazy(() => import('./components/LoginForm'));
const AccountDetails = lazy(() => import('./components/AccountDetails'));
const Transactions = lazy(() => import('./components/TransactionList'));
const DepositForm = lazy(() => import('./components/DepositForm'));

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/account-details" element={<AccountDetails />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/deposit" element={<DepositForm />} />
            <Route path="/" element={<LoginForm />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
};

export default App;
