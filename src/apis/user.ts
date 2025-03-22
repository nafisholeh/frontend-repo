/**
 * User API Service
 * Handles all user-related API calls to the backend
 */

import { User } from '@/store/userSlice';
import { auth } from '@/config/firebase';
import { store } from '@/store/store';

// Base URL for API endpoints
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/user';

// Flag to determine if we should use mock data instead of real API calls
// In a real app, you would check if the API is available
const USE_MOCK_API = true;

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
 * Mock function to generate user data for development/demo purposes
 * @param userId - User ID to generate data for
 * @returns Mock user data
 */
const generateMockUserData = (userId: string): User => {
  // Try to get display name and email from Firebase
  const displayName = auth?.currentUser?.displayName || '';
  const email = auth?.currentUser?.email || '';
  
  // Try to get display name and email from Redux auth store as fallback
  const authState = store.getState().auth;
  const authName = authState?.user?.displayName || '';
  const authEmail = authState?.user?.email || '';
  
  return {
    id: userId,
    name: displayName || authName || 'Demo User',
    email: email || authEmail || 'user@example.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

/**
 * Fetch user data from the backend
 * @param userId - User ID to fetch
 * @returns User data
 */
export const fetchUser = async (userId: string): Promise<User> => {
  try {
    // If using mock data, return the mock user
    if (USE_MOCK_API) {
      console.log('Using mock API for user data');
      // Adding a slight delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 500));
      return generateMockUserData(userId);
    }
    
    // Real API implementation
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
    
    // If there's an error with the API, fallback to mock data
    if (error instanceof Error && error.message.includes('not found')) {
      console.log('API error, falling back to mock data');
      return generateMockUserData(userId);
    }
    
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
    // If using mock data, return the updated mock user
    if (USE_MOCK_API) {
      console.log('Using mock API for updating user data');
      // Adding a slight delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockUser = generateMockUserData(userId);
      const updatedUser = {
        ...mockUser,
        ...userData,
        updatedAt: new Date().toISOString()
      };
      return updatedUser;
    }
    
    // Real API implementation
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
    
    // If there's an error with the API, fallback to mock data
    if (error instanceof Error && error.message.includes('not found')) {
      console.log('API error, falling back to mock data for update');
      const mockUser = generateMockUserData(userId);
      return {
        ...mockUser,
        ...userData,
        updatedAt: new Date().toISOString()
      };
    }
    
    throw error;
  }
}; 