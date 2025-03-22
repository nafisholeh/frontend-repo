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

/**
 * Sign in with email and password
 * @param email - User email
 * @param password - User password
 * @returns UserCredential object from Firebase
 */
export const signIn = async (email: string, password: string): Promise<UserCredential> => {
  try {
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
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

/**
 * Get the current user's ID
 * @returns User ID or null if not logged in
 */
export const getCurrentUserId = (): string | null => {
  // First check Firebase auth
  const firebaseUserId = auth.currentUser?.uid;
  if (firebaseUserId) return firebaseUserId;
  
  // Fallback to Redux store - auth slice
  const authUser = store.getState().auth.user;
  if (authUser?.uid) return authUser.uid;
  
  // Fallback to Redux store - user slice
  const userState = store.getState().user;
  if (userState?.user?.id) return userState.user.id;
  
  return null;
};

/**
 * Get the current auth token
 * @returns Promise that resolves to the token string or null
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    const token = await auth.currentUser?.getIdToken();
    return token || null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}; 