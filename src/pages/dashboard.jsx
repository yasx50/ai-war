import { useUser, UserButton } from '@clerk/clerk-react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Swords, User, LayoutDashboard, Zap, ChevronRight, Plus, Menu, X } from 'lucide-react';
import TokenCounter from '../components/TokenCounter';
import { useProfiles } from '../hooks/useProfile';
import { useTokens } from '../hooks/useTokens';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Profiles', href: '/profiles', icon: User },
  { label: 'Debate Arena', href: '/debate', icon: Swords },
];

const StatCard = ({ label, value, sub, color }) => (
  <Card className="bg-zinc-900/60 border-zinc-700/60">
    <CardContent className="pt-4 pb-4 px-4 sm:pt-5 sm:pb-5 sm:px-5">
      <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">{label}</p>
      <p className={cn('text-2xl sm:text-3xl font-black', color || 'text-white')}>{value}</p>
      {sub && <p className="text-xs text-zinc-600 mt-1">{sub}</p>}
    </CardContent>
  </Card>
);

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  return (
    <aside className="flex flex-col gap-1 pt-2">
      {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        const active = location.pathname === href;
        return (
          <Link key={href} to={href} onClick={onClose}>
            <div
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                active
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
              {active && <ChevronRight className="w-3 h-3 ml-auto" />}
            </div>
          </Link>
        );
      })}
    </aside>
  );
};

const Dashboard = () => {
  const { user } = useUser();
  const { profiles, loading: profilesLoading, canCreateMore } = useProfiles();
  const { tokensUsed, tokenLimit, tokensRemaining, percentUsed } = useTokens();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Top Nav */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur sticky top-0 z-20">
        <div className="flex items-center gap-2">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden mr-1 text-zinc-400 hover:text-white transition-colors"
            onClick={() => setMobileNavOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Swords className="w-5 h-5 text-amber-400" />
          <span className="font-black tracking-tight">DebateAI</span>
        </div>
        <UserButton afterSignOutUrl="/" />
      </header>

      {/* Mobile slide-down nav */}
      {mobileNavOpen && (
        <div className="lg:hidden bg-zinc-900/95 border-b border-zinc-800 px-4 py-3 z-10">
          <Sidebar onClose={() => setMobileNavOpen(false)} />
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex gap-6 lg:gap-8">
        {/* Desktop sidebar */}
        <div className="hidden lg:block w-56 flex-shrink-0">
          <Sidebar />
        </div>

        <main className="flex-1 min-w-0 space-y-5 sm:space-y-6">
          {/* Greeting */}
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {greeting}, {user?.firstName || 'Debater'} 👋
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Ready to watch legends clash? Set up your profiles and start a debate.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <StatCard
              label="Profiles"
              value={profilesLoading ? '—' : profiles.length}
              sub="of 2 max"
              color={profiles.length >= 2 ? 'text-amber-400' : 'text-white'}
            />
            <StatCard
              label="Tokens Used"
              value={tokensUsed}
              sub={`of ${tokenLimit}`}
              color={percentUsed >= 80 ? 'text-red-400' : 'text-white'}
            />
            <StatCard
              label="Tokens Left"
              value={tokensRemaining}
              sub="for debates"
              color={tokensRemaining < 200 ? 'text-red-400' : 'text-emerald-400'}
            />
          </div>

          {/* Token bar */}
          <Card className="bg-zinc-900/60 border-zinc-700/60">
            <CardContent className="pt-4 pb-4 px-4 sm:pt-5 sm:pb-5 sm:px-5">
              <TokenCounter />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-zinc-900/60 border-zinc-700/60 hover:border-zinc-600 transition-colors group">
              <CardContent className="pt-4 pb-4 px-4 sm:pt-5 sm:pb-5 sm:px-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-violet-400" />
                  </div>
                  <Badge variant="outline" className="border-zinc-700 text-zinc-500 text-xs">
                    {profiles.length}/2
                  </Badge>
                </div>
                <h3 className="text-white font-bold text-sm mb-1">My Profiles</h3>
                <p className="text-zinc-500 text-xs mb-4">
                  {canCreateMore
                    ? `You can create ${2 - profiles.length} more profile${2 - profiles.length > 1 ? 's' : ''}.`
                    : 'Both profile slots are filled.'}
                </p>
                <Link to="/profiles">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-zinc-700 hover:border-violet-500/60 hover:bg-violet-500/10 text-xs text-zinc-300 hover:text-violet-400"
                  >
                    {canCreateMore ? <><Plus className="w-3 h-3 mr-1.5" />Create Profile</> : 'Manage Profiles'}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/60 border-zinc-700/60 hover:border-amber-500/40 transition-colors group">
              <CardContent className="pt-4 pb-4 px-4 sm:pt-5 sm:pb-5 sm:px-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <Swords className="w-5 h-5 text-amber-400" />
                  </div>
                  <Zap className="w-4 h-4 text-amber-400/60" />
                </div>
                <h3 className="text-white font-bold text-sm mb-1">Debate Arena</h3>
                <p className="text-zinc-500 text-xs mb-4">
                  Pick two personas, set a topic, and let the battle begin.
                </p>
                <Link to="/debate">
                  <Button
                    size="sm"
                    className="w-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 hover:border-amber-500/60 text-xs"
                  >
                    <Swords className="w-3 h-3 mr-1.5" />
                    Start a Debate
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Recent profiles preview */}
          {profiles.length > 0 && (
            <Card className="bg-zinc-900/60 border-zinc-700/60">
              <CardHeader className="pb-2 pt-4 px-4 sm:px-5">
                <CardTitle className="text-sm text-zinc-300 font-semibold">Your Profiles</CardTitle>
              </CardHeader>
              <Separator className="bg-zinc-800 mx-4 sm:mx-5" />
              <CardContent className="pt-3 pb-4 px-4 sm:px-5 space-y-2">
                {profiles.map((p) => (
                  <div
                    key={p._id}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-800/60 border border-zinc-700/40"
                  >
                    <span className="text-xl flex-shrink-0">{p.avatar || '👤'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{p.name}</p>
                      <p className="text-xs text-zinc-500 capitalize">{p.type} profile</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[10px] border flex-shrink-0',
                        p.type === 'preset'
                          ? 'border-amber-500/40 text-amber-400'
                          : 'border-violet-500/40 text-violet-400'
                      )}
                    >
                      {p.type}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;