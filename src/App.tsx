import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Layout from './pages/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import StudentDashboard from './pages/Dashboard/StudentDashboard';
import AttendanceHistory from './pages/attendance/AttendanceRecord';
import Settings from './pages/settings/Settings';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
function App() {
  return (
    <>
          <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
          <Router future={{ v7_relativeSplatPath: true }}>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            Protected routes with Layout
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/student-dashboard" element={<StudentDashboard />} />
                <Route path="/attendance-history" element={<AttendanceHistory />} />
                <Route path="/settings" element={<Settings />} />

              </Route>
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
    </>

  );
}

export default App;