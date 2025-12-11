import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';
import AdminLayout from './components/layout/AdminLayout';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';
import ScrollToTop from './components/common/ScrollToTop';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AuthCallback from './pages/AuthCallback';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Chat from './pages/Chat';
import Tools from './pages/Tools';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import PromptLibrary from './pages/PromptLibrary';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Documentation from './pages/Documentation';
import ApiDocs from './pages/ApiDocs';
import Terms from './pages/Terms';
import Support from './pages/Support';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTools from './pages/admin/AdminTools';
import AdminCourses from './pages/admin/AdminCourses';
import AdminSupport from './pages/admin/AdminSupport';
import AdminUsers from './pages/admin/AdminUsers';
import AdminLessons from './pages/admin/AdminLessons';
import AdminQuiz from './pages/admin/AdminQuiz';
import AdminPrompts from './pages/admin/AdminPrompts';

const toastOptions = {
  duration: 4000,
  style: {
    background: '#161616',
    color: '#FFFFFF',
    border: '1px solid #262626',
    borderRadius: '12px',
    padding: '16px',
  },
  success: {
    iconTheme: { primary: '#00E3A5', secondary: '#0D0D0D' },
  },
  error: {
    iconTheme: { primary: '#EF4444', secondary: '#0D0D0D' },
  },
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            
            {/* Password Reset Routes - No layout needed */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* OAuth Callback - No layout needed */}
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* Email Verification - doesn't require verification itself */}
            <Route path="/verify-email" element={
              <ProtectedRoute requireVerification={false}>
                <VerifyEmail />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="tools" element={<AdminTools />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="courses/:courseId/lessons" element={<AdminLessons />} />
              <Route path="courses/:courseId/quiz" element={<AdminQuiz />} />
              <Route path="prompts" element={<AdminPrompts />} />
              <Route path="support" element={<AdminSupport />} />
            </Route>

            {/* Main Layout Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/prompts" element={<PromptLibrary />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/support" element={<Support />} />
              <Route path="/docs" element={<Documentation />} />
              <Route path="/api-docs" element={<ApiDocs />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/chat" element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </Router>
        <Toaster position="top-right" toastOptions={toastOptions} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
