import { Flame, Star } from 'lucide-react';

interface HeaderProps {
  currentStreak: number;
  isAtRecord: boolean;
}

export function Header({ currentStreak, isAtRecord }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-lg">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Stay Hydrated
        </h1>
        
        {currentStreak > 0 && (
          <div className="flex items-center gap-1.5 streak-glow">
            <Flame className="h-5 w-5 text-accent" />
            <span className="text-lg font-semibold text-accent">{currentStreak}</span>
            {isAtRecord && (
              <Star className="h-4 w-4 text-streak-star fill-streak-star" />
            )}
          </div>
        )}
      </div>
    </header>
  );
}
