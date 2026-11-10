'use client';

import React, { useState } from 'react';
import {
  X,
  Settings,
  Target,
  Clock,
  Key,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  Check,
  ShieldCheck,
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
  const [customApiKey, setCustomApiKey] = useState<string>('');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg my-8 rounded-3xl bg-[#0B0F19] border border-white/10 shadow-2xl p-6 sm:p-8 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white">Cài đặt nhịp sinh học & Dữ liệu</h3>
              <p className="text-xs text-slate-400">Tùy biến mục tiêu giấc ngủ và lưu trữ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6 mt-6">
          {/* Target Sleep Duration */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-indigo-400" /> Mục tiêu thời lượng ngủ mỗi đêm (Giờ)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[7.0, 7.5, 8.0, 8.5, 9.0].map((h) => (
                <button
                  type="button"
                  key={h}
                  onClick={() => setTargetHours(h)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                    targetHours === h
                      ? 'border-indigo-500 bg-indigo-500/20 text-indigo-200 shadow-md shadow-indigo-500/15'
                      : 'border-white/5 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {h}h
                </button>
              ))}
            </div>
          </div>

          {/* Ideal Bedtime and Wake time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-400" /> Giờ ngủ lý tưởng
              </label>
              <input
                type="time"
                value={idealBedtime}
                onChange={(e) => setIdealBedtime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" /> Giờ dậy lý tưởng
              </label>
              <input
                type="time"
                value={idealWakeTime}
                onChange={(e) => setIdealWakeTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* AI Model Status */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" /> Mô hình AI Bác sĩ Giấc ngủ
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Hoạt động
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono">
              nvidia/nemotron-3-ultra-550b-a55b:free
            </p>
            <p className="text-[11px] text-slate-400">
              Được tích hợp sẵn bảo mật thông qua OpenRouter API.
            </p>
          </div>

          {/* Data Backup & Reset */}
          <div className="pt-2 border-t border-white/10 space-y-3">
            <label className="block text-xs font-medium text-slate-300">Quản lý dữ liệu:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleExportJson}
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-medium text-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>Sao lưu JSON</span>
              </button>
              <button
                type="button"
                onClick={handleResetSeed}
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-medium text-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
                <span>Dữ liệu mẫu chuẩn</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa sạch dữ liệu</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 text-xs font-medium transition-colors"
              >
                Đóng
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {isSaved ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{isSaved ? 'Đã lưu!' : 'Lưu cài đặt'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
