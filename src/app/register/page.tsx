'use client';

import { Typography, Container } from '@mui/material';
import PageLayout from '@/components/organisms/PageLayout';
import RegisterForm from '@/components/molecules/RegisterForm';

export default function RegisterPage() {
  return (
    <PageLayout>
      <Container maxWidth="md">
        <Typography variant="h4" align="center" gutterBottom>
          Create an Account
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" paragraph>
          Sign up to access all features
        </Typography>
        
        <RegisterForm />
      </Container>
    </PageLayout>
  );
} 