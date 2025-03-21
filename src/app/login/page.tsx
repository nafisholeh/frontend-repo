'use client';

import { Typography, Container } from '@mui/material';
import PageLayout from '@/components/organisms/PageLayout';
import LoginForm from '@/components/molecules/LoginForm';

export default function LoginPage() {
  return (
    <PageLayout>
      <Container maxWidth="md">
        <Typography variant="h4" align="center" gutterBottom>
          Sign in to your account
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" paragraph>
          Enter your credentials to access the dashboard
        </Typography>
        
        <LoginForm />
      </Container>
    </PageLayout>
  );
} 