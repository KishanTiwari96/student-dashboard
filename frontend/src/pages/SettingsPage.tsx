import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import InputField from '../components/InputField';
import Card from '../components/Card';
import ConfirmationModal from '../components/ConfirmationModal';
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser
} from 'firebase/auth';

const SettingsPage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('security');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);
  
  // Preference States
  const [emailNotifications, setEmailNotifications] = useState(() => {
    const saved = localStorage.getItem('emailNotifications');
    return saved !== null ? saved === 'true' : true;
  });
  
  const [studentUpdates, setStudentUpdates] = useState(() => {
    const saved = localStorage.getItem('studentUpdates');
    return saved !== null ? saved === 'true' : true;
  });
  
  const [marketingEmails, setMarketingEmails] = useState(() => {
    const saved = localStorage.getItem('marketingEmails');
    return saved !== null ? saved === 'true' : false;
  });
  
  const [compactView, setCompactView] = useState(() => {
    const saved = localStorage.getItem('compactView');
    return saved !== null ? saved === 'true' : false;
  });

  useEffect(() => {
    // Initialize preferences from localStorage on component mount
    const initPreferences = () => {
      document.documentElement.classList.toggle('compact-view', compactView);
    };
    
    initPreferences();
  }, [compactView]);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Check if user has email/password provider
      const hasPasswordProvider = currentUser.providerData.some(
        provider => provider.providerId === 'password'
      );
      
      if (!hasPasswordProvider) {
        setError('You cannot change password because you signed in with Google.');
        setLoading(false);
        return;
      }
      
      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(
        currentUser.email!,
        currentPassword
      );
      
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);
      
      setSuccess(true);
      resetForm();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Password update error:', err);
      if (err.code === 'auth/wrong-password') {
        setError('Current password is incorrect');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later');
      } else if (err.code === 'auth/requires-recent-login') {
        setError('This operation requires recent authentication. Please log out and log back in before retrying');
      } else {
        setError('Failed to update password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAccountDelete = async () => {
    setDeleteError(null);
    setLoading(true);
    
    try {
      if (!currentUser) {
        throw new Error('User not found');
      }
      
      // Re-authenticate user before deleting account
      const credential = EmailAuthProvider.credential(
        currentUser.email!,
        deletePassword
      );
      
      await reauthenticateWithCredential(currentUser, credential);
      await deleteUser(currentUser);
      
      // No need to redirect - onAuthStateChanged in AuthContext will handle this
    } catch (err: any) {
      console.error('Account deletion error:', err);
      if (err.code === 'auth/wrong-password') {
        setDeleteError('Password is incorrect');
      } else {
        setDeleteError('Failed to delete account. Please try again.');
      }
      setLoading(false);
    }
  };

  // Save preferences to localStorage
  const savePreference = (key: string, value: boolean) => {
    localStorage.setItem(key, value.toString());
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Account Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account security and preferences</p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden transition-colors duration-200">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button 
            type="button"
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'security' 
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('security')}
          >
            Security & Password
          </button>
          <button 
            type="button"
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'account' 
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('account')}
          >
            Account Management
          </button>
          <button 
            type="button"
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'preferences' 
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('preferences')}
          >
            Preferences
          </button>
        </div>

        {/* Content */}
        <div className="p-6 dark:text-white">
          {/* Security & Password Tab */}
          {activeTab === 'security' && (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">Change Password</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Update your password to keep your account secure
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 rounded">
                  <p className="text-sm">{error}</p>
                </div>
              )}
              
              {success && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 text-green-700 dark:text-green-400 rounded">
                  <p className="text-sm">Password updated successfully!</p>
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                <InputField
                  id="currentPassword"
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  required
                />
                
                <InputField
                  id="newPassword"
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  minLength={6}
                />

                <InputField
                  id="confirmPassword"
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  minLength={6}
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                  >
                    {loading ? 'Updating Password...' : 'Update Password'}
                  </Button>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Login Method</h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg max-w-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300">Email and Password</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{currentUser.email}</p>
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-md text-xs font-medium">
                      Primary
                    </div>
                  </div>
                  
                  {currentUser.providerData.map(provider => (
                    provider.providerId !== 'password' && (
                      <div key={provider.providerId} className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div>
                          <p className="font-medium text-gray-700 dark:text-gray-300">
                            {provider.providerId === 'google.com' ? 'Google' : provider.providerId}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{provider.email}</p>
                        </div>
                        <div className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 px-2 py-1 rounded-md text-xs font-medium">
                          Connected
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Account Management Tab */}
          {activeTab === 'account' && (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">Account Management</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Manage your account and make permanent changes
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-blue-300 hover:shadow-md">
                  <div className="dark:bg-gray-800">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-800 dark:text-white">Your Profile</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Update your personal information
                        </p>
                      </div>
                      <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        onClick={() => navigate('/profile')}
                      >
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="border-blue-300 hover:shadow-md">
                  <div className="dark:bg-gray-800">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-800 dark:text-white">Sign Out</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Log out from your account
                        </p>
                      </div>
                      <svg className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </div>
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        onClick={logout}
                      >
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                <Card className="border-blue-300 hover:shadow-md">
                  <div className="dark:bg-gray-800">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-red-600 dark:text-red-400">Delete Account</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Permanently delete your account and all data. This action cannot be undone.
                        </p>
                      </div>
                      <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </div>
                    <div className="mt-4">
                      <Button
                        variant="danger"
                        onClick={() => setShowDeleteConfirm(true)}
                      >
                        Delete My Account
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">Preferences</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Customize your experience with StudentHub
                </p>
              </div>

              <div className="space-y-6">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Notifications</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700 dark:text-gray-300">Email Notifications</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates and alerts via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={emailNotifications}
                          onChange={() => {
                            setEmailNotifications(!emailNotifications);
                            savePreference('emailNotifications', !emailNotifications);
                          }}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700 dark:text-gray-300">Student Updates</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications about student changes</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={studentUpdates}
                          onChange={() => {
                            setStudentUpdates(!studentUpdates);
                            savePreference('studentUpdates', !studentUpdates);
                          }}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700 dark:text-gray-300">Marketing Emails</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive promotional content and offers</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={marketingEmails}
                          onChange={() => {
                            setMarketingEmails(!marketingEmails);
                            savePreference('marketingEmails', !marketingEmails);
                          }}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Display Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700 dark:text-gray-300">Dark Mode</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark themes</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700 dark:text-gray-300">Compact View</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Show more content with less spacing</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={compactView}
                          onChange={() => {
                            setCompactView(!compactView);
                            savePreference('compactView', !compactView);
                          }}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>Preference changes are saved automatically</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Delete Account Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeletePassword('');
          setDeleteError(null);
        }}
        onConfirm={handleAccountDelete}
        title="Delete Your Account?"
        message="This action is permanent and cannot be undone. All your data will be permanently deleted."
        confirmText="Delete Account"
        cancelText="Cancel"
        type="danger"
        loading={loading}
        customContent={
          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Please enter your password to confirm:</p>
            <InputField
              id="deletePassword"
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              label=""
              placeholder="Enter your password"
              required
            />
            {deleteError && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{deleteError}</p>
            )}
          </div>
        }
      />
    </div>
  );
};

export default SettingsPage; 