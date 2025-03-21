'use client';

import { ReactNode, useEffect, useState } from 'react';
import { Box, Container, AppBar, Toolbar, Typography, Button } from '@mui/material';
import Link from 'next/link';
import { useAppSelector } from '@/hooks/storeHooks';
import { User } from 'firebase/auth';

interface PageLayoutProps {
  children: ReactNode;
}

/**
 * PageLayout component
 * A consistent layout wrapper for all pages
 */
export default function PageLayout({ children }: PageLayoutProps) {
  // Use client-side only rendering for auth-dependent UI
  const [mounted, setMounted] = useState(false);
  const [authUser, setAuthUser] = useState<User | null>(null);
  
  // Get auth user from Redux
  const { user } = useAppSelector((state) => state.auth);
  
  // Only run after client-side hydration is complete
  useEffect(() => {
    setMounted(true);
    setAuthUser(user);
  }, [user]);
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
              EBUDDY
            </Link>
          </Typography>
          
          {/* Only render auth-dependent UI after client-side hydration */}
          {mounted ? (
            authUser ? (
              <>
                <Button color="inherit" component={Link} href="/dashboard">
                  Dashboard
                </Button>
                <Button color="inherit" component={Link} href="/profile">
                  Profile
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} href="/login">
                  Login
                </Button>
                <Button color="inherit" component={Link} href="/register">
                  Register
                </Button>
              </>
            )
          ) : (
            // Render empty buttons during server-side rendering to maintain layout
            <>
              <Button color="inherit" style={{ visibility: 'hidden' }}>
                Loading...
              </Button>
              <Button color="inherit" style={{ visibility: 'hidden' }}>
                Loading...
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      
      <Box sx={{ flex: 1, py: 4 }}>
        {children}
      </Box>
      
      <Box component="footer" sx={{ py: 3, bgcolor: 'background.paper', textAlign: 'center' }}>
        <Container>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} EBUDDY PTE. LTD. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
} 