'use client';

import { TextField, TextFieldProps } from '@mui/material';
import { ChangeEvent } from 'react';

/**
 * Props for FormInput component
 * Extends MUI TextFieldProps and adds onChange handler with simplified type
 */
interface FormInputProps extends Omit<TextFieldProps, 'onChange'> {
  onChange?: (value: string) => void;
}

/**
 * FormInput component
 * A wrapper around MUI TextField with simplified onChange handler
 */
export default function FormInput({ onChange, ...props }: FormInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <TextField
      {...props}
      onChange={handleChange}
      fullWidth
      margin="normal"
      variant="outlined"
    />
  );
} 