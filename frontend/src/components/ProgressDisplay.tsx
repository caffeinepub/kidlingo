import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { UserProgress } from '../backend';
import { Trophy, Star, BookOpen, LogIn } from 'lucide-react';

interface ProgressDisplayProps {
  progress?: UserProgress;
}

export default function ProgressDisplay({ progress }: ProgressDisplayProps) {
  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const completedLessons = progress ? Number(progress.completedLessons) : 0;
  const totalScore = progress ? Number(progress.totalScore) : 0;

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-6 border-4 border-purple-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <Trophy className="w-7 h-7 text-purple-600 mr-2" />
          Your Progress
        </h3>
        
        <div className="text-center py-8 space-y-4">
          <div className="text-6xl mb-4">🔒</div>
          <p className="text-lg text-gray-600 mb-4">
            Sign up to track your progress and earn rewards!
          </p>
          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-2xl shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
          >
            {isLoggingIn ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Sign Up Now</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 border-4 border-purple-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <Trophy className="w-7 h-7 text-purple-600 mr-2" />
        Your Progress
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-8 h-8 text-purple-600" />
            <span className="text-lg font-semibold text-gray-700">Lessons Completed</span>
          </div>
          <span className="text-3xl font-bold text-purple-600">{completedLessons}</span>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-2xl">
          <div className="flex items-center space-x-3">
            <Star className="w-8 h-8 text-amber-600" />
            <span className="text-lg font-semibold text-gray-700">Total Score</span>
          </div>
          <span className="text-3xl font-bold text-amber-600">{totalScore}</span>
        </div>
      </div>
    </div>
  );
}
