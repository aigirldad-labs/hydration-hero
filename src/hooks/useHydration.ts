import { useState, useEffect, useCallback } from 'react';
import { UserProfile, DailyHydrationRecord, StreakStats, ModalType } from '@/lib/types';
import { hydrationProvider } from '@/lib/localStorageProvider';
import { getTodayKey } from '@/lib/dateUtils';
import { calculateCurrentStreak, calculateStreakOnCompletion } from '@/lib/streakUtils';

export function useHydration() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [records, setRecords] = useState<DailyHydrationRecord[]>([]);
  const [streakStats, setStreakStats] = useState<StreakStats>({ longestStreakDays: 0 });
  const [todayRecord, setTodayRecord] = useState<DailyHydrationRecord | null>(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [modalToShow, setModalToShow] = useState<ModalType>('none');
  const [isLoading, setIsLoading] = useState(true);

  const today = getTodayKey();

  // Load initial data
  useEffect(() => {
    async function loadData() {
      const [loadedProfile, loadedRecords, loadedStats] = await Promise.all([
        hydrationProvider.getUserProfile(),
        hydrationProvider.getDailyRecords(),
        hydrationProvider.getStreakStats(),
      ]);

      setProfile(loadedProfile);
      setRecords(loadedRecords);
      setStreakStats(loadedStats);

      // Find or create today's record
      let todayRec = loadedRecords.find(r => r.date === today);
      if (!todayRec) {
        const goalOz = loadedProfile ? Math.round(loadedProfile.weightLbs) : 0;
        todayRec = {
          date: today,
          goalOz,
          consumedOz: 0,
          completedAt: null,
        };
        await hydrationProvider.upsertDailyRecord(todayRec);
        setRecords(prev => [...prev, todayRec!]);
      }
      setTodayRecord(todayRec);

      // Calculate current streak
      const streak = calculateCurrentStreak(loadedRecords);
      setCurrentStreak(streak);

      setIsLoading(false);
    }
    loadData();
  }, [today]);

  const updateWeight = useCallback(async (weightLbs: number) => {
    const now = new Date().toISOString();
    const newProfile: UserProfile = profile
      ? { ...profile, weightLbs, updatedAt: now }
      : { weightLbs, createdAt: now, updatedAt: now };

    await hydrationProvider.saveUserProfile(newProfile);
    setProfile(newProfile);

    // Update today's goal
    const goalOz = Math.round(weightLbs);
    if (todayRecord) {
      const wasCompleted = todayRecord.completedAt !== null;
      const willBeCompleted = goalOz > 0 && todayRecord.consumedOz >= goalOz;
      
      const updatedRecord: DailyHydrationRecord = {
        ...todayRecord,
        goalOz,
        completedAt: willBeCompleted && !wasCompleted ? now : todayRecord.completedAt,
      };

      await hydrationProvider.upsertDailyRecord(updatedRecord);
      setTodayRecord(updatedRecord);
      setRecords(prev => prev.map(r => r.date === today ? updatedRecord : r));

      // Check if we just completed by changing goal
      if (willBeCompleted && !wasCompleted) {
        handleCompletion(updatedRecord);
      }
    }
  }, [profile, todayRecord, today]);

  const handleCompletion = useCallback(async (record: DailyHydrationRecord) => {
    // Calculate the new streak
    const newStreak = calculateStreakOnCompletion(records);
    setCurrentStreak(newStreak);

    // Update longest streak if needed
    if (newStreak > streakStats.longestStreakDays) {
      const newStats = { longestStreakDays: newStreak };
      await hydrationProvider.saveStreakStats(newStats);
      setStreakStats(newStats);
    }

    // Determine which modal to show
    if (newStreak === 30) {
      setModalToShow('streak30');
    } else if (newStreak === 7) {
      setModalToShow('streak7');
    } else {
      setModalToShow('daily');
    }
  }, [records, streakStats]);

  const chug = useCallback(async () => {
    if (!todayRecord || todayRecord.goalOz === 0) return;

    const now = new Date().toISOString();
    const newConsumed = todayRecord.consumedOz + 1;
    const wasCompleted = todayRecord.completedAt !== null;
    const justCompleted = !wasCompleted && newConsumed >= todayRecord.goalOz;

    const updatedRecord: DailyHydrationRecord = {
      ...todayRecord,
      consumedOz: newConsumed,
      completedAt: justCompleted ? now : todayRecord.completedAt,
    };

    await hydrationProvider.upsertDailyRecord(updatedRecord);
    setTodayRecord(updatedRecord);
    setRecords(prev => prev.map(r => r.date === today ? updatedRecord : r));

    if (justCompleted) {
      handleCompletion(updatedRecord);
    }
  }, [todayRecord, today, handleCompletion]);

  const closeModal = useCallback(() => {
    setModalToShow('none');
  }, []);

  const goalOz = todayRecord?.goalOz ?? 0;
  const consumedOz = todayRecord?.consumedOz ?? 0;
  const remainingOz = Math.max(goalOz - consumedOz, 0);
  const fillPercent = goalOz > 0 ? remainingOz / goalOz : 0;
  const isAtRecord = currentStreak > 0 && currentStreak === streakStats.longestStreakDays;

  return {
    isLoading,
    profile,
    records,
    todayRecord,
    currentStreak,
    longestStreak: streakStats.longestStreakDays,
    isAtRecord,
    goalOz,
    consumedOz,
    remainingOz,
    fillPercent,
    modalToShow,
    updateWeight,
    chug,
    closeModal,
  };
}
