import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  TextField,
  Grid,
  Paper,
  Divider,
  Chip,
  IconButton,
  Alert,
  Skeleton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import TokenIcon from '@mui/icons-material/Token';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../hooks/useAuth';
import { useUserProfile } from '../../hooks/useUserProfile';

const ProfileCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[1],
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(12),
  height: theme.spacing(12),
  marginRight: theme.spacing(3),
  boxShadow: theme.shadows[3],
  border: `4px solid ${theme.palette.background.paper}`,
  [theme.breakpoints.down('sm')]: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    marginRight: theme.spacing(2),
  },
}));

const InfoRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

const InfoLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  minWidth: 120,
  marginRight: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(1),
  },
}));

const TokenDisplay = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  fontWeight: 600,
}));

const Profile: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { profile, isLoadingProfile, error, loadProfile, updateUserProfile } = useUserProfile();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
  });

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        username: profile.username,
      });
    }
  }, [profile]);

  const handleEditToggle = () => {
    if (editing) {
      // Cancel editing
      setFormData({
        name: profile?.name || '',
        username: profile?.username || '',
      });
    }
    setEditing(!editing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profile) {
      const success = await updateUserProfile(formData);
      if (success) {
        setEditing(false);
      }
    }
  };

  const getPlanDisplay = () => {
    if (!profile) return null;

    switch(profile.plan) {
      case 'free':
        return (
          <Chip
            label="Free"
            color="default"
          />
        );
      case 'standard':
        return (
          <Chip
            label="Standard"
            color="primary"
          />
        );
      case 'premium':
        return (
          <Chip
            label="Premium"
            color="secondary"
          />
        );
      default:
        return (
          <Chip
            label="Free"
            color="default"
          />
        );
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <Container>
          <Typography variant="h5" color="text.secondary" sx={{ textAlign: 'center', mt: 8 }}>
            Please log in to view your profile
          </Typography>
        </Container>
      </Layout>
    );
  }

  if (isLoadingProfile) {
    return (
      <Layout>
        <Container>
          <ProfileCard>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Skeleton variant="circular" width={96} height={96} sx={{ mr: 3 }} />
                <Box>
                  <Skeleton variant="text" width={200} height={32} />
                  <Skeleton variant="text" width={120} height={24} />
                </Box>
              </Box>
              <Divider sx={{ my: 3 }} />
              <Skeleton variant="text" width="100%" height={40} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="100%" height={40} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="100%" height={40} />
            </CardContent>
          </ProfileCard>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container>
        <Box sx={{ mt: 4, mb: 6 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            My Profile
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage your account settings
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <ProfileCard>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <ProfileAvatar src={`https://ui-avatars.com/api/?name=${profile?.name || 'User'}&background=6366f1&color=fff&size=120`} />
              <Box>
                <Typography variant="h5" gutterBottom>
                  {profile?.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" color="text.secondary" sx={{ mr: 2 }}>
                    @{profile?.username}
                  </Typography>
                  {getPlanDisplay()}
                </Box>
              </Box>
              <Box sx={{ ml: 'auto' }}>
                <TokenDisplay>
                  <TokenIcon sx={{ mr: 1 }} />
                  {profile?.tokensAvailable} Tokens
                </TokenDisplay>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {editing ? (
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={profile?.email}
                      disabled
                      helperText="Email cannot be changed"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={handleEditToggle}
                        sx={{ mr: 2 }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                      >
                        Save Changes
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Box>
                <InfoRow>
                  <InfoLabel color="text.secondary">Name:</InfoLabel>
                  <Typography>{profile?.name}</Typography>
                </InfoRow>
                <InfoRow>
                  <InfoLabel color="text.secondary">Username:</InfoLabel>
                  <Typography>@{profile?.username}</Typography>
                </InfoRow>
                <InfoRow>
                  <InfoLabel color="text.secondary">Email:</InfoLabel>
                  <Typography>{profile?.email}</Typography>
                </InfoRow>
                <InfoRow>
                  <InfoLabel color="text.secondary">Plan:</InfoLabel>
                  <Typography sx={{ textTransform: 'capitalize' }}>{profile?.plan}</Typography>
                </InfoRow>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={handleEditToggle}
                  >
                    Edit Profile
                  </Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </ProfileCard>

        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom>
            Account Information
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <TokenIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={`${profile?.tokensAvailable} tokens available`}
                secondary="Tokens are used to generate AI responses"
              />
              <Button
                variant="outlined"
                color="primary"
                component="a"
                href="/pricing"
              >
                Get More Tokens
              </Button>
            </ListItem>
          </List>
        </Paper>
      </Container>
    </Layout>
  );
};

export default Profile;
