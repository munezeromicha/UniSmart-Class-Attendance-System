import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './ProtectedRoutes';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import InvitationSignup from './components/auth/InvitationSignup';
import NotFound from './components/dashboard/NotFound';
import AdminDashboard from './components/dashboard/AdminDashboard';
import HodDashboard from './components/dashboard/HodDashboard';
import LecturerDashboard from './components/dashboard/LecturerDashboard';
import RepresentativeDashboard from './components/dashboard/RepresentativeDashboard';
import StudentDashboard from './components/dashboard/Studentdashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './context/ThemeContext';
import './config/config';
import LandingPage from './pages/LandingPage';
import { HoverToReadProvider } from './context/HoverToReadContext';

interface RoleProtectedRouteProps {
  children: JSX.Element;
  allowedRole: string;
}

const RoleProtectedRoute = ({ children, allowedRole }: RoleProtectedRouteProps) => (
  <ProtectedRoute>
    {(props) => props.user?.role?.toLowerCase() === allowedRole.toLowerCase() 
      ? children 
      : <NotFound />
    }
  </ProtectedRoute>
);

export default function App() {
  
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <HoverToReadProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup/:role" element={<InvitationSignup />} />
            
            <Route path="/admin" element={<RoleProtectedRoute allowedRole="admin"><AdminDashboard /></RoleProtectedRoute>} />
            <Route path="/hod" element={<RoleProtectedRoute allowedRole="hod"><HodDashboard /></RoleProtectedRoute>} />
            <Route path="/lecturer" element={<RoleProtectedRoute allowedRole="lecturer"><LecturerDashboard /></RoleProtectedRoute>} />
            <Route path="/class_rep" element={<RoleProtectedRoute allowedRole="class_rep"><RepresentativeDashboard /></RoleProtectedRoute>} />
            <Route path="/student" element={<RoleProtectedRoute allowedRole="student"><StudentDashboard /></RoleProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ToastContainer />
        </div>
        </HoverToReadProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}