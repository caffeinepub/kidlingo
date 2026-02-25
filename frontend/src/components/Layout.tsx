import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Home, LogOut, LogIn, UserPlus } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { identity, clear, login, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const handleNavigation = (path: string) => {
    navigate({ to: path });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b-4 border-orange-400">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">🎓</div>
              <h1 className="text-3xl font-bold text-orange-600">KidLingo</h1>
            </div>
            
            <nav className="hidden md:flex items-center space-x-2">
              <button
                onClick={() => handleNavigation('/')}
                className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-orange-100 hover:bg-orange-200 text-orange-700 font-semibold transition-all hover:scale-105"
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </button>
            </nav>

            <div className="flex items-center space-x-3">
              {!isAuthenticated && (
                <button
                  onClick={handleAuth}
                  disabled={isLoggingIn}
                  className="flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all hover:scale-105 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggingIn ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      <span>Sign Up / Login</span>
                    </>
                  )}
                </button>
              )}
              
              {isAuthenticated && (
                <button
                  onClick={handleAuth}
                  className="flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all hover:scale-105 bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t-4 border-orange-400 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              © {new Date().getFullYear()} KidLingo. Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:text-orange-700 font-semibold"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
