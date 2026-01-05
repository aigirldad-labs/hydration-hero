export interface UserProfile {
  weightLbs: number;
  createdAt: string;
  updatedAt: string;
}

export interface DailyHydrationRecord {
  date: string; // YYYY-MM-DD
  goalOz: number;
  consumedOz: number;
  completedAt: string | null;
}

export interface StreakStats {
  longestStreakDays: number;
}

export interface HydrationDataProvider {
  getUserProfile(): Promise<UserProfile | null>;
  saveUserProfile(profile: UserProfile): Promise<void>;
  getDailyRecords(): Promise<DailyHydrationRecord[]>;
  upsertDailyRecord(record: DailyHydrationRecord): Promise<void>;
  getStreakStats(): Promise<StreakStats>;
  saveStreakStats(stats: StreakStats): Promise<void>;
}

export type ModalType = 'none' | 'daily' | 'streak7' | 'streak30';
