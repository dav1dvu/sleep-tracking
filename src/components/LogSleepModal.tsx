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
        setBedtimeTime('23:15');
        setWakeTimeTime('07:15');
      }
      setQuality(4);
      setEnergyLevel(4);
      setLatencyMinutes(15);
      setSelectedTags(['room_cool', 'shower_warm']);
      setNotes('');
      setDreamNotes('');
    }
  }, [isOpen, editingSession, initialBedtime, initialWakeTime]);

  if (!isOpen) return null;

  // Tính tổng phút và số chu kỳ 90p
  const calculateDuration = () => {
    const [bH, bM] = bedtimeTime.split(':').map(Number);
    const [wH, wM] = wakeTimeTime.split(':').map(Number);
    let startMins = bH * 60 + bM;
    let endMins = wH * 60 + wM;
    if (endMins <= startMins) {
      endMins += 24 * 60; // Qua nửa đêm
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

    // Kích hoạt pháo hoa nhẹ ăn mừng nếu ngủ ngon
    if (quality >= 4 && diff >= 420) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#6366F1', '#A855F7', '#F59E0B'],
        });
      } catch {}
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl my-8 rounded-3xl bg-[#0B0F19] border border-white/10 shadow-2xl p-6 sm:p-8 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white">
                {editingSession ? 'Chỉnh sửa giấc ngủ' : 'Ghi nhận giấc ngủ'}
              </h3>
              <p className="text-xs text-slate-400">
                Lưu lại các chỉ số phục hồi và thói quen ban đêm
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Date Picker */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-400" /> Ngày thức dậy
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Bedtime & Wake Time Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-400" /> Giờ đi ngủ
              </label>
              <input
                type="time"
                value={bedtimeTime}
                onChange={(e) => setBedtimeTime(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" /> Giờ thức dậy
              </label>
              <input
                type="time"
                value={wakeTimeTime}
                onChange={(e) => setWakeTimeTime(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Calculated Duration Banner */}
          <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 flex items-center justify-between">
            <div>
              <span className="text-xs text-indigo-300 block">Thời lượng thực tế:</span>
              <span className="font-semibold text-lg text-white">
                {hours} giờ {mins > 0 ? `${mins} phút` : ''}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-indigo-300 block">Chu kỳ 90 phút:</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-200 border border-indigo-500/30">
                {cycles} chu kỳ
              </span>
            </div>
          </div>

          {/* Sleep Quality (Stars) */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400/20" /> Chất lượng giấc ngủ
              </span>
              <span className="text-amber-400 font-semibold">
                {quality === 5
                  ? 'Tuyệt hảo (Sâu & Liền mạch)'
                  : quality === 4
                  ? 'Ngon giấc'
                  : quality === 3
                  ? 'Bình thường'
                  : quality === 2
                  ? 'Chập chờn'
                  : 'Rất tệ / Mất ngủ'}
              </span>
            </label>
            <div className="flex items-center gap-2 sm:gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setQuality(star)}
                  className={`flex-1 py-2.5 rounded-xl border flex items-center justify-center transition-all ${
                    star <= quality
                      ? 'border-amber-400/50 bg-amber-500/10 text-amber-400 shadow-md shadow-amber-500/10'
                      : 'border-white/5 bg-slate-900/60 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= quality ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Wake-up Energy Level (1-5) */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-400" /> Mức năng lượng sáng nay
              </span>
              <span className="text-emerald-400 font-semibold">
                {energyLevel === 5
                  ? '100% Tràn đầy sinh lực'
                  : energyLevel === 4
                  ? 'Tỉnh táo & Sảng khoái'
                  : energyLevel === 3
                  ? 'Bình thường'
                  : energyLevel === 2
                  ? 'Uể oải / Muốn ngủ tiếp'
                  : 'Kiệt sức / Đau đầu'}
              </span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setEnergyLevel(lvl)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    lvl === energyLevel
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-md shadow-emerald-500/10'
                      : 'border-white/5 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lvl} / 5
                </button>
              ))}
            </div>
          </div>

          {/* Sleep Latency Chips */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Thời gian trằn trọc chìm vào giấc ngủ:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { mins: 10, label: '< 15 phút' },
                { mins: 20, label: '15-30 phút' },
                { mins: 40, label: '30-45 phút' },
                { mins: 60, label: '> 1 tiếng' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.mins}
                  onClick={() => setLatencyMinutes(item.mins)}
                  className={`py-2 px-1 rounded-xl text-xs font-medium border text-center transition-all ${
                    latencyMinutes === item.mins
                      ? 'border-indigo-500 bg-indigo-500/20 text-indigo-200'
                      : 'border-white/5 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Habit Tags */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Các yếu tố & thói quen tác động tối qua:
            </label>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
              {SLEEP_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag.id);
                const IconComponent = TAG_ICONS[tag.icon] || Sparkles;
                return (
                  <button
                    type="button"
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      isSelected
                        ? tag.type === 'positive'
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200'
                          : tag.type === 'negative'
                          ? 'bg-rose-500/20 border-rose-500/50 text-rose-200'
                          : 'bg-indigo-500/20 border-indigo-500/50 text-indigo-200'
                        : 'bg-slate-900/70 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{tag.label}</span>
                    {isSelected && <Check className="w-3 h-3 ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes & Dream Pad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Ghi chú nhật ký:
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ví dụ: Tối qua thức khuya làm việc, sáng nay dậy thấy hơi khô cổ..."
                rows={2}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Ghi nhớ giấc mơ (Dream Log):
              </label>
              <textarea
                value={dreamNotes}
                onChange={(e) => setDreamNotes(e.target.value)}
                placeholder="Mơ thấy bay lượn, cảnh biển yên bình..."
                rows={2}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 text-sm font-medium transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-all transform active:scale-95 cursor-pointer"
            >
              Lưu giấc ngủ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
