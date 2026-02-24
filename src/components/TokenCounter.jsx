import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Zap, AlertTriangle, XCircle } from 'lucide-react';
import { useTokens } from '../hooks/useTokens';
import { cn } from '@/lib/utils';

const TokenCounter = ({ className, compact = false }) => {
  const { tokensUsed, tokenLimit, tokensRemaining, percentUsed, isLow, isExhausted, loading } =
    useTokens();

  if (loading) {
    return (
      <div className={cn('animate-pulse', className)}>
        <div className="h-4 bg-zinc-800 rounded w-full mb-2" />
        <div className="h-2 bg-zinc-800 rounded w-full" />
      </div>
    );
  }

  const barColor = isExhausted
    ? 'bg-red-500'
    : isLow
    ? 'bg-amber-400'
    : 'bg-emerald-400';

  const icon = isExhausted ? (
    <XCircle className="w-4 h-4 text-red-400" />
  ) : isLow ? (
    <AlertTriangle className="w-4 h-4 text-amber-400" />
  ) : (
    <Zap className="w-4 h-4 text-emerald-400" />
  );

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {icon}
        <span className="text-xs font-mono text-zinc-300">
          {tokensUsed}/{tokenLimit}
        </span>
        <div className="w-20 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all', barColor)}
            style={{ width: `${Math.min(percentUsed, 100)}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-semibold text-zinc-200 tracking-wide">
            Token Usage
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              'font-mono text-xs border',
              isExhausted
                ? 'border-red-500 text-red-400'
                : isLow
                ? 'border-amber-400 text-amber-400'
                : 'border-emerald-500 text-emerald-400'
            )}
          >
            {tokensRemaining} left
          </Badge>
          <span className="text-xs text-zinc-500 font-mono">
            {tokensUsed} / {tokenLimit}
          </span>
        </div>
      </div>

      <div className="relative w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-700',
            barColor,
            isLow && !isExhausted && 'animate-pulse'
          )}
          style={{ width: `${Math.min(percentUsed, 100)}%` }}
        />
      </div>

      {isExhausted && (
        <Alert className="border-red-500/40 bg-red-500/10 text-red-300">
          <XCircle className="w-4 h-4" />
          <AlertDescription className="text-xs">
            Token limit reached. You've used all 1000 tokens for this session.
          </AlertDescription>
        </Alert>
      )}

      {isLow && !isExhausted && (
        <Alert className="border-amber-400/40 bg-amber-400/10 text-amber-300">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription className="text-xs">
            Running low — only {tokensRemaining} tokens remaining.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default TokenCounter;