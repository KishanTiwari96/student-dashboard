import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { updateProfile } from 'firebase/auth';

interface UserContextType {
  displayName: string;
  photoURL: string;
  updateUserProfile: (name: string, photo?: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const { currentUser } = useAuth();
  const [displayName, setDisplayName] = useState<string>('');
  const [photoURL, setPhotoURL] = useState<string>('');

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
      setPhotoURL(currentUser.photoURL || '');
    } else {
      setDisplayName('');
      setPhotoURL('');
    }
  }, [currentUser]);

  const updateUserProfile = async (name: string, photo?: string) => {
    if (!currentUser) {
      throw new Error('No user is logged in');
    }

    try {
      const updateData: { displayName: string; photoURL?: string } = {
        displayName: name
      };

      if (photo !== undefined) {
        updateData.photoURL = photo;
      }

      await updateProfile(currentUser, updateData);
      
      // Update local state
      setDisplayName(name);
      if (photo !== undefined) {
        setPhotoURL(photo);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const value = {
    displayName,
    photoURL,
    updateUserProfile
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
} 