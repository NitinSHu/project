import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import './App.css';

// Auth Provider
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Components
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CustomerList from './pages/CustomerList';
import CustomerDetail from './pages/CustomerDetail';
import CustomerForm from './pages/CustomerForm';
import Login from './pages/Login';
import Register from './pages/Register';
import UserManagement from './pages/UserManagement';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Container className="py-4">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              <Route path="/customers" element={
                <ProtectedRoute>
                  <CustomerList />
                </ProtectedRoute>
              } />
              
              <Route path="/customers/:id" element={
                <ProtectedRoute>
                  <CustomerDetail />
                </ProtectedRoute>
              } />
              
              <Route path="/customers/new" element={
                <ProtectedRoute>
                  <CustomerForm />
                </ProtectedRoute>
              } />
              
              <Route path="/customers/edit/:id" element={
                <ProtectedRoute>
                  <CustomerForm />
                </ProtectedRoute>
              } />
              
              {/* Admin routes */}
              <Route path="/admin/users" element={
                <ProtectedRoute requireAdmin={true}>
                  <UserManagement />
                </ProtectedRoute>
              } />
            </Routes>
          </Container>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 