'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Container, Grid, Card, CardContent, CardHeader, Box } from '@mui/material';
import PageLayout from '@/components/organisms/PageLayout';
import { useAppSelector } from '@/hooks/storeHooks';

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);
  
  // Show nothing until we confirm authentication
  if (!user) {
    return null;
  }
  
  return (
    <PageLayout>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Welcome back, {user.displayName || 'User'}! Here&apos;s an overview of your account.
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* User Profile Card */}
          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardHeader title="Profile" />
              <CardContent>
                <Typography variant="body1" gutterBottom>
                  <strong>Name:</strong> {user.displayName || 'Not set'}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Email:</strong> {user.email}
                </Typography>
                <Typography variant="body1">
                  <strong>User ID:</strong> {user.uid.substring(0, 8)}...
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Activity Card */}
          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardHeader title="Recent Activity" />
              <CardContent>
                <Box sx={{ height: '180px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No recent activity
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Stats Card */}
          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardHeader title="Statistics" />
              <CardContent>
                <Box sx={{ height: '180px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No statistics available
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </PageLayout>
  );
} 