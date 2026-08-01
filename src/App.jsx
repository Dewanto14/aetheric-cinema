import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Placeholder Pages (will implement soon)
import Dashboard from './pages/Dashboard';
import MovieDetail from './pages/MovieDetail';
import Player from './pages/Player';
import Series from './pages/Series';
import Anime from './pages/Anime';
import Dramas from './pages/Dramas';
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
import MaintenanceScreen from './components/MaintenanceScreen';
import { listenToSiteSettings } from './services/db';

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
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Check if user is admin
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        if (userObj.email?.toLowerCase() === 'dewantomaulana14@gmail.com') {
          setIsAdmin(true);
        }
      } catch(e) {}
    }

    // Listen to global settings
    const unsubscribe = listenToSiteSettings((settings) => {
      setMaintenanceMode(settings?.maintenanceMode || false);
      setIsInitializing(false);
    });

    // Fallback if no db connection
    setTimeout(() => setIsInitializing(false), 2000);

    return () => unsubscribe();
  }, []);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  // If maintenance is ON and the user is NOT the admin, show the lockdown screen.
  if (maintenanceMode && !isAdmin) {
    return <MaintenanceScreen />;
  }

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/series" element={<Series />} />
        <Route path="/anime" element={<Anime />} />
        <Route path="/dramas" element={<Dramas />} />
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
