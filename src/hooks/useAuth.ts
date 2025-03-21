'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { auth } from '@/config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { loginSuccess, loginFailure, logout } from '@/store/userSlice';
import { signIn, signUp, logOut } from '@/apis/auth';

/**
 * Custom hook for Firebase authentication
 * Provides auth state management and authentication methods
 */
export const useAuth = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  // Watch for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setLoading(false);
        if (user) {
          // User is signed in
          dispatch(loginSuccess({ uid: user.uid }));
        } else {
          // User is signed out
          dispatch(logout());
        }
      },
      (error) => {
        console.error('Auth state change error:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    // Cleanup subscription
    return () => unsubscribe();
  }, [dispatch]);

  /**
   * Handle user login
   * @param email - User email
   * @param password - User password
   */
  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      await signIn(email, password);
      // loginSuccess will be dispatched by the onAuthStateChanged listener
      router.push('/dashboard'); // Navigate to dashboard after login
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        dispatch(loginFailure(error.message));
      } else {
        setError('An unknown error occurred');
        dispatch(loginFailure('An unknown error occurred'));
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle user registration
   * @param email - User email
   * @param password - User password
   */
  const handleRegister = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      await signUp(email, password);
      // loginSuccess will be dispatched by the onAuthStateChanged listener
      router.push('/dashboard'); // Navigate to dashboard after registration
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle user logout
   */
  const handleLogout = async () => {
    setLoading(true);
    setError(null);

    try {
      await logOut();
      // logout will be dispatched by the onAuthStateChanged listener
      router.push('/login'); // Navigate to login after logout
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    isAuthenticated: !!auth.currentUser,
    user: auth.currentUser,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
}; 