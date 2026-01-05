import { useHydration } from '@/hooks/useHydration';
import { Header } from '@/components/Header';
import { WeightInput } from '@/components/WeightInput';
import { GoalSummary } from '@/components/GoalSummary';
import { BottleVisualizer } from '@/components/BottleVisualizer';
import { ChugButton } from '@/components/ChugButton';
import { HydrationChart } from '@/components/HydrationChart';
import { CompletionModal } from '@/components/CompletionModal';

const Index = () => {
  const {
    isLoading,
    profile,
    records,
    currentStreak,
    isAtRecord,
    goalOz,
    consumedOz,
    remainingOz,
    fillPercent,
    modalToShow,
    updateWeight,
    chug,
    closeModal,
  } = useHydration();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentStreak={currentStreak} isAtRecord={isAtRecord} />
      
      <main className="flex-1 container max-w-lg mx-auto px-4 py-6 space-y-6">
        <WeightInput 
          initialWeight={profile?.weightLbs ?? null} 
          onWeightChange={updateWeight} 
        />
        
        <GoalSummary 
          goalOz={goalOz} 
          consumedOz={consumedOz} 
          remainingOz={remainingOz} 
        />
        
        <BottleVisualizer 
          fillPercent={fillPercent} 
          goalOz={goalOz} 
        />
        
        <ChugButton 
          disabled={goalOz === 0} 
          onChug={chug} 
        />
        
        <HydrationChart 
          records={records} 
          currentGoal={goalOz} 
        />
      </main>

      <CompletionModal type={modalToShow} onClose={closeModal} />
    </div>
  );
};

export default Index;
