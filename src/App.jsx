import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Placeholder Pages (will implement soon)
import Dashboard from './pages/Dashboard';
import MovieDetail from './pages/MovieDetail';
import Player from './pages/Player';
import Series from './pages/Series';
import Anime from './pages/Anime';
import MyList from './pages/MyList';
import History from './pages/History';
import Navbar from './components/Navbar';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import HelpCenter from './pages/HelpCenter';
import ResetPassword from './pages/ResetPassword';
import PersonDetail from './pages/PersonDetail';

function ProtectedRoute({ children }) {
  const user = localStorage.getItem('user');
  const location = useLocation();

  if (!user) {
    // Redirect to auth page and save the attempted URL
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/series" element={<Series />} />
        <Route path="/anime" element={<Anime />} />
        <Route path="/mylist" element={<MyList />} />
        <Route path="/history" element={<History />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/tv/:id" element={<MovieDetail />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/person/:id" element={<PersonDetail />} />
        <Route path="/play/:id" element={<ProtectedRoute><Player /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
