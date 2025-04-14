import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';
import Layout from '../../components/layout/Layout';

const ErrorIcon = styled(ErrorOutlineIcon)(({ theme }) => ({
  fontSize: 80,
  color: theme.palette.error.main,
  marginBottom: theme.spacing(2),
}));

const NotFound: React.FC = () => {
  return (
    <Layout>
      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 5,
              borderRadius: 4,
              textAlign: 'center',
              bgcolor: 'background.paper',
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            <ErrorIcon />
            <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
              404
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
              Page Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
              Oops! The page you're looking for doesn't exist or has been moved.
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                component={RouterLink}
                to="/"
                startIcon={<HomeIcon />}
              >
                Go to Home Page
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Layout>
  );
};

export default NotFound;
