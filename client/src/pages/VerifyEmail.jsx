import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, RefreshCw, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import Button from '../components/ui/Button';
import Logo from '../components/common/Logo';
import toast from 'react-hot-toast';

export default function VerifyEmail() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  // Redirect if already verified
  useEffect(() => {
    if (user?.isEmailVerified) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Handle OTP input change
  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    
    // Handle paste
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split('');
      pastedCode.forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit;
      });
      setOtp(newOtp);
      // Focus last filled input or last input
      const lastIndex = Math.min(pastedCode.length - 1, 5);
      inputRefs.current[lastIndex]?.focus();
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste on container
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const newOtp = [...otp];
      pastedData.split('').forEach((digit, i) => {
        newOtp[i] = digit;
      });
      setOtp(newOtp);
      inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
    }
  };

  // Verify OTP
  const handleVerify = async () => {
    const code = otp.join('');
    
    if (code.length !== 6) {
      toast.error('Please enter the 6-digit code');
      return;
    }

    setIsVerifying(true);
    try {
      const response = await authAPI.verifyEmail({ otp: code });
      
      // Update user in context
      updateUser({ isEmailVerified: true });
      
      setIsVerified(true);
      toast.success('Email verified successfully!');
      
      // Redirect after animation
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid verification code');
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setIsResending(true);
    try {
      await authAPI.resendOTP();
      toast.success('New verification code sent!');
      setResendCooldown(60); // 60 second cooldown
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  // Auto-submit when all digits entered
  useEffect(() => {
    if (otp.every(digit => digit !== '') && !isVerifying) {
      handleVerify();
    }
  }, [otp]);

  // Success state
  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--color-bg)' }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,227,165,0.1)' }}
          >
            <CheckCircle className="w-12 h-12" style={{ color: 'var(--color-primary)' }} />
          </motion.div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            Email Verified!
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Redirecting to dashboard...
          </p>
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
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,227,165,0.1)' }}
          >
            <Mail className="w-10 h-10" style={{ color: 'var(--color-primary)' }} />
          </div>
          
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            Verify Your Email
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            We sent a 6-digit code to
          </p>
          <p className="font-medium" style={{ color: 'var(--color-primary)' }}>
            {user?.email}
          </p>
        </div>

        {/* OTP Input */}
        <div 
          className="card p-6 mb-6"
          onPaste={handlePaste}
        >
          <div className="flex justify-center gap-2 sm:gap-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-11 h-14 sm:w-12 sm:h-14 text-center text-2xl font-bold rounded-lg border-2 focus:outline-none transition-colors"
                style={{ 
                  backgroundColor: 'var(--color-bg)',
                  borderColor: digit ? 'var(--color-primary)' : 'var(--color-border)',
                  color: 'var(--color-text)'
                }}
                disabled={isVerifying}
              />
            ))}
          </div>

          <Button 
            onClick={handleVerify} 
            className="w-full" 
            size="lg"
            isLoading={isVerifying}
            disabled={otp.some(d => !d)}
          >
            {isVerifying ? 'Verifying...' : 'Verify Email'}
            {!isVerifying && <ArrowRight className="w-5 h-5" />}
          </Button>
        </div>

        {/* Resend */}
        <div className="text-center">
          <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
            Didn't receive the code?
          </p>
          <button
            onClick={handleResend}
            disabled={resendCooldown > 0 || isResending}
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors disabled:opacity-50"
            style={{ color: 'var(--color-primary)' }}
          >
            {isResending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : resendCooldown > 0 ? (
              <>
                <RefreshCw className="w-4 h-4" />
                Resend in {resendCooldown}s
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Resend Code
              </>
            )}
          </button>
        </div>

        {/* Help text */}
        <p className="text-center text-xs mt-8" style={{ color: 'var(--color-text-muted)' }}>
          Check your spam folder if you don't see the email.<br />
          The code expires in 10 minutes.
        </p>
      </motion.div>
    </div>
  );
}
