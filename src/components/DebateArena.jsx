import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Swords, RotateCcw, Lock, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApi } from '../lib/api';
import { useTokens } from '../hooks/useTokens';
import TokenCounter from './TokenCounter';

const PRESET_PROFILES = [
  { _id: 'preset_virat', name: 'Virat Kohli', emoji: '🏏', type: 'preset', presetKey: 'virat_kohli' },
  { _id: 'preset_ronaldo', name: 'Cristiano Ronaldo', emoji: '⚽', type: 'preset', presetKey: 'cristiano_ronaldo' },
  { _id: 'preset_modi', name: 'Narendra Modi', emoji: '🇮🇳', type: 'preset', presetKey: 'narendra_modi' },
  { _id: 'preset_trump', name: 'Donald Trump', emoji: '🦅', type: 'preset', presetKey: 'donald_trump' },
  { _id: 'preset_elon', name: 'Elon Musk', emoji: '🚀', type: 'preset', presetKey: 'elon_musk' },
  { _id: 'preset_sam', name: 'Sam Altman', emoji: '🤖', type: 'preset', presetKey: 'sam_altman' },
];

const MessageBubble = ({ message, profile, side }) => {
  const isLeft = side === 'left';
  return (
    <div className={cn('flex gap-2 sm:gap-3 mb-4', isLeft ? 'flex-row' : 'flex-row-reverse')}>
      <div
        className={cn(
          'w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-base sm:text-lg flex-shrink-0 shadow',
          isLeft ? 'bg-blue-900' : 'bg-red-900'
        )}
      >
        {profile?.emoji || profile?.avatar || '🎭'}
      </div>
      <div className={cn('max-w-[82%] sm:max-w-[75%] space-y-1', isLeft ? 'items-start' : 'items-end')}>
        <span className={cn('text-xs text-zinc-500 font-medium', isLeft ? 'pl-1' : 'pr-1 block text-right')}>
          {profile?.name}
        </span>
        <div
          className={cn(
            'px-3 py-2.5 sm:px-4 sm:py-3 rounded-2xl text-sm leading-relaxed shadow-md',
            isLeft
              ? 'bg-zinc-800 text-zinc-100 rounded-tl-none border border-zinc-700/60'
              : 'bg-gradient-to-br from-red-900/70 to-red-800/40 text-zinc-100 rounded-tr-none border border-red-700/40'
          )}
        >
          {message.content}
        </div>
        {message.tokens && (
          <span className={cn('text-[10px] text-zinc-600 font-mono', isLeft ? 'pl-1' : 'pr-1 block text-right')}>
            {message.tokens} tokens
          </span>
        )}
      </div>
    </div>
  );
};

const DebateArena = ({ userProfiles = [] }) => {
  const api = useApi();
  const { isExhausted, refetch: refetchTokens } = useTokens();

  const allProfiles = [...PRESET_PROFILES, ...userProfiles.map(p => ({
    ...p,
    emoji: p.avatar || '👤',
  }))];

  const [profile1Id, setProfile1Id] = useState('');
  const [profile2Id, setProfile2Id] = useState('');
  const [topic, setTopic] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [isDebating, setIsDebating] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isDebating && !loading && messages.length >= 2) {
      const timer = setTimeout(() => {
        continueDebate();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isDebating, loading, messages.length]);

  const profile1 = allProfiles.find((p) => p._id === profile1Id);
  const profile2 = allProfiles.find((p) => p._id === profile2Id);
  const canStart = profile1Id && profile2Id && profile1Id !== profile2Id && topic.trim() && !isExhausted;

  const startDebate = async () => {
    if (!canStart) return;
    setStarted(true);
    setMessages([]);
    setLoading(true);
    setIsDebating(true);

    try {
      const res = await api.post('/debate/start', {
        profile1,
        profile2,
        topic: topic.trim(),
        messages: [],
      });

      const data = res.data;
      setMessages([
        { id: 1, role: 'profile1', content: data.profile1Response || 'No response', tokens: data.tokensUsed?.profile1 },
        { id: 2, role: 'profile2', content: data.profile2Response || 'No response', tokens: data.tokensUsed?.profile2 },
      ]);
      refetchTokens();
    } catch (err) {
      setMessages([{ id: 1, role: 'system', content: `Error: ${err.message}` }]);
      setIsDebating(false);
    } finally {
      setLoading(false);
    }
  };

  const continueDebate = async () => {
    if (loading || isExhausted) return;
    setLoading(true);

    try {
      const res = await api.post('/debate/continue', {
        profile1,
        profile2,
        topic,
        messages: messages.filter(m => m.role !== 'system'),
      });

      const data = res.data;
      const newMessage = {
        id: Date.now() + Math.random(),
        role: data.isProfile1Turn ? 'profile1' : 'profile2',
        content: data.isProfile1Turn ? data.profile1Response : data.profile2Response,
        tokens: data.isProfile1Turn ? data.tokensUsed.profile1 : data.tokensUsed.profile2,
      };

      setMessages((prev) => [...prev, newMessage]);
      refetchTokens();
    } catch (err) {
      setMessages((prev) => [...prev, { id: Date.now(), role: 'system', content: `Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStarted(false);
    setMessages([]);
    setTopic('');
    setProfile1Id('');
    setProfile2Id('');
    setIsDebating(false);
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full">

      {/* Setup Panel */}
      {!started && (
        <div className="space-y-4 sm:space-y-5 p-4 sm:p-6 rounded-2xl bg-zinc-900/60 border border-zinc-700/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-1">
            <Swords className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">Setup Your Debate</h2>
          </div>

          <TokenCounter />
          <Separator className="bg-zinc-800" />

          {/* Profile Selectors — stack on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                🔵 Fighter 1
              </label>
              <Select value={profile1Id} onValueChange={setProfile1Id}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white focus:ring-blue-500">
                  <SelectValue placeholder="Choose persona..." />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  {allProfiles.map((p) => (
                    <SelectItem
                      key={p._id}
                      value={p._id}
                      disabled={p._id === profile2Id}
                      className="text-zinc-200 focus:bg-zinc-800"
                    >
                      {p.emoji || p.avatar || '👤'} {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                🔴 Fighter 2
              </label>
              <Select value={profile2Id} onValueChange={setProfile2Id}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white focus:ring-red-500">
                  <SelectValue placeholder="Choose persona..." />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  {allProfiles.map((p) => (
                    <SelectItem
                      key={p._id}
                      value={p._id}
                      disabled={p._id === profile1Id}
                      className="text-zinc-200 focus:bg-zinc-800"
                    >
                      {p.emoji || p.avatar || '👤'} {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* VS Badge */}
          {profile1 && profile2 && (
            <div className="flex items-center justify-center gap-3 sm:gap-4 py-1">
              <span className="text-2xl">{profile1.emoji}</span>
              <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold px-3">VS</Badge>
              <span className="text-2xl">{profile2.emoji}</span>
            </div>
          )}

          {/* Topic */}
          <div className="space-y-2">
            <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
              Debate Topic
            </label>
            <Textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. AI will replace all jobs within 10 years..."
              rows={2}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-amber-500/60 resize-none"
            />
          </div>

          {isExhausted && (
            <Alert className="border-red-500/40 bg-red-500/10">
              <Lock className="w-4 h-4 text-red-400" />
              <AlertDescription className="text-red-300 text-xs">
                No tokens remaining. You cannot start a new debate.
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={startDebate}
            disabled={!canStart || loading}
            className="w-full h-11 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold tracking-wide shadow-lg shadow-amber-500/20 disabled:opacity-50"
          >
            <Swords className="w-4 h-4 mr-2" />
            {loading ? 'Generating Debate...' : 'START DEBATE ⚔️'}
          </Button>
        </div>
      )}

      {/* Arena */}
      {started && (
        <div className="rounded-2xl bg-zinc-900/60 border border-zinc-700/60 overflow-hidden">

          {/* Arena Header — wraps on very small screens */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-3 border-b border-zinc-800 bg-zinc-900/80">
            <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-wrap">
              <span className="text-base sm:text-lg">{profile1?.emoji}</span>
              <span className="text-xs text-zinc-400 font-medium truncate max-w-[70px] sm:max-w-none">{profile1?.name}</span>
              <Badge variant="outline" className="border-amber-500/40 text-amber-400 text-[10px] px-1.5 sm:px-2">VS</Badge>
              <span className="text-xs text-zinc-400 font-medium truncate max-w-[70px] sm:max-w-none">{profile2?.name}</span>
              <span className="text-base sm:text-lg">{profile2?.emoji}</span>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <TokenCounter compact />
              {isDebating && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsDebating(false)}
                  className="h-7 px-2 text-xs text-red-400 hover:text-red-500 hover:bg-red-500/10"
                >
                  <Square className="w-3 h-3 sm:mr-1 fill-current" />
                  <span className="hidden sm:inline">Stop</span>
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={reset}
                className="h-7 px-2 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <RotateCcw className="w-3 h-3 sm:mr-1" />
                <span className="hidden sm:inline">Reset</span>
              </Button>
            </div>
          </div>

          {/* Topic Banner */}
          <div className="px-3 sm:px-4 py-2 bg-amber-500/10 border-b border-amber-500/20">
            <p className="text-xs text-amber-400 font-medium text-center line-clamp-2 sm:line-clamp-1">
              📢 {topic}
            </p>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="h-[360px] sm:h-[420px] overflow-y-auto p-3 sm:p-4 space-y-1 scroll-smooth"
          >
            {loading && messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-3">
                  <div className="flex gap-1 justify-center">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                  <p className="text-zinc-500 text-sm">Generating debate...</p>
                </div>
              </div>
            )}

            {messages.length === 0 && !loading && (
              <div className="flex items-center justify-center h-full">
                <p className="text-zinc-500 text-sm text-center px-4">Messages will appear here once debate starts</p>
              </div>
            )}

            {messages.map((msg) => {
              if (msg.role === 'user') {
                return (
                  <div key={msg.id} className="flex justify-center my-3">
                    <Badge variant="outline" className="border-zinc-700 text-zinc-400 text-xs px-3 text-center">
                      🎙️ You steered: "{msg.content}"
                    </Badge>
                  </div>
                );
              }
              if (msg.role === 'system') {
                return (
                  <Alert key={msg.id} className="border-red-500/40 bg-red-500/10 text-red-300 text-xs">
                    <AlertDescription>{msg.content}</AlertDescription>
                  </Alert>
                );
              }

              const displayProfile = msg.role === 'profile1' ? profile1 : profile2;
              const displayContent = msg.content || '(No response generated)';

              return (
                <MessageBubble
                  key={msg.id}
                  message={{ ...msg, content: displayContent }}
                  profile={displayProfile}
                  side={msg.role === 'profile1' ? 'left' : 'right'}
                />
              );
            })}

            {loading && messages.length > 0 && (
              <div className="flex justify-center py-2">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default DebateArena;