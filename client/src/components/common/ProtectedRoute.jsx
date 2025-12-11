import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false, requireVerification = true }) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check email verification (skip for verify-email page itself)
  const isVerifyEmailPage = location.pathname === '/verify-email';
  
  if (requireVerification && !isVerifyEmailPage && user && !user.isEmailVerified) {
    // User is logged in but email not verified - redirect to verify page
    return <Navigate to="/verify-email" replace />;
  }

  // If on verify-email page but already verified, redirect to dashboard
  if (isVerifyEmailPage && user?.isEmailVerified) {
    return <Navigate to="/dashboard" replace />;
  }

  // Redirect if admin route but user is not admin
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
