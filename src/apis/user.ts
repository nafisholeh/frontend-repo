/**
 * User API Service
 * Handles all user-related API calls to the backend
 */

import { User } from '@/store/userSlice';

// Base URL for API endpoints
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/user';

/**
 * Get auth token for API requests
 * @returns Auth token as a string
 */
const getAuthToken = (): string => {
  // Typically this would get a token from Firebase Auth
  // For now, we'll use the simplified token from our backend implementation
  return 'test-token';
};

/**
 * Fetch user data from the backend
 * @param userId - User ID to fetch
 * @returns User data
 */
export const fetchUser = async (userId: string): Promise<User> => {
  try {
    const response = await fetch(`${BASE_URL}/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch user data');
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

/**
 * Update user data on the backend
 * @param userId - User ID to update
 * @param userData - User data to update
 * @returns Updated user data
 */
export const updateUser = async (userId: string, userData: Partial<User>): Promise<User> => {
  try {
    const response = await fetch(`${BASE_URL}/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update user data');
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}; 