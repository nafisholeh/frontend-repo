'use client';

import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import {
  fetchUserStart,
  fetchUserSuccess,
  fetchUserFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  User,
} from '@/store/userSlice';
import { fetchUser, updateUser } from '@/apis/user';
import { getCurrentUserId } from '@/apis/auth';

/**
 * Custom hook for user data operations
 * Provides methods for fetching and updating user data
 */
export const useUser = () => {
  const dispatch = useDispatch();
  // Add default values to handle potential undefined state.user
  const userState = useSelector((state: RootState) => state.user) || { user: null, isLoading: false, error: null };
  const { user, isLoading, error } = userState;
  const [loadingUser, setLoadingUser] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);

  /**
   * Fetch user data from the API
   * @param userId - Optional user ID (defaults to current user ID)
   */
  const fetchUserData = useCallback(async (userId?: string) => {
    // Get the current user ID, which should always return at least a mock ID now
    const currentUserId = userId || getCurrentUserId();
    
    setLoadingUser(true);
    setUserError(null);
    dispatch(fetchUserStart());

    try {
      const userData = await fetchUser(currentUserId);
      dispatch(fetchUserSuccess(userData));
    } catch (error) {
      console.error('Error in fetchUserData:', error);
      let errorMessage = 'Failed to fetch user data';
      
      if (error instanceof Error) {
        // Show a user-friendly error message
        errorMessage = error.message;
        if (error.message.includes('not found')) {
          errorMessage = 'User profile not found. Creating a new profile...';
          
          // Create a default user profile when not found
          const defaultUser: User = {
            id: currentUserId,
            name: '',
            email: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          // Still dispatch success with the default user to prevent further errors
          dispatch(fetchUserSuccess(defaultUser));
          setLoadingUser(false);
          return;
        }
      }
      
      setUserError(errorMessage);
      dispatch(fetchUserFailure(errorMessage));
    } finally {
      setLoadingUser(false);
    }
  }, [dispatch]);

  /**
   * Update user data on the API
   * @param userData - User data to update
   * @param userId - Optional user ID (defaults to current user ID)
   */
  const updateUserData = useCallback(async (userData: Partial<User>, userId?: string) => {
    // Get the current user ID, which should always return at least a mock ID now
    const currentUserId = userId || getCurrentUserId();
    
    setLoadingUser(true);
    setUserError(null);
    dispatch(updateUserStart());

    try {
      const updatedUser = await updateUser(currentUserId, userData);
      dispatch(updateUserSuccess(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error('Error in updateUserData:', error);
      let errorMessage = 'Failed to update user data';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // If user not found, try to create one with the provided data
        if (error.message.includes('not found')) {
          const newUser: User = {
            id: currentUserId,
            name: userData.name || '',
            email: userData.email || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...userData
          };
          
          dispatch(updateUserSuccess(newUser));
          setLoadingUser(false);
          return newUser;
        }
      }
      
      setUserError(errorMessage);
      dispatch(updateUserFailure(errorMessage));
      return null;
    } finally {
      setLoadingUser(false);
    }
  }, [dispatch]);

  return {
    user,
    isLoading: isLoading || loadingUser,
    error: error || userError,
    fetchUserData,
    updateUserData,
  };
}; 