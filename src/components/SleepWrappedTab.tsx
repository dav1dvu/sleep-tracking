'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  Sparkles,
  Download,
  Share2,
  Moon,
  Star,
  Zap,
  Calendar,
  Award,
  Flame,
  Check,
} from 'lucide-react';
import { SleepSession, SleepStats } from '@/types/sleep';
import { SLEEP_TAGS } from '@/lib/circadian';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';

interface SleepWrappedTabProps {
  sessions: SleepSession[];
  stats: SleepStats;
  targetHours: number;
}

export function SleepWrappedTab({ sessions, stats, targetHours }: SleepWrappedTabProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [currentMonthStr, setCurrentMonthStr] = useState<string>('Tháng này');

  useEffect(() => {
    setCurrentMonthStr(
      new Date().toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' })
    );
  }, []);

  const totalHours = Math.round(
    sessions.reduce((acc, s) => acc + s.durationMinutes, 0) / 60
  );

  // Thói quen mang lại năng lượng tốt nhất
  const getTopHabit = () => {
    const habitMap: Record<string, number> = {};
    sessions.forEach((s) => {
      if (s.energyLevel >= 4) {
        s.tags.forEach((t) => {
          habitMap[t] = (habitMap[t] || 0) + 1;
        });
      }
    });
    const sorted = Object.entries(habitMap).sort((a, b) => b[1] - a[1]);
    if (sorted.length > 0) {
      const topTagId = sorted[0][0];
      return SLEEP_TAGS.find((t) => t.id === topTagId)?.label || 'Phòng mát';
    }
    return 'Phòng ngủ tĩnh lặng';
  };

  const topHabit = getTopHabit();

  const handleDownloadCard = async () => {
    if (!cardRef.current || isExporting) return;
    setIsExporting(true);

    try {
      // Bắn confetti chúc mừng
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#F59E0B', '#10B981'],
      });

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        quality: 0.95,
        backgroundColor: '#06080F',
      });

      const link = document.createElement('a');
      link.download = `Somna-Sleep-Wrapped-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to export card image:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 mb-3">
            <Award className="w-3.5 h-3.5" />
            Phong cách Spotify Wrapped
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Thẻ Tổng Kết Giấc Ngủ (Sleep Wrapped)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Xem tấm thẻ danh hiệu nhịp sinh học cá nhân của bạn và xuất hình ảnh chất lượng cao để
            chia sẻ lên Instagram Story hoặc Facebook.
          </p>
        </div>
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Container with Card & Controls */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 py-4">
        {/* The Card to Export */}
        <div
          ref={cardRef}
          className="w-full max-w-[380px] sm:max-w-[420px] rounded-3xl p-7 sm:p-8 bg-gradient-to-b from-[#13112c] via-[#0b0f1e] to-[#06080f] border border-purple-500/30 shadow-2xl relative overflow-hidden text-white flex flex-col justify-between aspect-[9/14]"
        >
          {/* Ambient Lighting Orbs inside Card */}
          <div className="absolute -top-20 -left-20 w-52 h-52 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-52 h-52 bg-indigo-600/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center">
                <Moon className="w-4 h-4 text-purple-300" />
              </div>
              <span className="font-bold text-sm tracking-wider text-white">SOMNA WRAPPED</span>
            </div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-purple-300 bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-500/30">
              {currentMonthStr}
            </span>
          </div>

          {/* Center Persona & Big Title */}
          <div className="relative z-10 py-6 text-center my-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 mb-3">
              <Award className="w-3.5 h-3.5" />
              Danh hiệu Nhịp Sinh Học
            </div>

            <h3 className="font-extrabold text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-purple-200 mb-2">
              {stats.chronotype}
            </h3>

            <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
              Bạn duy trì thời lượng ngủ trung bình{' '}
              <strong className="text-purple-300 font-semibold">
                {(stats.averageDurationMinutes / 60).toFixed(1)}h
              </strong>{' '}
              với chỉ số nhịp sinh học đều đặn đạt{' '}
              <strong className="text-emerald-300 font-semibold">{stats.regularityScore}%</strong>!
            </p>
          </div>

          {/* Key Metrics Grid inside Card */}
          <div className="relative z-10 grid grid-cols-2 gap-3 mb-6">
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm">
              <span className="text-[11px] text-slate-400 block mb-1">Tổng thời gian ngủ</span>
              <div className="font-mono text-xl font-bold text-white">{totalHours} Giờ</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm">
              <span className="text-[11px] text-slate-400 block mb-1">Điểm đều đặn SRI</span>
              <div className="font-mono text-xl font-bold text-emerald-400">
                {stats.regularityScore}%
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm">
              <span className="text-[11px] text-slate-400 block mb-1">Đêm ngủ sâu nhất</span>
              <div className="text-xs font-semibold text-purple-300 truncate">
                {stats.bestNightDate || 'Đêm qua'}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm">
              <span className="text-[11px] text-slate-400 block mb-1">Thói quen vàng</span>
              <div className="text-xs font-semibold text-amber-300 truncate">{topHabit}</div>
            </div>
          </div>

          {/* Card Footer Watermark */}
          <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
            <span>somna.vercel.app</span>
            <span className="text-purple-300 font-medium">#SomnaSleepWrapped</span>
          </div>
        </div>

        {/* Action Panel */}
        <div className="w-full max-w-sm space-y-4">
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h4 className="font-semibold text-white text-base">Chia sẻ thành quả</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tấm thẻ được thiết kế chuẩn tỷ lệ khung hình di động (Instagram Story / Zalo / Facebook).
              Nhấn nút dưới để tải ảnh PNG chất lượng cao về máy.
            </p>

            <button
              onClick={handleDownloadCard}
              disabled={isExporting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white font-semibold text-sm shadow-xl shadow-purple-600/25 flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang dựng ảnh PNG...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Đã tải thành công!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Tải ảnh thẻ PNG</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                confetti({
                  particleCount: 100,
                  spread: 80,
                  origin: { y: 0.6 },
                });
              }}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Ăn mừng thành tích (Confetti)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
