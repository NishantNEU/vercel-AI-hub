import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

/**
 * AuthCallback Component
 * 
 * Handles the OAuth callback from Google:
 * 1. Extracts token from URL params
 * 2. Stores token and fetches user data
 * 3. Redirects to dashboard on success
 */
export default function AuthCallback() {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Completing sign in...');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithToken } = useAuth();
  
  // Prevent double execution in React Strict Mode
  const hasRun = useRef(false);

  useEffect(() => {
    // Skip if already executed
    if (hasRun.current) return;
    hasRun.current = true;

    const handleCallback = async () => {
      try {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setMessage(getErrorMessage(error));
          return;
        }

        if (!token) {
          setStatus('error');
          setMessage('No authentication token received');
          return;
        }

        // Complete login with token
        const result = await loginWithToken(token);

        if (result.success) {
          setStatus('success');
          setMessage(`Welcome, ${result.user?.name || 'back'}!`);
          toast.success(`Welcome, ${result.user?.name || 'back'}!`);
          
          // Redirect to dashboard
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 1000);
        } else {
          setStatus('error');
          setMessage(result.error || 'Failed to complete sign in');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setStatus('error');
        setMessage('An unexpected error occurred');
      }
    };

    handleCallback();
  }, []);

  const getErrorMessage = (error) => {
    switch (error) {
      case 'google_auth_failed':
        return 'Google authentication failed. Please try again.';
      case 'access_denied':
        return 'Access was denied. Please grant permission to continue.';
      case 'no_email':
        return 'No email found in your Google account.';
      default:
        return 'Authentication failed. Please try again.';
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="text-center">
        {/* Status Icon */}
        <div className="mb-6">
          {status === 'loading' && (
            <div 
              className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(0,227,165,0.1)' }}
            >
              <Loader2 
                className="w-10 h-10 animate-spin" 
                style={{ color: 'var(--color-primary)' }} 
              />
            </div>
          )}
          
          {status === 'success' && (
            <div 
              className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(0,227,165,0.1)' }}
            >
              <CheckCircle 
                className="w-10 h-10" 
                style={{ color: 'var(--color-primary)' }} 
              />
            </div>
          )}
          
          {status === 'error' && (
            <div 
              className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}
            >
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
          )}
        </div>

        {/* Message */}
        <h2 
          className="text-xl font-semibold mb-2"
          style={{ color: 'var(--color-text)' }}
        >
          {status === 'loading' && 'Signing you in...'}
          {status === 'success' && 'Success!'}
          {status === 'error' && 'Sign in failed'}
        </h2>
        
        <p style={{ color: 'var(--color-text-secondary)' }}>
          {message}
        </p>

        {/* Error Actions */}
        {status === 'error' && (
          <div className="mt-6 space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 rounded-lg font-medium transition-colors"
              style={{ 
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-bg)'
              }}
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 rounded-lg font-medium transition-colors"
              style={{ 
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text)'
              }}
            >
              Go Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
