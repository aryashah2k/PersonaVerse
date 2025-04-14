import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Card,
  CardContent,
  Divider,
  useMediaQuery,
  Stack,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SpeedIcon from '@mui/icons-material/Speed';
import InsightsIcon from '@mui/icons-material/Insights';
import Layout from '../../components/layout/Layout';
import Logo from '../../components/ui/Logo';

const HeroSection = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(8, 0),
  background: `linear-gradient(170deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(6, 0),
  },
}));

const HeroTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: '3.5rem',
  lineHeight: 1.2,
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    fontSize: '2.5rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem',
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: '50%',
  padding: theme.spacing(1.5),
  display: 'inline-flex',
  marginBottom: theme.spacing(2),
}));

const Section = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(6, 0),
  },
}));

const Home: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Layout>
      <HeroSection>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <HeroTitle variant="h1">
                AI-Powered Persona Responses for Your Surveys
              </HeroTitle>
              <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4, maxWidth: 600 }}>
                Generate diverse, realistic survey responses from multiple personas to gain deeper insights and save valuable research time.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  component={RouterLink}
                  to="/signup"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ py: 1.5, px: 3 }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  component={RouterLink}
                  to="/login"
                  sx={{ py: 1.5, px: 3 }}
                >
                  Sign In
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: { xs: '300px', md: '400px' },
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Paper
                  elevation={6}
                  sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: 'primary.main',
                  }}
                >
                  <Logo onlyLogo height={isMobile ? 200 : 300} />
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      <Section>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" component="h2" gutterBottom fontWeight={700}>
              Why PersonaVerse?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
              Our AI-powered platform helps researchers, marketers, and product teams get valuable survey insights faster and more efficiently.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard elevation={2}>
                <CardContent sx={{ p: 3, flexGrow: 1 }}>
                  <FeatureIcon>
                    <PeopleAltIcon fontSize="medium" />
                  </FeatureIcon>
                  <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
                    Diverse Personas
                  </Typography>
                  <Typography color="text.secondary">
                    Access a wide range of persona profiles representing different demographics and perspectives.
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard elevation={2}>
                <CardContent sx={{ p: 3, flexGrow: 1 }}>
                  <FeatureIcon>
                    <SpeedIcon fontSize="medium" />
                  </FeatureIcon>
                  <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
                    Rapid Results
                  </Typography>
                  <Typography color="text.secondary">
                    Get hundreds of survey responses in minutes instead of waiting days or weeks.
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard elevation={2}>
                <CardContent sx={{ p: 3, flexGrow: 1 }}>
                  <FeatureIcon>
                    <InsightsIcon fontSize="medium" />
                  </FeatureIcon>
                  <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
                    Deep Insights
                  </Typography>
                  <Typography color="text.secondary">
                    Uncover patterns and perspectives you might miss with traditional survey methods.
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard elevation={2}>
                <CardContent sx={{ p: 3, flexGrow: 1 }}>
                  <FeatureIcon>
                    <AutoAwesomeIcon fontSize="medium" />
                  </FeatureIcon>
                  <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
                    Multiple AI Models
                  </Typography>
                  <Typography color="text.secondary">
                    Choose from different AI engines to get the best results for your specific survey needs.
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          </Grid>
        </Container>
      </Section>

      <Divider />

      <Section sx={{ bgcolor: 'background.paper' }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" component="h2" gutterBottom fontWeight={700}>
              Ready to Transform Your Survey Research?
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4 }}>
              Join thousands of researchers and marketers already using PersonaVerse to get deeper insights from their surveys.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={RouterLink}
              to="/signup"
              endIcon={<ArrowForwardIcon />}
              sx={{ py: 1.5, px: 4 }}
            >
              Get Started Now
            </Button>
          </Box>
        </Container>
      </Section>
    </Layout>
  );
};

export default Home;
