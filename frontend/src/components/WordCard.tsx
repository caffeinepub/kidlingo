import { Word } from '../backend';
import { useState } from 'react';

interface WordCardProps {
  word: Word;
}

const wordImageMap: Record<string, string> = {
  'Dog': '/assets/generated/dog.dim_200x200.png',
  'Cat': '/assets/generated/cat.dim_200x200.png',
  'Bird': '/assets/generated/bird.dim_200x200.png',
  'Apple': '/assets/generated/apple.dim_200x200.png',
  'Banana': '/assets/generated/banana.dim_200x200.png',
};

export default function WordCard({ word }: WordCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const imageUrl = wordImageMap[word.text] || '/assets/generated/cat.dim_200x200.png';

  return (
    <div
      onClick={() => setIsFlipped(!isFlipped)}
      className="cursor-pointer perspective-1000"
    >
      <div
        className={`relative w-full h-80 transition-transform duration-500 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden">
          <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all h-full border-4 border-blue-200 overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
              <img
                src={imageUrl}
                alt={word.text}
                className="w-40 h-40 object-contain"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-3xl font-bold text-gray-800 mb-2">{word.text}</h3>
              <p className="text-sm text-gray-500">Tap to see translation</p>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl shadow-lg h-full border-4 border-green-300 flex items-center justify-center p-6">
            <div className="text-center text-white">
              <p className="text-2xl font-semibold mb-4">{word.text}</p>
              <p className="text-4xl font-bold">{word.translation}</p>
              <p className="text-sm mt-4 opacity-90">Tap to flip back</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
