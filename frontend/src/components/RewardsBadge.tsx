import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Reward } from '../backend';
import { Award, LogIn } from 'lucide-react';

interface RewardsBadgeProps {
  rewards: Reward[];
}

export default function RewardsBadge({ rewards }: RewardsBadgeProps) {
  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const goldCount = rewards.filter(r => r === 'goldStar').length;

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-6 border-4 border-amber-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <Award className="w-7 h-7 text-amber-600 mr-2" />
          Your Rewards
        </h3>
        
        <div className="text-center py-8 space-y-4">
          <div className="text-6xl mb-4">🏆</div>
          <p className="text-lg text-gray-600 mb-4">
            Create an account to earn and save badges!
          </p>
          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-2xl shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
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
    <div className="bg-white rounded-3xl shadow-lg p-6 border-4 border-amber-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <Award className="w-7 h-7 text-amber-600 mr-2" />
        Your Rewards
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-2xl">
          <img
            src="/assets/generated/star-badge.dim_128x128.png"
            alt="Star Badge"
            className="w-20 h-20 mx-auto mb-2"
          />
          <p className="text-sm font-semibold text-gray-600">Stars Earned</p>
          <p className="text-3xl font-bold text-amber-600">{rewards.length}</p>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl">
          <img
            src="/assets/generated/trophy-badge.dim_128x128.png"
            alt="Trophy Badge"
            className="w-20 h-20 mx-auto mb-2"
          />
          <p className="text-sm font-semibold text-gray-600">Gold Stars</p>
          <p className="text-3xl font-bold text-orange-600">{goldCount}</p>
        </div>
      </div>
      
      {rewards.length === 0 && (
        <div className="mt-4 text-center p-4 bg-gray-50 rounded-2xl">
          <p className="text-gray-600">Complete lessons to earn rewards! 🌟</p>
        </div>
      )}
    </div>
  );
}
