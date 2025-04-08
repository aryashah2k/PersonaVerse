import { Outlet, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectUser } from '@/store/slices/userSlice';

export default function AuthLayout() {
  // If user is already logged in, redirect to dashboard
  const user = useSelector(selectUser);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className= "min-h-screen flex flex-col" >
    <header className="border-b border-border" >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center" >
        <Link to="/" className = "text-2xl font-bold" >
          PersonaVerse
          </Link>
          < nav >
          <ul className="flex gap-6" >
            <li>
            <Link to="/about" className = "text-muted-foreground hover:text-foreground transition-colors" >
              About
              </Link>
              </li>
              < li >
              <Link to="/pricing" className = "text-muted-foreground hover:text-foreground transition-colors" >
                Pricing
                </Link>
                </li>
                </ul>
                </nav>
                </div>
                </header>

                < main className = "flex-1 flex items-center justify-center p-4" >
                  <div className="w-full max-w-md" >
                    <Outlet />
                    </div>
                    </main>

                    < footer className = "border-t border-border py-6" >
                      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground" >
          & copy; { new Date().getFullYear() } PersonaVerse.All rights reserved.
        </div>
    </footer>
    </div>
  );
}
