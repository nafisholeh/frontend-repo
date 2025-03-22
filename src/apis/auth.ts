/**
 * Authentication Service
 * Handles Firebase authentication operations
 */
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  UserCredential,
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import { store } from '@/store/store';

// Mock user ID for development when Firebase auth is not available
const MOCK_USER_ID = 'mock-user-id-12345';

/**
 * Sign in with email and password
 * @param email - User email
 * @param password - User password
 * @returns UserCredential object from Firebase
 */
export const signIn = async (email: string, password: string): Promise<UserCredential> => {
  try {
    if (!auth) {
      throw new Error('Firebase auth is not initialized');
    }
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

/**
 * Sign up with email and password
 * @param email - User email
 * @param password - User password
 * @returns UserCredential object from Firebase
 */
export const signUp = async (email: string, password: string): Promise<UserCredential> => {
  try {
    if (!auth) {
      throw new Error('Firebase auth is not initialized');
    }
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

/**
 * Sign out the current user
 */
export const logOut = async (): Promise<void> => {
  try {
    if (!auth) {
      throw new Error('Firebase auth is not initialized');
    }
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

/**
 * Get the current user's ID
 * @returns User ID or a mock ID if not logged in (for development)
 */
export const getCurrentUserId = (): string => {
  // First check Firebase auth
  if (auth && auth.currentUser) {
    return auth.currentUser.uid;
  }
  
  // Fallback to Redux store - auth slice
  const authUser = store.getState().auth.user;
  if (authUser?.uid) return authUser.uid;
  
  // Fallback to Redux store - user slice
  const userState = store.getState().user;
  if (userState?.user?.id) return userState.user.id;
  
  // For development use a mock ID to prevent errors
  console.warn('No user ID found, using mock ID for development');
  return MOCK_USER_ID;
};

/**
 * Get the current auth token
 * @returns Promise that resolves to the token string or null
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    if (!auth || !auth.currentUser) {
      return null;
    }
    const token = await auth.currentUser.getIdToken();
    return token || null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}; 