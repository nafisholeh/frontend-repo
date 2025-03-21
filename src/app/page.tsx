import { Typography, Box, Container, Button } from '@mui/material';
import Link from 'next/link';
import PageLayout from '@/components/organisms/PageLayout';

export default function Home() {
  return (
    <PageLayout>
      <Container maxWidth="md">
        <Box 
          sx={{
            py: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to EBUDDY
          </Typography>
          
          <Typography variant="h5" color="text.secondary" paragraph>
            A simple application to demonstrate Firebase authentication and API integration
          </Typography>
          
          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Link href="/login" passHref style={{ textDecoration: 'none' }}>
              <Button variant="contained" size="large">
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard" passHref style={{ textDecoration: 'none' }}>
              <Button variant="outlined" size="large">
                Dashboard
              </Button>
            </Link>
          </Box>
        </Box>
      </Container>
    </PageLayout>
  );
}
