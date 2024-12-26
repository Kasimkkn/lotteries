import React, { useEffect } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation
} from 'react-router-dom';

import { Toaster } from 'react-hot-toast';
import './charts/ChartjsConfig';
import './css/style.css';
// Import page
import AdminOnlyRoute from './components/AdminOnlyRoute/AdminOnlyRoute';
import DashboardLottery from './pages/DashboardLottery';
import Dashboard from './pages/Dashboard';
import DashboardUsers from './pages/DashboardUsers';
import Home from './pages/Home';
import Login from './pages/Login';
import DashboardTickets from './pages/DashboardTickets';
import DashboardTransaction from './pages/DashboardTransaction';

// AuthRoute Component
const AuthRoute = ({ children }) => {
  const token = localStorage.getItem('lottery:token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const location = useLocation();
  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto';
    window.scroll({ top: 0 });
    document.querySelector('html').style.scrollBehavior = '';
  }, [location.pathname]);

  return (
    <>
      <Routes>
        <Route
          path="/dashboard-home"
          element={
            <AuthRoute>
              <AdminOnlyRoute>
                <Dashboard />
              </AdminOnlyRoute>
            </AuthRoute>
          }
        />
        <Route
          path="/dashboard-user"
          element={
            <AuthRoute>
              <AdminOnlyRoute>
                <DashboardUsers />
              </AdminOnlyRoute>
            </AuthRoute>
          }
        />
        <Route
          path="/dashboard-lottery"
          element={
            <AuthRoute>
              <AdminOnlyRoute>
                <DashboardLottery />
              </AdminOnlyRoute>
            </AuthRoute>
          }
        />
        <Route
          path="/dashboard-ticket"
          element={
            <AuthRoute>
              <AdminOnlyRoute>
                <DashboardTickets />
              </AdminOnlyRoute>
            </AuthRoute>
          }
        />
        <Route
          path="/dashboard-transaction"
          element={
            <AuthRoute>
              <AdminOnlyRoute>
                <DashboardTransaction />
              </AdminOnlyRoute>
            </AuthRoute>
          }
        />
        <Route
          index
          path="/"
          element={
            <AuthRoute>
              <Home />
            </AuthRoute>
          }
        />
        <Route
          path="/login"
          element={<Login />}
        />
      </Routes>
      <Toaster position='top-center' />
    </>
  );
}

export default App;
