import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import InputField from '../components/InputField';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const { signup, loginWithGoogle, currentUser, error: authError } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  // Display Firebase authentication errors
  useEffect(() => {
    if (authError) {
      setLocalError(authError);
    }
  }, [authError]);

  // Calculate password strength whenever password changes
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    // Length check
    if (password.length >= 8) strength += 1;
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1;
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1;
    // Contains number
    if (/[0-9]/.test(password)) strength += 1;
    // Contains special char
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    setPasswordStrength(strength);
  }, [password]);

  const validateForm = (): boolean => {
    setLocalError(null);
    
    if (!email.trim()) {
      setLocalError('Email is required');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLocalError('Please enter a valid email address');
      return false;
    }
    
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return false;
    }
    
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      await signup(email, password);
      // Navigation is handled by the useEffect when currentUser changes
    } catch (err) {
      // Error is handled by authError in useAuth
      console.error('Signup attempt failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLocalError(null);
      setGoogleLoading(true);
      await loginWithGoogle();
      // Navigation is handled by the useEffect when currentUser changes
    } catch (err) {
      // Error is handled by the authError in useAuth
      console.error('Google login attempt failed');
    } finally {
      setGoogleLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prev => !prev);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(prev => !prev);
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-6 px-4 md:px-0 md:pt-0 md:justify-center bg-gradient-to-br from-gray-50 to-indigo-50">
      <div className="w-full max-w-md relative">
        {/* Decorative Elements */}
        <div className="absolute -top-8 -left-8 md:-top-12 md:-left-12 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 -right-8 md:-bottom-10 md:-right-10 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-tr from-blue-400 to-indigo-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
        
        <div className="relative backdrop-blur-sm bg-white/70 rounded-xl md:rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 z-0"></div>
          
          {/* Header with logo */}
          <div className="relative pt-6 pb-4 md:pt-8 md:pb-6 px-6 md:px-8 text-center border-b border-gray-200 mb-4 md:mb-6 z-10">
            <div className="mx-auto w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-full flex items-center justify-center mb-3 md:mb-4 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Create Account</h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">Join Student<span className="text-indigo-600">Hub</span> today</p>
          </div>
          
          {/* Signup Form */}
          <div className="px-6 pb-6 md:px-8 md:pb-8 relative z-10">
          <form onSubmit={handleSubmit}>
            {localError && (
                <div className="mb-4 md:mb-5 p-3 md:p-4 rounded-lg bg-red-50 border-l-4 border-red-500 flex items-center">
                  <svg className="h-4 w-4 md:h-5 md:w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                <p className="text-xs md:text-sm text-red-700">{localError}</p>
              </div>
            )}
            
              <div className="space-y-4 md:space-y-5">
            <InputField
              id="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
              required
                  className="mb-0"
            />
            
                <div className="relative">
            <InputField
              id="password"
              label="Password"
                    type={isPasswordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
              required
              minLength={6}
                    className="mb-0"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                    onClick={togglePasswordVisibility}
                  >
                    {isPasswordVisible ? (
                      <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                  
                  {/* Password strength meter */}
                  {password && (
                    <div className="mt-1">
                      <div className="flex h-1 w-full overflow-hidden rounded-full bg-gray-200">
                        <div 
                          className={`transition-all duration-300 ${getStrengthColor()}`} 
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 flex justify-between">
                        <span>Password strength: </span>
                        <span className={`font-medium ${
                          passwordStrength <= 1 ? 'text-red-500' : 
                          passwordStrength <= 3 ? 'text-yellow-500' : 
                          'text-green-500'
                        }`}>
                          {getStrengthText()}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="relative">
            <InputField
              id="confirmPassword"
              label="Confirm Password"
                    type={isConfirmPasswordVisible ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              minLength={6}
                    className="mb-0"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {isConfirmPasswordVisible ? (
                      <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                
                <div className="flex items-start md:items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="ml-2 block text-xs md:text-sm text-gray-700">
                    I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-500">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
                  </label>
                </div>
              </div>
              
              <div className="mt-6 md:mt-8">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={loading}
                responsive={true}
                className="py-2 md:py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 relative overflow-hidden group"
              >
                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                <span className="relative">{loading ? 'Creating Account...' : 'Create Account'}</span>
              </Button>
            </div>
          </form>
          
          <div className="mt-5 md:mt-6 flex items-center justify-center">
            <span className="bg-gray-300 h-px flex-grow mx-3"></span>
            <span className="text-xs md:text-sm text-gray-500 px-2">Or continue with</span>
            <span className="bg-gray-300 h-px flex-grow mx-3"></span>
          </div>
          
          <div className="mt-4 md:mt-5">
            <button
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-2 py-2 md:py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 relative overflow-hidden group"
            >
              <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-indigo-500 rounded-full group-hover:w-full group-hover:h-56 opacity-10"></span>
              {googleLoading ? (
                <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22,12.1c0-0.6,0-1.2-0.1-1.8H12v3.4h5.6c-0.2,1.2-1,2.3-2.1,3v2.5h3.3C20.9,17.1,22,14.8,22,12.1z M12,22c2.8,0,5.1-0.9,6.8-2.5l-3.3-2.5c-0.9,0.6-2.1,1-3.5,1c-2.7,0-4.9-1.8-5.7-4.2H3v2.6C4.7,19.8,8.1,22,12,22z M6.3,13.7c-0.2-0.6-0.3-1.2-0.3-1.8c0-0.6,0.1-1.2,0.3-1.8V7.5H3c-0.6,1.4-1,2.9-1,4.5s0.4,3.1,1,4.5L6.3,13.7z M12,5.8c1.5,0,2.9,0.5,3.9,1.5l2.9-2.9C17.1,2.7,14.8,2,12,2C8.1,2,4.7,4.2,3,7.5l3.3,2.6C7.1,7.6,9.4,5.8,12,5.8z"/>
                  </svg>
                  <span className="relative">Sign up with Google</span>
                </>
              )} 
            </button>
          </div>

          <div className="mt-4 md:mt-5 text-center">
            <p className="text-xs md:text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Sign in
              </Link>
            </p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
