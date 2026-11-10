'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  Sparkles,
  Download,
  Moon,
  Award,
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
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-20 md:pb-8">
      {/* Title */}
      <div className="glass-panel p-5 sm:p-7 rounded-3xl">
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Thẻ tổng kết giấc ngủ (Sleep Wrapped)
        </h2>
        <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
          Tấm thẻ cá nhân hóa tóm tắt thói quen ngủ của bạn, sẵn sàng tải về máy để chia sẻ Story.
        </p>
      </div>

      {/* Main Container */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 py-2">
        {/* The Card to Export */}
        <div
          ref={cardRef}
          className="w-full max-w-[360px] sm:max-w-[400px] rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-[#13112c] via-[#0b0f1e] to-[#06080f] border border-purple-500/40 shadow-2xl relative overflow-hidden text-white flex flex-col justify-between aspect-[9/13]"
        >
          {/* Top Brand Header */}
          <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center">
                <Moon className="w-5 h-5 text-purple-300" />
              </div>
              <span className="font-extrabold text-sm tracking-wider text-white">SOMNA WRAPPED</span>
            </div>
            <span className="text-xs uppercase font-mono tracking-wider text-purple-300 bg-purple-950/80 px-3 py-1 rounded-full border border-purple-500/40 font-bold">
              {currentMonthStr}
            </span>
          </div>

          {/* Center Persona */}
          <div className="relative z-10 py-6 text-center my-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-3">
              <Award className="w-4 h-4" />
              <span>Danh hiệu Nhịp Sinh Học</span>
            </div>

            <h3 className="font-black text-2xl sm:text-3xl text-white mb-2 tracking-tight">
              {stats.chronotype}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xs mx-auto leading-relaxed">
              Bạn đạt thời lượng trung bình{' '}
              <strong className="text-purple-300 font-bold">
                {(stats.averageDurationMinutes / 60).toFixed(1)}h/đêm
              </strong>{' '}
              với độ đều đặn nhịp sinh học{' '}
              <strong className="text-emerald-300 font-bold">{stats.regularityScore}%</strong>.
            </p>
          </div>

          {/* Key Metrics Grid inside Card */}
          <div className="relative z-10 grid grid-cols-2 gap-3 mb-4">
            <div className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/10">
              <span className="text-xs text-slate-400 block mb-1 font-medium">Tổng giờ ngủ</span>
              <div className="font-mono text-2xl font-black text-white">{totalHours}h</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/10">
              <span className="text-xs text-slate-400 block mb-1 font-medium">Độ đều đặn SRI</span>
              <div className="font-mono text-2xl font-black text-emerald-400">
                {stats.regularityScore}%
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/10">
              <span className="text-xs text-slate-400 block mb-1 font-medium">Đêm sâu nhất</span>
              <div className="text-xs font-bold text-purple-300 truncate">
                {stats.bestNightDate || 'Gần đây'}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/10">
              <span className="text-xs text-slate-400 block mb-1 font-medium">Thói quen vàng</span>
              <div className="text-xs font-bold text-amber-300 truncate">{topHabit}</div>
            </div>
          </div>

          {/* Card Footer Watermark */}
          <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>somna.vercel.app</span>
            <span className="text-purple-300 font-bold">#SomnaWrapped</span>
          </div>
        </div>

        {/* Action Buttons Panel: Minimum 48px height */}
        <div className="w-full max-w-sm space-y-3">
          <button
            onClick={handleDownloadCard}
            disabled={isExporting}
            className="w-full h-13 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Đang xuất ảnh...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <Check className="w-5 h-5 text-emerald-300" />
                <span>Đã lưu thành công!</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
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
            className="w-full h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Pháo hoa chúc mừng</span>
          </button>
        </div>
      </div>
    </div>
  );
}
