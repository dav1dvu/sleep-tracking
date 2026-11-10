'use client';

import React, { useState } from 'react';
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-sm overscroll-contain animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[92dvh] sm:max-h-[88vh] flex flex-col rounded-t-[28px] sm:rounded-3xl bg-[#0B0F19] border border-white/10 shadow-2xl overflow-hidden overscroll-contain text-slate-100">
        {/* Sticky Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 shrink-0 bg-[#0B0F19]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/25 text-indigo-400 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Cài đặt mục tiêu</h3>
              <p className="text-xs text-slate-400">Tùy biến mục tiêu giấc ngủ</p>
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

        {/* Scrollable Form Body */}
        <form id="settings-form" onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 overscroll-contain">
          {/* Target Sleep Duration */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-indigo-400" /> Mục tiêu thời lượng mỗi đêm
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[7.0, 7.5, 8.0, 8.5, 9.0].map((h) => (
                <button
                  type="button"
                  key={h}
                  onClick={() => setTargetHours(h)}
                  className={`h-11 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
                    targetHours === h
                      ? 'border-indigo-500 bg-indigo-500/25 text-indigo-200'
                      : 'border-white/10 bg-slate-900 text-slate-400'
                  }`}
                >
                  {h}h
                </button>
              ))}
            </div>
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
                className="w-full h-12 px-3 rounded-xl bg-slate-900 border border-white/10 text-white font-mono text-base font-bold text-center focus:outline-none focus:border-indigo-500"
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
                className="w-full h-12 px-3 rounded-xl bg-slate-900 border border-white/10 text-white font-mono text-base font-bold text-center focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* AI Model Status */}
          <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-indigo-200">
                AI: Nemotron 3 Ultra 550B
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              Sẵn sàng
            </span>
          </div>

          {/* Data Backup & Reset */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <label className="block text-xs font-bold text-slate-300">Dữ liệu:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleExportJson}
                className="h-11 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-bold text-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4 text-indigo-400" />
                <span>Sao lưu JSON</span>
              </button>
              <button
                type="button"
                onClick={handleResetSeed}
                className="h-11 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-bold text-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-purple-400" />
                <span>Mẫu chuẩn</span>
              </button>
            </div>
          </div>
        </form>

        {/* Sticky Action Footer */}
        <div className="sticky bottom-0 z-20 flex items-center justify-between p-4 sm:p-5 border-t border-white/10 bg-[#0B0F19]/95 backdrop-blur-md pb-[max(1rem,env(safe-area-inset-bottom))] shrink-0">
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
              className="h-12 px-4 rounded-xl border border-white/10 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="submit"
              form="settings-form"
              className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
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
