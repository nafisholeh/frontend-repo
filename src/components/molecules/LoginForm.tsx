'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { Box, Button, TextField, Paper, Alert, CircularProgress, Link, Typography } from '@mui/material';
import { useAppDispatch } from '@/hooks/storeHooks';
import { loginUser } from '@/store/slices/authSlice';
import { FirebaseError } from 'firebase/app';

type LoginFormData = {
  email: string;
  password: string;
};

/**
 * Get a user-friendly error message from Firebase error codes
 */
const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Invalid email address format.';
    case 'auth/user-disabled':
      return 'This user account has been disabled.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please check your email or sign up.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many failed login attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/internal-error':
      return 'An internal error occurred. Please try again later.';
    case 'auth/api-key-not-valid':
      return 'Firebase configuration error: Invalid API key. Please contact the administrator.';
    case 'auth/configuration-not-found':
      return 'Firebase Authentication is not properly set up. You need to enable Email/Password authentication in Firebase Console.';
    default:
      if (errorCode.includes('configuration-not-found') || errorCode.includes('CONFIGURATION_NOT_FOUND')) {
        return 'Firebase Authentication is not properly set up. You need to enable Email/Password authentication in Firebase Console.';
      }
      return 'Login failed. Please check your credentials and try again.';
  }
};

/**
 * LoginForm component
 * A responsive form for user authentication
 */
export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setIsLoading(true);
    
    try {
      await dispatch(loginUser(data)).unwrap();
      router.push('/dashboard');
    } catch (err: unknown) {
      // Get error code from Firebase error
      const firebaseError = err as FirebaseError;
      const errorCode = firebaseError?.code || '';
      setError(getErrorMessage(errorCode));
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit(onSubmit)} 
      sx={{ 
        maxWidth: 400, 
        mx: 'auto', 
        mt: 4 
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 3 
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
            {error.includes('configuration') && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Please check the <Link href="https://github.com/yourusername/ebuddy-frontend#firebase-configuration" target="_blank">README</Link> for setup instructions.
              </Typography>
            )}
          </Alert>
        )}
        
        <Controller
          name="email"
          control={control}
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              variant="outlined"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={isLoading}
            />
          )}
        />
        
        <Controller
          name="password"
          control={control}
          rules={{
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters'
            }
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={isLoading}
            />
          )}
        />
        
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isLoading}
          sx={{ mt: 2 }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
        </Button>
      </Paper>
    </Box>
  );
} 