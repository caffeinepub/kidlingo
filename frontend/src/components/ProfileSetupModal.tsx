import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Loader2 } from 'lucide-react';

export default function ProfileSetupModal() {
  const [name, setName] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('Spanish');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      await saveProfile.mutateAsync({
        name: name.trim(),
        preferredLanguage,
        age: undefined,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">👋</div>
          <h2 className="text-3xl font-bold text-orange-600 mb-2">Welcome to KidLingo!</h2>
          <p className="text-gray-600 text-lg">Let's get to know you</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-lg font-semibold text-gray-700 mb-2">
              What's your name?
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 text-lg border-2 border-orange-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all"
              required
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="language" className="block text-lg font-semibold text-gray-700 mb-2">
              Which language do you want to learn?
            </label>
            <select
              id="language"
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              className="w-full px-4 py-3 text-lg border-2 border-orange-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all bg-white"
            >
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Italian">Italian</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={saveProfile.isPending || !name.trim()}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xl font-bold rounded-2xl shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center space-x-2"
          >
            {saveProfile.isPending ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Start Learning! 🚀</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
