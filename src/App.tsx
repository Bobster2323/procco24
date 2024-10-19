import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import MainDashboard from './components/MainDashboard';
import CreateServiceRequest from './components/CreateServiceRequest';
import BuyerDashboard from './components/BuyerDashboard';
import SellerDashboard from './components/SellerDashboard';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const ProtectedRoute: React.FC<{ element: React.ReactElement, allowedRole?: 'buyer' | 'seller' }> = ({ element, allowedRole }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return element;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-800">
          <Header />
          <div className="py-8">
            <Routes>
              <Route path="/" element={<MainDashboard />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/create-request" element={
                <ProtectedRoute element={<CreateServiceRequest />} allowedRole="buyer" />
              } />
              <Route path="/buyer-dashboard" element={
                <ProtectedRoute element={<BuyerDashboard />} allowedRole="buyer" />
              } />
              <Route path="/seller-dashboard" element={
                <ProtectedRoute element={<SellerDashboard />} allowedRole="seller" />
              } />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;