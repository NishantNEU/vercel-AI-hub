import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { authAPI } from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Logo from '../components/common/Logo';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authAPI.forgotPassword({ email });
      setIsSubmitted(true);
      toast.success('Reset link sent! Check your email.');
    } catch (err) {
      // Don't reveal if email exists or not for security
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Success state - email sent
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--color-bg)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center"
        >
          <div 
            className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,227,165,0.1)' }}
          >
            <CheckCircle className="w-10 h-10" style={{ color: 'var(--color-primary)' }} />
          </div>
          
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            Check Your Email
          </h1>
          
          <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            If an account exists with <strong style={{ color: 'var(--color-primary)' }}>{email}</strong>, 
            you'll receive a password reset link shortly.
          </p>

          <div 
            className="p-4 rounded-lg mb-6"
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              💡 Don't see the email? Check your spam folder.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => {
                setIsSubmitted(false);
                setEmail('');
              }}
              variant="secondary"
              className="w-full"
            >
              Try another email
            </Button>
            
            <Link to="/login">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

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
            <Mail className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />
          </div>
          
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            Forgot Password?
          </h1>
          
          <p style={{ color: 'var(--color-text-secondary)' }}>
            No worries! Enter your email and we'll send you a reset link.
          </p>
        </div>

        <div 
          className="p-6 rounded-2xl"
          style={{ backgroundColor: 'var(--color-surface)' }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              error={error}
              leftIcon={<Mail className="w-5 h-5" />}
            />

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              isLoading={isLoading}
            >
              <Send className="w-5 h-5" />
              Send Reset Link
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
