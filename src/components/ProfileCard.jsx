import { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Pencil, Trash2, Shield, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const PRESET_META = {
  virat_kohli:       { emoji: '🏏', color: 'from-blue-900 to-blue-700' },
  cristiano_ronaldo: { emoji: '⚽', color: 'from-green-900 to-green-700' },
  narendra_modi:     { emoji: '🇮🇳', color: 'from-orange-900 to-orange-700' },
  donald_trump:      { emoji: '🦅', color: 'from-red-900 to-red-700' },
  elon_musk:         { emoji: '🚀', color: 'from-zinc-900 to-zinc-700' },
  sam_altman:        { emoji: '🤖', color: 'from-violet-900 to-violet-700' },
};

const ProfileCard = ({ profile, onUpdate, onDelete }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: profile.name,
    personality: profile.personality || '',
    background: profile.background || '',
    speakingStyle: profile.speakingStyle || '',
    topicsExpertise: (profile.topicsExpertise || []).join(', '),
    avatar: profile.avatar || '',
  });

  const isPreset = profile.type === 'preset';
  const meta = isPreset ? PRESET_META[profile.presetKey] : null;

  const handleSave = async () => {
    setSaving(true);
    const payload = isPreset
      ? { name: form.name } // presets: only name editable
      : {
          name: form.name,
          personality: form.personality,
          background: form.background,
          speakingStyle: form.speakingStyle,
          avatar: form.avatar,
          topicsExpertise: form.topicsExpertise
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
        };
    await onUpdate(profile._id, payload);
    setSaving(false);
    setEditOpen(false);
  };

  return (
    <>
      <Card
        className={cn(
          'relative overflow-hidden border border-zinc-700/60 bg-zinc-900/80 backdrop-blur-sm',
          'hover:border-zinc-500/80 transition-all duration-300 group'
        )}
      >
        {/* Top gradient bar */}
        <div
          className={cn(
            'h-1 w-full bg-gradient-to-r',
            meta?.color || 'from-violet-600 to-pink-600'
          )}
        />

        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center text-2xl',
                  'bg-gradient-to-br shadow-lg',
                  meta?.color || 'from-violet-900 to-pink-900'
                )}
              >
                {isPreset ? meta?.emoji : (profile.avatar || '👤')}
              </div>
              <div>
                <h3 className="font-bold text-white text-base leading-tight">
                  {profile.name}
                </h3>
                <Badge
                  variant="outline"
                  className={cn(
                    'text-xs mt-1 border',
                    isPreset
                      ? 'border-amber-500/60 text-amber-400 bg-amber-500/10'
                      : 'border-violet-500/60 text-violet-400 bg-violet-500/10'
                  )}
                >
                  {isPreset ? (
                    <><Shield className="w-2.5 h-2.5 mr-1" />Preset</>
                  ) : (
                    <><User className="w-2.5 h-2.5 mr-1" />Custom</>
                  )}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-4 pb-2">
          {profile.personality && (
            <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
              {profile.personality}
            </p>
          )}
          {profile.topicsExpertise?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {profile.topicsExpertise.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700"
                >
                  {t}
                </span>
              ))}
              {profile.topicsExpertise.length > 3 && (
                <span className="text-[10px] text-zinc-500">
                  +{profile.topicsExpertise.length - 3}
                </span>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="px-4 pb-4 pt-2 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 h-8 text-xs border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800"
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="w-3 h-3 mr-1.5" />
            Edit
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="h-8 px-3 text-xs border-red-800/60 text-red-400 hover:bg-red-900/20 hover:border-red-600"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-zinc-900 border-zinc-700">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Delete Profile?</AlertDialogTitle>
                <AlertDialogDescription className="text-zinc-400">
                  This will permanently delete <strong className="text-zinc-200">{profile.name}</strong>.
                  You can create a new profile after deleting.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => onDelete(profile._id)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-700 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Profile</DialogTitle>
            <DialogDescription className="text-zinc-400 text-sm">
              {isPreset
                ? 'Preset profiles only allow name editing.'
                : 'Update your custom profile details.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-zinc-300 text-xs">Display Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white focus:border-violet-500"
              />
            </div>

            {!isPreset && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-zinc-300 text-xs">Avatar (emoji)</Label>
                  <Input
                    value={form.avatar}
                    onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                    placeholder="e.g. 👑"
                    className="bg-zinc-800 border-zinc-700 text-white focus:border-violet-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-zinc-300 text-xs">Personality</Label>
                  <Textarea
                    value={form.personality}
                    onChange={(e) => setForm({ ...form, personality: e.target.value })}
                    rows={3}
                    placeholder="Describe how this persona debates..."
                    className="bg-zinc-800 border-zinc-700 text-white focus:border-violet-500 resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-zinc-300 text-xs">Background</Label>
                  <Input
                    value={form.background}
                    onChange={(e) => setForm({ ...form, background: e.target.value })}
                    placeholder="e.g. Software engineer from Mumbai"
                    className="bg-zinc-800 border-zinc-700 text-white focus:border-violet-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-zinc-300 text-xs">
                    Topics of Expertise <span className="text-zinc-500">(comma-separated)</span>
                  </Label>
                  <Input
                    value={form.topicsExpertise}
                    onChange={(e) => setForm({ ...form, topicsExpertise: e.target.value })}
                    placeholder="tech, politics, sports"
                    className="bg-zinc-800 border-zinc-700 text-white focus:border-violet-500"
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditOpen(false)}
              className="border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !form.name.trim()}
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileCard;