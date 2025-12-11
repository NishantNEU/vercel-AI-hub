import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Sparkles, Check, X, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Logo from '../components/common/Logo';
import HelperChatBot from '../components/common/HelperChatBot';

const benefits = [
  'Access to 70+ curated AI tools',
  'Learn from expert-led courses',
  'Chat with advanced AI models',
  'Earn certificates on completion',
  'Track your learning progress',
];

// Name validation
const validateName = (name) => {
  if (!name) return { isValid: false, message: '' };
  
  const trimmed = name.trim();
  
  if (trimmed.length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters' };
  }
  
  if (trimmed.length > 50) {
    return { isValid: false, message: 'Name must be less than 50 characters' };
  }
  
  if (/\d/.test(trimmed)) {
    return { isValid: false, message: 'Name cannot contain numbers' };
  }
  
  if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
    return { isValid: false, message: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }
  
  // Check for valid name pattern (at least first name)
  if (!/^[a-zA-Z][a-zA-Z\s'-]*$/.test(trimmed)) {
    return { isValid: false, message: 'Name must start with a letter' };
  }
  
  return { isValid: true, message: 'Looks good!' };
};

// Email validation
const validateEmail = (email) => {
  if (!email) return { isValid: false, message: '' };
  
  const trimmed = email.trim().toLowerCase();
  
  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  
  // Check for common typos in domains
  const commonTypos = {
    'gmial.com': 'gmail.com',
    'gmal.com': 'gmail.com',
    'gamil.com': 'gmail.com',
    'gnail.com': 'gmail.com',
    'gmail.con': 'gmail.com',
    'gmail.co': 'gmail.com',
    'hotmal.com': 'hotmail.com',
    'hotmial.com': 'hotmail.com',
    'hotmail.con': 'hotmail.com',
    'yahooo.com': 'yahoo.com',
    'yaho.com': 'yahoo.com',
    'yahoo.con': 'yahoo.com',
    'outlok.com': 'outlook.com',
    'outloo.com': 'outlook.com',
  };
  
  const domain = trimmed.split('@')[1];
  if (commonTypos[domain]) {
    return { 
      isValid: false, 
      message: `Did you mean @${commonTypos[domain]}?`,
      suggestion: trimmed.replace(domain, commonTypos[domain])
    };
  }
  
  // Check for valid TLD
  const validTLDs = ['com', 'org', 'net', 'edu', 'gov', 'io', 'co', 'in', 'uk', 'us', 'ca', 'au', 'de', 'fr', 'jp', 'cn', 'info', 'biz', 'me', 'tv', 'cc', 'xyz'];
  const tld = domain.split('.').pop();
  if (tld.length < 2) {
    return { isValid: false, message: 'Please enter a valid email domain' };
  }
  
  // Check for disposable email domains
  const disposableDomains = [
    'tempmail.com', 'throwaway.com', 'mailinator.com', 'guerrillamail.com',
    'temp-mail.org', '10minutemail.com', 'fakeinbox.com', 'trashmail.com'
  ];
  if (disposableDomains.includes(domain)) {
    return { isValid: false, message: 'Please use a permanent email address' };
  }
  
  // Check minimum length for local part
  const localPart = trimmed.split('@')[0];
  if (localPart.length < 1) {
    return { isValid: false, message: 'Email username is too short' };
  }
  
  return { isValid: true, message: 'We\'ll send important updates here' };
};

// Validation indicator component
const ValidationIndicator = ({ validation, show }) => {
  if (!show || !validation.message) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 mt-1.5 text-xs"
    >
      {validation.isValid ? (
        <>
          <Check className="w-3.5 h-3.5 text-green-500" />
          <span className="text-green-500">{validation.message}</span>
        </>
      ) : (
        <>
          <AlertCircle className="w-3.5 h-3.5 text-red-400" />
          <span className="text-red-400">{validation.message}</span>
        </>
      )}
    </motion.div>
  );
};

// Password strength calculation
const calculatePasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '', requirements: [] };
  
  let score = 0;
  const requirements = [
    { 
      label: 'At least 8 characters', 
      met: password.length >= 8,
      required: true
    },
    { 
      label: 'Contains uppercase letter', 
      met: /[A-Z]/.test(password),
      required: true
    },
    { 
      label: 'Contains lowercase letter', 
      met: /[a-z]/.test(password),
      required: true
    },
    { 
      label: 'Contains a number', 
      met: /[0-9]/.test(password),
      required: true
    },
    { 
      label: 'Contains special character (!@#$%^&*)', 
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      required: false
    },
    { 
      label: 'At least 12 characters', 
      met: password.length >= 12,
      required: false
    },
  ];

  // Calculate score
  requirements.forEach(req => {
    if (req.met) score += req.required ? 20 : 10;
  });

  // Cap at 100
  score = Math.min(score, 100);

  // Determine label and color
  let label, color;
  if (score < 40) {
    label = 'Weak';
    color = '#EF4444'; // red
  } else if (score < 60) {
    label = 'Fair';
    color = '#F97316'; // orange
  } else if (score < 80) {
    label = 'Good';
    color = '#FBBF24'; // yellow
  } else {
    label = 'Strong';
    color = '#10B981'; // green
  }

  return { score, label, color, requirements };
};

// Password strength bar component
const PasswordStrengthBar = ({ password }) => {
  const { score, label, color, requirements } = useMemo(
    () => calculatePasswordStrength(password),
    [password]
  );

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-2 space-y-3"
    >
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: 'var(--color-text-muted)' }}>Password strength</span>
          <span style={{ color }} className="font-medium">{label}</span>
        </div>
        <div 
          className="h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: 'var(--color-border)' }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.3 }}
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="grid grid-cols-1 gap-1">
        {requirements.map((req, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-center gap-2 text-xs"
          >
            {req.met ? (
              <Check className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <X className="w-3.5 h-3.5" style={{ color: 'var(--color-text-muted)' }} />
            )}
            <span style={{ color: req.met ? 'var(--color-text-secondary)' : 'var(--color-text-muted)' }}>
              {req.label}
              {!req.required && <span className="text-[10px] ml-1 opacity-60">(optional)</span>}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Live validations
  const nameValidation = useMemo(() => validateName(formData.name), [formData.name]);
  const emailValidation = useMemo(() => validateEmail(formData.email), [formData.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  // Apply email suggestion
  const applyEmailSuggestion = () => {
    if (emailValidation.suggestion) {
      setFormData(prev => ({ ...prev, email: emailValidation.suggestion }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Name validation
    const nameCheck = validateName(formData.name);
    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (!nameCheck.isValid) {
      newErrors.name = nameCheck.message;
    }
    
    // Email validation
    const emailCheck = validateEmail(formData.email);
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailCheck.isValid) {
      newErrors.email = emailCheck.message;
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const { requirements } = calculatePasswordStrength(formData.password);
      const requiredNotMet = requirements.filter(r => r.required && !r.met);
      
      if (requiredNotMet.length > 0) {
        newErrors.password = `Password must have: ${requiredNotMet.map(r => r.label.toLowerCase()).join(', ')}`;
      }
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });
    setIsLoading(false);

    if (result.success) {
      // Redirect to email verification page
      if (result.requiresVerification) {
        navigate('/verify-email');
      } else {
        navigate('/dashboard');
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`;
  };

  // Check if password meets minimum requirements
  const passwordStrength = useMemo(
    () => calculatePasswordStrength(formData.password),
    [formData.password]
  );
  const isPasswordValid = passwordStrength.requirements
    .filter(r => r.required)
    .every(r => r.met);

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex flex-1 bg-dark-surface items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-[100px]" />
        </div>
        
        <div className="relative max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8"
          >
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary p-5 shadow-glow-lg">
              <Sparkles className="w-full h-full text-dark-bg" />
            </div>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold mb-6"
          >
            Start Your AI Journey Today
          </motion.h2>
          
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            {benefits.map((benefit, index) => (
              <motion.li
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span className="text-text-secondary">{benefit}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <Logo size="lg" className="mb-8" />
            <h1 className="text-3xl font-bold mb-2">Create your account</h1>
            <p className="text-text-secondary">
              Join thousands of AI enthusiasts
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <Input
                label="Full Name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.name}
                leftIcon={<User className="w-5 h-5" />}
              />
              <ValidationIndicator 
                validation={nameValidation} 
                show={touched.name && formData.name && !errors.name} 
              />
            </div>

            {/* Email Field */}
            <div>
              <Input
                label="Email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                leftIcon={<Mail className="w-5 h-5" />}
              />
              <ValidationIndicator 
                validation={emailValidation} 
                show={touched.email && formData.email && !errors.email} 
              />
              {/* Email suggestion */}
              {emailValidation.suggestion && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  type="button"
                  onClick={applyEmailSuggestion}
                  className="text-xs mt-1 text-primary hover:underline"
                >
                  Click to use: {emailValidation.suggestion}
                </motion.button>
              )}
            </div>

            {/* Password Field with Strength Indicator */}
            <div>
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  leftIcon={<Lock className="w-5 h-5" />}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 p-1 rounded"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Strength Bar */}
              <PasswordStrengthBar password={formData.password} />
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                leftIcon={<Lock className="w-5 h-5" />}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 p-1 rounded"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              
              {/* Password Match Indicator */}
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

            <div className="pt-2">
              <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                Create Account
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-dark-bg text-text-muted">or continue with</span>
            </div>
          </div>

          {/* Google Sign Up */}
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            size="lg"
            onClick={handleGoogleLogin}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>

          {/* Terms */}
          <p className="text-center mt-6 text-sm text-text-muted">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
          </p>

          {/* Sign In Link */}
          <p className="text-center mt-6 text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Floating AI Learning Guide Chat Bot */}
      <HelperChatBot />
    </div>
  );
}
