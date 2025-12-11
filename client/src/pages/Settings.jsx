import { useState } from 'react';
import { 
  Settings as SettingsIcon, Moon, Sun, Bell, BellOff, 
  Globe, Trash2, AlertTriangle, Check, Monitor,
  Shield, Eye, EyeOff, Lock
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  
  // Notification preferences (mock state - would need backend support)
  const [notifications, setNotifications] = useState({
    email: true,
    coursesUpdates: true,
    newFeatures: false,
    marketing: false,
  });
  
  // Privacy settings (mock state)
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showActivity: true,
  });
  
  // Delete account modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Theme options
  const themeOptions = [
    { value: 'dark', label: 'Dark', icon: Moon, description: 'Easy on the eyes' },
    { value: 'light', label: 'Light', icon: Sun, description: 'Classic bright mode' },
    { value: 'system', label: 'System', icon: Monitor, description: 'Match device settings' },
  ];

  // Handle notification toggle
  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success('Notification preferences updated');
  };

  // Handle privacy toggle
  const handlePrivacyToggle = (key) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success('Privacy settings updated');
  };

  // Handle theme change
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    toast.success(`Theme changed to ${newTheme}`);
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }

    // Require password for non-Google accounts
    if (!user?.googleId && !deletePassword) {
      toast.error('Please enter your password');
      return;
    }

    try {
      setIsDeleting(true);
      
      await authAPI.deleteAccount({
        password: deletePassword,
        confirmation: deleteConfirmText
      });
      
      toast.success('Account deleted successfully');
      logout();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setDeleteConfirmText('');
      setDeletePassword('');
    }
  };

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            Settings
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Customize your experience and manage your preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Appearance */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'rgba(0,227,165,0.1)' }}
              >
                <Moon className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              </div>
              <div>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
                  Appearance
                </h2>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Customize how AI Super Hub looks
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = theme === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleThemeChange(option.value)}
                    className={`relative p-4 rounded-xl text-left transition-all ${
                      isSelected ? 'ring-2 ring-[var(--color-primary)]' : ''
                    }`}
                    style={{ 
                      backgroundColor: isSelected ? 'rgba(0,227,165,0.1)' : 'var(--color-bg)',
                      border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`
                    }}
                  >
                    {isSelected && (
                      <div 
                        className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                      >
                        <Check className="w-3 h-3" style={{ color: 'var(--color-bg)' }} />
                      </div>
                    )}
                    <Icon 
                      className="w-6 h-6 mb-2" 
                      style={{ color: isSelected ? 'var(--color-primary)' : 'var(--color-text-secondary)' }} 
                    />
                    <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                      {option.label}
                    </p>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notifications */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'rgba(0,209,255,0.1)' }}
              >
                <Bell className="w-5 h-5" style={{ color: 'var(--color-secondary)' }} />
              </div>
              <div>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
                  Notifications
                </h2>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Manage your email notifications
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { key: 'email', label: 'Email Notifications', description: 'Receive important updates via email' },
                { key: 'coursesUpdates', label: 'Course Updates', description: 'Get notified about new lessons and quizzes' },
                { key: 'newFeatures', label: 'New Features', description: 'Be the first to know about new features' },
                { key: 'marketing', label: 'Marketing Emails', description: 'Receive promotional content and offers' },
              ].map((item) => (
                <div 
                  key={item.key}
                  className="flex items-center justify-between p-4 rounded-lg"
                  style={{ backgroundColor: 'var(--color-bg)' }}
                >
                  <div>
                    <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                      {item.label}
                    </p>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                      {item.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle(item.key)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      notifications[item.key] ? 'bg-[var(--color-primary)]' : 'bg-gray-600'
                    }`}
                  >
                    <div 
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        notifications[item.key] ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'rgba(139,92,246,0.1)' }}
              >
                <Shield className="w-5 h-5" style={{ color: '#8B5CF6' }} />
              </div>
              <div>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
                  Privacy
                </h2>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Control your privacy settings
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { key: 'profileVisible', label: 'Public Profile', description: 'Allow others to see your profile', icon: Eye },
                { key: 'showActivity', label: 'Show Activity', description: 'Display your learning activity on profile', icon: Globe },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={item.key}
                    className="flex items-center justify-between p-4 rounded-lg"
                    style={{ backgroundColor: 'var(--color-bg)' }}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
                      <div>
                        <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                          {item.label}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePrivacyToggle(item.key)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        privacy[item.key] ? 'bg-[var(--color-primary)]' : 'bg-gray-600'
                      }`}
                    >
                      <div 
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          privacy[item.key] ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Danger Zone */}
          <div 
            className="card"
            style={{ border: '1px solid rgba(239,68,68,0.3)' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}
              >
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-red-500">
                  Danger Zone
                </h2>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Irreversible actions
                </p>
              </div>
            </div>

            <div 
              className="flex items-center justify-between p-4 rounded-lg"
              style={{ backgroundColor: 'rgba(239,68,68,0.05)' }}
            >
              <div>
                <p className="font-medium text-red-400">Delete Account</p>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Permanently delete your account and all data
                </p>
              </div>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => setShowDeleteModal(true)}
                className="!text-red-400 !border-red-500/30 hover:!bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowDeleteModal(false)}
          />
          <div 
            className="relative w-full max-w-md p-6 rounded-2xl"
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            <div className="text-center mb-6">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}
              >
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-red-500 mb-2">
                Delete Account?
              </h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                This action cannot be undone. All your data, courses progress, and chat history will be permanently deleted.
              </p>
            </div>

            <div className="mb-4">
              <label className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Type <span className="font-bold text-red-400">DELETE</span> to confirm
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full mt-2 px-4 py-2 rounded-lg"
                style={{ 
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)'
                }}
                placeholder="Type DELETE"
              />
            </div>

            {/* Password field - only show for non-Google accounts */}
            {!user?.googleId && (
              <div className="mb-6">
                <label className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Enter your password to confirm
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="w-full mt-2 pl-10 pr-4 py-2 rounded-lg"
                    style={{ 
                      backgroundColor: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text)'
                    }}
                    placeholder="Enter your password"
                  />
                </div>
              </div>
            )}

            {user?.googleId && <div className="mb-6" />}

            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                className="flex-1"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText('');
                  setDeletePassword('');
                }}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 !bg-red-500 hover:!bg-red-600"
                onClick={handleDeleteAccount}
                isLoading={isDeleting}
                disabled={deleteConfirmText !== 'DELETE' || (!user?.googleId && !deletePassword)}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
