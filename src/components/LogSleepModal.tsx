'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  Zap,
  Clock,
  Calendar,
  Sparkles,
  Coffee,
  Smartphone,
  Wine,
  Dumbbell,
  Utensils,
  AlertCircle,
  BookOpen,
  ThermometerSnowflake,
  Droplets,
  Pill,
  Shield,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SleepSession, SleepTagId } from '@/types/sleep';
import { SLEEP_TAGS } from '@/lib/circadian';
import confetti from 'canvas-confetti';

interface LogSleepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (session: SleepSession) => void;
  initialBedtime?: string;
  initialWakeTime?: string;
  editingSession?: SleepSession | null;
}

const TAG_ICONS: Record<string, any> = {
  Coffee,
  Smartphone,
  Wine,
  Dumbbell,
  Utensils,
  AlertCircle,
  Sparkles,
  BookOpen,
  ThermometerSnowflake,
  Droplets,
  Pill,
  Shield,
};

export function LogSleepModal({
  isOpen,
  onClose,
  onSave,
  initialBedtime,
  initialWakeTime,
  editingSession,
}: LogSleepModalProps) {
  const [date, setDate] = useState<string>('');
  const [bedtimeTime, setBedtimeTime] = useState<string>('23:00');
  const [wakeTimeTime, setWakeTimeTime] = useState<string>('07:00');
  const [quality, setQuality] = useState<number>(4);
  const [energyLevel, setEnergyLevel] = useState<number>(4);
  const [latencyMinutes, setLatencyMinutes] = useState<number>(15);
  const [selectedTags, setSelectedTags] = useState<SleepTagId[]>(['room_cool', 'reading']);
  const [notes, setNotes] = useState<string>('');
  const [dreamNotes, setDreamNotes] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Lock background body scroll when modal is open to prevent scroll-bleed on mobile Safari/Android
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (editingSession) {
      setDate(editingSession.date);
      const b = new Date(editingSession.bedtime);
      const w = new Date(editingSession.wakeTime);
      setBedtimeTime(
        `${String(b.getHours()).padStart(2, '0')}:${String(b.getMinutes()).padStart(2, '0')}`
      );
      setWakeTimeTime(
        `${String(w.getHours()).padStart(2, '0')}:${String(w.getMinutes()).padStart(2, '0')}`
      );
      setQuality(editingSession.quality);
      setEnergyLevel(editingSession.energyLevel);
      setLatencyMinutes(editingSession.latencyMinutes);
      setSelectedTags(editingSession.tags);
      setNotes(editingSession.notes || '');
      setDreamNotes(editingSession.dreamNotes || '');
      setShowAdvanced(true);
    } else {
      const now = new Date();
      setDate(now.toISOString().split('T')[0]);

      if (initialBedtime && initialWakeTime) {
        const b = new Date(initialBedtime);
        const w = new Date(initialWakeTime);
        setBedtimeTime(
          `${String(b.getHours()).padStart(2, '0')}:${String(b.getMinutes()).padStart(2, '0')}`
        );
        setWakeTimeTime(
          `${String(w.getHours()).padStart(2, '0')}:${String(w.getMinutes()).padStart(2, '0')}`
        );
      } else {
        setBedtimeTime('23:00');
        setWakeTimeTime('07:00');
      }
      setQuality(4);
      setEnergyLevel(4);
      setLatencyMinutes(15);
      setSelectedTags(['room_cool', 'shower_warm']);
      setNotes('');
      setDreamNotes('');
      setShowAdvanced(false);
    }
  }, [isOpen, editingSession, initialBedtime, initialWakeTime]);

  if (!isOpen) return null;

  const calculateDuration = () => {
    const [bH, bM] = bedtimeTime.split(':').map(Number);
    const [wH, wM] = wakeTimeTime.split(':').map(Number);
    let startMins = bH * 60 + bM;
    let endMins = wH * 60 + wM;
    if (endMins <= startMins) {
      endMins += 24 * 60;
    }
    const diff = endMins - startMins;
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;
    const cycles = (diff / 90).toFixed(1);
    return { diff, hours, mins, cycles };
  };

  const { diff, hours, mins, cycles } = calculateDuration();

  const toggleTag = (tagId: SleepTagId) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const applyPreset = (bed: string, wake: string) => {
    setBedtimeTime(bed);
    setWakeTimeTime(wake);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const [bH, bM] = bedtimeTime.split(':').map(Number);
    const [wH, wM] = wakeTimeTime.split(':').map(Number);

    const baseDate = new Date(date);
    const bedDate = new Date(baseDate);
    bedDate.setHours(bH, bM, 0, 0);

    const wakeDate = new Date(baseDate);
    wakeDate.setHours(wH, wM, 0, 0);
    if (wakeDate.getTime() <= bedDate.getTime()) {
      wakeDate.setDate(wakeDate.getDate() + 1);
    }

    const session: SleepSession = {
      id: editingSession?.id || `session_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      date,
      bedtime: bedDate.toISOString(),
      wakeTime: wakeDate.toISOString(),
      durationMinutes: diff,
      quality,
      energyLevel,
      latencyMinutes,
      tags: selectedTags,
      notes: notes.trim() || undefined,
      dreamNotes: dreamNotes.trim() || undefined,
      createdAt: editingSession?.createdAt || new Date().toISOString(),
    };

    onSave(session);

    if (quality >= 4 && diff >= 420) {
      try {
        confetti({
          particleCount: 55,
          spread: 65,
          origin: { y: 0.7 },
          colors: ['#F59E0B', '#FBBF24', '#6366F1', '#38BDF8'],
        });
      } catch {}
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md overscroll-contain animate-fadeIn">
      {/* Modal Container: Flex column with fixed header & sticky footer for mobile */}
      <div className="relative w-full max-w-lg h-[88vh] sm:h-auto sm:max-h-[85vh] flex flex-col rounded-t-[28px] sm:rounded-3xl bg-[#0A1329] border border-amber-400/25 shadow-2xl shadow-indigo-950/80 overflow-hidden overscroll-contain text-slate-100">
        
        {/* Mobile Drag Indicator */}
        <div className="w-12 h-1.5 bg-amber-400/30 rounded-full mx-auto mt-2.5 sm:hidden shrink-0" />

        {/* Sticky Header with Van Gogh Starry Night badge */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 shrink-0 bg-[#0A1329]/95 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-300 flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <span>{editingSession ? 'Chỉnh sửa giấc ngủ' : 'Ghi nhận giấc ngủ'}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Đêm đầy sao
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Lưu lại thời lượng & nhịp sinh học
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body: min-h-0 is CRITICAL for Safari/WebKit flexbox inner scrolling */}
        <form
          id="log-sleep-form"
          onSubmit={handleSubmit}
          className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-5 overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* Quick Presets for Mobile: 1-Tap Fast Selection */}
          <div>
            <span className="block text-xs font-bold text-slate-400 mb-2">⭐ Chọn nhanh 1 chạm:</span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => applyPreset('23:00', '07:00')}
                className="h-10 px-3.5 rounded-xl bg-slate-900/90 border border-amber-400/30 hover:border-amber-400 text-xs font-semibold text-amber-200 hover:text-amber-100 whitespace-nowrap transition-colors shrink-0 cursor-pointer"
              >
                🌙 23:00 → 07:00 (8h)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('22:30', '06:30')}
                className="h-10 px-3.5 rounded-xl bg-slate-900/90 border border-amber-400/30 hover:border-amber-400 text-xs font-semibold text-amber-200 hover:text-amber-100 whitespace-nowrap transition-colors shrink-0 cursor-pointer"
              >
                ✨ 22:30 → 06:30 (8h)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('00:00', '07:30')}
                className="h-10 px-3.5 rounded-xl bg-slate-900/90 border border-amber-400/30 hover:border-amber-400 text-xs font-semibold text-amber-200 hover:text-amber-100 whitespace-nowrap transition-colors shrink-0 cursor-pointer"
              >
                🦉 00:00 → 07:30 (7.5h)
              </button>
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-400" /> Ngày thức dậy
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={{ colorScheme: 'dark' }}
              className="w-full h-12 px-4 rounded-xl bg-slate-900/90 border border-white/15 text-white text-base font-medium focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Bedtime & Wake Time Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-400" /> Giờ đi ngủ
              </label>
              <input
                type="time"
                value={bedtimeTime}
                onChange={(e) => setBedtimeTime(e.target.value)}
                required
                style={{ colorScheme: 'dark' }}
                className="w-full h-12 px-3 sm:px-4 rounded-xl bg-slate-900/90 border border-white/15 text-white font-mono text-base font-bold focus:outline-none focus:border-amber-400 text-center"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" /> Giờ thức dậy
              </label>
              <input
                type="time"
                value={wakeTimeTime}
                onChange={(e) => setWakeTimeTime(e.target.value)}
                required
                style={{ colorScheme: 'dark' }}
                className="w-full h-12 px-3 sm:px-4 rounded-xl bg-slate-900/90 border border-white/15 text-white font-mono text-base font-bold focus:outline-none focus:border-amber-400 text-center"
              />
            </div>
          </div>

          {/* Starry Night Duration Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0F1E44] via-[#13234F] to-[#0A1329] border border-amber-400/30 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-xs text-amber-200/80 block font-medium">Thời lượng ngủ:</span>
              <span className="font-extrabold text-2xl text-white tracking-tight">
                {hours}h {mins > 0 ? `${mins}p` : ''}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-amber-200/80 block font-medium">Chu kỳ 90P:</span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                {cycles} chu kỳ
              </span>
            </div>
          </div>

          {/* Sleep Quality (Stars): Glowing Van Gogh Gold */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Đánh giá chất lượng
              </span>
              <span className="text-amber-300 font-bold">
                {quality === 5
                  ? 'Tuyệt hảo (Sâu)'
                  : quality === 4
                  ? 'Ngon giấc'
                  : quality === 3
                  ? 'Bình thường'
                  : quality === 2
                  ? 'Chập chờn'
                  : 'Rất tệ'}
              </span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setQuality(star)}
                  className={`h-12 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                    star <= quality
                      ? 'border-amber-400/70 bg-amber-400/20 text-amber-400 shadow-sm shadow-amber-400/30'
                      : 'border-white/10 bg-slate-900/80 text-slate-600 hover:text-slate-400'
                  }`}
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= quality ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Collapsible Details: Thói quen & Ghi chú (helps keep form compact & clean on mobile) */}
          <div className="pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-white/10 hover:border-amber-400/30 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span>Thói quen & Ghi chú nhật ký</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold">
                  {selectedTags.length} thói quen
                </span>
              </span>
              {showAdvanced ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {showAdvanced && (
              <div className="space-y-4 mt-4 animate-fadeIn">
                {/* Wake-up Energy Level (1-5) */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-emerald-400" /> Mức năng lượng sáng
                    </span>
                    <span className="text-emerald-400 font-bold">
                      {energyLevel === 5
                        ? '100% Tràn đầy sinh lực'
                        : energyLevel === 4
                        ? 'Tỉnh táo sảng khoái'
                        : energyLevel === 3
                        ? 'Bình thường'
                        : energyLevel === 2
                        ? 'Uể oải'
                        : 'Kiệt sức'}
                    </span>
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <button
                        type="button"
                        key={lvl}
                        onClick={() => setEnergyLevel(lvl)}
                        className={`h-11 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
                          lvl === energyLevel
                            ? 'border-emerald-500 bg-emerald-500/25 text-emerald-300'
                            : 'border-white/10 bg-slate-900 text-slate-400'
                        }`}
                      >
                        {lvl}/5
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sleep Latency Chips */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    Thời gian vào giấc ngủ:
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { mins: 10, label: '< 15p' },
                      { mins: 20, label: '15-30p' },
                      { mins: 40, label: '30-45p' },
                      { mins: 60, label: '> 1h' },
                    ].map((item) => (
                      <button
                        type="button"
                        key={item.mins}
                        onClick={() => setLatencyMinutes(item.mins)}
                        className={`h-11 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          latencyMinutes === item.mins
                            ? 'border-amber-400 bg-amber-400/20 text-amber-200'
                            : 'border-white/10 bg-slate-900 text-slate-400'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Habit Tags */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    Thói quen tác động tối qua:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SLEEP_TAGS.map((tag) => {
                      const isSelected = selectedTags.includes(tag.id);
                      const IconComponent = TAG_ICONS[tag.icon] || Sparkles;
                      return (
                        <button
                          type="button"
                          key={tag.id}
                          onClick={() => toggleTag(tag.id)}
                          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer min-h-[44px] ${
                            isSelected
                              ? tag.type === 'positive'
                                ? 'bg-emerald-500/25 border-emerald-500 text-emerald-200'
                                : tag.type === 'negative'
                                ? 'bg-rose-500/25 border-rose-500 text-rose-200'
                                : 'bg-amber-400/25 border-amber-400 text-amber-200'
                              : 'bg-slate-900/90 border-white/10 text-slate-300 hover:text-white'
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                          <span>{tag.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 ml-0.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Ghi chú chi tiết:
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ghi chú thêm về giấc mơ, nhiệt độ phòng hoặc cảm nhận..."
                    rows={2}
                    className="w-full p-3 rounded-xl bg-slate-900/90 border border-white/15 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Sticky Modal Footer: ALWAYS visible on mobile, above safe-area */}
        <div className="sticky bottom-0 z-20 flex items-center justify-between gap-3 p-4 sm:p-5 border-t border-amber-400/20 bg-[#0A1329]/95 backdrop-blur-md pb-[max(1.25rem,env(safe-area-inset-bottom))] shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="h-12 px-5 rounded-2xl border border-white/15 text-slate-300 hover:text-white hover:bg-white/5 text-sm font-semibold transition-colors cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="submit"
            form="log-sleep-form"
            className="btn-starry-gold h-12 px-7 rounded-2xl text-sm font-extrabold shadow-lg shadow-amber-500/30 transition-all cursor-pointer active:scale-95 flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Lưu giấc ngủ</span>
          </button>
        </div>
      </div>
    </div>
  );
}
