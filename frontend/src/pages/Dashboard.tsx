import { useGetProgress, useGetRewards } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import VocabularyCategoryCard from '../components/VocabularyCategoryCard';
import ProgressDisplay from '../components/ProgressDisplay';
import RewardsBadge from '../components/RewardsBadge';
import { Loader2, AlertCircle, LogIn } from 'lucide-react';

const categories = [
  { id: 'Animals', name: 'Animals', icon: '/assets/generated/cat.dim_200x200.png', emoji: '🐾' },
  { id: 'Colors', name: 'Colors', icon: '/assets/generated/colors.dim_200x200.png', emoji: '🎨' },
  { id: 'Numbers', name: 'Numbers', icon: '/assets/generated/numbers.dim_200x200.png', emoji: '🔢' },
  { id: 'Family', name: 'Family', icon: '/assets/generated/family.dim_200x200.png', emoji: '👨‍👩‍👧‍👦' },
  { id: 'Food', name: 'Food', icon: '/assets/generated/apple.dim_200x200.png', emoji: '🍎' },
];

export default function Dashboard() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: progress, isLoading: progressLoading } = useGetProgress();
  const { data: rewards, isLoading: rewardsLoading } = useGetRewards();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl">
        <img
          src="/assets/generated/hero-banner.dim_1200x400.png"
          alt="Welcome to KidLingo"
          className="w-full h-48 md:h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/80 to-amber-600/80 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              {isAuthenticated ? 'Welcome Back! 🎉' : 'Welcome to KidLingo! 🎉'}
            </h1>
            <p className="text-xl md:text-2xl">
              {isAuthenticated ? 'Ready to learn something new today?' : 'Learn languages through fun and play!'}
            </p>
          </div>
        </div>
      </div>

      {/* Guest Mode Banner */}
      {!isAuthenticated && (
        <div className="bg-gradient-to-r from-blue-100 to-cyan-100 border-4 border-blue-300 rounded-3xl p-6 shadow-lg">
          <div className="flex items-start space-x-4">
            <AlertCircle className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-blue-800 mb-2">👋 You're in Guest Mode</h3>
              <p className="text-lg text-blue-700 mb-4">
                You can explore all categories and play quizzes, but your progress won't be saved.
              </p>
              <button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-2xl shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingIn ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Sign Up to Save Progress</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress and Rewards Section - Only for authenticated users */}
      {isAuthenticated && (
        <>
          {(progressLoading || rewardsLoading) ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProgressDisplay progress={progress} />
              <RewardsBadge rewards={rewards || []} />
            </div>
          )}
        </>
      )}

      {/* Categories Section */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-3">📚</span>
          Choose a Topic
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <VocabularyCategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
}
