import { useState } from 'react';

interface QuizQuestionProps {
  question: {
    word: string;
    correctAnswer: string;
    options: string[];
  };
  onAnswer: (answer: string) => void;
  isChecking: boolean;
}

const wordImageMap: Record<string, string> = {
  'Dog': '/assets/generated/dog.dim_200x200.png',
  'Cat': '/assets/generated/cat.dim_200x200.png',
  'Bird': '/assets/generated/bird.dim_200x200.png',
  'Apple': '/assets/generated/apple.dim_200x200.png',
  'Banana': '/assets/generated/banana.dim_200x200.png',
};

export default function QuizQuestion({ question, onAnswer, isChecking }: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const imageUrl = wordImageMap[question.word] || '/assets/generated/cat.dim_200x200.png';

  const handleSelect = (answer: string) => {
    if (isChecking || showFeedback) return;
    
    setSelectedAnswer(answer);
    setShowFeedback(true);
    onAnswer(answer);
    
    setTimeout(() => {
      setSelectedAnswer(null);
      setShowFeedback(false);
    }, 1500);
  };

  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-blue-200">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">What is this in the target language?</h2>
        
        <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl p-8 mb-6">
          <img
            src={imageUrl}
            alt={question.word}
            className="w-48 h-48 mx-auto object-contain"
          />
          <p className="text-4xl font-bold text-gray-800 mt-4">{question.word}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrectOption = option === question.correctAnswer;
          
          let buttonClass = 'bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white';
          
          if (showFeedback && isSelected) {
            buttonClass = isCorrect
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white animate-pulse'
              : 'bg-gradient-to-r from-red-500 to-rose-500 text-white';
          } else if (showFeedback && isCorrectOption) {
            buttonClass = 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
          }

          return (
            <button
              key={index}
              onClick={() => handleSelect(option)}
              disabled={isChecking || showFeedback}
              className={`p-6 text-2xl font-bold rounded-2xl shadow-lg transition-all hover:scale-105 disabled:cursor-not-allowed disabled:scale-100 ${buttonClass}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div className="mt-6 text-center">
          <p className={`text-3xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrect ? '🎉 Correct!' : '❌ Try again next time!'}
          </p>
        </div>
      )}
    </div>
  );
}
