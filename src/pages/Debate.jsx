import { UserButton } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Swords, ArrowLeft } from 'lucide-react';
import DebateArena from '../components/DebateArena';
import { useProfiles } from '../hooks/useProfile';

const Debate = () => {
  const { profiles, loading } = useProfiles();

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white h-8 px-2">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Dashboard
            </Button>
          </Link>
          <span className="text-zinc-700">|</span>
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-sm">Debate Arena</span>
          </div>
        </div>
        <UserButton afterSignOutUrl="/" />
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <span>⚔️</span>
            Debate Arena
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Pick two personas, drop a hot topic, and watch the sparks fly.
            {profiles.length > 0 && (
              <span className="text-violet-400 ml-1">
                Your custom profiles are available in the selector.
              </span>
            )}
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 bg-zinc-800/60 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <DebateArena userProfiles={profiles} />
        )}
      </div>
    </div>
  );
};

export default Debate;