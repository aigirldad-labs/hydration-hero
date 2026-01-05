import { HydrationDataProvider, UserProfile, DailyHydrationRecord, StreakStats } from './types';

const KEYS = {
  userProfile: 'stayHydrated.userProfile',
  dailyRecords: 'stayHydrated.dailyRecords',
  streakStats: 'stayHydrated.streakStats',
  schemaVersion: 'stayHydrated.schemaVersion',
};

export class LocalStorageHydrationProvider implements HydrationDataProvider {
  constructor() {
    // Initialize schema version if not present
    if (!localStorage.getItem(KEYS.schemaVersion)) {
      localStorage.setItem(KEYS.schemaVersion, '1');
    }
  }

  async getUserProfile(): Promise<UserProfile | null> {
    const data = localStorage.getItem(KEYS.userProfile);
    if (!data) return null;
    try {
      return JSON.parse(data) as UserProfile;
    } catch {
      return null;
    }
  }

  async saveUserProfile(profile: UserProfile): Promise<void> {
    localStorage.setItem(KEYS.userProfile, JSON.stringify(profile));
  }

  async getDailyRecords(): Promise<DailyHydrationRecord[]> {
    const data = localStorage.getItem(KEYS.dailyRecords);
    if (!data) return [];
    try {
      return JSON.parse(data) as DailyHydrationRecord[];
    } catch {
      return [];
    }
  }

  async upsertDailyRecord(record: DailyHydrationRecord): Promise<void> {
    const records = await this.getDailyRecords();
    const existingIndex = records.findIndex(r => r.date === record.date);
    
    if (existingIndex >= 0) {
      records[existingIndex] = record;
    } else {
      records.push(record);
    }
    
    // Keep only last 365 days
    records.sort((a, b) => b.date.localeCompare(a.date));
    const trimmed = records.slice(0, 365);
    
    localStorage.setItem(KEYS.dailyRecords, JSON.stringify(trimmed));
  }

  async getStreakStats(): Promise<StreakStats> {
    const data = localStorage.getItem(KEYS.streakStats);
    if (!data) return { longestStreakDays: 0 };
    try {
      return JSON.parse(data) as StreakStats;
    } catch {
      return { longestStreakDays: 0 };
    }
  }

  async saveStreakStats(stats: StreakStats): Promise<void> {
    localStorage.setItem(KEYS.streakStats, JSON.stringify(stats));
  }
}

// Singleton instance
export const hydrationProvider = new LocalStorageHydrationProvider();
