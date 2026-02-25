import { useNavigate } from '@tanstack/react-router';
import { Trophy, Star, Home, RotateCcw } from 'lucide-react';

interface QuizResultProps {
  score: number;
  totalQuestions: number;
  category: string;
}

export default function QuizResult({ score, totalQuestions, category }: QuizResultProps) {
  const navigate = useNavigate();
  const percentage = Math.round((score / totalQuestions) * 100);

  const getMessage = () => {
    if (percentage === 100) return "Perfect! You're a star! 🌟";
    if (percentage >= 80) return "Excellent work! 🎉";
    if (percentage >= 60) return "Great job! Keep it up! 👏";
    return "Good try! Practice makes perfect! 💪";
  };

  const getStars = () => {
    if (percentage === 100) return 3;
    if (percentage >= 60) return 2;
    return 1;
  };

  const stars = getStars();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-amber-200 text-center">
        <div className="mb-6">
          <Trophy className="w-24 h-24 mx-auto text-amber-500 mb-4" />
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
          <p className="text-2xl text-gray-600">{getMessage()}</p>
        </div>

        <div className="bg-gradient-to-br from-amber-100 to-yellow-100 rounded-3xl p-8 mb-6">
          <div className="text-6xl font-bold text-amber-600 mb-4">
            {score} / {totalQuestions}
          </div>
          <div className="flex justify-center space-x-2 mb-4">
            {[...Array(3)].map((_, index) => (
              <Star
                key={index}
                className={`w-12 h-12 ${
                  index < stars ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-xl text-gray-700">You scored {percentage}%</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-xl font-bold rounded-2xl shadow-lg transition-all hover:scale-105"
          >
            <Home className="w-6 h-6" />
            <span>Home</span>
          </button>
          
          <button
            onClick={() => navigate({ to: '/quiz/$category', params: { category } })}
            className="flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-xl font-bold rounded-2xl shadow-lg transition-all hover:scale-105"
          >
            <RotateCcw className="w-6 h-6" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    </div>
  );
}
