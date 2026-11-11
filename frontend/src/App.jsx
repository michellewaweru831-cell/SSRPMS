import Register from './pages/Register';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LogContribution from './pages/LogContribution';
import Rewards from './pages/Rewards';
import Schedules from './pages/Schedules';
import Reports from './pages/Reports';

const Protected = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-center">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/*"
        element={
          <Protected>
            <Layout />
          </Protected>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="log" element={<LogContribution />} />
        <Route path="rewards" element={<Rewards />} />
        <Route path="schedules" element={<Schedules />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}