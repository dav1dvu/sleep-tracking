export type SleepTagId =
  | 'caffeine_late'
  | 'alcohol'
  | 'workout_late'
  | 'screen_bed'
  | 'meditation'
  | 'melatonin'
  | 'reading'
  | 'room_cool'
  | 'high_stress'
  | 'heavy_meal'
  | 'shower_warm'
  | 'earplugs';

export interface SleepTag {
  id: SleepTagId;
  label: string;
  icon: string;
  type: 'positive' | 'negative' | 'neutral';
  impactHint: string;
}

export interface SleepSession {
  id: string;
  date: string; // YYYY-MM-DD (ngày thức dậy hoặc đêm ngủ)
  bedtime: string; // ISO string
  wakeTime: string; // ISO string
  durationMinutes: number; // Tổng phút ngủ thực tế
  quality: number; // 1 to 5 stars
  energyLevel: number; // 1 to 5 (Mức năng lượng buổi sáng)
  latencyMinutes: number; // Thời gian trằn trọc chìm vào giấc (phút)
  tags: SleepTagId[];
  notes?: string;
  dreamNotes?: string;
  createdAt: string;
}

export interface CircadianProfile {
  targetHours: number; // mặc định 7.5 hoặc 8.0
  idealBedtime: string; // "23:00"
  idealWakeTime: string; // "06:30"
  fallAsleepBufferMinutes: number; // 14
  caffeineCurfewHoursBeforeBed: number; // 9
  dinnerCurfewHoursBeforeBed: number; // 3
  screenCurfewHoursBeforeBed: number; // 1
  soundVolume: number;
}

export interface SleepStats {
  averageDurationMinutes: number;
  totalSessions: number;
  sleepDebtHours: number; // Âm là thiếu ngủ, Dương là dư ngủ
  regularityScore: number; // 0 - 100% (Sleep Regularity Index)
  averageQuality: number; // 1 - 5
  averageEnergy: number; // 1 - 5
  averageLatency: number; // Phút
  bestNightDate?: string;
  chronotype: 'Cú Đêm 🦉' | 'Sơn Ca Ban Mai 🐦' | 'Nhịp Sinh Học Gấu 🐻';
}

export interface AiChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface WeeklyAuditReport {
  generatedAt: string;
  overallScore: number; // 0 - 100
  headline: string;
  chronotype: string;
  summary: string;
  keyInsights: string[];
  recommendedActions: string[];
  debtVerdict: string;
}
