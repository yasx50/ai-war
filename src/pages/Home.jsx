import { SignInButton, SignUpButton, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Swords } from 'lucide-react';

const FEATURED = [
  { iconNum: 1, name: 'Elon Musk' },
  { iconNum: 2, name: 'Virat Kohli' },
  { iconNum: 3, name: 'Cristiano Ronaldo' },
  { iconNum: 4, name: 'Narendra Modi' },
  { iconNum: 5, name: 'Sam Altman' },
  { iconNum: 6, name: 'Donald Trump' },
];

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/60 hover:border-zinc-700 transition-all hover:-translate-y-1 duration-300">
    <div className="text-2xl mb-3">{icon}</div>
    <h3 className="text-white font-bold text-sm mb-1">{title}</h3>
    <p className="text-zinc-500 text-xs leading-relaxed">{desc}</p>
  </div>
);

const Home = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) navigate('/dashboard');
  }, [isSignedIn, navigate]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60">
        <div className="flex items-center gap-2">
          <Swords className="w-5 h-5 text-amber-400 animate-pulse" />
          <span className="font-black text-lg tracking-tight">DebateAI</span>
        </div>
        <div className="flex gap-2">
          <SignInButton mode="modal">
            <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white hover:bg-zinc-800">
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-black font-bold">
              Get Started
            </Button>
          </SignUpButton>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">

        {/* Beta Badge */}
        <Badge className="mb-6 bg-amber-500/20 text-amber-400 border border-amber-500/40 px-4 py-1 animate-pulse">
          Beta Version
        </Badge>

        <h1 className="font-google text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-none animate-fadeIn">
          Watch Your Idols
          <br />
          <span className="font-space text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 animate-gradient">
            Battle It Out
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-amber-400 text-lg mb-4 italic animate-fadeIn">
          Have fun while your idols fight for you.
        </p>

        <p className="text-zinc-400 text-lg max-w-xl mb-10 leading-relaxed animate-fadeIn">
          Put Virat Kohli vs Elon Musk. Modi vs Trump. Or create your own custom persona.
          Let AI simulate intense debates on any topic.
        </p>

        {/* Featured profiles */}
        <div className="flex gap-3 mb-10 flex-wrap justify-center">
          {FEATURED.map((f) => (
            <div
              key={f.name}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-sm text-zinc-300 hover:border-zinc-600 transition-all hover:scale-105 duration-300"
            >
              <div className="w-5 h-5 rounded-full overflow-hidden bg-zinc-700/50 flex items-center justify-center">
                <img
                  src={`/${f.iconNum}.svg`}
                  alt={f.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-medium">{f.name}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <SignUpButton mode="modal">
            <Button className="h-12 px-8 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold text-base shadow-xl shadow-amber-500/20 transition-transform hover:scale-105">
              <Swords className="w-5 h-5 mr-2" />
              Start Debating Free
            </Button>
          </SignUpButton>
          <SignInButton mode="modal">
            <Button
              variant="outline"
              className="h-12 px-8 border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 text-base transition-transform hover:scale-105"
            >
              Sign In
            </Button>
          </SignInButton>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-20 max-w-3xl w-full">
          <FeatureCard
            icon="🎭"
            title="Preset Legends"
            desc="Choose from 6 iconic personalities — each with a unique debate style."
          />
          <FeatureCard
            icon="😉"
            title="Custom Profiles"
            desc="Create up to 2 custom personas with your own style."
          />
          <FeatureCard
            icon="⚡"
            title="1000 Free Tokens"
            desc="Every account gets 1000 tokens to run debates."
          />
        </div>
      </main>

      <footer className="text-center py-6 text-zinc-700 text-xs border-t border-zinc-800/60">
        Built with ⚡ Vite + React + Clerk + MongoDB
      </footer>
    </div>
  );
};

export default Home;