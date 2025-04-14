import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  Stack,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import Logo from "../ui/Logo";

const FooterRoot = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(6, 0),
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(4, 0),
  },
}));

const Footer: React.FC = () => {
  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "/features" },
        { name: "Pricing", href: "/pricing" },
        { name: "Use Cases", href: "/use-cases" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "/about" },
        { name: "Blog", href: "/blog" },
        { name: "Careers", href: "/careers" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "/docs" },
        { name: "Support", href: "/support" },
        { name: "FAQ", href: "/faq" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy", href: "/privacy" },
        { name: "Terms", href: "/terms" },
        { name: "Security", href: "/security" },
      ],
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <FooterRoot component="footer">
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Logo height={40} />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Generate diverse survey responses from multiple personas to gain
              deeper insights and save valuable research time.
            </Typography>
            {/* <Stack direction="row" spacing={1}>
              <IconButton aria-label="GitHub" size="small" component="a" href="https://github.com" target="_blank">
                <GitHubIcon fontSize="small" />
              </IconButton>
              <IconButton aria-label="Twitter" size="small" component="a" href="https://twitter.com" target="_blank">
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton aria-label="LinkedIn" size="small" component="a" href="https://linkedin.com" target="_blank">
                <LinkedInIcon fontSize="small" />
              </IconButton>
            </Stack> */}
          </Grid>

          {footerLinks.map((group) => (
            <Grid item xs={6} sm={3} md={2} key={group.title}>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                {group.title}
              </Typography>
              <Stack spacing={1}>
                {group.links.map((link) => (
                  <Link
                    component={RouterLink}
                    to={link.href}
                    key={link.name}
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      textDecoration: "none",
                      "&:hover": { color: "primary.main" },
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} PersonaVerse. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Made with ❤️ by the PersonaVerse Team
          </Typography>
        </Box>
      </Container>
    </FooterRoot>
  );
};

export default Footer;
