import { CircadianProfile, SleepSession } from '@/types/sleep';

const STORAGE_KEY_SESSIONS = 'somna_sleep_sessions_v1';
const STORAGE_KEY_PROFILE = 'somna_circadian_profile_v1';
const STORAGE_KEY_ACTIVE_SLEEP = 'somna_active_sleep_v1';
const STORAGE_KEY_BRAIN_DUMP = 'somna_brain_dump_notes_v1';

export const DEFAULT_PROFILE: CircadianProfile = {
  targetHours: 8.0,
  idealBedtime: '23:00',
  idealWakeTime: '07:00',
  fallAsleepBufferMinutes: 14,
  caffeineCurfewHoursBeforeBed: 9,
  dinnerCurfewHoursBeforeBed: 3.5,
  screenCurfewHoursBeforeBed: 1,
  soundVolume: 0.65,
};

// Dữ liệu mẫu chuẩn lâm sàng để hiển thị biểu đồ và phân tích ngay khi mở ứng dụng
export function generateSeedSessions(): SleepSession[] {
  const seed: SleepSession[] = [];
  const now = new Date();

  const sampleDays = [
    { offset: 0, bed: '23:15', wake: '07:10', dur: 475, q: 5, e: 5, lat: 12, tags: ['room_cool', 'meditation', 'shower_warm'] },
    { offset: 1, bed: '23:45', wake: '06:45', dur: 420, q: 4, e: 4, lat: 18, tags: ['reading', 'earplugs'] },
    { offset: 2, bed: '00:30', wake: '06:30', dur: 360, q: 3, e: 2, lat: 35, tags: ['caffeine_late', 'screen_bed'] },
    { offset: 3, bed: '22:50', wake: '07:00', dur: 490, q: 5, e: 5, lat: 10, tags: ['meditation', 'room_cool', 'shower_warm'] },
    { offset: 4, bed: '01:15', wake: '07:45', dur: 390, q: 2, e: 2, lat: 40, tags: ['alcohol', 'heavy_meal', 'screen_bed'] },
    { offset: 5, bed: '23:00', wake: '07:30', dur: 510, q: 5, e: 4, lat: 15, tags: ['reading', 'room_cool'] },
    { offset: 6, bed: '23:30', wake: '07:15', dur: 465, q: 4, e: 4, lat: 20, tags: ['shower_warm'] },
    { offset: 7, bed: '00:00', wake: '08:00', dur: 480, q: 4, e: 4, lat: 22, tags: ['reading'] },
    { offset: 8, bed: '00:45', wake: '07:00', dur: 375, q: 3, e: 3, lat: 30, tags: ['workout_late', 'screen_bed'] },
    { offset: 9, bed: '23:10', wake: '07:20', dur: 490, q: 5, e: 5, lat: 12, tags: ['meditation', 'room_cool'] },
  ];

  sampleDays.forEach((item, index) => {
    const sessionDate = new Date(now.getTime() - item.offset * 24 * 60 * 60 * 1000);
    const dateStr = sessionDate.toISOString().split('T')[0];

    const [bH, bM] = item.bed.split(':').map(Number);
    const [wH, wM] = item.wake.split(':').map(Number);

    const bedDate = new Date(sessionDate);
    bedDate.setHours(bH, bM, 0, 0);
    if (bH >= 0 && bH <= 4) {
      // Giờ đi ngủ sau nửa đêm
      bedDate.setDate(bedDate.getDate() + 1);
    }

    const wakeDate = new Date(bedDate);
    wakeDate.setHours(wH, wM, 0, 0);
    if (wakeDate.getTime() <= bedDate.getTime()) {
      wakeDate.setDate(wakeDate.getDate() + 1);
    }

    seed.push({
      id: `seed_session_${index}_${dateStr}`,
      date: dateStr,
      bedtime: bedDate.toISOString(),
      wakeTime: wakeDate.toISOString(),
      durationMinutes: item.dur,
      quality: item.q,
      energyLevel: item.e,
      latencyMinutes: item.lat,
      tags: item.tags as any,
      notes: index === 0 ? 'Cảm thấy rất sảng khoái và tràn đầy năng lượng!' : undefined,
      createdAt: wakeDate.toISOString(),
    });
  });

  return seed;
}

export function getStoredSessions(): SleepSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSIONS);
    if (!raw) {
      const initial = generateSeedSessions();
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error reading sleep sessions:', e);
    return [];
  }
}

export function saveSession(session: SleepSession): SleepSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getStoredSessions();
    const existingIndex = current.findIndex((s) => s.id === session.id);
    let updated: SleepSession[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = session;
    } else {
      updated = [session, ...current];
    }
    // Sắp xếp giảm dần theo ngày thức dậy
    updated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving sleep session:', e);
    return [];
  }
}

export function deleteSession(id: string): SleepSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getStoredSessions();
    const filtered = current.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(filtered));
    return filtered;
  } catch (e) {
    console.error('Error deleting session:', e);
    return [];
  }
}

export function getCircadianProfile(): CircadianProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveCircadianProfile(profile: CircadianProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving profile:', e);
  }
}

export function getActiveSleepStart(): number | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACTIVE_SLEEP);
    return raw ? Number(raw) : null;
  } catch {
    return null;
  }
}

export function setActiveSleepStart(timestamp: number | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (timestamp === null) {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_SLEEP);
    } else {
      localStorage.setItem(STORAGE_KEY_ACTIVE_SLEEP, String(timestamp));
    }
  } catch (e) {
    console.error('Error updating active sleep state:', e);
  }
}

export function getStoredBrainDump(): string {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(STORAGE_KEY_BRAIN_DUMP) || '';
  } catch {
    return '';
  }
}

export function saveStoredBrainDump(text: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_BRAIN_DUMP, text);
  } catch (e) {
    console.error('Error saving brain dump:', e);
  }
}
