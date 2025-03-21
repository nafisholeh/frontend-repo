'use client';

import { Button, ButtonProps, CircularProgress } from '@mui/material';
import { ReactNode } from 'react';

/**
 * Props for CustomButton component
 * Extends MUI ButtonProps and adds loading state
 */
interface CustomButtonProps extends ButtonProps {
  children: ReactNode;
  loading?: boolean;
}

/**
 * CustomButton component
 * A button with loading state support
 */
export default function CustomButton({
  children,
  loading = false,
  disabled,
  ...props
}: CustomButtonProps) {
  return (
    <Button 
      {...props}
      disabled={loading || disabled}
    >
      {loading ? (
        <CircularProgress size={24} color="inherit" />
      ) : (
        children
      )}
    </Button>
  );
} 