import { Droplets } from 'lucide-react';

interface GoalSummaryProps {
  goalOz: number;
  consumedOz: number;
  remainingOz: number;
}

export function GoalSummary({ goalOz, consumedOz, remainingOz }: GoalSummaryProps) {
  return (
    <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center justify-center gap-2 mb-4">
        <Droplets className="h-5 w-5 text-primary" />
        <span className="text-lg font-semibold text-foreground">
          Daily goal: <span className="text-primary">{goalOz} oz</span>
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="stat-card text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Consumed</p>
          <p className="text-2xl font-bold text-foreground">{consumedOz} <span className="text-sm font-normal text-muted-foreground">oz</span></p>
        </div>
        <div className="stat-card text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Remaining</p>
          <p className="text-2xl font-bold text-primary">{remainingOz} <span className="text-sm font-normal text-muted-foreground">oz</span></p>
        </div>
      </div>
    </div>
  );
}
