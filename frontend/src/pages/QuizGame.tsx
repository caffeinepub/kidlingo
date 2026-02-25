import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetWordsByCategory, useCheckQuizAnswer, useCompleteLesson } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import QuizQuestion from '../components/QuizQuestion';
import QuizResult from '../components/QuizResult';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export default function QuizGame() {
  const { category } = useParams({ from: '/quiz/$category' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: words, isLoading } = useGetWordsByCategory(category);
  const checkAnswer = useCheckQuizAnswer();
  const completeLesson = useCompleteLesson();

  const isAuthenticated = !!identity;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [questions, setQuestions] = useState<Array<{ word: string; correctAnswer: string; options: string[] }>>([]);

  useEffect(() => {
    if (words && words.length > 0) {
      // Create quiz questions with randomized options
      const quizQuestions = words.slice(0, Math.min(5, words.length)).map(word => {
        const correctAnswer = word.translation;
        const otherAnswers = words
          .filter(w => w.translation !== correctAnswer)
          .map(w => w.translation)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        
        const options = [correctAnswer, ...otherAnswers].sort(() => Math.random() - 0.5);
        
        return {
          word: word.text,
          correctAnswer,
          options,
        };
      });
      
      setQuestions(quizQuestions);
    }
  }, [words]);

  const handleAnswer = async (selectedAnswer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    
    // For guest users, check answer locally
    let isCorrect = false;
    if (isAuthenticated) {
      isCorrect = await checkAnswer.mutateAsync({
        word: currentQuestion.word,
        translation: selectedAnswer,
      });
    } else {
      // Guest mode: check answer locally
      isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    }

    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 1500);
    } else {
      // Quiz complete
      const finalScore = isCorrect ? score + 1 : score;
      
      // Only save progress for authenticated users
      if (isAuthenticated) {
        await completeLesson.mutateAsync(BigInt(finalScore * 10));
      }
      
      setTimeout(() => {
        setQuizComplete(true);
      }, 1500);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!words || words.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-2xl text-gray-600 mb-4">No words available for this quiz yet.</p>
        <button
          onClick={() => navigate({ to: '/' })}
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-2xl"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (quizComplete) {
    return <QuizResult score={score} totalQuestions={questions.length} category={category} />;
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Guest Mode Warning */}
      {!isAuthenticated && (
        <div className="bg-gradient-to-r from-yellow-100 to-amber-100 border-4 border-yellow-300 rounded-3xl p-4 shadow-lg">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-yellow-700 flex-shrink-0" />
            <p className="text-sm font-semibold text-yellow-800">
              Guest Mode: Your quiz score won't be saved. Sign up to track your progress!
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate({ to: '/' })}
          className="flex items-center space-x-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-2xl shadow-md transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Exit Quiz</span>
        </button>
        
        <div className="text-2xl font-bold text-orange-600">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-4 border-4 border-purple-200">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold text-gray-700">Score: {score}</div>
          <div className="flex space-x-1">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index < currentQuestionIndex
                    ? 'bg-green-500'
                    : index === currentQuestionIndex
                    ? 'bg-orange-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <QuizQuestion
        question={questions[currentQuestionIndex]}
        onAnswer={handleAnswer}
        isChecking={checkAnswer.isPending}
      />
    </div>
  );
}
