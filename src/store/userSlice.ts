import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * User interface
 * Defines the structure of user data in the store
 */
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * User state interface
 * Includes user data and loading/error states
 */
interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isLoggedIn: boolean;
}

/**
 * Initial state for user slice
 */
const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
  isLoggedIn: false,
};

/**
 * User slice
 * Contains reducers for managing user state
 */
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ uid: string }>) => {
      state.isLoading = false;
      state.isLoggedIn = true;
      state.error = null;
      // Store user ID from login response
      if (state.user) {
        state.user.id = action.payload.uid;
      } else {
        // If no user object exists yet, create a minimal one with just the ID
        state.user = {
          id: action.payload.uid,
          name: '',
          email: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isLoggedIn = false;
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
    },
    fetchUserStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchUserSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.user = action.payload;
      state.error = null;
    },
    fetchUserFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateUserStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateUserSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.user = action.payload;
      state.error = null;
    },
    updateUserFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  fetchUserStart,
  fetchUserSuccess,
  fetchUserFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} = userSlice.actions;

export default userSlice.reducer; 