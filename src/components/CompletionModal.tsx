import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ModalType } from '@/lib/types';
import { Trophy, Flame, Crown } from 'lucide-react';

interface CompletionModalProps {
  type: ModalType;
  onClose: () => void;
}

const modalConfig = {
  daily: {
    icon: Trophy,
    title: 'Congratulations!',
    body: 'You drank all the water.',
    cta: 'Nice.',
    iconColor: 'text-primary',
  },
  streak7: {
    icon: Flame,
    title: '7-Day Streak!',
    body: 'Congratulations — you hit your goal 7 days in a row.',
    cta: 'Keep going.',
    iconColor: 'text-accent',
  },
  streak30: {
    icon: Crown,
    title: '30-Day Streak!',
    body: 'Incredible — 30 days in a row.',
    cta: 'Legend.',
    iconColor: 'text-streak-star',
  },
};

export function CompletionModal({ type, onClose }: CompletionModalProps) {
  if (type === 'none') return null;

  const config = modalConfig[type];
  const Icon = config.icon;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border/50 max-w-sm animate-scale-in">
        <DialogHeader className="text-center items-center pt-4">
          <div className={`mb-4 ${config.iconColor}`}>
            <Icon className="h-16 w-16" />
          </div>
          <DialogTitle className="text-2xl font-bold text-foreground">
            {config.title}
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground pt-2">
            {config.body}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center pt-4 pb-2">
          <Button 
            onClick={onClose}
            className="px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
          >
            {config.cta}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
