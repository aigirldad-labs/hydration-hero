import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ChugButtonProps {
  disabled: boolean;
  onChug: () => void;
}

export function ChugButton({ disabled, onChug }: ChugButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    
    setIsAnimating(true);
    onChug();
    
    setTimeout(() => setIsAnimating(false), 150);
  };

  return (
    <div className="flex flex-col items-center gap-3 animate-fade-in" style={{ animationDelay: '0.3s' }}>
      <Button
        onClick={handleClick}
        disabled={disabled}
        className={`
          relative w-full h-16 text-2xl font-extrabold tracking-widest
          bg-secondary hover:bg-secondary/80 border-2 border-chug/30
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-all duration-150 overflow-hidden
          ${isAnimating ? 'scale-95' : 'scale-100'}
        `}
      >
        <span className="chug-button">CHUG</span>
        
        {/* Ripple effect */}
        {isAnimating && (
          <span className="absolute inset-0 bg-chug/20 animate-ripple rounded-lg" />
        )}
      </Button>
      
      {disabled && (
        <p className="text-sm text-muted-foreground">Enter weight to start.</p>
      )}
    </div>
  );
}
