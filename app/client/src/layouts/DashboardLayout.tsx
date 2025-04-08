import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import {
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Selectors
import { selectUser, selectProfile, logoutUser } from '@/store/slices/userSlice';
import { AppDispatch } from '@/store';
import { signOut } from '@/lib/auth'; // New import for signOut

export default function DashboardLayout() {
  const user = useSelector(selectUser);
  const profile = useSelector(selectProfile);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  // Updated handleLogout function to use signOut
  const handleLogout = async () => {
    await signOut();
    navigate('/auth/login');
  };

  // Get initial letters for avatar fallback
  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }

    if (user?.email) {
      return user.email[0].toUpperCase();
    }

    return 'U';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="font-bold text-2xl flex items-center gap-2">
                ChantriBucket
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:block">
                <ul className="flex gap-6 items-center">
                  <li>
                    <Link
                      to="/dashboard"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/pricing"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Pricing
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  Tokens: <span className="font-medium text-foreground">{profile?.tokens_left || 0}</span>
                </p>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || ''} />
                        <AvatarFallback>{getInitials()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLogoutDialogOpen(true)}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t mt-3">
              <ul className="space-y-4">
                <li>
                  <Link
                    to="/dashboard"
                    className="block text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="block text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="block text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground mb-4">
                      Tokens: <span className="font-medium text-foreground">{profile?.tokens_left || 0}</span>
                    </p>

                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          navigate('/dashboard/profile');
                          setMobileMenuOpen(false);
                        }}
                        className="flex-1"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => {
                          setLogoutDialogOpen(true);
                          setMobileMenuOpen(false);
                        }}
                        className="flex-1"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    </div>
                  </div>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-border py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ChantriBucket. All rights reserved.
        </div>
      </footer>

      {/* Logout confirmation dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log out</DialogTitle>
            <DialogDescription>
              Do you want to log out of your account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogoutDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLogout}>
              Log out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
