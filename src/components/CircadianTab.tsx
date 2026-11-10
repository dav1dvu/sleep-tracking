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
} from 'lucide-react';
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

export function CircadianTab() {
  const [calcMode, setCalcMode] = useState<'wake' | 'bed'>('wake');
  const [targetWakeTime, setTargetWakeTime] = useState<string>('06:30');
  const [targetBedtime, setTargetBedtime] = useState<string>('23:00');
  const [wakeOptions, setWakeOptions] = useState<any[]>([]);
  const [curfewTimeline, setCurfewTimeline] = useState<any[]>([]);

  const bedOptions = calculateBedtimesFromWakeTime(targetWakeTime);

  useEffect(() => {
    setWakeOptions(calculateWakeTimesFromNow());
    setCurfewTimeline(calculateCurfewTimeline(targetBedtime));
  }, [targetBedtime]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-20 md:pb-8">
      {/* Header */}
      <div className="glass-panel p-5 sm:p-7 rounded-3xl">
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Bộ tính chu kỳ ngủ 90 Phút
        </h2>
        <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
          Giấc ngủ diễn ra theo từng chu kỳ ~90 phút. Thức dậy ở cuối chu kỳ giúp não bộ sảng khoái tức thì, không bị choáng váng.
        </p>
      </div>

      {/* Calculator Component */}
      <div className="glass-panel p-5 sm:p-7 rounded-3xl">
        {/* Toggle Mode Segmented Control: 48px height, easy to tap */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-900 rounded-2xl border border-white/10 mb-6">
          <button
            onClick={() => setCalcMode('wake')}
            className={`h-12 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              calcMode === 'wake'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-400" />
            <span>Tôi muốn dậy lúc...</span>
          </button>
          <button
            onClick={() => setCalcMode('bed')}
            className={`h-12 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              calcMode === 'bed'
                ? 'bg-indigo-600 text-white shadow-md'
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-white/10">
              <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-400" />
                <span>Giờ bạn cần thức dậy:</span>
              </label>
              <input
                type="time"
                value={targetWakeTime}
                onChange={(e) => setTargetWakeTime(e.target.value)}
                className="h-12 px-4 rounded-xl bg-slate-800 border border-indigo-500/40 text-white font-mono text-xl font-bold focus:outline-none focus:border-indigo-400 text-center sm:text-left"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {bedOptions.map((opt) => (
                <div
                  key={opt.cycles}
                  className={`p-5 rounded-2xl border transition-all ${
                    opt.isOptimal
                      ? 'bg-indigo-950/70 border-indigo-400/60 shadow-lg shadow-indigo-500/20'
                      : 'bg-slate-900/60 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400 font-medium">Giờ đi ngủ:</span>
                    {opt.recommendedTag && (
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                          opt.isOptimal
                            ? 'bg-indigo-500/30 text-indigo-200 border-indigo-400/50'
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

                  <div className="text-sm font-bold text-indigo-300">
                    {opt.cycles} chu kỳ • {(opt.durationMinutes / 60).toFixed(1)}h ngủ
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-sm text-slate-300 font-medium">
              Nếu bạn nhắm mắt ngủ ngay bây giờ, hãy đặt chuông báo thức vào một trong các mốc sau:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {wakeOptions.map((opt) => (
                <div
                  key={opt.cycles}
                  className={`p-5 rounded-2xl border transition-all ${
                    opt.isOptimal
                      ? 'bg-purple-950/70 border-purple-400/60 shadow-lg shadow-purple-500/20'
                      : 'bg-slate-900/60 border-white/10'
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
      <div className="glass-panel p-5 sm:p-7 rounded-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <span>Lịch trình Curfew sinh học</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Chuẩn bị cơ thể trước giờ đi ngủ
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Giờ ngủ dự kiến:</span>
            <input
              type="time"
              value={targetBedtime}
              onChange={(e) => setTargetBedtime(e.target.value)}
              className="h-10 px-3 rounded-xl bg-slate-900 border border-white/10 text-white font-mono text-sm font-bold focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div className="space-y-3">
          {curfewTimeline.map((item, idx) => {
            const IconComp = CURFEW_ICONS[item.icon] || Sparkles;
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center shrink-0">
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
