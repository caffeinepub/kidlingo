import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetWordsByCategory } from '../hooks/useQueries';
import WordCard from '../components/WordCard';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function VocabularyCategory() {
  const { category } = useParams({ from: '/vocabulary/$category' });
  const navigate = useNavigate();
  const { data: words, isLoading } = useGetWordsByCategory(category);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate({ to: '/' })}
          className="flex items-center space-x-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-2xl shadow-md transition-all hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>
        
        <h1 className="text-4xl font-bold text-orange-600">{category} Words</h1>
      </div>

      {words && words.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {words.map((word, index) => (
            <WordCard key={index} word={word} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-2xl text-gray-600">No words available yet for this category.</p>
          <p className="text-lg text-gray-500 mt-2">Check back soon! 🌟</p>
        </div>
      )}
    </div>
  );
}
