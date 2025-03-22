'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  CircularProgress, 
  Alert,
  Card,
  CardContent
} from '@mui/material';
import { useUser } from '@/hooks/useUser';
import { User } from '@/store/userSlice';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';

/**
 * UserProfileUpdater component
 * Provides interface to fetch and update user information
 */
export default function UserProfileUpdater() {
  const { user, isLoading, error, fetchUserData, updateUserData } = useUser();
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: ''
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email
      });
    }
  }, [user]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission for updating user
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateSuccess(false);
    setUpdateLoading(true);
    
    try {
      await updateUserData(formData);
      setUpdateSuccess(true);
      // Reset success message after 3 seconds
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      console.error("Error updating user profile:", err);
    } finally {
      setUpdateLoading(false);
    }
  };

  // Handle fetch user data
  const handleFetchUser = async () => {
    setFetchLoading(true);
    try {
      await fetchUserData();
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setFetchLoading(false);
    }
  };

  return (
    <Card elevation={3} sx={{ mb: 4 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            User Profile
          </Typography>
          
          <Button 
            variant="outlined" 
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={handleFetchUser}
            disabled={fetchLoading}
          >
            {fetchLoading ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                Fetching...
              </>
            ) : (
              'Fetch Data'
            )}
          </Button>
        </Box>

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {updateSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Profile updated successfully!
          </Alert>
        )}

        {user && (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              fullWidth
              label="Name"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              disabled={updateLoading}
            />
            
            <TextField
              margin="normal"
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleChange}
              disabled={updateLoading}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                {user.updatedAt ? (
                  <>Last updated: {new Date(user.updatedAt).toLocaleString()}</>
                ) : null}
              </Typography>
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={updateLoading}
                startIcon={<SaveIcon />}
              >
                {updateLoading ? (
                  <>
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    Updating...
                  </>
                ) : (
                  'Update Profile'
                )}
              </Button>
            </Box>
          </Box>
        )}

        {!user && !isLoading && (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            No user data available. Click &quot;Fetch Data&quot; to load your profile.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
} 