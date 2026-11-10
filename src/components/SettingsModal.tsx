'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Settings,
  Target,
  Clock,
  Download,
  RotateCcw,
  Trash2,
  Check,
  Sparkles,
} from 'lucide-react';
import { CircadianProfile, SleepSession } from '@/types/sleep';
import { generateSeedSessions } from '@/lib/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CircadianProfile;
  onSaveProfile: (newProfile: CircadianProfile) => void;
  sessions: SleepSession[];
  onUpdateSessions: (sessions: SleepSession[]) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  sessions,
  onUpdateSessions,
}: SettingsModalProps) {
  const [targetHours, setTargetHours] = useState<number>(profile.targetHours);
  const [idealBedtime, setIdealBedtime] = useState<string>(profile.idealBedtime);
  const [idealWakeTime, setIdealWakeTime] = useState<string>(profile.idealWakeTime);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTargetHours(profile.targetHours);
      setIdealBedtime(profile.idealBedtime);
      setIdealWakeTime(profile.idealWakeTime);
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...profile,
      targetHours,
      idealBedtime,
      idealWakeTime,
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  const handleExportJson = () => {
    const dataStr = JSON.stringify({ profile, sessions }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `somna-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleResetSeed = () => {
    if (confirm('Bạn có chắc muốn đặt lại dữ liệu mẫu chuẩn y sinh?')) {
      const seeds = generateSeedSessions();
      onUpdateSessions(seeds);
      localStorage.setItem('somna_sleep_sessions_v1', JSON.stringify(seeds));
    }
  };

  const handleClearAll = () => {
    if (confirm('CẢNH BÁO: Thao tác này sẽ xóa toàn bộ nhật ký giấc ngủ đã lưu?')) {
      onUpdateSessions([]);
      localStorage.removeItem('somna_sleep_sessions_v1');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md overscroll-contain animate-fadeIn">
      <div className="relative w-full max-w-lg h-[88vh] sm:h-auto sm:max-h-[85vh] flex flex-col rounded-t-[28px] sm:rounded-3xl bg-[#0A1329] border border-amber-400/25 shadow-2xl shadow-indigo-950/80 overflow-hidden overscroll-contain text-slate-100">
        
        {/* Mobile Drag Indicator */}
        <div className="w-12 h-1.5 bg-amber-400/30 rounded-full mx-auto mt-2.5 sm:hidden shrink-0" />

        {/* Sticky Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 shrink-0 bg-[#0A1329]/95 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-300 flex items-center justify-center shadow-sm">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <span>Cài đặt mục tiêu</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Starry Night
                </span>
              </h3>
              <p className="text-xs text-slate-400">Tùy biến mục tiêu & đồng bộ chu kỳ</p>
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

        {/* Scrollable Form Body with min-h-0 for Safari flex scrolling */}
        <form
          id="settings-form"
          onSubmit={handleSave}
          className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-5 overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* Target Sleep Duration: 5 choices 6h, 6.5h, 7h, 7.5h, 8h */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-amber-400" /> Mục tiêu thời lượng mỗi đêm
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[6.0, 6.5, 7.0, 7.5, 8.0].map((h) => (
                <button
                  type="button"
                  key={h}
                  onClick={() => setTargetHours(h)}
                  className={`h-12 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
                    targetHours === h
                      ? 'border-amber-400 bg-amber-400/20 text-amber-200 shadow-sm shadow-amber-400/30'
                      : 'border-white/10 bg-slate-900/80 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {h}h
                </button>
              ))}
            </div>
            <p className="text-xs text-amber-300/80 mt-1.5">
              ✨ Khuyến nghị y sinh: 7.5h (5 chu kỳ 90p) hoặc 8.0h lý tưởng nhất cho não bộ.
            </p>
          </div>

          {/* Ideal Bedtime and Wake time */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-400" /> Giờ ngủ lý tưởng
              </label>
              <input
                type="time"
                value={idealBedtime}
                onChange={(e) => setIdealBedtime(e.target.value)}
                style={{ colorScheme: 'dark' }}
                className="w-full h-12 px-3 rounded-xl bg-slate-900/90 border border-white/15 text-white font-mono text-base font-bold text-center focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" /> Giờ dậy lý tưởng
              </label>
              <input
                type="time"
                value={idealWakeTime}
                onChange={(e) => setIdealWakeTime(e.target.value)}
                style={{ colorScheme: 'dark' }}
                className="w-full h-12 px-3 rounded-xl bg-slate-900/90 border border-white/15 text-white font-mono text-base font-bold text-center focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* AI Model Status */}
          <div className="p-3.5 rounded-2xl bg-[#0D1B3E] border border-indigo-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-amber-200">
                AI: Nemotron 3 Ultra 550B
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              Sẵn sàng
            </span>
          </div>

          {/* Data Backup & Reset */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <label className="block text-xs font-bold text-slate-300">Dữ liệu & Sao lưu:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleExportJson}
                className="h-11 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-xs font-bold text-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Sao lưu JSON</span>
              </button>
              <button
                type="button"
                onClick={handleResetSeed}
                className="h-11 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-xs font-bold text-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-purple-400" />
                <span>Mẫu chuẩn</span>
              </button>
            </div>
          </div>
        </form>

        {/* Sticky Action Footer: ALWAYS visible above safe area */}
        <div className="sticky bottom-0 z-20 flex items-center justify-between p-4 sm:p-5 border-t border-amber-400/20 bg-[#0A1329]/95 backdrop-blur-md pb-[max(1.25rem,env(safe-area-inset-bottom))] shrink-0">
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer min-h-[44px] px-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Xóa sạch</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-12 px-4 rounded-xl border border-white/10 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="submit"
              form="settings-form"
              className="btn-starry-gold h-12 px-6 rounded-xl text-xs font-bold shadow-md shadow-amber-500/25 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              {isSaved ? <Check className="w-4 h-4" /> : null}
              <span>{isSaved ? 'Đã lưu!' : 'Lưu cài đặt'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
