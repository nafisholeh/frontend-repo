'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { Box, Button, TextField, Paper, Alert, CircularProgress, Link, Typography } from '@mui/material';
import NextLink from 'next/link';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '@/config/firebase';
import { useAppDispatch } from '@/hooks/storeHooks';
import { setUser } from '@/store/slices/authSlice';

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FieldProps = {
  field: {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    value: string;
    name: string;
    ref: React.Ref<HTMLInputElement>;
  };
};

/**
 * Get a user-friendly error message from Firebase error codes
 */
const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please use a different email or try logging in.';
    case 'auth/invalid-email':
      return 'Invalid email address format.';
    case 'auth/operation-not-allowed':
      return 'Email/password registration is not enabled. Please contact the administrator.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use a stronger password.';
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
      return 'Registration failed. Please try again.';
  }
};

export default function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegisterFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    setIsLoading(true);
    
    try {
      // Check if auth is available (happens in SSR or when Firebase is not configured)
      if (!auth) {
        setError('Firebase authentication is not available. Please check your configuration.');
        return;
      }
      
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        data.email, 
        data.password
      );
      
      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: data.name
      });
      
      // Update redux store with serialized user
      dispatch(setUser(userCredential.user));
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      const firebaseError = error as FirebaseError;
      const errorCode = firebaseError?.code || '';
      setError(getErrorMessage(errorCode));
      console.error('Registration error:', error);
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
          name="name"
          control={control}
          rules={{
            required: 'Name is required'
          }}
          render={({ field }: FieldProps) => (
            <TextField
              {...field}
              label="Full Name"
              variant="outlined"
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message}
              disabled={isLoading}
            />
          )}
        />
        
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
          render={({ field }: FieldProps) => (
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
          render={({ field }: FieldProps) => (
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
        
        <Controller
          name="confirmPassword"
          control={control}
          rules={{
            required: 'Please confirm your password',
            validate: (value: string) => 
              value === password || 'The passwords do not match'
          }}
          render={({ field }: FieldProps) => (
            <TextField
              {...field}
              label="Confirm Password"
              type="password"
              variant="outlined"
              fullWidth
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
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
          {isLoading ? <CircularProgress size={24} /> : 'Register'}
        </Button>
        
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          Already have an account?{' '}
          <Link component={NextLink} href="/login">
            Sign in
          </Link>
        </Box>
      </Paper>
    </Box>
  );
} 