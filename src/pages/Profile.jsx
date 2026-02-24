import { useState } from 'react';
import { UserButton } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Swords, Plus, User, Shield, ArrowLeft, Info } from 'lucide-react';
import ProfileCard from '../components/ProfileCard';
import { useProfiles } from '../hooks/useProfile';
import { cn } from '@/lib/utils';

const PRESETS = [
  { key: 'virat_kohli', name: 'Virat Kohli', emoji: '🏏', tags: ['sports', 'leadership'] },
  { key: 'cristiano_ronaldo', name: 'Cristiano Ronaldo', emoji: '⚽', tags: ['sports', 'fitness'] },
  { key: 'narendra_modi', name: 'Narendra Modi', emoji: '🇮🇳', tags: ['politics', 'governance'] },
  { key: 'donald_trump', name: 'Donald Trump', emoji: '🦅', tags: ['politics', 'business'] },
  { key: 'elon_musk', name: 'Elon Musk', emoji: '🚀', tags: ['tech', 'innovation'] },
  { key: 'sam_altman', name: 'Sam Altman', emoji: '🤖', tags: ['AI', 'startups'] },
];

const SPEAKING_STYLES = ['aggressive', 'diplomatic', 'formal', 'casual', 'sarcastic', 'passionate'];

const CreateProfileDialog = ({ open, onOpenChange, onSave, loading }) => {
  const [tab, setTab] = useState('preset');
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [form, setForm] = useState({
    name: '',
    avatar: '',
    personality: '',
    background: '',
    speakingStyle: '',
    topicsExpertise: '',
  });

  const handleSave = () => {
    if (tab === 'preset' && selectedPreset) {
      onSave({
        type: 'preset',
        presetKey: selectedPreset.key,
        name: selectedPreset.name,
      });
    } else {
      onSave({
        type: 'custom',
        name: form.name,
        avatar: form.avatar,
        personality: form.personality,
        background: form.background,
        speakingStyle: form.speakingStyle,
        topicsExpertise: form.topicsExpertise.split(',').map((t) => t.trim()).filter(Boolean),
      });
    }
  };

  const isValid =
    (tab === 'preset' && selectedPreset) ||
    (tab === 'custom' && form.name.trim() && form.personality.trim());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-700 max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-lg font-bold">Create New Profile</DialogTitle>
          <DialogDescription className="text-zinc-400 text-sm">
            Choose a preset legend or build your own custom persona.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="mt-2">
          <TabsList className="grid grid-cols-2 w-full bg-zinc-800">
            <TabsTrigger
              value="preset"
              className="data-[state=active]:bg-zinc-700 data-[state=active]:text-amber-400 text-zinc-400"
            >
              <Shield className="w-3.5 h-3.5 mr-1.5" />
              Preset Legend
            </TabsTrigger>
            <TabsTrigger
              value="custom"
              className="data-[state=active]:bg-zinc-700 data-[state=active]:text-violet-400 text-zinc-400"
            >
              <User className="w-3.5 h-3.5 mr-1.5" />
              Custom Persona
            </TabsTrigger>
          </TabsList>

          {/* PRESET TAB */}
          <TabsContent value="preset" className="mt-4">
            <div className="grid grid-cols-2 gap-3">
              {PRESETS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setSelectedPreset(p)}
                  className={cn(
                    'p-3 rounded-xl border text-left transition-all',
                    selectedPreset?.key === p.key
                      ? 'border-amber-500/60 bg-amber-500/10'
                      : 'border-zinc-700 bg-zinc-800/60 hover:border-zinc-600 hover:bg-zinc-800'
                  )}
                >
                  <div className="text-2xl mb-2">{p.emoji}</div>
                  <div className="text-sm font-semibold text-white">{p.name}</div>
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {p.tags.map((t) => (
                      <span key={t} className="text-[10px] text-zinc-500 bg-zinc-700/60 px-1.5 py-0.5 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>

          {/* CUSTOM TAB */}
          <TabsContent value="custom" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-zinc-300 text-xs">Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. The Philosopher"
                  className="bg-zinc-800 border-zinc-700 text-white focus:border-violet-500"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-zinc-300 text-xs">Avatar (emoji)</Label>
                <Input
                  value={form.avatar}
                  onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                  placeholder="e.g. 🦁"
                  className="bg-zinc-800 border-zinc-700 text-white focus:border-violet-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-zinc-300 text-xs">Personality / Debate Style *</Label>
              <Textarea
                value={form.personality}
                onChange={(e) => setForm({ ...form, personality: e.target.value })}
                rows={3}
                placeholder="e.g. Calm, uses data and logic. Never raises voice. Quotes philosophers. Asks Socratic questions."
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-violet-500 resize-none text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-zinc-300 text-xs">Background (optional)</Label>
              <Input
                value={form.background}
                onChange={(e) => setForm({ ...form, background: e.target.value })}
                placeholder="e.g. Professor of philosophy from Oxford"
                className="bg-zinc-800 border-zinc-700 text-white focus:border-violet-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-zinc-300 text-xs">Speaking Style</Label>
              <Select
                value={form.speakingStyle}
                onValueChange={(v) => setForm({ ...form, speakingStyle: v })}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Choose style..." />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  {SPEAKING_STYLES.map((s) => (
                    <SelectItem key={s} value={s} className="text-zinc-200 capitalize focus:bg-zinc-800">
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-zinc-300 text-xs">
                Topics of Expertise{' '}
                <span className="text-zinc-600">(comma-separated)</span>
              </Label>
              <Input
                value={form.topicsExpertise}
                onChange={(e) => setForm({ ...form, topicsExpertise: e.target.value })}
                placeholder="AI, philosophy, ethics, science"
                className="bg-zinc-800 border-zinc-700 text-white focus:border-violet-500"
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isValid || loading}
            className={cn(
              'font-bold',
              tab === 'preset'
                ? 'bg-amber-500 hover:bg-amber-600 text-black'
                : 'bg-violet-600 hover:bg-violet-700 text-white'
            )}
          >
            {loading ? 'Creating...' : 'Create Profile'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Profiles = () => {
  const { profiles, loading, canCreateMore, createProfile, updateProfile, deleteProfile } = useProfiles();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleCreate = async (data) => {
    setSaving(true);
    const result = await createProfile(data);
    setSaving(false);
    if (result) setDialogOpen(false);
  };

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
            <User className="w-4 h-4 text-violet-400" />
            <span className="font-bold text-sm">My Profiles</span>
          </div>
        </div>
        <UserButton afterSignOutUrl="/" />
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-white">Profile Manager</h1>
            <p className="text-zinc-500 text-sm mt-1">
              You can have up to{' '}
              <span className="text-white font-semibold">2 profiles</span>. Delete one to create a new.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className={cn(
                'border px-3 py-1 font-mono',
                profiles.length >= 2
                  ? 'border-amber-500/50 text-amber-400'
                  : 'border-zinc-700 text-zinc-400'
              )}
            >
              {profiles.length} / 2
            </Badge>
            <Button
              onClick={() => setDialogOpen(true)}
              disabled={!canCreateMore}
              className="bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-40"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Profile
            </Button>
          </div>
        </div>

        {/* Limit alert */}
        {!canCreateMore && (
          <Alert className="mb-5 border-amber-500/30 bg-amber-500/10">
            <Info className="w-4 h-4 text-amber-400" />
            <AlertDescription className="text-amber-300 text-xs">
              Both profile slots are occupied. Delete an existing profile to create a new one.
            </AlertDescription>
          </Alert>
        )}

        {/* Profiles grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[0, 1].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-zinc-800/60 animate-pulse" />
            ))}
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
            <div className="text-5xl mb-4">🎭</div>
            <h3 className="text-zinc-300 font-bold mb-2">No Profiles Yet</h3>
            <p className="text-zinc-600 text-sm mb-6">
              Create your first profile to start debating.
            </p>
            <Button
              onClick={() => setDialogOpen(true)}
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Profile
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profiles.map((profile) => (
              <ProfileCard
                key={profile._id}
                profile={profile}
                onUpdate={updateProfile}
                onDelete={deleteProfile}
              />
            ))}

            {/* Empty slot */}
            {canCreateMore && (
              <button
                onClick={() => setDialogOpen(true)}
                className="h-full min-h-[200px] rounded-2xl border-2 border-dashed border-zinc-800 hover:border-zinc-600 flex flex-col items-center justify-center gap-3 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-zinc-800 group-hover:bg-zinc-700 flex items-center justify-center transition-colors">
                  <Plus className="w-6 h-6 text-zinc-500 group-hover:text-zinc-300" />
                </div>
                <span className="text-zinc-600 group-hover:text-zinc-400 text-sm font-medium transition-colors">
                  Create Profile
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      <CreateProfileDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleCreate}
        loading={saving}
      />
    </div>
  );
};

export default Profiles;