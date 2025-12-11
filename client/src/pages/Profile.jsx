import { useState, useRef } from 'react';
import { 
  User, Mail, Camera, Loader2, Save, Lock, Eye, EyeOff,
  CheckCircle, AlertCircle, Shield, Calendar, Trash2, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI, uploadAPI } from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  
  // Profile state
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  
  // Password state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Handle avatar upload
  const handleAvatarClick = () => {
    if (user?.avatar) {
      setShowAvatarOptions(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      setShowAvatarOptions(false);
      const response = await uploadAPI.avatar(file);
      
      // Update user in context
      updateUser({ avatar: response.data.data.url });
      toast.success('Avatar updated successfully!');
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle avatar removal
  const handleRemoveAvatar = async () => {
    if (!user?.avatar) return;

    try {
      setIsRemoving(true);
      setShowAvatarOptions(false);
      
      // Delete from Cloudinary
      await uploadAPI.delete(user.avatar);
      
      // Update user profile to remove avatar
      await authAPI.updateProfile({ name: user.name, avatar: '' });
      
      // Update local state
      updateUser({ avatar: '' });
      toast.success('Avatar removed successfully!');
    } catch (error) {
      console.error('Avatar remove error:', error);
      toast.error(error.response?.data?.message || 'Failed to remove avatar');
    } finally {
      setIsRemoving(false);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      setIsLoading(true);
      const response = await authAPI.updateProfile({ name: formData.name });
      updateUser(response.data.data.user);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Validation
    if (!passwordData.currentPassword) {
      toast.error('Current password is required');
      return;
    }
    if (!passwordData.newPassword) {
      toast.error('New password is required');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setIsChangingPassword(true);
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      toast.success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordSection(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            Profile Settings
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Manage your account settings and profile information
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Avatar */}
          <div className="md:col-span-1">
            <div className="card text-center">
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                <div 
                  className="w-32 h-32 rounded-full overflow-hidden mx-auto relative"
                  style={{ backgroundColor: 'var(--color-surface)' }}
                >
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div 
                      className="w-full h-full flex items-center justify-center text-3xl font-bold"
                      style={{ 
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--color-bg)'
                      }}
                    >
                      {getInitials(user?.name)}
                    </div>
                  )}
                  
                  {/* Upload/Remove Overlay */}
                  {(isUploading || isRemoving) && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-white" />
                    </div>
                  )}
                </div>

                {/* Camera Button */}
                <button
                  onClick={handleAvatarClick}
                  disabled={isUploading || isRemoving}
                  className="absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:opacity-90"
                  style={{ 
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-bg)'
                  }}
                >
                  <Camera className="w-5 h-5" />
                </button>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />

                {/* Avatar Options Modal */}
                {showAvatarOptions && (
                  <>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setShowAvatarOptions(false)}
                    />
                    <div 
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 py-2 rounded-xl shadow-xl z-50"
                      style={{ 
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)'
                      }}
                    >
                      <button
                        onClick={() => {
                          setShowAvatarOptions(false);
                          fileInputRef.current?.click();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--color-bg)]"
                        style={{ color: 'var(--color-text)' }}
                      >
                        <Camera className="w-4 h-4" />
                        Change Photo
                      </button>
                      <button
                        onClick={handleRemoveAvatar}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove Photo
                      </button>
                    </div>
                  </>
                )}
              </div>

              <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>
                {user?.name}
              </h2>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {user?.email}
              </p>

              {/* Role Badge */}
              <div className="mt-4">
                <span 
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm"
                  style={{ 
                    backgroundColor: user?.role === 'admin' ? 'rgba(239,68,68,0.1)' : 'rgba(0,227,165,0.1)',
                    color: user?.role === 'admin' ? '#EF4444' : 'var(--color-primary)'
                  }}
                >
                  <Shield className="w-4 h-4" />
                  {user?.role === 'admin' ? 'Administrator' : 'User'}
                </span>
              </div>

              {/* Google Account Indicator */}
              {user?.googleId && (
                <div className="mt-3 flex items-center justify-center gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Connected with Google
                </div>
              )}

              {/* Member Since */}
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                <div className="flex items-center justify-center gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  <Calendar className="w-4 h-4" />
                  Member since {formatDate(user?.createdAt)}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Profile & Password */}
          <div className="md:col-span-2 space-y-6">
            {/* Profile Information */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
                  Profile Information
                </h3>
                {!isEditing && (
                  <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <Input
                    label="Full Name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    leftIcon={<User className="w-5 h-5" />}
                  />
                  
                  <Input
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    disabled
                    leftIcon={<Mail className="w-5 h-5" />}
                    helperText="Email cannot be changed"
                  />

                  <div className="flex gap-3 pt-2">
                    <Button type="submit" isLoading={isLoading}>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                    <Button 
                      type="button" 
                      variant="secondary" 
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({ name: user?.name || '', email: user?.email || '' });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Full Name</label>
                    <p className="font-medium" style={{ color: 'var(--color-text)' }}>{user?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Email Address</label>
                    <div className="flex items-center gap-2">
                      <p className="font-medium" style={{ color: 'var(--color-text)' }}>{user?.email}</p>
                      {user?.isEmailVerified && (
                        <CheckCircle className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Password Section - Only show for non-Google users */}
            {!user?.googleId && (
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
                    Password & Security
                  </h3>
                  {!showPasswordSection && (
                    <Button variant="secondary" size="sm" onClick={() => setShowPasswordSection(true)}>
                      Change Password
                    </Button>
                  )}
                </div>

                {showPasswordSection ? (
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="relative">
                      <Input
                        label="Current Password"
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        leftIcon={<Lock className="w-5 h-5" />}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                        className="absolute right-3 top-9 p-1"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    <div className="relative">
                      <Input
                        label="New Password"
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        leftIcon={<Lock className="w-5 h-5" />}
                        helperText="Minimum 6 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                        className="absolute right-3 top-9 p-1"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    <div className="relative">
                      <Input
                        label="Confirm New Password"
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        leftIcon={<Lock className="w-5 h-5" />}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                        className="absolute right-3 top-9 p-1"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button type="submit" isLoading={isChangingPassword}>
                        <Lock className="w-4 h-4" />
                        Update Password
                      </Button>
                      <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={() => {
                          setShowPasswordSection(false);
                          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg)' }}>
                    <Lock className="w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
                    <div>
                      <p style={{ color: 'var(--color-text)' }}>Password</p>
                      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        ••••••••
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Google Users - No Password Section */}
            {user?.googleId && (
              <div className="card">
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
                  Password & Security
                </h3>
                <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg)' }}>
                  <AlertCircle className="w-5 h-5" style={{ color: 'var(--color-secondary)' }} />
                  <div>
                    <p style={{ color: 'var(--color-text)' }}>Signed in with Google</p>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                      Password management is handled by your Google account
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
