import { DailyHydrationRecord } from './types';
import { getTodayKey, getPreviousDay } from './dateUtils';

export function isSuccessfulDay(record: DailyHydrationRecord | undefined): boolean {
  if (!record) return false;
  return record.goalOz > 0 && record.consumedOz >= record.goalOz;
}

export function calculateCurrentStreak(records: DailyHydrationRecord[]): number {
  if (records.length === 0) return 0;

  // Create a map for quick lookup
  const recordMap = new Map<string, DailyHydrationRecord>();
  records.forEach(r => recordMap.set(r.date, r));

  const today = getTodayKey();
  let streak = 0;
  let checkDate = today;

  // Check if today is successful
  const todayRecord = recordMap.get(today);
  if (isSuccessfulDay(todayRecord)) {
    streak = 1;
    checkDate = getPreviousDay(today);
  } else {
    // If today isn't successful, start checking from yesterday
    checkDate = getPreviousDay(today);
  }

  // Count consecutive successful days backwards
  while (true) {
    const record = recordMap.get(checkDate);
    if (isSuccessfulDay(record)) {
      streak++;
      checkDate = getPreviousDay(checkDate);
    } else {
      break;
    }
  }

  return streak;
}

export function calculateStreakOnCompletion(records: DailyHydrationRecord[]): number {
  // When completing today, calculate streak including today as successful
  if (records.length === 0) return 1;

  const recordMap = new Map<string, DailyHydrationRecord>();
  records.forEach(r => recordMap.set(r.date, r));

  const today = getTodayKey();
  let streak = 1; // Today counts
  let checkDate = getPreviousDay(today);

  // Count consecutive successful days backwards from yesterday
  while (true) {
    const record = recordMap.get(checkDate);
    if (isSuccessfulDay(record)) {
      streak++;
      checkDate = getPreviousDay(checkDate);
    } else {
      break;
    }
  }

  return streak;
}
