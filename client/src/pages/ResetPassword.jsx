import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle, XCircle, ArrowLeft, Check, X } from 'lucide-react';
import { authAPI } from '../services/api';
import Button from '../components/ui/Button';
import Logo from '../components/common/Logo';
import toast from 'react-hot-toast';

// Password strength calculation
const calculatePasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '', requirements: [] };
  
  let score = 0;
  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8, required: true },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(password), required: true },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(password), required: true },
    { label: 'Contains a number', met: /[0-9]/.test(password), required: true },
    { label: 'Contains special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(password), required: false },
  ];

  requirements.forEach(req => {
    if (req.met) score += req.required ? 20 : 20;
  });

  score = Math.min(score, 100);

  let label, color;
  if (score < 40) { label = 'Weak'; color = '#EF4444'; }
  else if (score < 60) { label = 'Fair'; color = '#F97316'; }
  else if (score < 80) { label = 'Good'; color = '#FBBF24'; }
  else { label = 'Strong'; color = '#10B981'; }

  return { score, label, color, requirements };
};

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('form'); // form, success, error
  const [error, setError] = useState('');

  const passwordStrength = useMemo(
    () => calculatePasswordStrength(formData.password),
    [formData.password]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validate = () => {
    if (!formData.password) {
      setError('Password is required');
      return false;
    }

    const requiredNotMet = passwordStrength.requirements.filter(r => r.required && !r.met);
    if (requiredNotMet.length > 0) {
      setError('Password does not meet requirements');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      await authAPI.resetPassword({
        token,
        password: formData.password,
      });
      
      setStatus('success');
      toast.success('Password reset successful!');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setStatus('error');
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  // No token provided
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--color-bg)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center"
        >
          <div 
            className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}
          >
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            Invalid Reset Link
          </h1>
          
          <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            This password reset link is invalid or has expired.
          </p>

          <Link to="/forgot-password">
            <Button className="w-full">
              Request New Link
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  // Success state
  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--color-bg)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <div 
            className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,227,165,0.1)' }}
          >
            <CheckCircle className="w-10 h-10" style={{ color: 'var(--color-primary)' }} />
          </div>
          
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            Password Reset!
          </h1>
          
          <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            Your password has been successfully reset. Redirecting to login...
          </p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--color-bg)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center"
        >
          <div 
            className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}
          >
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            Reset Failed
          </h1>
          
          <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            {error}
          </p>

          <div className="space-y-3">
            <Link to="/forgot-password">
              <Button className="w-full">
                Request New Link
              </Button>
            </Link>
            
            <Link to="/login">
              <Button variant="secondary" className="w-full">
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Form state
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--color-bg)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Logo size="lg" className="mx-auto mb-8" />
          
          <div 
            className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,227,165,0.1)' }}
          >
            <Lock className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />
          </div>
          
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            Create New Password
          </h1>
          
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Your new password must be different from previous passwords.
          </p>
        </div>

        <div 
          className="p-6 rounded-2xl"
          style={{ backgroundColor: 'var(--color-surface)' }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                New Password
              </label>
              <div className="relative">
                <Lock 
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" 
                  style={{ color: 'var(--color-text-muted)' }} 
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-lg"
                  style={{
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength */}
              {formData.password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: 'var(--color-text-muted)' }}>Password strength</span>
                    <span style={{ color: passwordStrength.color }} className="font-medium">
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div 
                    className="h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: 'var(--color-border)' }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${passwordStrength.score}%` }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: passwordStrength.color }}
                    />
                  </div>
                  
                  <div className="space-y-1 mt-2">
                    {passwordStrength.requirements.map((req, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        {req.met ? (
                          <Check className="w-3.5 h-3.5 text-green-500" />
                        ) : (
                          <X className="w-3.5 h-3.5" style={{ color: 'var(--color-text-muted)' }} />
                        )}
                        <span style={{ color: req.met ? 'var(--color-text-secondary)' : 'var(--color-text-muted)' }}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                Confirm New Password
              </label>
              <div className="relative">
                <Lock 
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" 
                  style={{ color: 'var(--color-text-muted)' }} 
                />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-lg"
                  style={{
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Match indicator */}
              {formData.confirmPassword && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 mt-2 text-xs"
                >
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-500" />
                      <span className="text-green-500">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <X className="w-3.5 h-3.5 text-red-500" />
                      <span className="text-red-500">Passwords do not match</span>
                    </>
                  )}
                </motion.div>
              )}
            </div>

            {/* Error message */}
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              isLoading={isLoading}
              disabled={!formData.password || !formData.confirmPassword}
            >
              Reset Password
            </Button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-sm font-medium"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
