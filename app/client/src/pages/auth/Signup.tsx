import React, { useState, FormEvent, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Grid,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import PersonIcon from "@mui/icons-material/Person";
import { useAuth } from "../../hooks/useAuth";
import Logo from "../../components/ui/Logo";

interface FormData {
  // name?: string;
  // username?: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const AuthContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  padding: theme.spacing(2),
}));

const AuthPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(6),
  },
}));

const SocialButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1.2),
  borderRadius: theme.shape.borderRadius,
  width: "100%",
  justifyContent: "flex-start",
  textTransform: "none",
  fontWeight: 600,
  "& .MuiButton-startIcon": {
    marginRight: theme.spacing(2),
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: theme.spacing(4),
}));

const OrDivider = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  width: "100%",
  margin: theme.spacing(3, 0),
  "&::before, &::after": {
    content: '""',
    flex: 1,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  "& .MuiTypography-root": {
    padding: theme.spacing(0, 1),
    color: theme.palette.text.secondary,
  },
}));

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup, error, loading, clearAuthError, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    // name: "",
    // username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Clear auth errors when unmounting
    return () => {
      clearAuthError();
    };
  }, [clearAuthError]);

  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};
    let isValid = true;

    // if (!formData.name.trim()) {
    //   errors.name = "Name is required";
    //   isValid = false;
    // }

    // if (!formData.username.trim()) {
    //   errors.username = "Username is required";
    //   isValid = false;
    // } else if (formData.username.includes(" ")) {
    //   errors.username = "Username cannot contain spaces";
    //   isValid = false;
    // }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }

    if (!formData.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearAuthError();
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const { confirmPassword, ...signupData } = formData;
    const result = await signup(signupData);

    if (result.success) {
      navigate("/dashboard");
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AuthContainer maxWidth="sm">
      <AuthPaper>
        <LogoContainer>
          <Logo height={50} />
          <Typography
            variant="h5"
            component="h1"
            gutterBottom
            sx={{ mt: 2, fontWeight: 700 }}
          >
            Create your account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start generating AI-powered survey responses
          </Typography>
        </LogoContainer>

        {/* <Box sx={{ mb: 3 }}>
          <SocialButton
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={() => alert('Google Sign Up would be integrated here')}
          >
            Sign up with Google
          </SocialButton>
          <SocialButton
            variant="outlined"
            startIcon={<GitHubIcon />}
            onClick={() => alert('GitHub Sign Up would be integrated here')}
          >
            Sign up with GitHub
          </SocialButton>
        </Box>

        <OrDivider>
          <Typography variant="body2">OR</Typography>
        </OrDivider> */}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={formData.name}
            onChange={handleInputChange}
            error={!!formErrors.name}
            helperText={formErrors.name}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            value={formData.username}
            onChange={handleInputChange}
            error={!!formErrors.username}
            helperText={formErrors.username}
          /> */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleInputChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleInputChange}
            error={!!formErrors.password}
            helperText={formErrors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type={showPassword ? "text" : "password"}
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={!!formErrors.confirmPassword}
            helperText={formErrors.confirmPassword}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2, py: 1.2 }}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>

          <Grid container justifyContent="center">
            <Grid item>
              <Typography variant="body2" align="center">
                Already have an account?{" "}
                <Link component={RouterLink} to="/login" variant="body2">
                  Sign in
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </AuthPaper>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 4, mb: 4, textAlign: "center" }}
      >
        By signing up, you agree to our{" "}
        <Link component={RouterLink} to="/terms" color="inherit">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link component={RouterLink} to="/privacy" color="inherit">
          Privacy Policy
        </Link>
      </Typography>
    </AuthContainer>
  );
};

export default Signup;
