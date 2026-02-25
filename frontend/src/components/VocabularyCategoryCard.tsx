import { useNavigate } from '@tanstack/react-router';
import { BookOpen, Play } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: string;
  emoji: string;
}

interface VocabularyCategoryCardProps {
  category: Category;
}

export default function VocabularyCategoryCard({ category }: VocabularyCategoryCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all hover:scale-105 overflow-hidden border-4 border-orange-200">
      <div className="relative h-48 bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
        <img
          src={category.icon}
          alt={category.name}
          className="w-32 h-32 object-contain"
        />
        <div className="absolute top-4 right-4 text-4xl">{category.emoji}</div>
      </div>
      
      <div className="p-6 space-y-4">
        <h3 className="text-2xl font-bold text-gray-800 text-center">{category.name}</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate({ to: '/vocabulary/$category', params: { category: category.id } })}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-md transition-all hover:scale-105"
          >
            <BookOpen className="w-5 h-5" />
            <span>Learn</span>
          </button>
          
          <button
            onClick={() => navigate({ to: '/quiz/$category', params: { category: category.id } })}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-md transition-all hover:scale-105"
          >
            <Play className="w-5 h-5" />
            <span>Quiz</span>
          </button>
        </div>
      </div>
    </div>
  );
}
