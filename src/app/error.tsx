'use client';

import { useEffect } from 'react';
import { Box, Typography, Paper, Button, Container, Link } from '@mui/material';
import NextLink from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  const isFirebaseError = error.message?.includes('Firebase') || error.message?.includes('auth/');
  const isConfigNotFoundError = error.message?.includes('configuration-not-found') || 
                                error.message?.includes('CONFIGURATION_NOT_FOUND');
  
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isFirebaseError ? 'Firebase Configuration Error' : 'Something went wrong!'}
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
          {isConfigNotFoundError
            ? 'Firebase Authentication is not properly configured. This typically happens when you haven\'t enabled any authentication methods in your Firebase project.'
            : isFirebaseError
              ? 'There was an issue with the Firebase configuration. This typically happens when environment variables are not set up correctly.'
              : 'An unexpected error occurred. The application team has been notified.'}
        </Typography>
        
        {isFirebaseError && (
          <Box sx={{ my: 3, p: 3, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Troubleshooting Steps:
            </Typography>
            <Box component="ol" sx={{ pl: 2 }}>
              {isConfigNotFoundError && (
                <li>
                  <Typography fontWeight="bold" color="error.main">
                    Most Important: Enable Authentication in Firebase Console
                  </Typography>
                  <Typography component="ul" sx={{ mt: 1 }}>
                    <li>Go to Firebase Console &gt; Authentication</li>
                    <li>Click on the &quot;Sign-in method&quot; tab</li>
                    <li>Enable Email/Password authentication method</li>
                    <li>Save your changes</li>
                    <li>Restart your application</li>
                  </Typography>
                </li>
              )}
              <li>
                <Typography>
                  Ensure you&apos;ve created a <code>.env.local</code> file with all required Firebase configuration values
                </Typography>
              </li>
              <li>
                <Typography>
                  Verify that you&apos;ve enabled Email/Password authentication in your Firebase project
                </Typography>
              </li>
              <li>
                <Typography>
                  Check if your Firebase project is active and properly configured
                </Typography>
              </li>
              <li>
                <Typography>
                  Try restarting the development server after updating your environment variables
                </Typography>
              </li>
            </Box>
            <Typography variant="body2" sx={{ mt: 2 }}>
              For detailed setup instructions, please refer to the{' '}
              <Link href="https://github.com/yourusername/ebuddy-frontend#firebase-configuration" target="_blank">
                project README
              </Link>
            </Typography>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
          <Button variant="contained" onClick={reset}>
            Try again
          </Button>
          <Button variant="outlined" component={NextLink} href="/">
            Go to Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
} 