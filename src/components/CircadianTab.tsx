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
  Info,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Flame,
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
    <div className="space-y-8 animate-fadeIn">
      {/* Intro Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Khoa học Nhịp sinh học & Chu kỳ Ultradian
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Bộ tính chu kỳ 90 Phút & Đồng hồ Curfew
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Giấc ngủ con người không diễn ra liên tục mà lặp lại theo từng chu kỳ ~90 phút. Thức dậy
            ở cuối chu kỳ REM sẽ giúp bạn tỉnh táo ngay lập tức mà không bị tình trạng uể oải, nhức
            đầu (Sleep Inertia).
          </p>
        </div>
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 90-Minute Sleep Cycle Calculator */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl">
        {/* Toggle Mode */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">Tính toán chu kỳ giấc ngủ</h3>
              <p className="text-xs text-slate-400">Đã bao gồm 14 phút trung bình chìm vào giấc ngủ</p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-white/10 text-xs font-medium w-full sm:w-auto">
            <button
              onClick={() => setCalcMode('wake')}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg transition-all ${
                calcMode === 'wake'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tôi muốn thức dậy lúc...
            </button>
            <button
              onClick={() => setCalcMode('bed')}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg transition-all ${
                calcMode === 'bed'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Nếu tôi ngủ ngay bây giờ...
            </button>
          </div>
        </div>

        {/* Input & Output */}
        <div className="mt-6">
          {calcMode === 'wake' ? (
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                <label className="text-sm font-medium text-slate-200 flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Chọn giờ bạn cần thức dậy buổi sáng:</span>
                </label>
                <input
                  type="time"
                  value={targetWakeTime}
                  onChange={(e) => setTargetWakeTime(e.target.value)}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-indigo-500/30 text-white font-mono text-base focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {bedOptions.map((opt) => (
                  <div
                    key={opt.cycles}
                    className={`p-5 rounded-2xl border transition-all relative ${
                      opt.isOptimal
                        ? 'bg-gradient-to-b from-indigo-950/60 to-purple-950/40 border-indigo-500/50 shadow-xl shadow-indigo-500/10 glow-indigo'
                        : 'bg-slate-900/40 border-white/5 hover:border-white/15'
                    }`}
                  >
                    {opt.recommendedTag && (
                      <span
                        className={`absolute top-4 right-4 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          opt.isOptimal
                            ? 'bg-indigo-500/30 text-indigo-200 border-indigo-400/40'
                            : 'bg-white/5 text-slate-300 border-white/10'
                        }`}
                      >
                        {opt.recommendedTag}
                      </span>
                    )}

                    <span className="text-xs text-slate-400 block mb-1">Nên ngủ lúc:</span>
                    <div className="font-mono text-3xl font-bold text-white tracking-tight mb-2">
                      {opt.timeString}
                    </div>

                    <div className="text-xs font-semibold text-indigo-300 mb-2">
                      {opt.cycles} chu kỳ • {(opt.durationMinutes / 60).toFixed(1)}h ngủ
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {opt.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <span className="text-sm font-medium text-slate-200 flex items-center gap-2">
                  <Moon className="w-4 h-4 text-purple-400" />
                  <span>Nếu bạn nhắm mắt chìm vào giấc ngủ bây giờ, hãy đặt chuông báo thức:</span>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {wakeOptions.map((opt) => (
                  <div
                    key={opt.cycles}
                    className={`p-5 rounded-2xl border transition-all relative ${
                      opt.isOptimal
                        ? 'bg-gradient-to-b from-purple-950/60 to-indigo-950/40 border-purple-500/50 shadow-xl shadow-purple-500/10 glow-indigo'
                        : 'bg-slate-900/40 border-white/5 hover:border-white/15'
                    }`}
                  >
                    {opt.recommendedTag && (
                      <span
                        className={`absolute top-4 right-4 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          opt.isOptimal
                            ? 'bg-purple-500/30 text-purple-200 border-purple-400/40'
                            : 'bg-white/5 text-slate-300 border-white/10'
                        }`}
                      >
                        {opt.recommendedTag}
                      </span>
                    )}

                    <span className="text-xs text-slate-400 block mb-1">Thức dậy lúc:</span>
                    <div className="font-mono text-3xl font-bold text-white tracking-tight mb-2">
                      {opt.timeString}
                    </div>

                    <div className="text-xs font-semibold text-purple-300 mb-2">
                      {opt.cycles} chu kỳ • {(opt.durationMinutes / 60).toFixed(1)}h ngủ thực
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {opt.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 24-Hour Biological Curfew Timeline */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">
                Lịch trình Curfew sinh học (Bio-Curfew)
              </h3>
              <p className="text-xs text-slate-400">
                Các mốc giờ vàng chuẩn bị cơ thể trước giờ đi ngủ mục tiêu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Giờ ngủ mục tiêu:</span>
            <input
              type="time"
              value={targetBedtime}
              onChange={(e) => setTargetBedtime(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Timeline Items */}
        <div className="space-y-4">
          {curfewTimeline.map((item, idx) => {
            const IconComp = CURFEW_ICONS[item.icon] || Info;
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-white/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-center shrink-0">
                    <IconComp className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-white">{item.label}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 font-mono">
                        Trước {item.hoursBefore}h
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{item.tip}</p>
                  </div>
                </div>

                <div className="font-mono text-lg font-bold text-amber-300 sm:text-right shrink-0">
                  {item.time}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Science Educational Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-indigo-500/20">
        <h3 className="font-semibold text-white text-base mb-3 flex items-center gap-2">
          <Info className="w-5 h-5 text-indigo-400" />
          <span>Tại sao ngủ 8.5 tiếng vẫn thấy mệt hơn ngủ 7.5 tiếng?</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Nếu bạn đặt chuông báo thức ở mốc 8.5 tiếng, đó chính là lúc bạn đang chìm trong giai đoạn{' '}
          <strong className="text-indigo-300">Deep Sleep (Ngủ sâu sóng chậm)</strong> của chu kỳ thứ
          6. Bị đánh thức giữa giai đoạn này khiến não bộ bị sốc, sóng não chậm chưa kịp chuyển dịch
          sang sóng nhanh, gây cảm giác choáng váng như "say rượu giấc ngủ". Ngược lại, thức dậy ở
          mốc <strong className="text-emerald-300">7.5 tiếng (đúng 5 chu kỳ tròn)</strong> giúp bạn
          bước ra khỏi giấc ngủ một cách hoàn toàn tự nhiên!
        </p>
      </div>
    </div>
  );
}
