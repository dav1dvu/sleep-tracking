'use client';

import React, { useState, useEffect } from 'react';
import {
  Clock,
  Sparkles,
  Sun,
  Moon,
  Coffee,
  Utensils,
  Dumbbell,
  EyeOff,
  Flame,
  Check,
  RotateCw,
} from 'lucide-react';
import { CircadianProfile } from '@/types/sleep';
import {
  calculateBedtimesFromWakeTime,
  calculateWakeTimesFromNow,
  calculateCurfewTimeline,
} from '@/lib/circadian';

const CURFEW_ICONS: Record<string, any> = {
  Coffee,
  Utensils,
  Dumbbell,
  EyeOff,
  Moon,
};

interface CircadianTabProps {
  profile: CircadianProfile;
  onUpdateProfile?: (newProfile: CircadianProfile) => void;
}

export function CircadianTab({ profile, onUpdateProfile }: CircadianTabProps) {
  const [calcMode, setCalcMode] = useState<'wake' | 'bed'>('wake');
  const [targetWakeTime, setTargetWakeTime] = useState<string>(profile.idealWakeTime || '06:30');
  const [targetBedtime, setTargetBedtime] = useState<string>(profile.idealBedtime || '23:00');
  const [wakeOptions, setWakeOptions] = useState<any[]>([]);
  const [curfewTimeline, setCurfewTimeline] = useState<any[]>([]);
  const [isSynced, setIsSynced] = useState<boolean>(false);

  // Synchronize when profile updates from Settings
  useEffect(() => {
    if (profile.idealWakeTime) {
      setTargetWakeTime(profile.idealWakeTime);
    }
    if (profile.idealBedtime) {
      setTargetBedtime(profile.idealBedtime);
    }
  }, [profile.idealWakeTime, profile.idealBedtime]);

  const bedOptions = calculateBedtimesFromWakeTime(targetWakeTime);

  useEffect(() => {
    setWakeOptions(calculateWakeTimesFromNow());
    setCurfewTimeline(calculateCurfewTimeline(targetBedtime));
  }, [targetBedtime]);

  const handleSyncToProfile = () => {
    if (onUpdateProfile) {
      onUpdateProfile({
        ...profile,
        idealWakeTime: targetWakeTime,
        idealBedtime: targetBedtime,
      });
      setIsSynced(true);
      setTimeout(() => setIsSynced(false), 2000);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-24 md:pb-8">
      {/* Header with Starry Night Glow */}
      <div className="glass-panel p-5 sm:p-7 rounded-3xl border border-amber-400/20 bg-gradient-to-r from-[#0A1329]/90 via-[#0F1E44]/80 to-[#0A1329]/90 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Chu kỳ 90 Phút & Curfew Nhịp Sinh Học</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Bộ tính chu kỳ & Lịch trình chuẩn y sinh
            </h2>
            <p className="text-sm text-slate-300 mt-1.5 leading-relaxed max-w-2xl">
              Đồng bộ trực tiếp với mục tiêu ngủ trong Cài đặt ({profile.idealBedtime} → {profile.idealWakeTime}). Thức giấc ở cuối chu kỳ 90p giúp cơ thể tràn trề năng lượng.
            </p>
          </div>

          {/* Sync Status Badge & Action */}
          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            <button
              onClick={handleSyncToProfile}
              className={`h-11 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isSynced
                  ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 shadow-md shadow-emerald-500/20'
                  : 'bg-amber-400/15 hover:bg-amber-400/25 border-amber-400/30 text-amber-300'
              }`}
            >
              {isSynced ? <Check className="w-4 h-4 text-emerald-400" /> : <RotateCw className="w-4 h-4 text-amber-400" />}
              <span>{isSynced ? 'Đã đồng bộ vào Cài đặt!' : 'Lưu làm giờ lý tưởng'}</span>
            </button>
            <span className="text-xs text-slate-400">
              Đang liên kết: Ngủ <span className="text-amber-300 font-bold">{targetBedtime}</span> • Dậy <span className="text-amber-300 font-bold">{targetWakeTime}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Calculator Component */}
      <div className="glass-panel p-5 sm:p-7 rounded-3xl border border-amber-400/20">
        {/* Toggle Mode Segmented Control: 48px height, easy to tap */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#070B18] rounded-2xl border border-white/10 mb-6">
          <button
            onClick={() => setCalcMode('wake')}
            className={`h-12 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              calcMode === 'wake'
                ? 'btn-starry-gold text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-900" />
            <span>Tôi muốn dậy lúc...</span>
          </button>
          <button
            onClick={() => setCalcMode('bed')}
            className={`h-12 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              calcMode === 'bed'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Moon className="w-4 h-4 text-purple-400" />
            <span>Ngủ ngay bây giờ</span>
          </button>
        </div>

        {/* Mode Content */}
        {calcMode === 'wake' ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#0A1329] border border-amber-400/30">
              <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-400" />
                <span>Giờ bạn cần thức dậy (đồng bộ từ mục tiêu):</span>
              </label>
              <input
                type="time"
                value={targetWakeTime}
                onChange={(e) => setTargetWakeTime(e.target.value)}
                style={{ colorScheme: 'dark' }}
                className="h-12 px-4 rounded-xl bg-slate-900 border border-amber-400/50 text-white font-mono text-xl font-bold focus:outline-none focus:border-amber-300 text-center sm:text-left"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {bedOptions.map((opt) => (
                <div
                  key={opt.cycles}
                  className={`p-5 rounded-2xl border transition-all ${
                    opt.isOptimal
                      ? 'bg-gradient-to-b from-[#13234F] to-[#0A1329] border-amber-400/60 shadow-lg shadow-amber-500/15'
                      : 'bg-[#0A1329]/80 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400 font-medium">Giờ đi ngủ:</span>
                    {opt.recommendedTag && (
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                          opt.isOptimal
                            ? 'bg-amber-400/20 text-amber-300 border-amber-400/50'
                            : 'bg-white/10 text-slate-300 border-white/10'
                        }`}
                      >
                        {opt.recommendedTag}
                      </span>
                    )}
                  </div>

                  <div className="font-mono text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
                    {opt.timeString}
                  </div>

                  <div className="text-sm font-bold text-amber-300">
                    {opt.cycles} chu kỳ • {(opt.durationMinutes / 60).toFixed(1)}h ngủ
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-sm text-slate-300 font-medium">
              Nếu bạn nhắm mắt ngủ ngay bây giờ, hãy đặt chuông báo thức vào một trong các mốc sau để thức dậy đúng pha ngủ REM:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {wakeOptions.map((opt) => (
                <div
                  key={opt.cycles}
                  className={`p-5 rounded-2xl border transition-all ${
                    opt.isOptimal
                      ? 'bg-gradient-to-b from-[#1E1B4B] to-[#0A1329] border-purple-400/60 shadow-lg shadow-purple-500/20'
                      : 'bg-[#0A1329]/80 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400 font-medium">Giờ thức dậy:</span>
                    {opt.recommendedTag && (
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                          opt.isOptimal
                            ? 'bg-purple-500/30 text-purple-200 border-purple-400/50'
                            : 'bg-white/10 text-slate-300 border-white/10'
                        }`}
                      >
                        {opt.recommendedTag}
                      </span>
                    )}
                  </div>

                  <div className="font-mono text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
                    {opt.timeString}
                  </div>

                  <div className="text-sm font-bold text-purple-300">
                    {opt.cycles} chu kỳ • {(opt.durationMinutes / 60).toFixed(1)}h ngủ
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Curfew Timeline: Clean, legible list with big times */}
      <div className="glass-panel p-5 sm:p-7 rounded-3xl border border-amber-400/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <span>Lịch trình Curfew sinh học</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Thời điểm ngừng nạp chất kích thích & ánh sáng xanh trước giờ ngủ
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Giờ ngủ dự kiến:</span>
            <input
              type="time"
              value={targetBedtime}
              onChange={(e) => setTargetBedtime(e.target.value)}
              style={{ colorScheme: 'dark' }}
              className="h-11 px-3 rounded-xl bg-slate-900 border border-amber-400/40 text-white font-mono text-sm font-bold focus:outline-none focus:border-amber-300"
            />
          </div>
        </div>

        <div className="space-y-3">
          {curfewTimeline.map((item, idx) => {
            const IconComp = CURFEW_ICONS[item.icon] || Sparkles;
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#0A1329]/80 border border-white/10 flex items-center justify-between gap-3 hover:border-amber-400/30 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#0F1E44] border border-amber-400/25 flex items-center justify-center shrink-0">
                    <IconComp className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{item.label}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{item.tip}</p>
                  </div>
                </div>

                <div className="font-mono text-xl font-extrabold text-amber-300 shrink-0">
                  {item.time}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
