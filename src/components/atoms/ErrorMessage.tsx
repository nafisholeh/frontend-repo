'use client';

import { Alert, AlertProps, Box } from '@mui/material';

/**
 * Props for ErrorMessage component
 * Extends MUI AlertProps and specifies error message
 */
interface ErrorMessageProps extends AlertProps {
  error: string | null;
}

/**
 * ErrorMessage component
 * Displays an error message in an Alert component
 */
export default function ErrorMessage({ error, ...props }: ErrorMessageProps) {
  if (!error) return null;

  return (
    <Box sx={{ my: 2 }}>
      <Alert severity="error" {...props}>
        {error}
      </Alert>
    </Box>
  );
} 