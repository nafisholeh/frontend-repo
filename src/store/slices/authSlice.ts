import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auth } from '@/config/firebase';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  AuthError
} from 'firebase/auth';
import { serializeUser } from '@/utils/auth';

// Define a serialized user type
interface SerializedUser {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  isAnonymous: boolean;
  metadata: {
    creationTime: string | undefined;
    lastSignInTime: string | undefined;
  };
}

// Define the authentication state interface
interface AuthState {
  user: SerializedUser | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// Login thunk
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Check if auth is available (happens in SSR)
      if (!auth) {
        return rejectWithValue('Authentication not available');
      }
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Serialize the user before returning
      return serializeUser(userCredential.user);
    } catch (error) {
      const authError = error as AuthError;
      return rejectWithValue(authError.message || 'Login failed');
    }
  }
);

// Logout thunk
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Check if auth is available (happens in SSR)
      if (!auth) {
        return rejectWithValue('Authentication not available');
      }
      
      await firebaseSignOut(auth);
      return null;
    } catch (error) {
      const authError = error as AuthError;
      return rejectWithValue(authError.message || 'Logout failed');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      // Use serializeUser to ensure we only store serializable values
      state.user = serializeUser(action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearError } = authSlice.actions;

export default authSlice.reducer; 