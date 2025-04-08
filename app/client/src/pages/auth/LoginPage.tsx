import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUserEmail, loginUserGoogle, selectUserStatus, selectUserError } from '@/store/slices/userSlice';
import { AppDispatch } from '@/store';

// Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const status = useSelector(selectUserStatus);
  const error = useSelector(selectUserError);
  const { toast } = useToast();

  console.log("Rendering LoginPage component");
  console.log("Environment vars:", import.meta.env.VITE_SUPABASE_URL ? "URL defined" : "URL undefined");

  const validateForm = () => {
    let isValid = true;

    // Reset errors
    setEmailError('');
    setPasswordError('');

    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    }

    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }

    return isValid;
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt with:", email);

    if (!validateForm()) {
      return;
    }

    try {
      const resultAction = await dispatch(loginUserEmail({ email, password }));
      if (loginUserEmail.fulfilled.match(resultAction)) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await dispatch(loginUserGoogle());
      // Google OAuth will redirect to the callback URL
    } catch (err) {
      console.error('Google login failed', err);
    }
  };

  // Show error toast if login fails
  if (error && status === 'failed') {
    toast({
      title: 'Login Failed',
      description: error,
      variant: 'destructive',
    });
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>
          Enter your email and password to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-2">
            {/* Debug text to confirm component is rendering */}
            <p className="text-xs text-muted-foreground">Email field should appear below:</p>

            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
            />
            {emailError && <p className="text-sm text-destructive">{emailError}</p>}
          </div>
          <div className="space-y-2">
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={status === 'loading'}
            />
            {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <Button
          variant="outline"
          type="button"
          className="w-full"
          onClick={handleGoogleLogin}
          disabled={status === 'loading'}
        >
          <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
            <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
          </svg>
          Google
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/auth/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
