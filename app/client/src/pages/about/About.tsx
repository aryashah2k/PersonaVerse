import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  IconButton,
  Link,
  Paper,
  Button,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import EmailIcon from "@mui/icons-material/Email";
import GroupIcon from "@mui/icons-material/Group";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SpeedIcon from "@mui/icons-material/Speed";
import Layout from "../../components/layout/Layout";

const MissionSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  marginTop: theme.spacing(6),
  borderRadius: theme.shape.borderRadius * 2,
  background: `linear-gradient(45deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
  color: theme.palette.primary.contrastText,
}));

const ValueCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: "100%",
  borderRadius: theme.shape.borderRadius * 2,
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
  },
}));

const TeamCard = styled(Card)(() => ({
  position: "relative",
  height: "100%",
  borderRadius: 16,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  overflow: "hidden",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
  },
}));

const TeamAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
  marginBottom: theme.spacing(2),
  border: `3px solid ${theme.palette.background.paper}`,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
}));

const SectionHeading = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  position: "relative",
  display: "inline-block",
  fontWeight: 800,
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: -8,
    left: 0,
    width: 60,
    height: 4,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 2,
  },
}));

const ValueIcon = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 60,
  height: 60,
  borderRadius: "50%",
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.main,
}));

const About: React.FC = () => {
  const teamMembers = [
    {
      name: "Suryansh Srivastava",
      role: "Full Stack Developer",
      avatar: `https://ui-avatars.com/api/?name=Suryansh+Srivastava&background=6366f1&color=fff&size=120`,
      bio: "Experienced full stack developer with expertise in React, TypeScript, and modern web technologies.",
      github: "https://github.com/Suryansh2204",
      linkedin: "www.linkedin.com/in/suryansh-srivastava-3662771ab",
      twitter: "https://twitter.com/",
      email: "suryansh@example.com",
    },
    {
      name: "Arya Shah",
      role: "AI Specialist",
      avatar: `https://ui-avatars.com/api/?name=Arya+Shah&background=10b981&color=fff&size=120`,
      bio: "AI researcher focused on natural language processing and building AI-powered solutions.",
      github: "https://github.com/aryashah2k",
      linkedin: "https://www.linkedin.com/in/arya--shah/",
      twitter: "https://twitter.com/",
      email: "arya@example.com",
    },
    {
      name: "Swaraj Bhanja",
      role: "Infrastructure Engineer",
      avatar: `https://ui-avatars.com/api/?name=Swaraj+Bhanja&background=f97316&color=fff&size=120`,
      bio: "Cloud infrastructure specialist with expertise in scalable systems and deployment pipelines.",
      github: "https://github.com/st125052",
      linkedin: "https://www.linkedin.com/in/swarajbhanja/",
      twitter: "https://twitter.com/",
      email: "swaraj@example.com",
    },
  ];

  const values = [
    {
      title: "Innovation",
      description:
        "We constantly push the boundaries of what AI can do in research methodology.",
      icon: <AutoAwesomeIcon fontSize="large" />,
    },
    {
      title: "Accuracy",
      description:
        "Our models are trained to provide statistically significant and representative responses.",
      icon: <VisibilityIcon fontSize="large" />,
    },
    {
      title: "Efficiency",
      description:
        "We save researchers countless hours by generating responses in minutes, not weeks.",
      icon: <SpeedIcon fontSize="large" />,
    },
    {
      title: "Inclusivity",
      description:
        "Our personas represent diverse backgrounds, perspectives, and demographics.",
      icon: <GroupIcon fontSize="large" />,
    },
  ];

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ py: 8 }}>
          <Typography variant="h3" component="h1" fontWeight={800} gutterBottom>
            About PersonaVerse
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 800 }}
          >
            We're revolutionizing survey research with AI-powered persona
            responses that provide faster, more diverse insights at a fraction
            of the cost of traditional methods.
          </Typography>

          <MissionSection>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              fontWeight={700}
            >
              Our Mission
            </Typography>
            <Typography variant="h6" paragraph sx={{ maxWidth: 800 }}>
              To transform market research and user feedback with AI technology
              that provides researchers with authentic, diverse perspectives in
              a fraction of the time and cost of traditional research methods.
            </Typography>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              sx={{ borderColor: "white", mt: 2 }}
              href="/pricing"
            >
              See Our Solutions
            </Button>
          </MissionSection>

          <Box sx={{ mt: 10, mb: 6 }}>
            <SectionHeading variant="h4">Our Values</SectionHeading>
            <Typography color="text.secondary" paragraph sx={{ mt: 3, mb: 5 }}>
              These core principles guide everything we do at PersonaVerse.
            </Typography>

            <Grid container spacing={4}>
              {values.map((value, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <ValueCard>
                    <ValueIcon>{value.icon}</ValueIcon>
                    <Typography variant="h5" component="h3" gutterBottom>
                      {value.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {value.description}
                    </Typography>
                  </ValueCard>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Divider sx={{ my: 8 }} />

          <Box sx={{ mt: 10, mb: 6 }}>
            <SectionHeading variant="h4">Our Team</SectionHeading>
            <Typography color="text.secondary" paragraph sx={{ mt: 3, mb: 5 }}>
              Meet the passionate experts behind PersonaVerse.
            </Typography>
            <Grid container spacing={4}>
              {teamMembers.map((member, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <TeamCard>
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    >
                      <TeamAvatar src={member.avatar} alt={member.name} />
                      <Typography variant="h5" component="h3" gutterBottom>
                        {member.name}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color="primary"
                        gutterBottom
                        fontWeight="medium"
                      >
                        {member.role}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                      >
                        {member.bio}
                      </Typography>
                      <Box sx={{ mt: "auto" }}>
                        <IconButton
                          aria-label="github"
                          component={Link}
                          href={member.github}
                          target="_blank"
                        >
                          <GitHubIcon />
                        </IconButton>
                        <IconButton
                          aria-label="linkedin"
                          component={Link}
                          href={member.linkedin}
                          target="_blank"
                        >
                          <LinkedInIcon />
                        </IconButton>
                        {/* <IconButton
                          aria-label="twitter"
                          component={Link}
                          href={member.twitter}
                          target="_blank"
                        >
                          <TwitterIcon />
                        </IconButton> */}
                        {/* <IconButton
                          aria-label="email"
                          component={Link}
                          href={`mailto:${member.email}`}
                        >
                          <EmailIcon />
                        </IconButton> */}
                      </Box>
                    </CardContent>
                  </TeamCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default About;
