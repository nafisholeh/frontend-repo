'use client';

import { useState } from 'react';
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
  const { user, isLoading, error } = useSelector((state: RootState) => state.user);
  const [loadingUser, setLoadingUser] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);

  /**
   * Fetch user data from the API
   * @param userId - Optional user ID (defaults to current user ID)
   */
  const fetchUserData = async (userId?: string) => {
    const currentUserId = userId || getCurrentUserId();
    
    if (!currentUserId) {
      setUserError('No user ID available');
      return;
    }

    setLoadingUser(true);
    setUserError(null);
    dispatch(fetchUserStart());

    try {
      const userData = await fetchUser(currentUserId);
      dispatch(fetchUserSuccess(userData));
    } catch (error) {
      if (error instanceof Error) {
        setUserError(error.message);
        dispatch(fetchUserFailure(error.message));
      } else {
        setUserError('Failed to fetch user data');
        dispatch(fetchUserFailure('Failed to fetch user data'));
      }
    } finally {
      setLoadingUser(false);
    }
  };

  /**
   * Update user data on the API
   * @param userData - User data to update
   * @param userId - Optional user ID (defaults to current user ID)
   */
  const updateUserData = async (userData: Partial<User>, userId?: string) => {
    const currentUserId = userId || getCurrentUserId();
    
    if (!currentUserId) {
      setUserError('No user ID available');
      return;
    }

    setLoadingUser(true);
    setUserError(null);
    dispatch(updateUserStart());

    try {
      const updatedUser = await updateUser(currentUserId, userData);
      dispatch(updateUserSuccess(updatedUser));
      return updatedUser;
    } catch (error) {
      if (error instanceof Error) {
        setUserError(error.message);
        dispatch(updateUserFailure(error.message));
      } else {
        setUserError('Failed to update user data');
        dispatch(updateUserFailure('Failed to update user data'));
      }
      return null;
    } finally {
      setLoadingUser(false);
    }
  };

  return {
    user,
    isLoading: isLoading || loadingUser,
    error: error || userError,
    fetchUserData,
    updateUserData,
  };
}; 