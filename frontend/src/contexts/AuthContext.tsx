import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

interface AuthContextType {
  currentUser: User | null;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sign up function
  async function signup(email: string, password: string) {
    try {
      setError(null);
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      const errorMessage = (err as Error).message;
      console.error('Signup error:', errorMessage);
      setError(parseFirebaseAuthError(errorMessage));
      throw err;
    }
  }

  // Login function
  async function login(email: string, password: string) {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      const errorMessage = (err as Error).message;
      console.error('Login error:', errorMessage);
      setError(parseFirebaseAuthError(errorMessage));
      throw err;
    }
  }

  // Google Sign In function
  async function loginWithGoogle() {
    try {
      setError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const errorMessage = (err as Error).message;
      console.error('Google login error:', errorMessage);
      setError(parseFirebaseAuthError(errorMessage));
      throw err;
    }
  }

  // Logout function
  async function logout() {
    try {
      setError(null);
      await signOut(auth);
    } catch (err) {
      const errorMessage = (err as Error).message;
      console.error('Logout error:', errorMessage);
      setError(parseFirebaseAuthError(errorMessage));
      throw err;
    }
  }

  // Parse Firebase error messages to more user-friendly messages
  function parseFirebaseAuthError(message: string): string {
    if (message.includes('auth/user-not-found') || message.includes('auth/wrong-password')) {
      return 'Invalid email or password';
    } else if (message.includes('auth/email-already-in-use')) {
      return 'This email is already registered';
    } else if (message.includes('auth/weak-password')) {
      return 'Password should be at least 6 characters';
    } else if (message.includes('auth/invalid-email')) {
      return 'Please enter a valid email address';
    } else if (message.includes('auth/configuration-not-found')) {
      return 'Firebase configuration error. Please check your firebase.ts file and update it with your actual Firebase project details from the Firebase console.';
    } else if (message.includes('auth/popup-closed-by-user')) {
      return 'The sign-in popup was closed before completing the sign-in.';
    } else if (message.includes('auth/cancelled-popup-request')) {
      return 'The sign-in popup was cancelled.';
    } else if (message.includes('auth/popup-blocked')) {
      return 'The sign-in popup was blocked by the browser.';
    } else {
      return 'An error occurred. Please try again.';
    }
  }

  // Set up auth state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Clean up subscription
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    logout,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 