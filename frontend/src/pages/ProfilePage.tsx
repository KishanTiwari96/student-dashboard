import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import Button from '../components/Button';
import InputField from '../components/InputField';
import Card from '../components/Card';
import { sendEmailVerification } from 'firebase/auth';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const { displayName: userDisplayName, photoURL: userPhotoURL, updateUserProfile } = useUser();
  const navigate = useNavigate();
  
  const [displayName, setDisplayName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setDisplayName(userDisplayName || '');
      setAvatar(userPhotoURL || '');
    }
  }, [currentUser, userDisplayName, userPhotoURL]);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      await updateUserProfile(displayName, avatar);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Profile update error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendVerification = async () => {
    setLoading(true);
    setError(null);
    try {
      await sendEmailVerification(currentUser);
      setVerificationSent(true);
      setTimeout(() => setVerificationSent(false), 5000);
    } catch (err) {
      setError('Failed to send verification email. Please try again.');
      console.error('Email verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    if (displayName) {
      return displayName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase();
    }
    return currentUser.email!.charAt(0).toUpperCase();
  };

  const getDefaultAvatar = () => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.email || 'User')}&background=0D8ABC&color=fff`;
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Your Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your personal information and account settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <div className="md:col-span-1">
          <Card>
            <div className="flex flex-col items-center p-6 dark:bg-gray-800">
              <div className="relative">
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                  {avatar ? (
                    <img src={avatar} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <span>{getInitials()}</span>
                  )}
                </div>
                {currentUser.emailVerified && (
                  <div className="absolute bottom-0 right-0 bg-green-500 p-1 rounded-full border-2 border-white dark:border-gray-800">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
              
              <h2 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">
                {displayName || currentUser.email!.split('@')[0]}
              </h2>
              
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{currentUser.email}</p>
              
              <div className="mt-3 flex items-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  currentUser.emailVerified 
                    ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400' 
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-400'
                }`}>
                  {currentUser.emailVerified ? 'Verified' : 'Not Verified'}
                </span>
                
                {!currentUser.emailVerified && (
                  <button 
                    onClick={handleSendVerification}
                    disabled={loading || verificationSent}
                    className="ml-2 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                  >
                    {verificationSent ? 'Email Sent!' : 'Verify Email'}
                  </button>
                )}
              </div>
              
              <div className="w-full mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <div className="mb-2 flex items-start">
                    <svg className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-medium">Account Created</p>
                      <p>{currentUser.metadata.creationTime
                        ? new Date(currentUser.metadata.creationTime).toLocaleDateString()
                        : 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <svg className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <div>
                      <p className="font-medium">Last Sign In</p>
                      <p>{currentUser.metadata.lastSignInTime 
                        ? new Date(currentUser.metadata.lastSignInTime).toLocaleDateString()
                        : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Profile Edit Form */}
        <div className="md:col-span-2">
          <Card>
            <div className="p-6 dark:bg-gray-800">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Edit Profile Information</h2>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 rounded">
                  <p className="text-sm">{error}</p>
                </div>
              )}
              
              {success && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 text-green-700 dark:text-green-400 rounded">
                  <p className="text-sm">Profile updated successfully!</p>
                </div>
              )}
              
              <form onSubmit={handleUpdateProfile}>
                <div className="space-y-4">
                  <InputField
                    id="displayName"
                    label="Display Name"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your name"
                  />
                  
                  <InputField
                    id="avatar"
                    label="Profile Picture URL"
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://example.com/your-photo.jpg"
                    helperText="Enter a direct URL to an image, or leave blank to use your initials"
                  />
                  
                  <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    <p>Preview:</p>
                    <div className="mt-2 h-16 w-16 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
                      {avatar ? (
                        <img 
                          src={avatar} 
                          alt="Avatar preview" 
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null; 
                            e.currentTarget.src = getDefaultAvatar();
                          }}
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                          {getInitials()}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading}
                      className="w-full md:w-auto"
                    >
                      {loading ? 'Updating...' : 'Update Profile'}
                    </Button>
                  </div>
                </div>
              </form>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Email Address</h3>
                <p className="text-gray-600 mb-4">
                  Your email address is <strong>{currentUser.email}</strong>
                </p>
                
                <Button
                  variant="outline"
                  onClick={() => navigate('/settings')}
                >
                  Manage Account Settings
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;